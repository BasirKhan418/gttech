'use client'
import React, { useState, useEffect } from 'react'
import { 
  Eye, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  RefreshCw,
  BarChart3
} from 'lucide-react'
import { toast, Toaster } from 'sonner'

interface GAQRequest {
  _id: string
  name: string
  email: string
  phone: string
  budget: string
  projectType: 'solution' | 'consultancy'
  requirementsPdf: string
  estimatedBudget?: string
  status: 'pending' | 'seen' | 'processed' | 'rejected'
  adminNotes?: string
  processedBy?: {
    _id: string
    name: string
    email: string
  }
  seenAt?: string
  processedAt?: string
  createdAt: string
  updatedAt: string
}

interface GAQStats {
  total: number
  pending: number
  seen: number
  processed: number
  rejected: number
  solutions: number
  consultancy: number
}

const GAQAdminPage = () => {
  const [requests, setRequests] = useState<GAQRequest[]>([])
  const [stats, setStats] = useState<GAQStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<GAQRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchRequests()
    fetchStats()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/gaq')
      const data = await response.json()
      
      if (data.success) {
        setRequests(data.data)
      } else {
        toast.error(data.message || 'Failed to fetch requests')
      }
    } catch (error) {
      toast.error('Failed to fetch requests')
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/gaq?stats=true')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateRequestStatus = async (id: string, status: string, notes?: string) => {
    try {
      setUpdating(true)
      
      const response = await fetch('/api/gaq', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          adminNotes: notes || undefined
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Status updated successfully')
        fetchRequests()
        fetchStats()
        setShowModal(false)
      } else {
        toast.error(data.message || 'Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return

    try {
      const response = await fetch('/api/gaq', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Request deleted successfully')
        fetchRequests()
        fetchStats()
      } else {
        toast.error(data.message || 'Failed to delete request')
      }
    } catch (error) {
      toast.error('Failed to delete request')
      console.error('Error deleting request:', error)
    }
  }

  const downloadPDF = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openModal = (request: GAQRequest) => {
    setSelectedRequest(request)
    setAdminNotes(request.adminNotes || '')
    setShowModal(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'seen':
        return <Eye className="w-4 h-4 text-blue-600" />
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClass = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800 border border-yellow-300`
      case 'seen':
        return `${baseClass} bg-blue-100 text-blue-800 border border-blue-300`
      case 'processed':
        return `${baseClass} bg-green-100 text-green-800 border border-green-300`
      case 'rejected':
        return `${baseClass} bg-red-100 text-red-800 border border-red-300`
      default:
        return `${baseClass} bg-gray-100 text-gray-800 border border-gray-300`
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesProjectType = projectTypeFilter === 'all' || request.projectType === projectTypeFilter
    
    return matchesSearch && matchesStatus && matchesProjectType
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-cyan-600" />
            Quote Requests (GAQ)
          </h1>
          <p className="text-gray-600">Manage and track client quote requests</p>
        </div>
        
        <button
          onClick={() => { fetchRequests(); fetchStats() }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Seen</p>
                <p className="text-2xl font-bold text-blue-800">{stats.seen}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Processed</p>
                <p className="text-2xl font-bold text-green-800">{stats.processed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Rejected</p>
                <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-cyan-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-600">Solutions</p>
                <p className="text-2xl font-bold text-cyan-800">{stats.solutions}</p>
              </div>
              <FileText className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Consultancy</p>
                <p className="text-2xl font-bold text-purple-800">{stats.consultancy}</p>
              </div>
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="seen">Seen</option>
            <option value="processed">Processed</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={projectTypeFilter}
            onChange={(e) => setProjectTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">All Types</option>
            <option value="solution">Solutions</option>
            <option value="consultancy">Consultancy</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Budget</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{request.name}</p>
                      <p className="text-sm text-gray-600">{request.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{request.phone}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.projectType === 'solution' 
                          ? 'bg-cyan-100 text-cyan-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {request.projectType}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{request.budget}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className={getStatusBadge(request.status)}>
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(request)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View/Edit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => downloadPDF(request.requirementsPdf, `requirements-${request.name}.pdf`)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => window.open(request.requirementsPdf, '_blank')}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                        title="View PDF"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteRequest(request._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">No quote requests match your current filters.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Quote Request Details
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <p className="text-gray-900">{selectedRequest.budget}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                  <p className="text-gray-900 capitalize">{selectedRequest.projectType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedRequest.status)}
                    <span className={getStatusBadge(selectedRequest.status)}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.estimatedBudget && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.estimatedBudget}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateRequestStatus(selectedRequest._id, 'seen', adminNotes)}
                      disabled={updating}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                    >
                      Mark as Seen
                    </button>
                    <button
                      onClick={() => updateRequestStatus(selectedRequest._id, 'processed', adminNotes)}
                      disabled={updating}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                    >
                      Mark as Processed
                    </button>
                    <button
                      onClick={() => updateRequestStatus(selectedRequest._id, 'rejected', adminNotes)}
                      disabled={updating}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this request..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Created: {new Date(selectedRequest.createdAt).toLocaleString()}
                  {selectedRequest.processedBy && (
                    <span className="block">
                      Processed by: {selectedRequest.processedBy.name}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPDF(selectedRequest.requirementsPdf, `requirements-${selectedRequest.name}.pdf`)}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GAQAdminPage
