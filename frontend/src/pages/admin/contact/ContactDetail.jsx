import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiClock, 
  FiSend,
  FiEdit2,
  FiUser
} from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useContact } from '../../../hooks/useContact';
import Button from '../../../components/common/Button';

const ContactDetailPage = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const {
    currentContact,
    isLoading,
    getContactById,
    updateContactStatus,
    formatContactDate,
  } = useContact();

  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (contactId) {
      getContactById(contactId);
    }
  }, [contactId]);

  useEffect(() => {
    if (currentContact) {
      setStatus(currentContact.status);
      setPriority(currentContact.priority);
      setAdminNotes(currentContact.adminNotes || '');
    }
  }, [currentContact]);

  const handleStatusUpdate = async () => {
    try {
      await updateContactStatus(contactId, {
        status,
        priority,
        adminNotes,
      });
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    setIsReplying(true);
    
    try {
      // Here you would integrate with your email service
      // For now, we'll just update the status and add a note
      await updateContactStatus(contactId, {
        status: 'resolved',
        adminNotes: `Reply sent: ${replyMessage}`,
        replyMessage,
      });
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
        {status.replace('-', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading contact details...</div>
      </div>
    );
  }

  if (!currentContact) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Contact not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/contacts')}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Contact Details</h1>
            <p className="text-sm text-gray-500">#{currentContact._id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(currentContact.status)}
          {getPriorityBadge(currentContact.priority)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Message */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Message</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                <p className="mt-1 text-sm text-gray-900">{currentContact.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Message</h3>
                <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                  {currentContact.message}
                </div>
              </div>
            </div>
          </div>

          {/* Reply Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Send Reply</h2>
            <form onSubmit={handleReply}>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your reply here..."
                required
              />
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isReplying || !replyMessage.trim()}
                  icon={<FiSend className="h-4 w-4" />}
                >
                  {isReplying ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiUser className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{currentContact.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <a href={`mailto:${currentContact.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                    {currentContact.email}
                  </a>
                </div>
              </div>
              {currentContact.phone && (
                <div className="flex items-center">
                  <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <a href={`tel:${currentContact.phone}`} className="text-sm text-blue-600 hover:text-blue-800">
                      {currentContact.phone}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <FiCalendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-900">{formatContactDate(currentContact.createdAt)}</p>
                </div>
              </div>
              {currentContact.ipAddress && (
                <div className="flex items-center">
                  <HiOutlineLocationMarker className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900">{currentContact.ipAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Manage Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Internal notes..."
                />
              </div>
              <Button
                onClick={handleStatusUpdate}
                className="w-full"
                icon={<FiEdit2 className="h-4 w-4" />}
              >
                Update Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;