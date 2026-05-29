import { useEffect, useState } from 'react'
import { MessageSquare, Bot, ChevronRight, ChevronDown } from 'lucide-react'
import { conversationsAPI, botsAPI } from '../api/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function Conversations() {
  const [conversations, setConversations] = useState([])
  const [bots, setBots] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [expandedBots, setExpandedBots] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [convResponse, botsResponse] = await Promise.all([
        conversationsAPI.getAll(),
        botsAPI.getAll()
      ])
      setConversations(convResponse.data)
      
      // Create bot lookup map
      const botMap = {}
      botsResponse.data.forEach(bot => {
        botMap[bot.id] = bot
      })
      setBots(botMap)
      
      // Auto-expand first bot
      if (convResponse.data.length > 0) {
        const firstBotId = convResponse.data[0].bot_id
        setExpandedBots({ [firstBotId]: true })
      }
    } catch (error) {
      toast.error('Failed to load conversations')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleBot = (botId) => {
    setExpandedBots(prev => ({
      ...prev,
      [botId]: !prev[botId]
    }))
  }

  // Group conversations by bot
  const groupedConversations = conversations.reduce((acc, conv) => {
    if (!acc[conv.bot_id]) {
      acc[conv.bot_id] = []
    }
    acc[conv.bot_id].push(conv)
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-600 mt-2">View all customer conversations by bot</p>
      </div>

      {conversations.length === 0 ? (
        <div className="card text-center py-12">
          <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversations yet</h3>
          <p className="text-gray-600">Conversations will appear here once customers start chatting</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card p-0 max-h-[600px] overflow-y-auto">
              {Object.entries(groupedConversations).map(([botId, convs]) => {
                const bot = bots[botId]
                const isExpanded = expandedBots[botId]
                
                return (
                  <div key={botId}>
                    <button
                      onClick={() => toggleBot(botId)}
                      className="w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <Bot size={20} className="text-gray-400" />
                      <span className="font-medium text-gray-900 flex-1">
                        {bot?.name || 'Unknown Bot'}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {convs.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="bg-gray-50">
                        {convs.map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`w-full text-left p-3 pl-11 border-b border-gray-100 hover:bg-gray-100 transition-colors ${
                              selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {conv.messages.length > 0 
                                ? conv.messages[0].content.substring(0, 40) + '...'
                                : 'Empty conversation'
                              }
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{conv.messages.length} messages</span>
                              <span>•</span>
                              <span>{format(new Date(conv.created_at), 'MMM d')}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="card">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Conversation Details
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Bot: {bots[selectedConversation.bot_id]?.name || 'Unknown Bot'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Session ID: {selectedConversation.session_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Started: {format(new Date(selectedConversation.created_at), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto bg-gray-50 p-4 rounded-lg">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`flex items-end gap-2 max-w-[75%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                          message.role === 'user' ? 'bg-blue-600' : 'bg-green-600'
                        }`}>
                          {message.role === 'user' ? '👤' : '🤖'}
                        </div>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-900 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={`text-xs mt-2 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                            }`}
                          >
                            {format(new Date(message.timestamp), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">Select a conversation to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
