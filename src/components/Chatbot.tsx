'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Square
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isVoice?: boolean
}

interface VoiceChatResponse {
  success: boolean
  transcription?: string
  response?: string
  audio?: string
  language?: string
  error?: string
  details?: string
  processingTime?: number
}

type ConversationState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

interface ChatbotProps {
  className?: string
}

const Chatbot = ({ className = '' }: ChatbotProps) => {
  // UI State
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to GT Technologies. I can help you in multiple languages through text or voice! How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  
  // Voice State
  const [voiceState, setVoiceState] = useState<ConversationState>('idle')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<TTSVoice>('alloy')
  const [isMuted, setIsMuted] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [voiceStatusMessage, setVoiceStatusMessage] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  
  // Voice Detection Settings
  const [minRecordingTime] = useState(1000) // 1 second
  const [maxRecordingTime] = useState(30000) // 30 seconds
  const [silenceThreshold] = useState(0.02)
  const [silenceDuration] = useState(2000) // 2 seconds
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Voice Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const sessionIdRef = useRef(Date.now().toString())
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastVoiceActivityRef = useRef<number>(0)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ]

  const voices = [
    { id: 'alloy', name: 'Alloy' },
    { id: 'echo', name: 'Echo' },
    { id: 'fable', name: 'Fable' },
    { id: 'onyx', name: 'Onyx' },
    { id: 'nova', name: 'Nova' },
    { id: 'shimmer', name: 'Shimmer' }
  ]

  // Utility Functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current && !isVoiceMode) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized, isVoiceMode])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Voice initialization
  const initializeVoice = useCallback(async () => {
    try {
      console.log('🎤 Initializing voice...')
      setVoiceStatusMessage('Requesting microphone access...')
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      streamRef.current = stream
      
      // Setup audio context for voice activity detection
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      
      const microphone = audioContextRef.current.createMediaStreamSource(stream)
      microphone.connect(analyserRef.current)
      
      // Setup MediaRecorder
      const options: MediaRecorderOptions = { audioBitsPerSecond: 32000 }
      
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm'
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, options)
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        console.log('🎤 MediaRecorder stopped')
      }

      setVoiceStatusMessage('Voice ready! Click to start')
      
    } catch (error) {
      console.error('❌ Voice initialization failed:', error)
      setVoiceStatusMessage('Microphone access denied')
      setVoiceState('error')
    }
  }, [])

  // Voice Activity Detection
  const detectVoiceActivity = useCallback(() => {
    if (!analyserRef.current || voiceState !== 'listening') return
    
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const checkActivity = () => {
      if (voiceState !== 'listening') return
      
      analyserRef.current!.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / bufferLength
      const normalizedLevel = average / 255
      
      setAudioLevel(normalizedLevel)
      
      // Voice activity detection
      if (normalizedLevel > silenceThreshold) {
        lastVoiceActivityRef.current = Date.now()
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current)
          silenceTimeoutRef.current = null
        }
      } else {
        const silenceDurationMs = Date.now() - lastVoiceActivityRef.current
        if (silenceDurationMs > silenceDuration && recordingTime > minRecordingTime && !silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            if (voiceState === 'listening') {
              stopVoiceRecording()
            }
          }, 500)
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(checkActivity)
    }
    
    checkActivity()
  }, [voiceState, recordingTime, minRecordingTime, silenceDuration, silenceThreshold])

  // Process voice recording
  const processVoiceRecording = useCallback(async () => {
    try {
      if (audioChunksRef.current.length === 0) {
        throw new Error('No audio data recorded')
      }

      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
      })
      
      if (audioBlob.size < 1000) {
        throw new Error('Recording too short')
      }

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: '🎤 Processing...',
        sender: 'user',
        timestamp: new Date(),
        isVoice: true
      }
      setMessages(prev => [...prev, userMessage])

      // Prepare form data
      const formData = new FormData()
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: audioBlob.type })
      
      formData.append('audio', audioFile)
      formData.append('language', currentLanguage)
      formData.append('voice', selectedVoice)
      formData.append('sessionId', sessionIdRef.current)

      // API call
      setVoiceStatusMessage('Processing...')
      
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        body: formData
      })

      const data: VoiceChatResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Processing failed')
      }

      // Update messages
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, text: `🎤 "${data.transcription}"` }
          : msg
      ))

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response!,
        sender: 'bot',
        timestamp: new Date(),
        isVoice: true
      }
      setMessages(prev => [...prev, botMessage])
      
      // Play response
      if (data.audio) {
        setTimeout(() => playVoiceResponse(data.audio!), 500)
      }
      
    } catch (error) {
      console.error('❌ Processing failed:', error)
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: `❌ ${error instanceof Error ? error.message : 'Processing failed'}`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      
      setVoiceState('idle')
      setVoiceStatusMessage('Click to try again')
    }
  }, [currentLanguage, selectedVoice])

  // Start voice recording
  const startVoiceRecording = useCallback(() => {
    if (!mediaRecorderRef.current || voiceState !== 'idle') return
    
    setVoiceState('listening')
    setVoiceStatusMessage('Listening...')
    setRecordingTime(0)
    audioChunksRef.current = []
    lastVoiceActivityRef.current = Date.now()
    
    mediaRecorderRef.current.start(100)
    detectVoiceActivity()
    
    // Recording timer
    const startTime = Date.now()
    recordingTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setRecordingTime(elapsed)
      
      if (elapsed >= maxRecordingTime) {
        stopVoiceRecording()
      }
    }, 100)
  }, [voiceState, detectVoiceActivity, maxRecordingTime])

  // Stop voice recording
  const stopVoiceRecording = useCallback(() => {
    if (voiceState !== 'listening') return
    
    // Clear timers
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
      recordingTimerRef.current = null
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
      silenceTimeoutRef.current = null
    }
    
    setAudioLevel(0)
    
    if (recordingTime < minRecordingTime) {
      setVoiceStatusMessage('Too short! Speak longer')
      setVoiceState('idle')
      return
    }
    
    setVoiceState('processing')
    setVoiceStatusMessage('Processing...')
    
    mediaRecorderRef.current?.stop()
    setTimeout(() => processVoiceRecording(), 100)
  }, [voiceState, recordingTime, minRecordingTime, processVoiceRecording])

  // Play voice response
  const playVoiceResponse = useCallback(async (audioBase64: string) => {
    try {
      setVoiceState('speaking')
      setVoiceStatusMessage('Speaking...')
      
      // Stop current audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current.src = ''
      }
      
      // Convert base64 to audio
      const binaryString = atob(audioBase64)
      const audioArray = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        audioArray[i] = binaryString.charCodeAt(i)
      }
      
      const audioBlob = new Blob([audioArray], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      currentAudioRef.current = audio
      
      audio.onended = () => {
        setVoiceState('idle')
        setVoiceStatusMessage('Click to continue')
        URL.revokeObjectURL(audioUrl)
        currentAudioRef.current = null
      }
      
      audio.onerror = () => {
        setVoiceState('idle')
        setVoiceStatusMessage('Playback failed')
        URL.revokeObjectURL(audioUrl)
        currentAudioRef.current = null
      }
      
      if (!isMuted) {
        await audio.play()
      } else {
        setTimeout(() => {
          setVoiceState('idle')
          setVoiceStatusMessage('Click to continue')
          URL.revokeObjectURL(audioUrl)
          currentAudioRef.current = null
        }, 1000)
      }
      
    } catch (error) {
      console.error('❌ Playback error:', error)
      setVoiceState('idle')
      setVoiceStatusMessage('Click to continue')
    }
  }, [isMuted])

  // Text chat API call
  const callChatAPI = async (userMessage: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: currentLanguage
        })
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      return data.message
    } catch (error) {
      console.error('Error calling chat API:', error)
      return "I'm having trouble connecting. Please try again."
    }
  }

  // Handle text message send
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    const aiResponse = await callChatAPI(inputValue)
    
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 500)
  }

  // Toggle voice mode
  const toggleVoiceMode = async () => {
    if (!isVoiceMode) {
      await initializeVoice()
      setIsVoiceMode(true)
    } else {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      
      setIsVoiceMode(false)
      setVoiceState('idle')
      setVoiceStatusMessage('')
    }
  }

  // Handle voice button click
  const handleVoiceToggle = () => {
    if (!isVoiceMode) return
    
    switch (voiceState) {
      case 'idle':
        startVoiceRecording()
        break
      case 'listening':
        stopVoiceRecording()
        break
      case 'speaking':
        if (currentAudioRef.current) {
          currentAudioRef.current.pause()
          currentAudioRef.current = null
          setVoiceState('idle')
          setVoiceStatusMessage('Click to continue')
        }
        break
    }
  }

  // Responsive chat window positioning
  const getChatPosition = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      // Mobile: full screen
      return 'fixed inset-0 m-0 w-full h-full rounded-none'
    } else if (isMinimized) {
      // Minimized: small bar
      return 'fixed bottom-4 right-4 w-80 h-14'
    } else {
      // Desktop: positioned bottom-right
      return 'fixed bottom-4 right-4 w-full max-w-md h-[600px] sm:h-[700px]'
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open chat"
      >
        <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </div>
      </button>
    )
  }

  return (
    <div className={`${getChatPosition()} z-50 transition-all duration-300 ${className}`}>
      <div className="h-full bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-4 flex items-center justify-between">
          {!isMinimized && (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">GT Assistant</h3>
                  <p className="text-xs opacity-90">
                    {isVoiceMode ? 'Voice Mode' : 'Online'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  {showLanguageDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLanguage(lang.code)
                            setShowLanguageDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            currentLanguage === lang.code ? 'bg-gray-100 text-cyan-600' : 'text-gray-700'
                          }`}
                        >
                          {lang.flag} {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Mode Toggle */}
                <button
                  onClick={toggleVoiceMode}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={isVoiceMode ? 'Disable Voice' : 'Enable Voice'}
                >
                  {isVoiceMode ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                {/* Mute Toggle */}
                {isVoiceMode && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                )}

                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors hidden sm:block"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
          
          {isMinimized && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <span className="font-medium">GT Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {!isMinimized && (
          <>
            {/* Voice Status Bar */}
            {isVoiceMode && (
              <div className={`px-4 py-2 text-sm font-medium text-center ${
                voiceState === 'listening' ? 'bg-red-500 text-white' :
                voiceState === 'processing' ? 'bg-amber-500 text-white' :
                voiceState === 'speaking' ? 'bg-blue-500 text-white' :
                voiceState === 'error' ? 'bg-red-600 text-white' :
                'bg-gray-100 text-gray-700'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {voiceState === 'listening' && (
                    <>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-white rounded-full animate-pulse"
                            style={{
                              height: `${4 + audioLevel * 20}px`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                      <span>{Math.round(recordingTime / 1000)}s</span>
                    </>
                  )}
                  <span>{voiceStatusMessage}</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' ? 'bg-cyan-500' : 'bg-gray-300'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <span className={`text-xs opacity-70 mt-1 block ${
                        message.sender === 'user' ? 'text-right' : ''
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              {isVoiceMode ? (
                <div className="flex flex-col items-center gap-4">
                  {/* Voice Controls */}
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value as TTSVoice)}
                    disabled={voiceState !== 'idle'}
                    className="text-sm border rounded-lg px-3 py-1 disabled:opacity-50"
                  >
                    {voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>{voice.name}</option>
                    ))}
                  </select>

                  {/* Voice Button */}
                  <button
                    onClick={handleVoiceToggle}
                    disabled={voiceState === 'processing'}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      voiceState === 'listening' ? 'bg-red-500 hover:bg-red-600 animate-pulse' :
                      voiceState === 'processing' ? 'bg-amber-500' :
                      voiceState === 'speaking' ? 'bg-blue-500 hover:bg-blue-600' :
                      'bg-cyan-500 hover:bg-cyan-600'
                    } text-white shadow-lg hover:shadow-xl disabled:opacity-50`}
                  >
                    {voiceState === 'listening' ? <Square className="w-6 h-6" /> :
                     voiceState === 'processing' ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                     voiceState === 'speaking' ? <Volume2 className="w-6 h-6" /> :
                     <Mic className="w-6 h-6" />}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Chatbot