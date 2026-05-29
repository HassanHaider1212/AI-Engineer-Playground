import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Chat() {
  const [botId, setBotId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [bots, setBots] = useState([]);
  const [loadingBots, setLoadingBots] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [capturedLeads, setCapturedLeads] = useState(new Set()); // Track captured leads

  // Save state to localStorage
  useEffect(() => {
    if (connected) {
      localStorage.setItem('chatBotId', botId);
      localStorage.setItem('chatConnected', 'true');
    } else {
      localStorage.removeItem('chatBotId');
      localStorage.removeItem('chatConnected');
    }
  }, [connected, botId]);

  // Restore state on mount
  useEffect(() => {
    const savedBotId = localStorage.getItem('chatBotId');
    const savedConnected = localStorage.getItem('chatConnected') === 'true';
    
    if (savedBotId && savedConnected) {
      setBotId(savedBotId);
      setConnected(true);
      // Load conversation history for the saved bot
      const loadHistory = async () => {
        try {
          const response = await fetch(`${API_URL}/conversations/${savedBotId}`);
          const data = await response.json();
          if (data && data.length > 0 && data[0].messages && data[0].messages.length > 0) {
            const history = data[0].messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }));
            setMessages(history);
          }
        } catch (error) {
          console.error('Error loading saved conversation:', error);
        }
      };
      loadHistory();
    }
  }, []);

  const clearHistory = () => {
    setMessages([]);
    setCapturedLeads(new Set()); // Reset captured leads when clearing history
  };

  const disconnectBot = () => {
    setConnected(false);
    setMessages([]);
    setCapturedLeads(new Set()); // Reset captured leads
    localStorage.removeItem('chatBotId');
    localStorage.removeItem('chatConnected');
  };

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
        toast.success('Lead captured successfully!');
      } catch (error) {
        console.error('Error saving lead:', error);
      }
    }
  };

  useEffect(() => {
    const fetchBots = async () => {
      setLoadingBots(true);
      try {
        const response = await fetch(`${API_URL}/bots`);
        const data = await response.json();
        setBots(data);
        if (data.length > 0) {
          setBotId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching bots:', error);
      } finally {
        setLoadingBots(false);
      }
    };

    fetchBots();
  }, []);

  useEffect(() => {
    const checkHistory = async () => {
      if (botId) {
        try {
          const response = await fetch(`${API_URL}/conversations/${botId}`);
          const data = await response.json();
          setHasHistory(data && data.length > 0 && data[0].messages && data[0].messages.length > 0);
        } catch (error) {
          setHasHistory(false);
        }
      }
    };

    checkHistory();
  }, [botId]);

  const handleConnect = async (loadHistory = false) => {
    if (botId.trim()) {
      setConnected(true);
      setMessages([]);
      
      if (loadHistory) {
        // Fetch conversation history
        try {
          const response = await fetch(`${API_URL}/conversations/${botId}`);
          const data = await response.json();
          if (data && data.length > 0) {
            // Get the most recent conversation
            const latestConversation = data[0];
            if (latestConversation.messages && latestConversation.messages.length > 0) {
              const history = latestConversation.messages.map(msg => ({
                role: msg.role,
                content: msg.content
              }));
              setMessages(history);
            }
          }
        } catch (error) {
          console.error('Error fetching conversation history:', error);
        }
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
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
      const newMessages = [...updatedMessages, { role: 'assistant', content: data.response }];
      setMessages(newMessages);
      
      // Save conversation to backend (only messages with content)
      const messagesToSave = newMessages.filter(msg => msg.content && msg.content.trim() !== '');
      if (messagesToSave.length > 0) {
        await fetch(`${API_URL}/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bot_id: botId,
            messages: messagesToSave,
          }),
        });
      }
      
      // Automatically detect and save lead information
      await saveLeadIfDetected(newMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...messages, { role: 'user', content: userMessage }, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Your Chatbot</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          {loadingBots ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading bots...</p>
            </div>
          ) : bots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No bots available. Please create a bot first.</p>
              <a href="/bots" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                Go to Bots page
              </a>
            </div>
          ) : (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Bot
              </label>
              <select
                value={botId}
                onChange={(e) => setBotId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {bots.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name} {bot.is_trained ? '✓' : '(not trained)'}
                  </option>
                ))}
              </select>
              {hasHistory && (
                <p className="mt-2 text-sm text-green-600">
                  💬 Previous conversation available
                </p>
              )}
              <div className="flex gap-2">
                {hasHistory && (
                  <button
                    onClick={() => handleConnect(true)}
                    disabled={!botId}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Resume Conversation
                  </button>
                )}
                <button
                  onClick={() => handleConnect(false)}
                  disabled={!botId}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {hasHistory ? 'Start Fresh' : 'Start Chat'}
                </button>
              </div>
              {!bots.find(b => b.id === botId)?.is_trained && (
                <p className="mt-4 text-sm text-yellow-600">
                  ⚠️ This bot is not trained yet. Upload documents and train it first.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Chat with {bots.find(b => b.id === botId)?.name || 'Bot'}
        </h1>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear History
            </button>
          )}
          <button
            onClick={disconnectBot}
            className="text-gray-600 hover:text-gray-900"
          >
            Change Bot
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation with your bot!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex items-end gap-2 max-w-[75%] ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
                  }`}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">
                  🤖
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="border-t bg-white p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
