import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  Search,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import { useAuth } from '@hooks';

const Chat = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [activeConversation, setActiveConversation] = useState(userId || null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Mock conversations
  const conversations = [
    {
      id: '1',
      user: {
        _id: 'user1',
        name: 'Sarah Johnson',
        role: 'editor',
        avatar: null,
        online: true
      },
      lastMessage: {
        text: 'Thanks for the project opportunity! I\'ll send the first draft by Friday.',
        timestamp: '10:30 AM',
        unread: false,
        sender: 'user1'
      },
      unreadCount: 0
    },
    {
      id: '2',
      user: {
        _id: 'user2',
        name: 'Mike Chen',
        role: 'editor',
        avatar: null,
        online: false
      },
      lastMessage: {
        text: 'The color grading looks great! Can you adjust the audio levels?',
        timestamp: 'Yesterday',
        unread: true,
        sender: 'current'
      },
      unreadCount: 2
    },
    {
      id: '3',
      user: {
        _id: 'user3',
        name: 'Emma Wilson',
        role: 'client',
        avatar: null,
        online: true
      },
      lastMessage: {
        text: 'When can we schedule a call to discuss the project details?',
        timestamp: 'Yesterday',
        unread: true,
        sender: 'user3'
      },
      unreadCount: 1
    },
    {
      id: '4',
      user: {
        _id: 'user4',
        name: 'Tech Corp',
        role: 'client',
        avatar: null,
        online: false
      },
      lastMessage: {
        text: 'Project completed successfully. Thank you for your work!',
        timestamp: '2 days ago',
        unread: false,
        sender: 'current'
      },
      unreadCount: 0
    }
  ];

  // Mock messages for active conversation
  const messages = [
    { id: 1, text: 'Hi! I saw your proposal for the brand video project.', sender: 'current', timestamp: '10:00 AM', status: 'read' },
    { id: 2, text: 'Hello! Yes, I\'m very interested in working on it. I have experience with similar projects.', sender: 'other', timestamp: '10:05 AM' },
    { id: 3, text: 'Great! Can you tell me more about your experience with commercial videos?', sender: 'current', timestamp: '10:08 AM', status: 'read' },
    { id: 4, text: 'I\'ve worked on over 50 commercial projects for various brands. I specialize in fast-paced, high-energy content.', sender: 'other', timestamp: '10:12 AM' },
    { id: 5, text: 'That sounds perfect for what we need. What\'s your availability like?', sender: 'current', timestamp: '10:15 AM', status: 'read' },
    { id: 6, text: 'I\'m available full-time and can start immediately. The turnaround would be about 1 week for the first draft.', sender: 'other', timestamp: '10:18 AM' },
    { id: 7, text: 'Excellent! I\'d like to move forward with you. I\'ll send over the contract shortly.', sender: 'current', timestamp: '10:20 AM', status: 'delivered' },
    { id: 8, text: 'Thanks for the project opportunity! I\'ll send the first draft by Friday.', sender: 'other', timestamp: '10:30 AM' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    // Add message logic here
    setMessageInput('');
  };

  const activeConv = conversations.find(c => c.id === activeConversation);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations List */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 glass-morphism rounded-2xl border border-white/5 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-l-2 ${
                activeConversation === conv.id 
                  ? 'bg-primary-500/10 border-primary-500' 
                  : 'border-transparent'
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {conv.user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {conv.user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-800 rounded-full"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium truncate">{conv.user.name}</h4>
                  <span className="text-xs text-gray-500">{conv.lastMessage.timestamp}</span>
                </div>
                <p className={`text-sm truncate ${conv.lastMessage.unread ? 'text-white' : 'text-gray-400'}`}>
                  {conv.lastMessage.sender === 'current' && 'You: '}{conv.lastMessage.text}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 glass-morphism rounded-2xl border border-white/5 flex flex-col overflow-hidden"
      >
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {activeConv?.user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {activeConv?.user.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-800 rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{activeConv?.user.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">
                    {activeConv?.user.online ? 'Online' : 'Offline'} • {activeConv?.user.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isMe = msg.sender === 'current';
                const showAvatar = !isMe && (index === 0 || messages[index - 1].sender !== msg.sender);
                
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && showAvatar && (
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white font-semibold">
                            {activeConv?.user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      
                      <div className={`px-4 py-2.5 rounded-2xl ${
                        isMe 
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-br-md' 
                          : 'bg-dark-800 text-gray-200 rounded-bl-md'
                      }`}>
                        <p>{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                          <span>{msg.timestamp}</span>
                          {isMe && (
                            msg.status === 'read' 
                              ? <CheckCheck className="w-3 h-3" />
                              : <Check className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button 
                  type="button"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                  type="button"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                />
                <button 
                  type="button"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-dark-800 rounded-full flex items-center justify-center">
                <Send className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Chat;
