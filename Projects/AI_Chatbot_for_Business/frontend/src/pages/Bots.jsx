import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Bot, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { botsAPI } from '../api/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function Bots() {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
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
                <button
                  onClick={() => handleDeleteBot(bot.id, bot.name)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
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
    </div>
  )
}
