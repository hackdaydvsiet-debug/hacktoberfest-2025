import React, { useState } from 'react';
import { 
  Bell,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Star,
  Settings,
  Filter,
  CheckCheck,
  Trash2,
  Archive,
  X,
  Clock,
  UserPlus,
  Ticket,
  Image as ImageIcon
} from 'lucide-react';

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'event',
      title: 'React Workshop Starting Soon',
      message: 'Your React Workshop event starts in 30 minutes. Venue: CS Department Lab',
      time: '5 minutes ago',
      isRead: false,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      action: 'view_event',
      eventId: 101
    },
    {
      id: 2,
      type: 'club',
      title: 'Welcome to Coding Club!',
      message: 'Your membership request for Coding Club has been approved.',
      time: '1 hour ago',
      isRead: false,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      action: 'view_club',
      clubId: 201
    },
    {
      id: 3,
      type: 'volunteer',
      title: 'Volunteer Application Accepted',
      message: 'Your volunteer application for Cultural Fest has been accepted.',
      time: '2 hours ago',
      isRead: true,
      icon: Heart,
      color: 'bg-purple-100 text-purple-600',
      action: 'view_volunteer',
      eventId: 102
    },
    {
      id: 4,
      type: 'system',
      title: 'Profile Update Required',
      message: 'Please complete your profile to access all features.',
      time: '5 hours ago',
      isRead: true,
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600',
      action: 'update_profile'
    },
    {
      id: 5,
      type: 'message',
      title: 'New Message from Drama Club',
      message: 'You have a new message regarding the upcoming rehearsal schedule.',
      time: '1 day ago',
      isRead: true,
      icon: MessageSquare,
      color: 'bg-indigo-100 text-indigo-600',
      action: 'view_messages',
      clubId: 202
    },
    {
      id: 6,
      type: 'achievement',
      title: 'New Badge Earned!',
      message: 'You have earned the "Active Member" badge for your participation.',
      time: '2 days ago',
      isRead: true,
      icon: Star,
      color: 'bg-orange-100 text-orange-600',
      action: 'view_achievements'
    },
    {
      id: 7,
      type: 'event',
      title: 'Event Reminder: Photography Exhibition',
      message: 'Photography Exhibition starts tomorrow at 10:00 AM.',
      time: '2 days ago',
      isRead: true,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      action: 'view_event',
      eventId: 103
    },
    {
      id: 8,
      type: 'club',
      title: 'New Club Member',
      message: 'Sarah Johnson has joined your Coding Club.',
      time: '3 days ago',
      isRead: true,
      icon: UserPlus,
      color: 'bg-green-100 text-green-600',
      action: 'view_member',
      clubId: 201,
      userId: 301
    },
    {
      id: 9,
      type: 'rsvp',
      title: 'RSVP Confirmed',
      message: 'Your RSVP for AI Symposium has been confirmed.',
      time: '3 days ago',
      isRead: true,
      icon: Ticket,
      color: 'bg-teal-100 text-teal-600',
      action: 'view_event',
      eventId: 104
    },
    {
      id: 10,
      type: 'gallery',
      title: 'New Photos Uploaded',
      message: '5 new photos have been added to Cultural Fest gallery.',
      time: '4 days ago',
      isRead: true,
      icon: ImageIcon,
      color: 'bg-pink-100 text-pink-600',
      action: 'view_gallery',
      eventId: 102
    }
  ];

  const filters = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
    { key: 'event', label: 'Events', count: notifications.filter(n => n.type === 'event').length },
    { key: 'club', label: 'Clubs', count: notifications.filter(n => n.type === 'club').length },
    { key: 'volunteer', label: 'Volunteer', count: notifications.filter(n => n.type === 'volunteer').length },
    { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
  ];

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.isRead;
    return notification.type === activeFilter;
  });

  const toggleNotificationSelection = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const markAsRead = (ids) => {
    // In real app, update in database
    console.log('Mark as read:', ids);
    setSelectedNotifications([]);
  };

  const markAllAsRead = () => {
    // In real app, update all in database
    console.log('Mark all as read');
    setSelectedNotifications([]);
  };

  const deleteNotifications = (ids) => {
    // In real app, delete from database
    console.log('Delete notifications:', ids);
    setSelectedNotifications([]);
  };

  const handleNotificationAction = (notification) => {
    console.log('Action:', notification.action, notification);
    // In real app, navigate to appropriate page
  };

  const getNotificationIcon = (notification) => {
    const Icon = notification.icon;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-2 text-gray-600">
                Stay updated with your club activities and events
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200 flex items-center"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Filters and Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {filters.map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center ${
                        activeFilter === filter.key
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {filter.label}
                      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                        activeFilter === filter.key
                          ? 'bg-indigo-200 text-indigo-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Bulk Actions */}
                {selectedNotifications.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {selectedNotifications.length} selected
                    </span>
                    <button
                      onClick={() => markAsRead(selectedNotifications)}
                      className="px-3 py-1.5 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition duration-200 flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Read
                    </button>
                    <button
                      onClick={() => deleteNotifications(selectedNotifications)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isSelected={selectedNotifications.includes(notification.id)}
                      onSelect={toggleNotificationSelection}
                      onAction={handleNotificationAction}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-gray-500">
                    {activeFilter === 'unread' 
                      ? "You're all caught up! No unread notifications."
                      : "No notifications to display."
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Select All Footer */}
            {filteredNotifications.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={selectAll}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {selectedNotifications.length === filteredNotifications.length
                    ? 'Deselect All'
                    : 'Select All'
                  }
                </button>
                <div className="text-sm text-gray-500">
                  Showing {filteredNotifications.length} of {notifications.length} notifications
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Total</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{notifications.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-red-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Unread</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Event Alerts</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {notifications.filter(n => n.type === 'event').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Club Updates</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {notifications.filter(n => n.type === 'club').length}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={markAllAsRead}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition duration-200 flex items-center"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All as Read
                  </button>
                  <button
                    onClick={() => deleteNotifications(notifications.map(n => n.id))}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition duration-200 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <NotificationSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({ notification, isSelected, onSelect, onAction }) => {
  const Icon = notification.icon;

  const handleClick = () => {
    onAction(notification);
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-50 transition duration-200 cursor-pointer ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox for selection */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(notification.id);
          }}
          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />

        {/* Notification Icon */}
        <div className={`p-2 rounded-lg ${notification.color}`}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`text-sm font-medium ${
                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1" />
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {notification.time}
            </span>
            <div className="flex space-x-2">
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Mark as read action
                    console.log('Mark as read:', notification.id);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Delete action
                  console.log('Delete:', notification.id);
                }}
                className="text-xs text-gray-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Modal
const NotificationSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    clubAnnouncements: true,
    volunteerUpdates: true,
    messageAlerts: true,
    achievementAlerts: true,
    weeklyDigest: false,
    marketingEmails: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Notification Channels */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive browser notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Types */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
              <div className="space-y-3">
                {[
                  { key: 'eventReminders', label: 'Event Reminders', description: 'Reminders for upcoming events' },
                  { key: 'clubAnnouncements', label: 'Club Announcements', description: 'Updates from your clubs' },
                  { key: 'volunteerUpdates', label: 'Volunteer Updates', description: 'Volunteer opportunity updates' },
                  { key: 'messageAlerts', label: 'Message Alerts', description: 'New messages from clubs' },
                  { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'Badges and achievements' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of activities' },
                  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and offers' }
                ].map(setting => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{setting.label}</p>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Save settings:', settings);
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;