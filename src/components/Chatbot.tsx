'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
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
  Square,
  RefreshCw,
  Mail,
  UserCircle
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isVoice?: boolean
}

interface UserInfo {
  name: string
  email: string
  phone?: string
  company?: string
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
  collectUserInfoAfter?: number // Number of messages before showing form
  requireUserInfo?: boolean // Whether to require user info
}

const Chatbot = ({ 
  className = '', 
  collectUserInfoAfter = 3,
  requireUserInfo = true 
}: ChatbotProps) => {
  // UI State
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [userFormSubmitted, setUserFormSubmitted] = useState(false)
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to GT Technologies. I\'m your AI assistant. I can help you in multiple languages through text or voice! How can I assist you with our digital transformation solutions today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [messageCount, setMessageCount] = useState(0)
  
  // User Info State
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [tempUserInfo, setTempUserInfo] = useState<UserInfo>({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '' 
  })
  const [formErrors, setFormErrors] = useState<Partial<UserInfo>>({})
  
  // Voice State
  const [voiceState, setVoiceState] = useState<ConversationState>('idle')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<TTSVoice>('alloy')
  const [isMuted, setIsMuted] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [voiceStatusMessage, setVoiceStatusMessage] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  
  // Voice Detection Settings
  const [minRecordingTime] = useState(1000)
  const [maxRecordingTime] = useState(30000)
  const [silenceThreshold] = useState(0.02)
  const [silenceDuration] = useState(2000)
  
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
    if (isOpen && !isMinimized && inputRef.current && !isVoiceMode && !showUserForm) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized, isVoiceMode, showUserForm])

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

  // Check if user info should be collected
  useEffect(() => {
    if (requireUserInfo && messageCount >= collectUserInfoAfter && !userInfo && !showUserForm && !userFormSubmitted) {
      setShowUserForm(true)
      const infoMessage: Message = {
        id: Date.now().toString(),
        text: 'To provide you with better assistance and keep you updated with our solutions, could you please share your contact information?',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, infoMessage])
    }
  }, [messageCount, userInfo, showUserForm, userFormSubmitted, requireUserInfo, collectUserInfoAfter])

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate phone
  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phone.length >= 10 && phoneRegex.test(phone)
  }

  // Handle user info submit
  const handleUserInfoSubmit = async () => {
    const errors: Partial<UserInfo> = {}
    
    // Validate required fields
    if (!tempUserInfo.name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!tempUserInfo.email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(tempUserInfo.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    // Validate optional fields if provided
    if (tempUserInfo.phone && !validatePhone(tempUserInfo.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setFormErrors({})
    setUserInfo(tempUserInfo)
    setShowUserForm(false)
    setUserFormSubmitted(true)
    
    // Subscribe user to CRM/Newsletter
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: tempUserInfo.email,
          name: tempUserInfo.name,
          phone: tempUserInfo.phone,
          company: tempUserInfo.company,
          status: 'enabled',
          lists: [1],
          preconfirm_subscriptions: true
        })
      })
      
      if (response.ok) {
        const successMessage: Message = {
          id: Date.now().toString(),
          text: `Thank you, ${tempUserInfo.name}! Your information has been saved. You'll receive updates about our latest solutions at ${tempUserInfo.email}. How else can I assist you today?`,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, successMessage])
      }
    } catch (error) {
      console.error('Error subscribing user:', error)
      const message: Message = {
        id: Date.now().toString(),
        text: `Thank you, ${tempUserInfo.name}! Your information has been saved. How else can I assist you today?`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, message])
    }
  }

  // Skip user form
  const skipUserForm = () => {
    setShowUserForm(false)
    setUserFormSubmitted(true)
    const message: Message = {
      id: Date.now().toString(),
      text: 'No problem! Feel free to ask me anything about GT Technologies\' solutions.',
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
  }

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
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      
      const microphone = audioContextRef.current.createMediaStreamSource(stream)
      microphone.connect(analyserRef.current)
      
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

      const userMessage: Message = {
        id: Date.now().toString(),
        text: '🎤 Processing...',
        sender: 'user',
        timestamp: new Date(),
        isVoice: true
      }
      setMessages(prev => [...prev, userMessage])
      setMessageCount(prev => prev + 1)

      const formData = new FormData()
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: audioBlob.type })
      
      formData.append('audio', audioFile)
      formData.append('language', currentLanguage)
      formData.append('voice', selectedVoice)
      formData.append('sessionId', sessionIdRef.current)
      
      if (userInfo) {
        formData.append('userName', userInfo.name)
        formData.append('userEmail', userInfo.email)
      }

      setVoiceStatusMessage('Processing...')
      
      const response = await fetch('/api/voice-chat', {
        method: 'POST',
        body: formData
      })

      const data: VoiceChatResponse = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Processing failed')
      }

      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, text: `🎤 "${data.transcription}"` }
          : msg
      ))

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response!,
        sender: 'bot',
        timestamp: new Date(),
        isVoice: true
      }
      setMessages(prev => [...prev, botMessage])
      
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
  }, [currentLanguage, selectedVoice, userInfo])

  // Start/Stop voice recording functions (same as before)
  const startVoiceRecording = useCallback(() => {
    if (!mediaRecorderRef.current || voiceState !== 'idle') return
    
    setVoiceState('listening')
    setVoiceStatusMessage('Listening...')
    setRecordingTime(0)
    audioChunksRef.current = []
    lastVoiceActivityRef.current = Date.now()
    
    mediaRecorderRef.current.start(100)
    detectVoiceActivity()
    
    const startTime = Date.now()
    recordingTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setRecordingTime(elapsed)
      
      if (elapsed >= maxRecordingTime) {
        stopVoiceRecording()
      }
    }, 100)
  }, [voiceState, detectVoiceActivity, maxRecordingTime])

  const stopVoiceRecording = useCallback(() => {
    if (voiceState !== 'listening') return
    
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
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current.src = ''
      }
      
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
          language: currentLanguage,
          userInfo: userInfo
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
    setMessageCount(prev => prev + 1)

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

  // Reset chat
  const resetChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! 👋 Welcome to GT Technologies. I\'m your AI assistant. I can help you in multiple languages through text or voice! How can I assist you with our digital transformation solutions today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ])
    setMessageCount(0)
    setUserInfo(null)
    setShowUserForm(false)
    setUserFormSubmitted(false)
    setTempUserInfo({ name: '', email: '', phone: '', company: '' })
    setFormErrors({})
    sessionIdRef.current = Date.now().toString()
    
    if (voiceState !== 'idle') {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current.src = ''
      }
      setVoiceState('idle')
      setVoiceStatusMessage('Voice ready!')
    }
  }

  // Toggle voice mode
  const toggleVoiceMode = async () => {
    if (!isVoiceMode) {
      await initializeVoice()
      setIsVoiceMode(true)
    } else {
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
      return 'fixed inset-0 m-0 w-full h-full rounded-none'
    } else if (isMinimized) {
      return 'fixed bottom-4 right-4 w-80 h-14'
    } else {
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
                 <img
                 width={100}
                 height={90}
                src="./logo.png"
                alt="oops"
                 />
                <div>
                  <h3 className="font-semibold">GT Assistant</h3>
                  <p className="text-xs opacity-90">
                    {isVoiceMode ? 'Voice Mode' : 'Online'} 
                    {userInfo && ` • ${userInfo.name}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Language Selector */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Change Language"
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  {showLanguageDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-50">
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
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                )}

                {/* Reset Chat */}
                <button
                  onClick={resetChat}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Reset Chat"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors hidden sm:block"
                  title="Minimize"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Close"
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
                {userInfo && <span className="text-xs opacity-75">• {userInfo.name}</span>}
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

              {/* User Info Collection Form */}
              {showUserForm && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-3 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-cyan-600" />
                    Please share your details
                  </h4>
                  
                  <div className="space-y-2">
                    {/* Name Input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={tempUserInfo.name}
                        onChange={(e) => {
                          setTempUserInfo(prev => ({ ...prev, name: e.target.value }))
                          setFormErrors(prev => ({ ...prev, name: '' }))
                        }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email *"
                        value={tempUserInfo.email}
                        onChange={(e) => {
                          setTempUserInfo(prev => ({ ...prev, email: e.target.value }))
                          setFormErrors(prev => ({ ...prev, email: '' }))
                        }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Phone Input */}
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={tempUserInfo.phone}
                        onChange={(e) => {
                          setTempUserInfo(prev => ({ ...prev, phone: e.target.value }))
                          setFormErrors(prev => ({ ...prev, phone: '' }))
                        }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Company Input */}
                    <input
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={tempUserInfo.company}
                      onChange={(e) => setTempUserInfo(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />

                    {/* Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleUserInfoSubmit}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-2 rounded-lg text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Submit
                      </button>
                      <button
                        onClick={skipUserForm}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy and will only use this to improve our service
                  </p>
                </div>
              )}

              {/* Typing Indicator */}
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
                !showUserForm && (
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
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Chatbot