import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Ticket, 
  User, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Plus,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@student.edu',
    branch: 'Computer Science',
    year: '3rd Year',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const joinedClubs = [
    {
      id: 1,
      name: 'Coding Club',
      category: 'Technology',
      members: 150,
      eventsThisMonth: 3,
      logo: '💻'
    },
    {
      id: 2,
      name: 'Drama Club',
      category: 'Arts',
      members: 80,
      eventsThisMonth: 2,
      logo: '🎭'
    },
    {
      id: 3,
      name: 'Sports Club',
      category: 'Sports',
      members: 200,
      eventsThisMonth: 4,
      logo: '⚽'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'React Workshop',
      club: 'Coding Club',
      date: '2024-01-15',
      time: '3:00 PM - 5:00 PM',
      venue: 'CS Department Lab',
      rsvpStatus: 'confirmed'
    },
    {
      id: 2,
      title: 'Cultural Fest Rehearsal',
      club: 'Drama Club',
      date: '2024-01-18',
      time: '4:00 PM - 6:00 PM',
      venue: 'Auditorium',
      rsvpStatus: 'pending'
    },
    {
      id: 3,
      title: 'Basketball Tournament',
      club: 'Sports Club',
      date: '2024-01-20',
      time: '2:00 PM - 5:00 PM',
      venue: 'Sports Complex',
      rsvpStatus: 'confirmed'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Joined', club: 'Coding Club', time: '2 hours ago' },
    { id: 2, action: 'RSVPed for', event: 'React Workshop', time: '1 day ago' },
    { id: 3, action: 'Volunteered for', event: 'Cultural Fest', time: '2 days ago' }
  ];

  // Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'clubs', label: 'Clubs', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'rsvps', label: 'My RSVPs', icon: Ticket },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent 
          joinedClubs={joinedClubs} 
          upcomingEvents={upcomingEvents} 
          recentActivities={recentActivities}
          userData={userData}
        />;
      case 'clubs':
        return <ClubsContent />;
      case 'events':
        return <EventsContent />;
      case 'rsvps':
        return <RSVPsContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <OverviewContent 
          joinedClubs={joinedClubs} 
          upcomingEvents={upcomingEvents} 
          recentActivities={recentActivities}
          userData={userData}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl transform transition duration-300 ease-in-out z-50
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ClubHub</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {userData.branch} • {userData.year}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition duration-200
                  ${activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search Bar */}
              <div className="ml-4 lg:ml-0 relative max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="h-6 w-6" />
              </button>
              <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-700">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Overview Content Component
const OverviewContent = ({ joinedClubs, upcomingEvents, recentActivities, userData }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {userData.name}! 👋</h1>
        <p className="text-indigo-100">Here's what's happening with your clubs and events today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Joined Clubs</p>
              <p className="text-2xl font-bold text-gray-900">{joinedClubs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Ticket className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">RSVPs This Month</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Joined Clubs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Clubs</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {joinedClubs.map((club) => (
              <div key={club.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition duration-200">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{club.logo}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{club.name}</h3>
                    <p className="text-sm text-gray-500">{club.members} members • {club.eventsThisMonth} events this month</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {club.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition duration-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${event.rsvpStatus === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  `}>
                    {event.rsvpStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{event.club}</p>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.venue}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-gray-700">
                    <span className="font-medium">{activity.action}</span>{' '}
                    {activity.club || activity.event}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const ClubsContent = () => (
  <div className="text-center py-12">
    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Clubs Management</h3>
    <p className="text-gray-500">Browse and manage your clubs here.</p>
  </div>
);

const EventsContent = () => (
  <div className="text-center py-12">
    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Events Calendar</h3>
    <p className="text-gray-500">View and manage all events here.</p>
  </div>
);

const RSVPsContent = () => (
  <div className="text-center py-12">
    <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">My RSVPs</h3>
    <p className="text-gray-500">Manage your event registrations here.</p>
  </div>
);

const ProfileContent = () => (
  <div className="text-center py-12">
    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Settings</h3>
    <p className="text-gray-500">Manage your account settings here.</p>
  </div>
);

export default Dashboard;