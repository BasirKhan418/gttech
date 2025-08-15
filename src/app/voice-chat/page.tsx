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

const AutoVoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState<'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>('alloy');
  const [errorMessage, setErrorMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{transcription: string, response: string}>>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [silenceTimer, setSilenceTimer] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const SILENCE_THRESHOLD = 3000; // 3 seconds of silence
  const AUDIO_THRESHOLD = 0.01; // Minimum audio level to detect speech

  useEffect(() => {
    initializeAudioSystem();
    createFloatingParticles();
    
    return () => {
      cleanup();
    };
  }, []);

  const createFloatingParticles = () => {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 3 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particlesContainer.appendChild(particle);
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const initializeAudioSystem = async () => {
    try {
      setStatus('Requesting microphone access...');
      setDebugInfo('Initializing audio system...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        }
      });
      
      streamRef.current = stream;
      
      // Setup audio context for real-time audio analysis
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      // Setup MediaRecorder
      let options: MediaRecorderOptions = {
        audioBitsPerSecond: 32000
      };
      
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        options.mimeType = 'audio/wav';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          await processAudioRecording();
        }
      };

      setDebugInfo('Audio system initialized successfully');
      startContinuousRecording();
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Microphone access failed: ${errorMsg}`);
      setDebugInfo(`Initialization failed: ${errorMsg}`);
      setStatus('Microphone access required');
    }
  };

  const startContinuousRecording = () => {
    setIsRecording(true);
    setStatus('Listening... Start speaking');
    setDebugInfo('Continuous recording started');
    
    // Start MediaRecorder
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start(250);
    }
    
    // Start audio level monitoring
    monitorAudioLevel();
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateAudioLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average audio level
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      
      setAudioLevel(normalizedLevel);
      
      // Detect speech/silence
      if (normalizedLevel > AUDIO_THRESHOLD) {
        // Speech detected - reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        setSilenceTimer(0);
      } else if (isRecording && !silenceTimerRef.current) {
        // Silence detected - start countdown
        const startTime = Date.now();
        
        silenceTimerRef.current = setTimeout(() => {
          stopRecordingAndProcess();
        }, SILENCE_THRESHOLD);
        
        // Update silence timer display
        const updateTimer = () => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, SILENCE_THRESHOLD - elapsed);
          setSilenceTimer(Math.ceil(remaining / 1000));
          
          if (remaining > 0 && silenceTimerRef.current) {
            setTimeout(updateTimer, 100);
          }
        };
        updateTimer();
      }
      
      if (isRecording || isSpeaking) {
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };
    
    updateAudioLevel();
  };

  const stopRecordingAndProcess = () => {
    if (!isRecording) return;
    
    setIsRecording(false);
    setStatus('Processing your voice...');
    setDebugInfo('Stopping recording and processing...');
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    setSilenceTimer(0);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const processAudioRecording = async () => {
    try {
      setIsProcessing(true);
      setDebugInfo('Processing audio chunks...');

      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      
      audioChunksRef.current = [];

      if (audioBlob.size < 500) {
        setDebugInfo('Recording too short, restarting...');
        restartRecording();
        return;
      }

      const formData = new FormData();
      const extension = mimeType.includes('wav') ? '.wav' : '.webm';
      const audioFile = new File([audioBlob], `recording-${Date.now()}${extension}`, { type: mimeType });
      
      formData.append('audio', audioFile);
      formData.append('language', selectedLanguage);
      formData.append('voice', selectedVoice);

      setDebugInfo(`Sending ${audioFile.size} bytes to API...`);

      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        body: formData,
      });

      const data: VoiceChatResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      if (data.success && data.transcription && data.response && data.audio) {
        setConversationHistory(prev => [...prev, {
          transcription: data.transcription!,
          response: data.response!
        }]);
        
        setStatus(`You said: "${data.transcription}"`);
        setDebugInfo('Processing successful, playing response...');
        
        setTimeout(() => {
          playAudioResponse(data.audio!, data.response!);
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Processing error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Processing failed');
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      restartRecording();
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudioResponse = async (audioBase64: string, responseText: string) => {
    try {
      setIsSpeaking(true);
      setStatus('GT Assistant is speaking...');
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
      }
      
      const binaryString = atob(audioBase64);
      const audioArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioArray[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        setDebugInfo('Response completed, restarting recording...');
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        
        setTimeout(() => {
          restartRecording();
        }, 500);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        setDebugInfo('Audio playback failed, restarting...');
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        restartRecording();
      };
      
      await audio.play();
      
    } catch (error) {
      setIsSpeaking(false);
      setErrorMessage('Audio playback failed');
      restartRecording();
    }
  };

  const restartRecording = () => {
    if (isSpeaking || isProcessing) return;
    
    setTimeout(() => {
      startContinuousRecording();
    }, 1000);
  };

  const resetConversation = () => {
    cleanup();
    setConversationHistory([]);
    setErrorMessage('');
    setDebugInfo('');
    setSilenceTimer(0);
    initializeAudioSystem();
  };

  const getStatusColor = () => {
    if (isProcessing) return 'text-amber-400';
    if (isSpeaking) return 'text-blue-400';
    if (isRecording) return 'text-green-400';
    return 'text-cyan-400';
  };

  const getVisualizerIntensity = () => {
    return Math.max(0.3, audioLevel * 3);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <style jsx>{`
        .floating-particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(6, 182, 212, 0.3);
          border-radius: 50%;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes wave {
          0%, 100% { height: 20px; }
          50% { height: 60px; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .glassmorphism {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .glassmorphism-strong {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(6, 182, 212, 0.3);
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
        }
      `}</style>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="floating-particles"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center px-6 py-3 glassmorphism rounded-full mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse-slow"></div>
              <span className="text-cyan-300 font-medium">GT Voice Assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              <span className="block">Smart Voice</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                Assistant
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Just start speaking naturally. I'll listen and respond automatically when you pause.
            </p>
          </div>

          {/* Main Control Panel */}
          <div className="glassmorphism-strong rounded-3xl p-8 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <div className="flex flex-col items-center">
                <label className="text-slate-400 text-sm mb-2">Language</label>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-slate-800/80 border border-slate-600/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="hi">🇮🇳 हिंदी</option>
                  <option value="te">🇮🇳 తెలుగు</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="de">🇩🇪 Deutsch</option>
                  <option value="ja">🇯🇵 日本語</option>
                </select>
              </div>
              
              <div className="flex flex-col items-center">
                <label className="text-slate-400 text-sm mb-2">Voice</label>
                <select 
                  value={selectedVoice} 
                  onChange={(e) => setSelectedVoice(e.target.value as typeof selectedVoice)}
                  className="bg-slate-800/80 border border-slate-600/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  <option value="alloy">Alloy (Neutral)</option>
                  <option value="echo">Echo (Male)</option>
                  <option value="fable">Fable (British)</option>
                  <option value="onyx">Onyx (Deep)</option>
                  <option value="nova">Nova (Female)</option>
                  <option value="shimmer">Shimmer (Soft)</option>
                </select>
              </div>
            </div>

            {/* Status Display */}
            <div className="text-center mb-8">
              <div className={`text-2xl font-semibold mb-2 ${getStatusColor()} transition-colors duration-300`}>
                {status}
              </div>
              
              {silenceTimer > 0 && (
                <div className="text-amber-400 text-lg">
                  Processing in {silenceTimer}s...
                </div>
              )}
            </div>

            {/* Voice Visualizer */}
            <div className="flex justify-center items-end space-x-2 mb-8 h-20">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-full transition-all duration-150 ${
                    isRecording ? 'animate-wave' : ''
                  }`}
                  style={{
                    height: isRecording 
                      ? `${20 + (Math.sin((Date.now() / 100) + i) * 20 * getVisualizerIntensity())}px`
                      : '20px',
                    animationDelay: `${i * 0.1}s`,
                    opacity: isRecording ? getVisualizerIntensity() : 0.3
                  }}
                ></div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetConversation}
                className="px-6 py-3 bg-slate-700/80 hover:bg-slate-600/80 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-slate-600/50 backdrop-blur-sm"
              >
                Reset Chat
              </button>
              
              <button
                onClick={() => window.close()}
                className="px-6 py-3 bg-red-600/80 hover:bg-red-500/80 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-red-500/50 backdrop-blur-sm"
              >
                Close
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="glassmorphism border-red-400/30 rounded-xl p-4 mb-6 animate-fade-in-up">
              <div className="text-red-400 text-center">
                <div className="font-semibold mb-1">Error</div>
                <div className="text-sm">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="glassmorphism rounded-2xl p-6 mb-6 animate-fade-in-up">
              <h3 className="text-cyan-300 font-semibold mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                Recent Conversation
              </h3>
              
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {conversationHistory.slice(-3).map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="glassmorphism rounded-lg p-3 border-green-400/20">
                      <div className="text-green-300 text-sm font-medium mb-1">You said:</div>
                      <div className="text-slate-200 text-sm">"{item.transcription}"</div>
                    </div>
                    <div className="glassmorphism rounded-lg p-3 border-blue-400/20">
                      <div className="text-blue-300 text-sm font-medium mb-1">Assistant:</div>
                      <div className="text-slate-200 text-sm">{item.response}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="glassmorphism rounded-xl p-4 animate-fade-in-up">
            <div className="text-slate-400 text-sm text-center font-mono">
              {debugInfo || 'System ready...'}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AutoVoiceAssistant;