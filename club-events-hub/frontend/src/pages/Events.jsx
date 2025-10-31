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
  Plus,
  Bookmark,
  Share2,
  Eye
} from 'lucide-react';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('upcoming');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState({});

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'React Workshop: Building Modern Web Apps',
      club: 'Coding Club',
      category: 'Technology',
      description: 'Learn React fundamentals and build your first web application with hands-on exercises.',
      date: '2024-01-15',
      time: '3:00 PM - 5:00 PM',
      venue: 'CS Department Lab, Room 301',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
      attendees: 45,
      maxAttendees: 60,
      isPast: false,
      clubLogo: '💻',
      tags: ['Workshop', 'React', 'Web Development']
    },
    {
      id: 2,
      title: 'Annual Cultural Fest 2024',
      club: 'Drama Club',
      category: 'Arts',
      description: 'A grand celebration of cultural diversity with performances, food, and music from around the world.',
      date: '2024-01-20',
      time: '10:00 AM - 8:00 PM',
      venue: 'Main Auditorium & Campus Grounds',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      attendees: 200,
      maxAttendees: 300,
      isPast: false,
      clubLogo: '🎭',
      tags: ['Cultural', 'Festival', 'Performance']
    },
    {
      id: 3,
      title: 'Inter-College Basketball Tournament',
      club: 'Sports Club',
      category: 'Sports',
      description: 'Witness thrilling basketball matches as teams from different colleges compete for the championship.',
      date: '2024-01-25',
      time: '2:00 PM - 6:00 PM',
      venue: 'Sports Complex Basketball Court',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop',
      attendees: 89,
      maxAttendees: 120,
      isPast: false,
      clubLogo: '⚽',
      tags: ['Sports', 'Tournament', 'Basketball']
    },
    {
      id: 4,
      title: 'AI & Machine Learning Symposium',
      club: 'Robotics Club',
      category: 'Technology',
      description: 'Explore the latest advancements in AI and ML with industry experts and research presentations.',
      date: '2024-01-18',
      time: '11:00 AM - 4:00 PM',
      venue: 'Conference Hall, Tech Building',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      attendees: 78,
      maxAttendees: 100,
      isPast: false,
      clubLogo: '🤖',
      tags: ['AI', 'Machine Learning', 'Symposium']
    },
    {
      id: 5,
      title: 'Photography Exhibition: Campus Life',
      club: 'Photography Club',
      category: 'Arts',
      description: 'View stunning photographs capturing the essence of campus life, taken by student photographers.',
      date: '2024-01-12',
      time: '9:00 AM - 5:00 PM',
      venue: 'Art Gallery, Humanities Building',
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=200&fit=crop',
      attendees: 34,
      maxAttendees: 50,
      isPast: true,
      clubLogo: '📸',
      tags: ['Exhibition', 'Photography', 'Art']
    },
    {
      id: 6,
      title: 'Startup Pitch Competition',
      club: 'Entrepreneurship Club',
      category: 'Business',
      description: 'Watch students pitch their innovative startup ideas to a panel of investors and entrepreneurs.',
      date: '2024-01-22',
      time: '1:00 PM - 5:00 PM',
      venue: 'Business School Auditorium',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
      attendees: 67,
      maxAttendees: 80,
      isPast: false,
      clubLogo: '💼',
      tags: ['Startup', 'Pitch', 'Competition']
    }
  ];

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Arts', label: 'Arts & Culture' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Business', label: 'Business' },
    { value: 'Social', label: 'Social Service' },
    { value: 'Science', label: 'Science' }
  ];

  // Filter events based on search, type, and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.club.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = eventType === 'all' || 
                       (eventType === 'upcoming' && !event.isPast) ||
                       (eventType === 'past' && event.isPast);
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleRSVP = (eventId) => {
    setRsvpStatus(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
    // In real app, make API call here
    console.log(`RSVP toggled for event ${eventId}`);
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
              <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
              <p className="mt-2 text-gray-600">
                Discover and RSVP to exciting events happening around campus
              </p>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by title, description, or club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              {/* Event Type Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEventType('upcoming')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    eventType === 'upcoming'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setEventType('past')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    eventType === 'past'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Past Events
                </button>
                <button
                  onClick={() => setEventType('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    eventType === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
              </div>

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
            Showing <span className="font-semibold">{filteredEvents.length}</span> {eventType} events
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRSVP={handleRSVP}
                isRSVPed={rsvpStatus[event.id]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-4">
              {eventType === 'upcoming' 
                ? "There are no upcoming events matching your criteria."
                : "No past events match your search criteria."
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setEventType('upcoming');
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

// Event Card Component
const EventCard = ({ event, onRSVP, isRSVPed }) => {
  const attendancePercentage = (event.attendees / event.maxAttendees) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden">
      {/* Event Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {event.isPast && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
              Past Event
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition duration-200">
            <Bookmark className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition duration-200">
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
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
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
            {event.category}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
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
        </div>

        {/* Attendance */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Attendance</span>
            <span>{event.attendees}/{event.maxAttendees}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${attendancePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!event.isPast ? (
            <>
              <button 
                onClick={() => onRSVP(event.id)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                  isRSVPed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isRSVPed ? 'RSVP Confirmed' : 'RSVP Now'}
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <Eye className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition duration-200 flex items-center justify-center">
              <Eye className="h-4 w-4 mr-2" />
              View Details
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

export default EventsPage;