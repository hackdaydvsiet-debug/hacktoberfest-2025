import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  ChevronDown,
  X,
  Heart,
  CheckCircle,
  Clock4,
  AlertCircle,
  Star
} from 'lucide-react';

const VolunteerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState({});

  // Sample volunteer events data
  const volunteerEvents = [
    {
      id: 1,
      title: 'Annual Cultural Fest 2024',
      club: 'Drama Club',
      category: 'Arts',
      description: 'Help us organize the biggest cultural event of the year. Volunteers needed for registration, stage management, and crowd control.',
      date: '2024-01-20',
      time: '8:00 AM - 10:00 PM',
      venue: 'Main Auditorium & Campus Grounds',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      volunteersNeeded: 25,
      volunteersApplied: 18,
      skillsRequired: ['Communication', 'Teamwork', 'Organization'],
      roles: ['Registration', 'Stage Management', 'Crowd Control', 'Food Stall'],
      clubLogo: '🎭',
      urgency: 'high',
      applicationDeadline: '2024-01-18'
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      club: 'Coding Club',
      category: 'Technology',
      description: 'Assist in organizing our annual tech conference. Help with speaker coordination, workshop setup, and attendee guidance.',
      date: '2024-02-15',
      time: '9:00 AM - 6:00 PM',
      venue: 'Tech Building Auditorium',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      volunteersNeeded: 15,
      volunteersApplied: 12,
      skillsRequired: ['Technical Knowledge', 'Communication', 'Problem Solving'],
      roles: ['Speaker Support', 'Workshop Assistant', 'Registration Desk'],
      clubLogo: '💻',
      urgency: 'medium',
      applicationDeadline: '2024-02-10'
    },
    {
      id: 3,
      title: 'Sports Day 2024',
      club: 'Sports Club',
      category: 'Sports',
      description: 'Support the organization of inter-department sports competitions. Help with event coordination, scoring, and equipment management.',
      date: '2024-01-25',
      time: '7:00 AM - 5:00 PM',
      venue: 'Sports Complex',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop',
      volunteersNeeded: 20,
      volunteersApplied: 15,
      skillsRequired: ['Sports Knowledge', 'Team Management', 'First Aid'],
      roles: ['Event Coordinator', 'Score Keeper', 'Equipment Manager'],
      clubLogo: '⚽',
      urgency: 'high',
      applicationDeadline: '2024-01-22'
    },
    {
      id: 4,
      title: 'Environmental Cleanup Drive',
      club: 'Eco Club',
      category: 'Social',
      description: 'Join our campus cleanup initiative. Help make our campus greener and more sustainable.',
      date: '2024-02-05',
      time: '8:00 AM - 12:00 PM',
      venue: 'Campus Grounds',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop',
      volunteersNeeded: 30,
      volunteersApplied: 22,
      skillsRequired: ['Physical Fitness', 'Environmental Awareness'],
      roles: ['Cleanup Crew', 'Recycling Coordinator', 'Awareness Team'],
      clubLogo: '🌱',
      urgency: 'low',
      applicationDeadline: '2024-02-01'
    },
    {
      id: 5,
      title: 'Blood Donation Camp',
      club: 'Medical Club',
      category: 'Social',
      description: 'Support the organization of our quarterly blood donation camp. Help with donor registration and post-donation care.',
      date: '2024-01-30',
      time: '10:00 AM - 4:00 PM',
      venue: 'Medical Center',
      image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=200&fit=crop',
      volunteersNeeded: 12,
      volunteersApplied: 8,
      skillsRequired: ['Empathy', 'Communication', 'Basic Medical Knowledge'],
      roles: ['Donor Registration', 'Refreshment Station', 'Support Staff'],
      clubLogo: '🏥',
      urgency: 'medium',
      applicationDeadline: '2024-01-28'
    },
    {
      id: 6,
      title: 'Startup Expo 2024',
      club: 'Entrepreneurship Club',
      category: 'Business',
      description: 'Assist in organizing our startup exhibition. Help with booth setup, visitor guidance, and event coordination.',
      date: '2024-02-20',
      time: '10:00 AM - 6:00 PM',
      venue: 'Business School Lobby',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
      volunteersNeeded: 18,
      volunteersApplied: 10,
      skillsRequired: ['Communication', 'Organization', 'Business Acumen'],
      roles: ['Booth Coordinator', 'Visitor Guide', 'Event Support'],
      clubLogo: '💼',
      urgency: 'medium',
      applicationDeadline: '2024-02-15'
    }
  ];

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Arts', label: 'Arts & Culture' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Social', label: 'Social Service' },
    { value: 'Business', label: 'Business' }
  ];

  // Application status options
  const statusOptions = {
    applied: { label: 'Applied', color: 'bg-yellow-100 text-yellow-800', icon: Clock4 },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'Not Selected', color: 'bg-red-100 text-red-800', icon: X }
  };

  // Filter events
  const filteredEvents = volunteerEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.club.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleApply = (eventId) => {
    // Simulate API call
    setApplicationStatus(prev => ({
      ...prev,
      [eventId]: 'applied'
    }));
    
    // In real app, make API call here
    console.log(`Applied for volunteer event ${eventId}`);
  };

  const getApplicationStatus = (eventId) => {
    return applicationStatus[eventId] || null;
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyConfig = {
      high: { color: 'bg-red-100 text-red-800', text: 'Urgent' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Moderate' },
      low: { color: 'bg-green-100 text-green-800', text: 'Low' }
    };
    
    const config = urgencyConfig[urgency];
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Volunteer Opportunities</h1>
              <p className="mt-2 text-gray-600">
                Make a difference by volunteering for campus events and activities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                My Applications
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{volunteerEvents.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(applicationStatus).filter(status => status === 'applied').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(applicationStatus).filter(status => status === 'accepted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Volunteers Needed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {volunteerEvents.reduce((sum, event) => sum + event.volunteersNeeded, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search volunteer opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-200 transition duration-200 flex items-center"
              >
                <Filter className="h-5 w-5 mr-2" />
                More
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredEvents.length}</span> volunteer opportunities
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Volunteer Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <VolunteerEventCard 
                key={event.id} 
                event={event} 
                onApply={handleApply}
                applicationStatus={getApplicationStatus(event.id)}
                statusOptions={statusOptions}
                getUrgencyBadge={getUrgencyBadge}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteer opportunities found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters to find more opportunities.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Volunteer Event Card Component
const VolunteerEventCard = ({ event, onApply, applicationStatus, statusOptions, getUrgencyBadge }) => {
  const progressPercentage = (event.volunteersApplied / event.volunteersNeeded) * 100;
  const StatusIcon = statusOptions[applicationStatus]?.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden">
      {/* Event Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          {getUrgencyBadge(event.urgency)}
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
            Volunteers
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Club and Category */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{event.clubLogo}</span>
            <span className="text-sm text-gray-600">{event.club}</span>
          </div>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {event.category}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>

        {/* Event Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            {event.time}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            Apply by: {formatDate(event.applicationDeadline)}
          </div>
        </div>

        {/* Volunteer Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Volunteer Positions</span>
            <span>{event.volunteersApplied}/{event.volunteersNeeded} filled</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Required:</h4>
          <div className="flex flex-wrap gap-1">
            {event.skillsRequired.map((skill, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Available Roles */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Roles:</h4>
          <div className="flex flex-wrap gap-1">
            {event.roles.map((role, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Application Status or Apply Button */}
        <div className="mt-4">
          {applicationStatus ? (
            <div className={`flex items-center justify-center px-4 py-3 rounded-lg ${statusOptions[applicationStatus].color}`}>
              {StatusIcon && <StatusIcon className="h-4 w-4 mr-2" />}
              <span className="font-medium">{statusOptions[applicationStatus].label}</span>
            </div>
          ) : (
            <button 
              onClick={() => onApply(event.id)}
              disabled={event.volunteersApplied >= event.volunteersNeeded}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 ${
                event.volunteersApplied >= event.volunteersNeeded
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {event.volunteersApplied >= event.volunteersNeeded ? 'Positions Filled' : 'Apply to Volunteer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default VolunteerPage;