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
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open chat"
        >
          <div className="relative">
            {/* Main Button */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-700 hover:scale-110 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-white/90 group-hover:to-white/70 group-hover:border-cyan-400/40">
              {/* Enhanced glass effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-cyan-50/10 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/10 via-transparent to-cyan-300/8 rounded-2xl"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              
              {/* Icon container with enhanced depth */}
              <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-cyan-500/50 ring-1 ring-white/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              
              {/* Enhanced notification badge */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-xl border-2 border-white animate-pulse ring-2 ring-red-400/30"></div>
              
              {/* Enhanced floating particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1.5 h-1.5 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-all duration-700 ${
                      i % 3 === 0 ? 'bg-cyan-400/70 shadow-lg shadow-cyan-400/50' : 
                      i % 3 === 1 ? 'bg-cyan-300/60 shadow-lg shadow-cyan-300/40' : 
                      'bg-cyan-200/50 shadow-lg shadow-cyan-200/30'
                    }`}
                    style={{
                      left: `${15 + (i * 18)}%`,
                      top: `${10 + (i * 20)}%`,
                      animationDelay: `${i * 0.4}s`,
                      animationDuration: `${2.5 + (i % 2)}s`
                    }}
                  ></div>
                ))}
              </div>

              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl animate-ping"></div>
              </div>
            </div>
          </div>
        </button>

        {/* Enhanced Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            33% { transform: translateY(-12px) translateX(6px) rotate(2deg); }
            66% { transform: translateY(6px) translateX(-4px) rotate(-1deg); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-float {
            animation: float 3.5s ease-in-out infinite;
          }
          
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
        `}</style>
      </>
    )
  }

  return (
    <>
      <div className={`${getChatPosition()} z-50 transition-all duration-700 ${className}`}>
        <div className="h-full relative bg-gradient-to-br from-white/85 to-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl shadow-cyan-500/20 overflow-hidden ring-1 ring-white/30">
          {/* Enhanced glass effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/25 to-cyan-50/15"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/8 via-transparent to-cyan-300/6"></div>
          
          {/* Enhanced background grid pattern */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}></div>
            {/* Subtle dots overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(6,182,212,0.08) 1px, transparent 0)',
              backgroundSize: '48px 48px'
            }}></div>
          </div>

          {/* Enhanced floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full animate-float ${
                  i % 4 === 0 ? 'w-1.5 h-1.5 bg-cyan-400/25 shadow-lg shadow-cyan-400/40' : 
                  i % 4 === 1 ? 'w-1 h-1 bg-cyan-300/20 shadow-md shadow-cyan-300/30' : 
                  i % 4 === 2 ? 'w-0.5 h-0.5 bg-cyan-200/15 shadow-sm shadow-cyan-200/25' :
                  'w-2 h-2 bg-cyan-500/30 shadow-xl shadow-cyan-500/50'
                }`}
                style={{
                  left: `${5 + (i * 8)}%`,
                  top: `${3 + (i * 9)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + (i % 4)}s`
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 h-full flex flex-col">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-cyan-500/95 to-cyan-600/95 backdrop-blur-xl text-white p-4 flex items-center justify-between border-b border-cyan-400/30 shadow-lg">
              {!isMinimized && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/25 backdrop-blur-md border border-white/40 rounded-xl flex items-center justify-center shadow-xl ring-1 ring-white/20">
                      <Bot className="w-6 h-6 text-white drop-shadow-sm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white drop-shadow-sm">GT Assistant</h3>
                      <div className="text-xs opacity-95 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-400/50"></span>
                        <span className="font-medium">{isVoiceMode ? 'Voice Mode' : 'Online'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Enhanced Language Selector */}
                    <div className="relative  " ref={dropdownRef}>
                      <button 
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="p-2.5 hover:bg-white/25 rounded-xl transition-all duration-300 border border-white/30 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        title="Change Language"
                      >
                        <Globe className="w-5 h-5 drop-shadow-sm" />
                      </button>
                      {showLanguageDropdown && (
                        <div className="absolute top-full  right-0 mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden min-w-[220px] ring-1 ring-white/20">

                          {languages.map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setCurrentLanguage(lang.code)
                                setShowLanguageDropdown(false)
                              }}
                              className={`w-full text-left px-4 py-3.5  text-sm hover:bg-cyan-50/80 transition-all duration-200 flex items-center gap-3 ${
                                currentLanguage === lang.code ? 'bg-cyan-50/90 text-cyan-700 font-semibold shadow-inner' : 'text-gray-700'
                              }`}
                            >
                              <span className="text-lg drop-shadow-sm">{lang.flag}</span>
                              <span>{lang.name}</span>
                              {currentLanguage === lang.code && (
                                <span className="ml-auto w-2 h-2 bg-cyan-500 rounded-full shadow-sm"></span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Enhanced Voice Mode Toggle */}
                    <button
                      onClick={toggleVoiceMode}
                      className={`p-2.5 rounded-xl transition-all duration-300 border backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
                        isVoiceMode 
                          ? 'bg-white/25 border-white/50 text-white ring-2 ring-white/30' 
                          : 'hover:bg-white/25 border-white/30 text-white/90 hover:text-white'
                      }`}
                      title={isVoiceMode ? 'Disable Voice' : 'Enable Voice'}
                    >
                      {isVoiceMode ? <Mic className="w-5 h-5 drop-shadow-sm" /> : <MicOff className="w-5 h-5 drop-shadow-sm" />}
                    </button>

                    {/* Enhanced Mute Toggle */}
                    {isVoiceMode && (
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2.5 rounded-xl transition-all duration-300 border backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
                          isMuted 
                            ? 'bg-red-500/30 border-red-400/50 text-red-100 ring-2 ring-red-400/40' 
                            : 'hover:bg-white/25 border-white/30 text-white/90 hover:text-white'
                        }`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 drop-shadow-sm" /> : <Volume2 className="w-5 h-5 drop-shadow-sm" />}
                      </button>
                    )}

                    {/* Enhanced Minimize */}
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="p-2.5 hover:bg-white/25 rounded-xl transition-all duration-300 border border-white/30 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hidden sm:block"
                      title="Minimize"
                    >
                      <Minimize2 className="w-5 h-5 drop-shadow-sm" />
                    </button>

                    {/* Enhanced Close */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2.5 hover:bg-white/25 rounded-xl transition-all duration-300 border border-white/30 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      title="Close"
                    >
                      <X className="w-5 h-5 drop-shadow-sm" />
                    </button>
                  </div>
                </>
              )}
              
              {isMinimized && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/25 backdrop-blur-md border border-white/40 rounded-lg flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    <span className="font-semibold drop-shadow-sm">GT Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMinimized(false)}
                      className="p-1.5 hover:bg-white/25 rounded-lg transition-all duration-300 backdrop-blur-md shadow-md hover:scale-105"
                      title="Restore"
                    >
                      <Maximize2 className="w-4 h-4 drop-shadow-sm" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 hover:bg-white/25 rounded-lg transition-all duration-300 backdrop-blur-md shadow-md hover:scale-105"
                      title="Close"
                    >
                      <X className="w-4 h-4 drop-shadow-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!isMinimized && (
              <>
                {/* Enhanced Voice Status Bar */}
                {isVoiceMode && (
                  <div className={`px-4 py-4 text-sm font-semibold text-center backdrop-blur-xl border-b border-white/30 shadow-inner ${
                    voiceState === 'listening' ? 'bg-gradient-to-r from-red-500/95 to-red-600/95 text-white' :
                    voiceState === 'processing' ? 'bg-gradient-to-r from-amber-500/95 to-amber-600/95 text-white' :
                    voiceState === 'speaking' ? 'bg-gradient-to-r from-blue-500/95 to-blue-600/95 text-white' :
                    voiceState === 'error' ? 'bg-gradient-to-r from-red-600/95 to-red-700/95 text-white' :
                    'bg-gradient-to-r from-gray-50/95 to-gray-100/95 text-gray-700'
                  }`}>
                    <div className="flex items-center justify-center gap-4">
                      {voiceState === 'listening' && (
                        <>
                          <div className="flex gap-1.5">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1.5 bg-white rounded-full animate-pulse shadow-lg"
                                style={{
                                  height: `${12 + audioLevel * 20}px`,
                                  animationDelay: `${i * 0.15}s`
                                }}
                              />
                            ))}
                          </div>
                          <span className="font-bold text-lg drop-shadow-sm">{Math.round(recordingTime / 1000)}s</span>
                        </>
                      )}
                      <span className="drop-shadow-sm">{voiceStatusMessage}</span>
                    </div>
                  </div>
                )}

                {/* Enhanced Messages */}
                <div className="flex-1 -z-50 overflow-y-auto p-4 space-y-4 relative scrollbar-thin scrollbar-thumb-cyan-200/50 scrollbar-track-transparent">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${
                        message.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl backdrop-blur-md border ring-1 ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-cyan-400/60 ring-white/20' 
                            : 'bg-white/90 text-gray-600 border-gray-200/60 ring-white/30'
                        }`}>
                          {message.sender === 'user' ? <User className="w-5 h-5 drop-shadow-sm" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className={`relative backdrop-blur-xl border shadow-xl ring-1 ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-br from-cyan-500/95 to-cyan-600/95 text-white border-cyan-400/60 ring-white/20' 
                            : 'bg-white/90 text-gray-800 border-gray-200/60 ring-white/30'
                        } rounded-2xl px-4 py-3 max-w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}>
                          {/* Enhanced glass effect overlay */}
                          <div className={`absolute inset-0 rounded-2xl ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-br from-white/15 via-white/8 to-transparent' 
                              : 'bg-gradient-to-br from-white/70 via-white/40 to-cyan-50/15'
                          }`}></div>
                          
                          <div className="relative z-10">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.text}</p>
                            <span className={`text-xs opacity-80 mt-2 block font-medium ${
                              message.sender === 'user' ? 'text-right' : ''
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start animate-fade-in-up">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200/60 flex items-center justify-center shadow-xl ring-1 ring-white/30">
                          <Bot className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-2xl px-4 py-3 shadow-xl ring-1 ring-white/30">
                          <div className="flex gap-1.5">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce shadow-sm"
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

                {/* Enhanced Input Area */}
                <div className="border-t border-white/30 p-4 backdrop-blur-xl bg-white/40 shadow-inner">
                  {isVoiceMode ? (
                    <div className="flex flex-col items-center gap-4">
                      {/* Enhanced Voice Controls */}
                      <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value as TTSVoice)}
                        disabled={voiceState !== 'idle'}
                        className="text-sm bg-white/90 backdrop-blur-md border border-cyan-200/60 rounded-xl px-4 py-2.5 disabled:opacity-50 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/60 transition-all duration-300 font-medium ring-1 ring-white/20"
                      >
                        {voices.map((voice) => (
                          <option key={voice.id} value={voice.id}>{voice.name}</option>
                        ))}
                      </select>

                      {/* Enhanced Voice Button */}
                      <button
                        onClick={handleVoiceToggle}
                        disabled={voiceState === 'processing'}
                        className={`relative w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl backdrop-blur-xl border-2 ring-4 ${
                          voiceState === 'listening' ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-400/60 ring-red-400/30 animate-pulse scale-110 shadow-red-500/40' :
                          voiceState === 'processing' ? 'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400/60 ring-amber-400/30 shadow-amber-500/40' :
                          voiceState === 'speaking' ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-blue-400/60 ring-blue-400/30 animate-pulse shadow-blue-500/40' :
                          'bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 border-cyan-400/60 ring-cyan-400/30 hover:scale-110 shadow-cyan-500/40'
                        } text-white disabled:opacity-50 group active:scale-95`}
                      >
                        {/* Enhanced glass overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/15 to-transparent rounded-2xl"></div>
                        
                        {/* Button content with enhanced effects */}
                        <div className="relative z-10 drop-shadow-lg">
                          {voiceState === 'listening' ? <Square className="w-10 h-10" /> :
                           voiceState === 'processing' ? <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" /> :
                           voiceState === 'speaking' ? <Volume2 className="w-10 h-10" /> :
                           <Mic className="w-10 h-10" />}
                        </div>

                        {/* Enhanced ripple effect for listening state */}
                        {voiceState === 'listening' && (
                          <>
                            <div className="absolute inset-0 rounded-2xl bg-red-400/40 animate-ping"></div>
                            <div className="absolute inset-0 rounded-2xl bg-red-300/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3.5 bg-white/90 backdrop-blur-md border border-cyan-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/60 transition-all duration-300 shadow-lg text-gray-700 placeholder-gray-500 font-medium ring-1 ring-white/20 hover:bg-white/95"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="px-4 py-3.5 bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg backdrop-blur-md border border-cyan-400/60 hover:scale-105 disabled:hover:scale-100 active:scale-95 ring-1 ring-white/20"
                      >
                        <Send className="w-5 h-5 drop-shadow-sm" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-12px) translateX(6px) rotate(2deg); }
          66% { transform: translateY(6px) translateX(-4px) rotate(-1deg); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        /* Custom scrollbar styles */
        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-cyan-200\/50::-webkit-scrollbar-thumb {
          background-color: rgba(165, 243, 252, 0.5);
          border-radius: 6px;
        }

        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-thumb {
          background-color: rgba(165, 243, 252, 0.5);
          border-radius: 6px;
        }

        ::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </>
  )
}

export default Chatbot