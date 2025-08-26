"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, RotateCcw, X, Play, Pause } from 'lucide-react';

interface VoiceChatResponse {
  success: boolean;
  transcription?: string;
  response?: string;
  audio?: string;
  language?: string;
  error?: string;
  details?: string;
  processingTime?: number;
}

type ConversationState = 'idle' | 'recording' | 'processing' | 'speaking' | 'error';
type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

interface ConversationEntry {
  id: string;
  transcription: string;
  response: string;
  timestamp: Date;
}

const SequentialVoiceAssistant = () => {
  // Core state management
  const [state, setState] = useState<ConversationState>('idle');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedVoice, setSelectedVoice] = useState<TTSVoice>('alloy');
  const [statusMessage, setStatusMessage] = useState('Click the microphone to start');
  const [errorMessage, setErrorMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Recording state
  const [recordingTime, setRecordingTime] = useState(0);
  const [minRecordingTime] = useState(1000); // Minimum 1 second
  const [maxRecordingTime] = useState(30000); // Maximum 30 seconds
  
  // Refs for media handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sessionIdRef = useRef(Date.now().toString());

  // Initialize audio system
  const initializeAudio = useCallback(async () => {
    try {
      setStatusMessage('Requesting microphone access...');
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Media devices not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1
        }
      });
      
      streamRef.current = stream;
      
      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      
      // Setup MediaRecorder with optimal settings
      const options: MediaRecorderOptions = {
        audioBitsPerSecond: 32000
      };
      
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        options.mimeType = 'audio/wav';
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        processRecording();
      };

      setIsInitialized(true);
      setStatusMessage('Ready! Click the microphone to start talking');
      setErrorMessage('');
      
    } catch (error) {
      console.error('Audio initialization failed:', error);
      setErrorMessage(
        error instanceof Error 
          ? `Microphone access failed: ${error.message}` 
          : 'Failed to access microphone'
      );
      setStatusMessage('Microphone access required');
      setState('error');
    }
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  // Audio level monitoring
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateLevel = () => {
      if (!analyserRef.current || state !== 'recording') return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      
      setAudioLevel(normalizedLevel);
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  }, [state]);

  // Start recording
  const startRecording = useCallback(() => {
    if (!mediaRecorderRef.current || state !== 'idle') return;
    
    setState('recording');
    setStatusMessage('Listening... Speak now');
    setErrorMessage('');
    setRecordingTime(0);
    audioChunksRef.current = [];
    
    try {
      mediaRecorderRef.current.start(100);
      monitorAudioLevel();
      
      // Recording timer
      let startTime = Date.now();
      recordingTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setRecordingTime(elapsed);
        
        if (elapsed >= maxRecordingTime) {
          stopRecording();
        }
      }, 100);
      
    } catch (error) {
      console.error('Recording start failed:', error);
      setErrorMessage('Failed to start recording');
      setState('error');
    }
  }, [state, monitorAudioLevel, maxRecordingTime]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || state !== 'recording') return;
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setAudioLevel(0);
    
    if (recordingTime < minRecordingTime) {
      setErrorMessage('Recording too short. Please speak for at least 1 second.');
      setState('idle');
      setStatusMessage('Click the microphone to try again');
      return;
    }
    
    setState('processing');
    setStatusMessage('Processing your voice...');
    
    try {
      mediaRecorderRef.current.stop();
    } catch (error) {
      console.error('Recording stop failed:', error);
      setErrorMessage('Failed to stop recording');
      setState('error');
    }
  }, [state, recordingTime, minRecordingTime]);

  // Process the recorded audio
  const processRecording = useCallback(async () => {
    try {
      if (audioChunksRef.current.length === 0) {
        throw new Error('No audio data recorded');
      }

      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      
      if (audioBlob.size < 1000) {
        throw new Error('Recording too short or empty');
      }

      const formData = new FormData();
      const extension = mimeType.includes('wav') ? '.wav' : '.webm';
      const audioFile = new File([audioBlob], `voice-${Date.now()}${extension}`, { type: mimeType });
      
      formData.append('audio', audioFile);
      formData.append('language', selectedLanguage);
      formData.append('voice', selectedVoice);
      formData.append('sessionId', sessionIdRef.current);

      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        body: formData,
      });

      const data: VoiceChatResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (!data.transcription || !data.response || !data.audio) {
        throw new Error('Incomplete response from server');
      }

      // Add to conversation history
      const newEntry: ConversationEntry = {
        id: Date.now().toString(),
        transcription: data.transcription,
        response: data.response,
        timestamp: new Date()
      };
      
      setConversationHistory(prev => [...prev, newEntry]);
      setStatusMessage(`You said: "${data.transcription}"`);
      
      // Play the response
      setTimeout(() => playAudioResponse(data.audio!, data.response!), 500);
      
    } catch (error) {
      console.error('Processing failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Processing failed');
      setState('error');
      setTimeout(() => {
        setState('idle');
        setStatusMessage('Click the microphone to try again');
      }, 3000);
    }
  }, [selectedLanguage, selectedVoice]);

  // Play audio response
  const playAudioResponse = useCallback(async (audioBase64: string, responseText: string) => {
    try {
      setState('speaking');
      setStatusMessage('GT Assistant is speaking...');
      
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
      }
      
      // Convert base64 to audio
      const binaryString = atob(audioBase64);
      const audioArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        audioArray[i] = binaryString.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      audio.onloadeddata = () => {
        setStatusMessage(`Speaking... (${Math.round(audio.duration)}s)`);
      };
      
      audio.onended = () => {
        setState('idle');
        setStatusMessage('Click the microphone to continue talking');
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      audio.onerror = (error) => {
        console.error('Audio playback failed:', error);
        setState('idle');
        setStatusMessage('Click the microphone to continue talking');
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setErrorMessage('Audio playback failed');
      setState('idle');
      setStatusMessage('Click the microphone to continue talking');
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAudio();
    return cleanup;
  }, [initializeAudio, cleanup]);

  // Handle recording button
  const handleRecordingToggle = useCallback(() => {
    if (!isInitialized) {
      initializeAudio();
      return;
    }
    
    switch (state) {
      case 'idle':
        startRecording();
        break;
      case 'recording':
        stopRecording();
        break;
      default:
        // Cannot toggle during processing or speaking
        break;
    }
  }, [state, isInitialized, initializeAudio, startRecording, stopRecording]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (currentAudioRef.current && state === 'speaking') {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
      currentAudioRef.current = null;
      setState('idle');
      setStatusMessage('Click the microphone to continue talking');
    }
  }, [state]);

  // Reset conversation
  const resetConversation = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.src = '';
    }
    setConversationHistory([]);
    setErrorMessage('');
    setState('idle');
    setStatusMessage('Click the microphone to start');
    sessionIdRef.current = Date.now().toString();
  }, []);

  // Get appropriate colors based on state
  const getStateColors = () => {
    switch (state) {
      case 'recording':
        return {
          bg: 'from-red-500 to-red-600',
          text: 'text-red-400',
          border: 'border-red-400/50'
        };
      case 'processing':
        return {
          bg: 'from-amber-500 to-amber-600',
          text: 'text-amber-400',
          border: 'border-amber-400/50'
        };
      case 'speaking':
        return {
          bg: 'from-blue-500 to-blue-600',
          text: 'text-blue-400',
          border: 'border-blue-400/50'
        };
      case 'error':
        return {
          bg: 'from-red-600 to-red-700',
          text: 'text-red-400',
          border: 'border-red-400/50'
        };
      default:
        return {
          bg: 'from-cyan-500 to-cyan-600',
          text: 'text-cyan-400',
          border: 'border-cyan-400/50'
        };
    }
  };

  const colors = getStateColors();
  const canRecord = isInitialized && (state === 'idle' || state === 'recording');
  const isActive = state === 'recording' || state === 'processing' || state === 'speaking';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-slate-800/60 backdrop-blur-md rounded-full mb-6 border border-slate-600/30">
              <div className={`w-2 h-2 ${colors.text} rounded-full mr-3 ${isActive ? 'animate-pulse' : ''}`}></div>
              <span className="text-slate-300 font-medium">GT Voice Assistant</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="block">Sequential Voice</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                Assistant
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Click to speak → I'll listen → Process → Respond → Ready for next question
            </p>
          </div>

          {/* Main Control Panel */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 mb-6 border border-slate-600/30">
            
            {/* Settings */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Language</label>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  disabled={isActive}
                  className="bg-slate-700/80 border border-slate-600/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50"
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
              
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Voice</label>
                <select 
                  value={selectedVoice} 
                  onChange={(e) => setSelectedVoice(e.target.value as TTSVoice)}
                  disabled={isActive}
                  className="bg-slate-700/80 border border-slate-600/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50"
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
              <div className={`text-xl font-semibold mb-2 ${colors.text} transition-colors duration-300`}>
                {statusMessage}
              </div>
              
              {state === 'recording' && (
                <div className="text-slate-400">
                  Recording: {Math.round(recordingTime / 1000)}s / 30s
                </div>
              )}
            </div>

            {/* Main Recording Button */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Audio Level Visualization */}
                {state === 'recording' && (
                  <div className="absolute -inset-4 flex items-center justify-center">
                    <div 
                      className="absolute w-32 h-32 rounded-full border-2 border-red-400/30 animate-ping"
                      style={{ animationDuration: `${1 + audioLevel * 2}s` }}
                    ></div>
                    <div 
                      className="absolute w-24 h-24 rounded-full border border-red-400/50"
                      style={{ 
                        transform: `scale(${1 + audioLevel * 0.5})`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    ></div>
                  </div>
                )}
                
                <button
                  onClick={handleRecordingToggle}
                  disabled={!canRecord && state !== 'recording'}
                  className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${colors.bg} hover:scale-105 active:scale-95 transform transition-all duration-200 shadow-xl border-2 ${colors.border} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {state === 'recording' ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : state === 'processing' ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : state === 'speaking' ? (
                    <Volume2 className="w-8 h-8 text-white animate-pulse" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {state === 'speaking' && (
                <button
                  onClick={stopSpeaking}
                  className="px-6 py-3 bg-red-600/80 hover:bg-red-500/80 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-red-500/50 backdrop-blur-sm flex items-center gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Stop Speaking
                </button>
              )}
              
              <button
                onClick={resetConversation}
                disabled={state === 'processing'}
                className="px-6 py-3 bg-slate-700/80 hover:bg-slate-600/80 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-slate-600/50 backdrop-blur-sm disabled:opacity-50 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Chat
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-900/60 backdrop-blur-md border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="text-red-400 text-center">
                <div className="font-semibold mb-1">Error</div>
                <div className="text-sm">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 mb-6 border border-slate-600/30">
              <h3 className="text-cyan-300 font-semibold mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                Conversation History ({conversationHistory.length})
              </h3>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {conversationHistory.slice(-5).map((item, index) => (
                  <div key={item.id} className="space-y-2">
                    <div className="bg-green-900/30 backdrop-blur-sm rounded-lg p-3 border border-green-400/20">
                      <div className="text-green-300 text-sm font-medium mb-1 flex items-center justify-between">
                        <span>You said:</span>
                        <span className="text-slate-400 text-xs">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-slate-200 text-sm">"{item.transcription}"</div>
                    </div>
                    <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-3 border border-blue-400/20">
                      <div className="text-blue-300 text-sm font-medium mb-1">GT Assistant:</div>
                      <div className="text-slate-200 text-sm">{item.response}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {conversationHistory.length > 5 && (
                <div className="text-center mt-4">
                  <span className="text-slate-400 text-sm">
                    Showing last 5 conversations...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-6 border border-slate-600/20">
            <h4 className="text-slate-300 font-semibold mb-3">How to use:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-xs">1</div>
                <span>Click microphone to start recording</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-xs">2</div>
                <span>Speak your question clearly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 font-bold text-xs">3</div>
                <span>Click again to stop & process</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-xs">4</div>
                <span>Listen to the response</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequentialVoiceAssistant;