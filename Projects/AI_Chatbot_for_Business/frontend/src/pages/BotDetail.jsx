import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Upload, Link2, FileText, Loader, CheckCircle, ArrowLeft, MessageSquare } from 'lucide-react'
import { botsAPI } from '../api/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function BotDetail() {
  const { botId } = useParams()
  const [bot, setBot] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [training, setTraining] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [url, setUrl] = useState('')
  const [showWidgetModal, setShowWidgetModal] = useState(false)

  useEffect(() => {
    loadBotData()
  }, [botId])

  const loadBotData = async () => {
    try {
      const [botRes, docsRes] = await Promise.all([
        botsAPI.getOne(botId),
        botsAPI.getDocuments(botId),
      ])
      setBot(botRes.data)
      setDocuments(docsRes.data)
    } catch (error) {
      toast.error('Failed to load bot data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      await botsAPI.uploadFile(botId, file)
      toast.success('Document uploaded successfully')
      loadBotData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload document')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleUrlUpload = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    setUploading(true)
    try {
      await botsAPI.uploadUrl(botId, url)
      toast.success('URL content uploaded successfully')
      setUrl('')
      setShowUrlModal(false)
      loadBotData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload URL')
    } finally {
      setUploading(false)
    }
  }

  const handleTrain = async () => {
    if (documents.length === 0) {
      toast.error('Please upload at least one document first')
      return
    }

    setTraining(true)
    try {
      await botsAPI.train(botId)
      toast.success('Bot trained successfully!')
      loadBotData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Training failed')
    } finally {
      setTraining(false)
    }
  }

  const widgetCode = `<!-- AI Chatbot Widget -->
<script>
  window.chatbotConfig = {
    botId: '${botId}',
    apiUrl: 'http://localhost:8000/api'
  };
</script>
<script src="http://localhost:3000/widget.js"></script>`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!bot) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Bot not found</p>
        <Link to="/bots" className="btn-primary inline-block mt-4">
          Back to Bots
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/bots" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} />
        Back to Bots
      </Link>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{bot.name}</h1>
            <p className="text-gray-600 mt-2">{bot.description || 'No description'}</p>
          </div>
          <div className="flex items-center gap-3">
            {bot.is_trained ? (
              <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
                <CheckCircle size={20} />
                Trained
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-medium">
                <Loader size={20} />
                Not Trained
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
          <p className="text-3xl font-bold text-primary-600">{documents.length}</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
          <p className="text-lg font-medium text-gray-900">
            {bot.is_trained ? 'Ready to use' : 'Needs training'}
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
          <p className="text-lg font-medium text-gray-900">
            {format(new Date(bot.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Upload Knowledge</h2>
          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Upload size={20} />
                {uploading ? 'Uploading...' : 'Upload PDF or TXT'}
              </label>
            </label>

            <button
              onClick={() => setShowUrlModal(true)}
              disabled={uploading}
              className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Link2 size={20} />
              Add Website URL
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={handleTrain}
              disabled={training || documents.length === 0}
              className={`w-full btn-primary ${
                training || documents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {training ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin" size={20} />
                  Training...
                </span>
              ) : (
                'Train Bot'
              )}
            </button>
            {documents.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Upload documents first to train the bot
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Documents ({documents.length})</h2>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto mb-2" size={48} />
              <p>No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <FileText className="text-gray-400" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(doc.uploaded_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {doc.file_type.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {bot.is_trained && (
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Embed Widget</h2>
            <button
              onClick={() => setShowWidgetModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Get Widget Code
            </button>
          </div>
          <p className="text-gray-600">
            Your bot is ready! Copy the widget code and paste it into your website to start chatting.
          </p>
        </div>
      )}

      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add Website URL</h2>
            <form onSubmit={handleUrlUpload}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input"
                  placeholder="https://example.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  We'll extract the text content from this page
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary flex-1"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlModal(false)
                    setUrl('')
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

      {showWidgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Embed Chat Widget</h2>
            <p className="text-gray-600 mb-4">
              Copy this code and paste it before the closing &lt;/body&gt; tag in your website:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
              <pre className="text-sm">{widgetCode}</pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(widgetCode)
                  toast.success('Code copied to clipboard!')
                }}
                className="btn-primary flex-1"
              >
                Copy Code
              </button>
              <button
                onClick={() => setShowWidgetModal(false)}
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
