import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Bot, Trash2, CheckCircle, XCircle, Code } from 'lucide-react'
import { botsAPI } from '../api/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function Bots() {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)
  const [selectedBotForEmbed, setSelectedBotForEmbed] = useState(null)
  const [newBot, setNewBot] = useState({ name: '', description: '' })

  useEffect(() => {
    loadBots()
  }, [])

  const loadBots = async () => {
    try {
      const response = await botsAPI.getAll()
      setBots(response.data)
    } catch (error) {
      toast.error('Failed to load bots')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBot = async (e) => {
    e.preventDefault()
    if (!newBot.name.trim()) {
      toast.error('Bot name is required')
      return
    }

    try {
      await botsAPI.create(newBot)
      toast.success('Bot created successfully')
      setShowCreateModal(false)
      setNewBot({ name: '', description: '' })
      loadBots()
    } catch (error) {
      toast.error('Failed to create bot')
      console.error(error)
    }
  }

  const handleDeleteBot = async (botId, botName) => {
    if (!confirm(`Are you sure you want to delete "${botName}"?`)) return

    try {
      await botsAPI.delete(botId)
      toast.success('Bot deleted successfully')
      loadBots()
    } catch (error) {
      toast.error('Failed to delete bot')
      console.error(error)
    }
  }

  const handleEmbedBot = (bot) => {
    setSelectedBotForEmbed(bot)
    setShowEmbedModal(true)
  }

  const getEmbedCode = (bot) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    return `<script>
  window.chatbotConfig = {
    botId: '${bot.id}',
    apiUrl: '${apiUrl}'
  };
<\/script>
<script src="http://localhost:3000/widget.js"><\/script>`;
  }

  const copyEmbedCode = () => {
    const code = getEmbedCode(selectedBotForEmbed);
    navigator.clipboard.writeText(code);
    toast.success('Embed code copied to clipboard!');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bots</h1>
          <p className="text-gray-600 mt-2">Manage your AI chatbots</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create Bot
        </button>
      </div>

      {bots.length === 0 ? (
        <div className="card text-center py-12">
          <Bot className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bots yet</h3>
          <p className="text-gray-600 mb-6">Create your first AI chatbot to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Create Your First Bot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div key={bot.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Bot className="text-primary-600" size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEmbedBot(bot)}
                    className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Get Embed Code"
                  >
                    <Code size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteBot(bot.id, bot.name)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{bot.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {bot.description || 'No description'}
              </p>

              <div className="flex items-center gap-2 mb-4">
                {bot.is_trained ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <CheckCircle size={16} />
                    Trained
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                    <XCircle size={16} />
                    Not Trained
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Created {format(new Date(bot.created_at), 'MMM d, yyyy')}
              </p>

              <Link
                to={`/bots/${bot.id}`}
                className="block w-full text-center btn-primary"
              >
                Manage Bot
              </Link>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Bot</h2>
            <form onSubmit={handleCreateBot}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bot Name *
                </label>
                <input
                  type="text"
                  value={newBot.name}
                  onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Customer Support Bot"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newBot.description}
                  onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="What does this bot do?"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Create Bot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewBot({ name: '', description: '' })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEmbedModal && selectedBotForEmbed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Embed Chat Widget</h2>
            <p className="text-gray-600 mb-4">
              Add this chat widget to your website by copying the code below and pasting it into your HTML before the closing &lt;/body&gt; tag.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bot: {selectedBotForEmbed.name}
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Embed Code
              </label>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{getEmbedCode(selectedBotForEmbed)}</code>
                </pre>
                <button
                  onClick={copyEmbedCode}
                  className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Copy the embed code above</li>
                <li>Paste it into your website's HTML</li>
                <li>Place it before the closing &lt;/body&gt; tag</li>
                <li>Refresh your website to see the widget</li>
              </ol>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyEmbedCode}
                className="btn-primary flex-1"
              >
                Copy Code
              </button>
              <button
                onClick={() => {
                  setShowEmbedModal(false)
                  setSelectedBotForEmbed(null)
                }}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
