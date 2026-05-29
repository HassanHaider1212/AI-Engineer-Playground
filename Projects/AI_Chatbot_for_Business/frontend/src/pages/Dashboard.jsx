import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, MessageSquare, Users, TrendingUp } from 'lucide-react'
import { botsAPI, conversationsAPI, leadsAPI } from '../api/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBots: 0,
    totalConversations: 0,
    totalLeads: 0,
    trainedBots: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [botsRes, conversationsRes, leadsRes] = await Promise.all([
        botsAPI.getAll(),
        conversationsAPI.getAll(),
        leadsAPI.getAll(),
      ])

      const trainedBots = botsRes.data.filter(bot => bot.is_trained).length

      setStats({
        totalBots: botsRes.data.length,
        totalConversations: conversationsRes.data.length,
        totalLeads: leadsRes.data.length,
        trainedBots,
      })
    } catch (error) {
      toast.error('Failed to load dashboard stats')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Bots',
      value: stats.totalBots,
      icon: Bot,
      color: 'bg-blue-500',
      link: '/bots',
    },
    {
      name: 'Conversations',
      value: stats.totalConversations,
      icon: MessageSquare,
      color: 'bg-green-500',
      link: '/conversations',
    },
    {
      name: 'Leads Captured',
      value: stats.totalLeads,
      icon: Users,
      color: 'bg-purple-500',
      link: '/leads',
    },
    {
      name: 'Trained Bots',
      value: stats.trainedBots,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/bots',
    },
  ]

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your AI Chatbot management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Start</h2>
          <div className="space-y-3">
            <Link
              to="/bots"
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Create Your First Bot</h3>
              <p className="text-sm text-gray-600">Set up a new AI chatbot for your business</p>
            </Link>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Upload Documents</h3>
              <p className="text-sm text-gray-600">Train your bot with PDFs or website content</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-1">Embed Chat Widget</h3>
              <p className="text-sm text-gray-600">Add the chatbot to your website</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Features</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">RAG-Powered Responses</h4>
                <p className="text-sm text-gray-600">Answers based on your business data</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Automatic Lead Capture</h4>
                <p className="text-sm text-gray-600">Collect customer information seamlessly</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Chat History</h4>
                <p className="text-sm text-gray-600">View all customer conversations</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Easy Integration</h4>
                <p className="text-sm text-gray-600">Embed with a single script tag</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
