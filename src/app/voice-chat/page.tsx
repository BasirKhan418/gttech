"use client"

import React, { useState, useEffect, useRef } from 'react';

interface VoiceChatResponse {
  success: boolean;
  transcription?: string;
  response?: string;
  audio?: string;
  language?: string;
  error?: string;
  details?: string;
}

const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Press and hold to start conversation');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState<'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>('alloy');
  const [errorMessage, setErrorMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize floating particles on mount
  useEffect(() => {
    createFloatingParticles();
    
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, []);

  const createFloatingParticles = () => {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 3 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particlesContainer.appendChild(particle);
    }
  };

  const initializeAudio = async () => {
    try {
      setDebugInfo('Requesting microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });
      streamRef.current = stream;
      
      setDebugInfo('Microphone access granted, setting up recorder...');
      
      // Setup MediaRecorder for audio capture
      let options: MediaRecorderOptions = {
        audioBitsPerSecond: 128000
      };
      
      // Try different MIME types in order of preference
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options.mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        options.mimeType = 'audio/wav';
      }
      
      setDebugInfo(`Using MIME type: ${options.mimeType}`);
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setDebugInfo(`Audio chunk received: ${event.data.size} bytes`);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          await processAudioRecording();
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setErrorMessage('Recording failed. Please try again.');
        setDebugInfo(`MediaRecorder error: ${event}`);
      };

      setDebugInfo('Audio recorder initialized successfully');
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Microphone access denied: ${errorMsg}`);
      setDebugInfo(`Audio initialization failed: ${errorMsg}`);
      console.error('Audio initialization error:', error);
      return false;
    }
  };

  const processAudioRecording = async () => {
    try {
      setIsProcessing(true);
      setStatus('Processing your voice...');
      setDebugInfo(`Processing ${audioChunksRef.current.length} audio chunks...`);

      // Create audio blob from recorded chunks
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      
      setDebugInfo(`Created audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
      
      // Clear chunks for next recording
      audioChunksRef.current = [];

      // Validate blob size
      if (audioBlob.size === 0) {
        throw new Error('No audio data recorded');
      }

      if (audioBlob.size < 1000) {
        throw new Error('Audio recording too short');
      }

      // Create FormData to send to API
      const formData = new FormData();
      
      // Create a file with proper extension based on MIME type
      const extension = mimeType.includes('webm') ? '.webm' : 
                      mimeType.includes('mp4') ? '.mp4' : 
                      mimeType.includes('wav') ? '.wav' : '.webm';
      
      const audioFile = new File([audioBlob], `recording${extension}`, { type: mimeType });
      
      formData.append('audio', audioFile);
      formData.append('language', selectedLanguage);
      formData.append('voice', selectedVoice);

      setDebugInfo(`Sending request to API: ${audioFile.size} bytes`);

      // Send to API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch('/api/voice-chat-c', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      setDebugInfo(`API response received: ${response.status} ${response.statusText}`);

      let data: VoiceChatResponse;
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}. Content: ${textResponse.substring(0, 200)}`);
      }

      try {
        data = await response.json();
      } catch (jsonError) {
        const textResponse = await response.text();
        console.error('JSON parse error:', jsonError, 'Response:', textResponse);
        throw new Error(`Invalid JSON response from server: ${textResponse.substring(0, 200)}`);
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (data.success && data.transcription && data.response && data.audio) {
        setDebugInfo('API request successful');
        
        // Display transcription briefly
        setStatus(`You said: "${data.transcription}"`);
        
        // Play the AI response audio
        setTimeout(() => {
          playAudioResponse(data.audio!, data.response!);
        }, 1500);
      } else {
        throw new Error(data.error || 'Processing failed - incomplete response');
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      
      let errorMessage = 'Failed to process voice. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrorMessage(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);
      setStatus('Press and hold to start conversation');
      setIsProcessing(false);
    }
  };

  const playAudioResponse = async (audioBase64: string, responseText: string) => {
    try {
      setIsSpeaking(true);
      setStatus('GT Assistant is speaking...');
      setDebugInfo('Playing audio response...');
      
      // Convert base64 to audio blob
      const audioData = atob(audioBase64);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setDebugInfo(`Audio blob created: ${audioBlob.size} bytes`);
      
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      audio.onloadstart = () => setDebugInfo('Audio loading...');
      audio.oncanplay = () => setDebugInfo('Audio ready to play');
      
      audio.onended = () => {
        setIsSpeaking(false);
        setIsProcessing(false);
        setStatus('Press and hold to speak');
        setDebugInfo('Audio playback completed');
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsSpeaking(false);
        setIsProcessing(false);
        setStatus('Press and hold to speak');
        setErrorMessage('Audio playback failed');
        setDebugInfo(`Audio error: ${error}`);
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      await audio.play();
      setDebugInfo('Audio playing...');
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsSpeaking(false);
      setIsProcessing(false);
      setStatus('Press and hold to speak');
      setErrorMessage('Audio playback failed');
      setDebugInfo(`Playback error: ${error instanceof Error ? error.message : error}`);
    }
  };

  const handleMouseDown = async () => {
    if (isProcessing || isSpeaking) return;

    setDebugInfo('Recording started...');

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
    }

    setErrorMessage('');
    const audioInitialized = await initializeAudio();
    if (!audioInitialized) return;

    setIsRecording(true);
    setIsListening(true);
    setStatus('Listening... speak now');
    
    // Start recording
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setDebugInfo('MediaRecorder started');
    }
  };

  const handleMouseUp = () => {
    if (!isRecording) return;

    setDebugInfo('Recording stopped');
    setIsRecording(false);
    setIsListening(false);
    setStatus('Processing...');
    
    // Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setDebugInfo('MediaRecorder stopped');
    }

    // Stop the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    setDebugInfo(`Language changed to: ${e.target.value}`);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(e.target.value as typeof selectedVoice);
    setDebugInfo(`Voice changed to: ${e.target.value}`);
  };

  const getStatusClassName = () => {
    if (isListening) return 'status listening';
    if (isSpeaking) return 'status speaking';
    if (isProcessing) return 'status processing';
    return 'status';
  };

  const getButtonText = () => {
    if (isProcessing) return '⏳';
    if (isSpeaking) return '🔊';
    return '🎤';
  };

  return (
    <div className="voice-assistant-container">
      <style jsx>{`
        .voice-assistant-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          overflow: hidden;
          position: relative;
          padding: 1rem;
        }

        .floating-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(14, 165, 233, 0.3);
          border-radius: 50%;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }

        .container {
          text-align: center;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
        }

        .logo {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #0ea5e9, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-group label {
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .control-group select {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid #475569;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          min-width: 120px;
        }

        .control-group select:focus {
          outline: none;
          border-color: #0ea5e9;
        }

        .status {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #94a3b8;
          transition: all 0.3s ease;
          min-height: 1.5rem;
        }

        .status.listening {
          color: #22c55e;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .status.speaking {
          color: #3b82f6;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .status.processing {
          color: #f59e0b;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .voice-button {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid #0ea5e9;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          position: relative;
          overflow: hidden;
          user-select: none;
        }

        .voice-button:hover:not(.disabled) {
          transform: scale(1.1);
          box-shadow: 0 0 30px rgba(14, 165, 233, 0.5);
        }

        .voice-button:active:not(.disabled) {
          transform: scale(0.95);
        }

        .voice-button.active {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-color: #dc2626;
          animation: recording 2s ease-in-out infinite;
        }

        .voice-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: linear-gradient(135deg, #64748b, #475569);
          border-color: #64748b;
        }

        .voice-button.processing {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-color: #f59e0b;
          animation: processing 2s ease-in-out infinite;
        }

        .voice-button.speaking {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-color: #3b82f6;
          animation: speaking 1.5s ease-in-out infinite;
        }

        .voice-icon {
          font-size: 3rem;
        }

        .wave-visualization {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 3px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .wave-visualization.active {
          opacity: 1;
        }

        .wave-bar {
          width: 4px;
          height: 20px;
          background: linear-gradient(to top, #0ea5e9, #06b6d4);
          border-radius: 2px;
          animation: wave 1.2s ease-in-out infinite;
        }

        .wave-bar:nth-child(2) { animation-delay: 0.1s; }
        .wave-bar:nth-child(3) { animation-delay: 0.2s; }
        .wave-bar:nth-child(4) { animation-delay: 0.3s; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; }

        .error-message {
          color: #ef4444;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          min-height: 1.2rem;
          padding: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 0.5rem;
          border: 1px solid rgba(239, 68, 68, 0.3);
          display: ${errorMessage ? 'block' : 'none'};
        }

        .debug-info {
          color: #64748b;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          min-height: 1rem;
          font-family: monospace;
          background: rgba(100, 116, 139, 0.1);
          padding: 0.5rem;
          border-radius: 0.25rem;
          text-align: left;
          max-width: 100%;
          overflow-wrap: break-word;
        }

        .instructions {
          font-size: 0.9rem;
          color: #64748b;
          margin-top: 1rem;
          line-height: 1.4;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes recording {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
        }

        @keyframes processing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
        }

        @keyframes speaking {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }

        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 40px; }
        }

        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            align-items: center;
          }
          
          .control-group select {
            min-width: 200px;
          }
        }
      `}</style>

      <div className="floating-particles"></div>

      <div className="container">
        <div className="logo">GT Voice Assistant</div>
        
        <div className="controls">
          <div className="control-group">
            <label>Language</label>
            <select value={selectedLanguage} onChange={handleLanguageChange} disabled={isRecording || isProcessing}>
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="te">🇮🇳 తెలుగు</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="ko">🇰🇷 한국어</option>
              <option value="ar">🇸🇦 العربية</option>
              <option value="pt">🇧🇷 Português</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="it">🇮🇹 Italiano</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Voice</label>
            <select value={selectedVoice} onChange={handleVoiceChange} disabled={isRecording || isProcessing}>
              <option value="alloy">Alloy</option>
              <option value="echo">Echo</option>
              <option value="fable">Fable</option>
              <option value="onyx">Onyx</option>
              <option value="nova">Nova</option>
              <option value="shimmer">Shimmer</option>
            </select>
          </div>
        </div>

        <div className={getStatusClassName()}>
          {status}
        </div>

        <div 
          className={`voice-button ${isRecording ? 'active' : ''} ${isProcessing ? 'processing' : ''} ${isSpeaking ? 'speaking' : ''} ${(isProcessing || isSpeaking) ? 'disabled' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          <div className="voice-icon">{getButtonText()}</div>
        </div>

        <div className={`wave-visualization ${isListening ? 'active' : ''}`}>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>

        <div className="error-message">
          {errorMessage}
        </div>

        <div className="debug-info">
          {debugInfo || 'Ready to start...'}
        </div>

        <div className="instructions">
          Hold the microphone button and speak your question about GT Technologies. Release to get an AI response.
          <br />
          <small>Make sure to allow microphone permissions when prompted.</small>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;