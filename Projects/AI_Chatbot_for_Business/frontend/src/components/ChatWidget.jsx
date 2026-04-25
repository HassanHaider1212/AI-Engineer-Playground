import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function ChatWidget({ botId, position = 'bottom-right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState('');
  const messagesEndRef = useRef(null);
  const [capturedLeads, setCapturedLeads] = useState(new Set());

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  useEffect(() => {
    // Fetch bot info
    fetch(`${API_URL}/bots`)
      .then(res => res.json())
      .then(data => {
        const bot = data.find(b => b.id === botId);
        if (bot) setBotName(bot.name);
      });
  }, [botId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract contact information from messages
  const extractLeadInfo = (messageHistory) => {
    const leadInfo = { name: null, email: null, phone: null, message: null };
    
    // Simple patterns to detect contact info
    const emailPattern = /[\w.-]+@[\w.-]+\.\w+/;
    const phonePattern = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
    
    // Look through recent messages for contact info
    const recentMessages = messageHistory.slice(-10); // Check last 10 messages
    
    for (const msg of recentMessages) {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        
        // Check if this message contains contact info
        const emailMatch = msg.content.match(emailPattern);
        const phoneMatch = msg.content.match(phonePattern);
        
        if (emailMatch) leadInfo.email = emailMatch[0];
        if (phoneMatch) leadInfo.phone = phoneMatch[0];
        
        // Try to extract name (simple heuristic)
        if (content.includes('my name is') || content.includes('i am') || content.includes("i'm")) {
          const nameMatch = msg.content.match(/(?:my name is|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
          if (nameMatch) leadInfo.name = nameMatch[1].trim();
        }
        
        // Save the last message as the lead's message
        leadInfo.message = msg.content;
      }
    }
    
    return leadInfo;
  };

  // Save lead automatically when contact info is detected
  const saveLeadIfDetected = async (messageHistory) => {
    const leadInfo = extractLeadInfo(messageHistory);
    
    // Only save if we have at least email or phone
    if (leadInfo.email || leadInfo.phone) {
      // Create a unique key for this lead
      const leadKey = `${leadInfo.email || ''}-${leadInfo.phone || ''}`;
      
      // Check if we've already captured this lead
      if (capturedLeads.has(leadKey)) {
        return; // Skip if already captured
      }
      
      try {
        await fetch(`${API_URL}/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bot_id: botId,
            name: leadInfo.name,
            email: leadInfo.email,
            phone: leadInfo.phone,
            message: leadInfo.message,
          }),
        });
        
        // Mark this lead as captured
        setCapturedLeads(prev => new Set([...prev, leadKey]));
        toast.success('Thanks! We\'ll be in touch soon.');
      } catch (error) {
        console.error('Error saving lead:', error);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          bot_id: botId,
        }),
      });

      const data = await response.json();
      setMessages([...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: data.response }]);
      
      // Automatically detect and save lead information
      await saveLeadIfDetected([...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClasses[position]} z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110`}
          style={{ width: '60px', height: '60px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed ${positionClasses[position]} z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300`}
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-semibold">{botName || 'Chat Assistant'}</h3>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">Start a conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex items-end gap-2 max-w-[80%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
                    🤖
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
