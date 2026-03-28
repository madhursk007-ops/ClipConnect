import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Send, 
  Paperclip, 
  Smile,
  ChevronLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  File,
  Mic,
  PhoneCall,
  Video as VideoIcon,
  Info
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { useSocketStore } from '@store/socketStore'

const ChatPage = () => {
  const { user } = useAuthStore()
  const { isConnected, sendMessage, markAsRead, isUserOnline, isUserTyping } = useSocketStore()
  const [activeConversation, setActiveConversation] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      user: {
        id: 2,
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        role: 'Video Editor',
        isOnline: true
      },
      lastMessage: {
        text: 'Thanks! I\'ll send you the draft by tomorrow.',
        timestamp: '2024-01-10T14:30:00',
        isRead: true,
        sender: 2
      },
      unreadCount: 0
    },
    {
      id: 2,
      user: {
        id: 3,
        name: 'Marcus Johnson',
        avatar: '/avatars/marcus.jpg',
        role: 'Motion Designer',
        isOnline: false
      },
      lastMessage: {
        text: 'Can you please send me the project files?',
        timestamp: '2024-01-10T12:15:00',
        isRead: false,
        sender: 3
      },
      unreadCount: 2
    },
    {
      id: 3,
      user: {
        id: 4,
        name: 'Elena Rodriguez',
        avatar: '/avatars/elena.jpg',
        role: 'Video Producer',
        isOnline: true
      },
      lastMessage: {
        text: 'The final cut looks amazing! Great job!',
        timestamp: '2024-01-09T18:45:00',
        isRead: true,
        sender: 4
      },
      unreadCount: 0
    }
  ]

  // Mock messages data
  const [messages, setMessages] = useState([
    {
      id: 1,
      conversationId: 1,
      senderId: 2,
      text: 'Hi! I saw your project posting for the corporate video.',
      timestamp: '2024-01-10T14:25:00',
      status: 'read'
    },
    {
      id: 2,
      conversationId: 1,
      senderId: 1,
      text: 'Hello Sarah! Yes, I\'m looking for an experienced editor for this project.',
      timestamp: '2024-01-10T14:26:00',
      status: 'read'
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 2,
      text: 'I\'d love to help! I have 8 years of experience with corporate videos.',
      timestamp: '2024-01-10T14:27:00',
      status: 'read'
    },
    {
      id: 4,
      conversationId: 1,
      senderId: 1,
      text: 'That sounds great. What\'s your availability?',
      timestamp: '2024-01-10T14:28:00',
      status: 'read'
    },
    {
      id: 5,
      conversationId: 1,
      senderId: 2,
      text: 'I can start immediately and have a draft ready within 3 days.',
      timestamp: '2024-01-10T14:29:00',
      status: 'read'
    },
    {
      id: 6,
      conversationId: 1,
      senderId: 2,
      text: 'Thanks! I\'ll send you the draft by tomorrow.',
      timestamp: '2024-01-10T14:30:00',
      status: 'read'
    }
  ])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return

    const newMessage = {
      id: messages.length + 1,
      conversationId: activeConversation.id,
      senderId: user?._id || 1,
      text: messageInput,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    setMessages([...messages, newMessage])
    setMessageInput('')
    
    // Send via socket
    sendMessage({
      conversationId: activeConversation.id,
      text: messageInput,
      recipientId: activeConversation.user.id
    })
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const groupedMessages = messages
    .filter(m => !activeConversation || m.conversationId === activeConversation.id)
    .reduce((groups, message) => {
      const date = formatDate(message.timestamp)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    }, {})

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-6 py-8 h-[calc(100vh-80px)]">
        <div className="glass-morphism rounded-2xl border border-white/10 h-full overflow-hidden flex">
          {/* Conversations Sidebar */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <h1 className="text-2xl font-heading font-bold mb-4">Messages</h1>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation)}
                  className={`p-4 flex items-center space-x-3 cursor-pointer transition-colors hover:bg-white/5 ${
                    activeConversation?.id === conversation.id ? 'bg-white/10 border-r-2 border-primary-500' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {conversation.user.name.charAt(0)}
                      </span>
                    </div>
                    {conversation.user.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-dark-900 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                      <span className="text-xs text-gray-400">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage.sender === user?._id ? 'You: ' : ''}
                      {conversation.lastMessage.text}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setActiveConversation(null)}
                      className="md:hidden p-2 text-gray-400 hover:text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {activeConversation.user.name.charAt(0)}
                        </span>
                      </div>
                      {activeConversation.user.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-dark-900 rounded-full" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold">{activeConversation.user.name}</h3>
                      <p className="text-sm text-gray-400">
                        {activeConversation.user.isOnline ? 'Online' : 'Offline'}
                        {isUserTyping(activeConversation.user.id, activeConversation.id) && ' • typing...'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <PhoneCall className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <VideoIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Info className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date}>
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-dark-800 px-3 py-1 rounded-full text-xs text-gray-400">
                          {date}
                        </div>
                      </div>

                      {dateMessages.map((message, index) => {
                        const isOwn = message.senderId === (user?._id || 1)
                        const showAvatar = index === 0 || dateMessages[index - 1].senderId !== message.senderId

                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-end space-x-2 max-w-[70%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {!isOwn && showAvatar && (
                                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-semibold">
                                    {activeConversation.user.name.charAt(0)}
                                  </span>
                                </div>
                              )}

                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                                    : 'bg-dark-800 text-white'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <div className={`flex items-center mt-1 text-xs ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                                  <span>{formatTime(message.timestamp)}</span>
                                  {isOwn && (
                                    <span className="ml-2">
                                      {message.status === 'read' ? (
                                        <CheckCheck className="w-3 h-3" />
                                      ) : (
                                        <Check className="w-3 h-3" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => {
                          setMessageInput(e.target.value)
                          setIsTyping(e.target.value.length > 0)
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Type a message..."
                        className="input w-full pr-10"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>

                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="p-3 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500/20 to-accent-400/20 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-400 max-w-md">
                  Choose a conversation from the sidebar to start messaging with your clients or editors.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
