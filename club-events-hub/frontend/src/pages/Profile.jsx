import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Users,
  Award,
  Camera,
  Shield,
  Bell,
  Globe,
  Heart,
  Star,
  Clock,
  ChevronRight,
  Upload
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    // Personal Information
    name: 'John Doe',
    email: 'john.doe@student.edu',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate Computer Science student interested in web development, AI, and open source projects. Love to participate in hackathons and tech events.',
    
    // Academic Information
    studentId: 'CS2024001',
    branch: 'Computer Science',
    year: '3rd Year',
    semester: '6th Semester',
    cgpa: '8.7',
    
    // Social Links
    github: 'johndoe',
    linkedin: 'johndoe',
    portfolio: 'johndoe.dev',
    
    // Preferences
    emailNotifications: true,
    eventReminders: true,
    newsletter: false,
    
    // Stats
    joinedClubs: 4,
    eventsAttended: 12,
    volunteerHours: 24,
    achievements: 3
  });

  const [formData, setFormData] = useState(profileData);

  // Sample activities
  const activities = [
    {
      id: 1,
      type: 'club',
      action: 'Joined',
      target: 'Coding Club',
      time: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      type: 'event',
      action: 'Attended',
      target: 'React Workshop',
      time: '1 day ago',
      icon: Calendar
    },
    {
      id: 3,
      type: 'volunteer',
      action: 'Volunteered at',
      target: 'Cultural Fest',
      time: '2 days ago',
      icon: Heart
    },
    {
      id: 4,
      type: 'achievement',
      action: 'Earned badge',
      target: 'Active Member',
      time: '1 week ago',
      icon: Award
    }
  ];

  // Joined clubs
  const joinedClubs = [
    {
      id: 1,
      name: 'Coding Club',
      role: 'Member',
      joinDate: '2024-01-15',
      logo: '💻',
      events: 8
    },
    {
      id: 2,
      name: 'Drama Club',
      role: 'Active Member',
      joinDate: '2024-01-10',
      logo: '🎭',
      events: 5
    },
    {
      id: 3,
      name: 'Sports Club',
      role: 'Member',
      joinDate: '2024-01-08',
      logo: '⚽',
      events: 6
    },
    {
      id: 4,
      name: 'Photography Club',
      role: 'Coordinator',
      joinDate: '2024-01-05',
      logo: '📸',
      events: 3
    }
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'AI Workshop',
      club: 'Coding Club',
      date: '2024-02-15',
      time: '3:00 PM',
      venue: 'Tech Lab'
    },
    {
      id: 2,
      title: 'Photography Exhibition',
      club: 'Photography Club',
      date: '2024-02-20',
      time: '10:00 AM',
      venue: 'Art Gallery'
    }
  ];

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfileData(formData);
    } else {
      // Start editing - copy current data to form
      setFormData(profileData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
    // In real app, make API call to save data
    console.log('Profile updated:', formData);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'clubs', label: 'My Clubs', icon: Users },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Shield }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab profileData={profileData} activities={activities} />;
      case 'clubs':
        return <ClubsTab clubs={joinedClubs} />;
      case 'events':
        return <EventsTab events={upcomingEvents} />;
      case 'settings':
        return <SettingsTab profileData={profileData} onUpdate={handleInputChange} isEditing={isEditing} />;
      default:
        return <OverviewTab profileData={profileData} activities={activities} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition duration-200">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-b-2 border-indigo-500 bg-transparent focus:outline-none"
                      />
                    ) : (
                      profileData.name
                    )}
                  </h1>
                  <p className="text-gray-600 mt-1">{profileData.email}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{profileData.branch}</span>
                    <span>•</span>
                    <span>{profileData.year}</span>
                    <span>•</span>
                    <span>ID: {profileData.studentId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4 md:mt-0">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-600 max-w-3xl">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Clubs</p>
                    <p className="text-xl font-bold text-gray-900">{profileData.joinedClubs}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Events</p>
                    <p className="text-xl font-bold text-gray-900">{profileData.eventsAttended}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Volunteer Hours</p>
                    <p className="text-xl font-bold text-gray-900">{profileData.volunteerHours}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Achievements</p>
                    <p className="text-xl font-bold text-gray-900">{profileData.achievements}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition duration-200 ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ profileData, activities }) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{profileData.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-900">{profileData.phone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Branch</p>
              <p className="text-gray-900">{profileData.branch}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Year & Semester</p>
              <p className="text-gray-900">{profileData.year} • {profileData.semester}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="text-gray-900 font-medium">{profileData.studentId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CGPA</p>
            <p className="text-gray-900 font-medium">{profileData.cgpa}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Icon className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-medium">{activity.action}</span> {activity.target}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Clubs Tab Component
const ClubsTab = ({ clubs }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">My Clubs</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {clubs.map((club) => (
            <div key={club.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-200">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{club.logo}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{club.name}</h3>
                  <p className="text-sm text-gray-600">
                    {club.role} • Joined {new Date(club.joinDate).toLocaleDateString()} • {club.events} events
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-xs rounded-full ${
                  club.role === 'Coordinator' 
                    ? 'bg-purple-100 text-purple-800'
                    : club.role === 'Active Member'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {club.role}
                </span>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Events Tab Component
const EventsTab = ({ events }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <div className="p-6">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.club}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                      <span>•</span>
                      <span>{event.venue}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-sm">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ profileData, onUpdate, isEditing }) => {
  return (
    <div className="space-y-6">
      {/* Social Links */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={isEditing ? profileData.github : `github.com/${profileData.github}`}
                onChange={(e) => onUpdate('github', e.target.value)}
                disabled={!isEditing}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={isEditing ? profileData.linkedin : `linkedin.com/in/${profileData.linkedin}`}
                onChange={(e) => onUpdate('linkedin', e.target.value)}
                disabled={!isEditing}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={isEditing ? profileData.portfolio : profileData.portfolio}
                onChange={(e) => onUpdate('portfolio', e.target.value)}
                disabled={!isEditing}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.emailNotifications}
                onChange={(e) => onUpdate('emailNotifications', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Event Reminders</p>
              <p className="text-sm text-gray-600">Get reminders for upcoming events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.eventReminders}
                onChange={(e) => onUpdate('eventReminders', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Newsletter</p>
              <p className="text-sm text-gray-600">Monthly club updates and news</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.newsletter}
                onChange={(e) => onUpdate('newsletter', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 border border-red-200">
            Delete Account
          </button>
          <button className="w-full text-left px-4 py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 border border-orange-200">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;