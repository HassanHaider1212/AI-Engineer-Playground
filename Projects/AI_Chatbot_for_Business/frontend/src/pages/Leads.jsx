import { useEffect, useState } from 'react'
import { Users, Mail, Phone, MessageSquare } from 'lucide-react'
import { leadsAPI } from '../api/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      const response = await leadsAPI.getAll()
      setLeads(response.data)
    } catch (error) {
      toast.error('Failed to load leads')
      console.error(error)
    } finally {
      setLoading(false)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-2">Customer information captured by your chatbots</p>
      </div>

      {leads.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads yet</h3>
          <p className="text-gray-600">Leads will appear here when customers provide their contact information</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <Users size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {lead.name || 'Anonymous'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(lead.captured_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail size={16} className="text-gray-400" />
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {lead.email}
                        </a>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} className="text-gray-400" />
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {lead.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {lead.message && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Message</span>
                      </div>
                      <p className="text-gray-900">{lead.message}</p>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    New Lead
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
