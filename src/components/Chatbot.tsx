'use client'
import React, { useState, useRef, useEffect } from 'react'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Paperclip,
  Smile,
  Globe
} from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
}

interface UserInfo {
  name: string
  email: string
}

interface ChatbotProps {
  className?: string
}

const Chatbot = ({ className }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to GT Technologies. I\'m your AI assistant. I can help you in multiple languages! How can I assist you with our digital transformation solutions today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)
  const [tempUserInfo, setTempUserInfo] = useState({ name: '', email: '' })
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [messageCount, setMessageCount] = useState(1)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

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

  // Check if user info should be collected after 3 messages
  useEffect(() => {
    if (messageCount >= 3 && !userInfo && !showUserForm) {
      setShowUserForm(true)
      const infoMessage: Message = {
        id: Date.now().toString(),
        text: 'To provide you with better assistance, could you please share your name and email address? This will help us serve you better.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, infoMessage])
    }
  }, [messageCount, userInfo, showUserForm])

  const callOpenAI = async (userMessage: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          language: currentLanguage,
          userInfo: userInfo
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI')
      }

      const data = await response.json()
      return data.message
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      return getLanguageText('error')
    }
  }

  const subscribeUser = async (email: string, name: string) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name,
          status: 'enabled',
          lists: [1], // Default list ID
          preconfirm_subscriptions: true
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe user')
      }

      return true
    } catch (error) {
      console.error('Error subscribing user:', error)
      return false
    }
  }

  const getLanguageText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      en: {
        error: "I apologize, but I'm having trouble connecting right now. Please try again or contact us through our contact page for immediate assistance.",
        userInfoSaved: "Thank you! Your information has been saved. How else can I help you?",
        subscribed: "Great! You've been subscribed to our updates. How else can I assist you today?",
        contactUs: "I don't have specific information about that. Please contact us through our contact page for detailed assistance.",
        thankYou: "Thank you for contacting GT Technologies! Feel free to ask if you have more questions."
      },
      hi: {
        error: "क्षमा करें, मुझे अभी कनेक्शन में समस्या हो रही है। कृपया फिर से कोशिश करें या तुरंत सहायता के लिए हमारे संपर्क पेज से संपर्क करें।",
        userInfoSaved: "धन्यवाद! आपकी जानकारी सेव हो गई है। मैं आपकी और कैसे सहायता कर सकता हूं?",
        subscribed: "बहुत बढ़िया! आप हमारे अपडेट्स के लिए सब्स्क्राइब हो गए हैं। मैं आज आपकी और कैसे सहायता कर सकता हूं?",
        contactUs: "मेरे पास इसके बारे में विशिष्ट जानकारी नहीं है। विस्तृत सहायता के लिए कृपया हमारे संपर्क पेज से संपर्क करें।",
        thankYou: "GT Technologies से संपर्क करने के लिए धन्यवाद! यदि आपके कोई और प्रश्न हैं तो बेझिझक पूछें।"
      },
      te: {
        error: "క్షమించండి, నాకు ఇప్పుడు కనెక్షన్‌లో సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా తక్షణ సహాయం కోసం మా సంప్రదింపు పేజీ ద్వారా సంప్రదించండి.",
        userInfoSaved: "ధన్యవాదాలు! మీ సమాచారం సేవ్ చేయబడింది. నేను మీకు ఇంకా ఎలా సహాయం చేయగలను?",
        subscribed: "గొప్పది! మీరు మా అప్‌డేట్‌ల కోసం సబ్‌స్క్రైబ్ అయ్యారు. నేను ఈ రోజు మీకు ఇంకా ఎలా సహాయం చేయగలను?",
        contactUs: "దీని గురించి నా దగ్గర నిర్దిష్ట సమాచారం లేదు. వివరణాత్మక సహాయం కోసం దయచేసి మా సంప్రదింపు పేజీ ద్వారా సంప్రదించండి.",
        thankYou: "GT Technologies ను సంప్రదించినందుకు ధన్యవాదాలు! మీకు మరిన్ని ప్రశ్నలు ఉంటే వెనుకాడకండి."
      }
    }
    return texts[currentLanguage]?.[key] || texts.en[key]
  }

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

    // Get AI response
    const aiResponse = await callOpenAI(inputValue)
    
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

  const handleUserInfoSubmit = async () => {
    if (!tempUserInfo.name.trim() || !tempUserInfo.email.trim()) {
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(tempUserInfo.email)) {
      alert('Please enter a valid email address')
      return
    }

    setUserInfo(tempUserInfo)
    setShowUserForm(false)

    // Subscribe user
    const subscribed = await subscribeUser(tempUserInfo.email, tempUserInfo.name)
    
    const responseText = subscribed ? getLanguageText('subscribed') : getLanguageText('userInfoSaved')
    
    const botResponse: Message = {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, botResponse])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (showUserForm) {
        handleUserInfoSubmit()
      } else {
        handleSendMessage()
      }
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! 👋 Welcome to GT Technologies. I\'m your AI assistant. I can help you in multiple languages! How can I assist you with our digital transformation solutions today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ])
    setUserInfo(null)
    setShowUserForm(false)
    setMessageCount(1)
    setTempUserInfo({ name: '', email: '' })
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // Voice recognition will be handled by the voice agent API
    if (!isListening) {
      // Start voice recognition
      window.open('/voice-chat', '_blank', 'width=400,height=600')
    }
  }

  const handleLanguageSelect = (langCode: string) => {
    setCurrentLanguage(langCode)
    setShowLanguageDropdown(false)
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        {/* Floating Chat Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-r from-sky-500/90 to-cyan-500/90 backdrop-blur-xl border border-sky-400/50 rounded-full shadow-2xl hover:shadow-sky-500/25 transition-all duration-500 hover:scale-110"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 rounded-full" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '8px 8px'
            }}></div>
          </div>

          {/* Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-full"></div>
          
          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-float"
                style={{
                  left: `${20 + (i * 20)}%`,
                  top: `${15 + (i * 25)}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${2 + i}s`
                }}
              ></div>
            ))}
          </div>

          {/* Notification Dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-2 border-white/20 animate-bounce">
            <div className="w-full h-full bg-white/30 rounded-full animate-ping"></div>
          </div>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-sky-500/30 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-xl">
            Need help? Chat with us!
            <div className="absolute top-full right-3 w-2 h-2 bg-slate-900 border-r border-b border-sky-500/30 transform rotate-45"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed z-50 transition-all duration-500 ${className} ${
      // Responsive positioning
      isMinimized 
        ? 'bottom-6 right-6 w-80 h-12' 
        : 'bottom-6 right-6 w-96 h-[600px] md:w-[420px] md:h-[650px]'
    }`}>
      {/* Main Chat Container */}
      <div className="relative h-full bg-slate-950/95 backdrop-blur-2xl border border-sky-500/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Glass Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-sky-500/[0.08] via-transparent to-cyan-500/[0.05] rounded-2xl"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-float ${
                i % 2 === 0 ? 'bg-sky-400/30' : 'bg-white/20'
              }`}
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${15 + (i * 10)}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + (i % 2)}s`
              }}
            ></div>
          ))}
        </div>

        {isMinimized ? (
          /* Minimized Header */
          <div className="relative z-10 h-full flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-500/80 to-cyan-500/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-sky-400/50">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium text-sm">GT Assistant</span>
              {isTyping && (
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 bg-sky-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1.5 hover:bg-sky-500/20 rounded-lg transition-colors duration-200"
              >
                <Maximize2 className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b border-sky-500/20 bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500/80 to-cyan-500/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-sky-400/50">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-950"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">GT Assistant</h3>
                  <p className="text-sky-300/80 text-xs">
                    {isTyping ? 'Typing...' : 'Online • Ready to help'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Language Selector */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="p-2 hover:bg-sky-500/20 rounded-lg transition-colors duration-200 group"
                  >
                    <Globe className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                  </button>
                  {showLanguageDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-slate-800/95 backdrop-blur-xl border border-sky-500/30 rounded-lg shadow-xl z-[9999] min-w-[120px]">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-sky-500/20 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                            currentLanguage === lang.code ? 'text-sky-300 bg-sky-500/10' : 'text-slate-300'
                          }`}
                        >
                          {lang.flag} {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={resetChat}
                  className="p-2 hover:bg-sky-500/20 rounded-lg transition-colors duration-200 group"
                  title="Reset Chat"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 hover:bg-sky-500/20 rounded-lg transition-colors duration-200 group"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                  )}
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-sky-500/20 rounded-lg transition-colors duration-200 group"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200 group"
                  title="Close"
                >
                  <X className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 h-[400px] md:h-[450px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 border-purple-400/50' 
                        : 'bg-gradient-to-r from-sky-500/80 to-cyan-500/80 border-sky-400/50'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative backdrop-blur-sm border rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 border-sky-400/30 text-white'
                        : 'bg-slate-800/50 border-slate-600/30 text-slate-200'
                    }`}>
                      {/* Glass effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl"></div>
                      
                      <div className="relative z-10">
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {message.text}
                        </p>
                        <span className={`text-xs mt-2 block ${
                          message.sender === 'user' ? 'text-sky-200/70' : 'text-slate-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* User Info Collection Form */}
              {showUserForm && (
                <div className="bg-slate-800/80 backdrop-blur-sm border border-sky-500/30 rounded-2xl p-4 space-y-3">
                  <h4 className="text-white font-medium text-sm">Please provide your details:</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={tempUserInfo.name}
                      onChange={(e) => setTempUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={tempUserInfo.email}
                      onChange={(e) => setTempUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                    />
                    <button
                      onClick={handleUserInfoSubmit}
                      disabled={!tempUserInfo.name.trim() || !tempUserInfo.email.trim()}
                      className="w-full bg-gradient-to-r from-sky-500/80 to-cyan-500/80 hover:from-sky-600/80 hover:to-cyan-600/80 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    <div className="w-8 h-8 bg-gradient-to-r from-sky-500/80 to-cyan-500/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-sky-400/50">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative z-10 p-4 border-t border-sky-500/20 bg-slate-900/50 backdrop-blur-sm">
              {!showUserForm && (
                <div className="flex items-center space-x-2">
                  {/* Attachment Button */}
                  <button
                    className="p-2 hover:bg-sky-500/20 rounded-lg transition-colors duration-200 group"
                    title="Attach File"
                  >
                    <Paperclip className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                  </button>

                  {/* Input Field */}
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400/50 transition-all duration-300"
                    />
                    
                    {/* Emoji Button */}
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-sky-500/20 rounded-lg transition-colors duration-200 group"
                      title="Add Emoji"
                    >
                      <Smile className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                    </button>
                  </div>

                  {/* Voice Button */}
                  <button
                    onClick={toggleVoice}
                    className={`p-2 rounded-lg transition-colors duration-200 group ${
                      isListening ? 'bg-red-500/20 hover:bg-red-500/30' : 'hover:bg-sky-500/20'
                    }`}
                    title={isListening ? 'Stop Recording' : 'Voice Chat'}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-400" />
                    ) : (
                      <Mic className="w-4 h-4 text-slate-400 group-hover:text-sky-300" />
                    )}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="p-2 bg-gradient-to-r from-sky-500/80 to-cyan-500/80 hover:from-sky-600/80 hover:to-cyan-600/80 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-sky-400/50 group"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Chatbot