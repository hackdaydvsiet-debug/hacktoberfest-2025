import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Plus,
  X,
  ChevronDown,
  Eye,
  Link
} from 'lucide-react';

const ClubsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('members');

  // Sample clubs data
  const clubs = [
    {
      id: 1,
      name: 'Coding Club',
      category: 'Technology',
      description: 'Learn, code, and build amazing projects together. Weekly workshops and hackathons.',
      members: 150,
      upcomingEvents: 3,
      logo: '💻',
      isJoined: false,
      department: 'Computer Science',
      tags: ['Programming', 'Web Development', 'AI/ML'],
      established: '2020'
    },
    {
      id: 2,
      name: 'Drama Club',
      category: 'Arts',
      description: 'Express yourself through theater and performance. Annual cultural fest participation.',
      members: 80,
      upcomingEvents: 2,
      logo: '🎭',
      isJoined: true,
      department: 'Humanities',
      tags: ['Acting', 'Theater', 'Cultural'],
      established: '2018'
    },
    {
      id: 3,
      name: 'Sports Club',
      category: 'Sports',
      description: 'Stay active and compete in various sports. Regular tournaments and fitness sessions.',
      members: 200,
      upcomingEvents: 4,
      logo: '⚽',
      isJoined: false,
      department: 'Physical Education',
      tags: ['Football', 'Basketball', 'Fitness'],
      established: '2019'
    },
    {
      id: 4,
      name: 'Music Club',
      category: 'Arts',
      description: 'For music enthusiasts. Jam sessions, concerts, and music theory workshops.',
      members: 120,
      upcomingEvents: 2,
      logo: '🎵',
      isJoined: false,
      department: 'Humanities',
      tags: ['Singing', 'Instruments', 'Concerts'],
      established: '2021'
    },
    {
      id: 5,
      name: 'Robotics Club',
      category: 'Technology',
      description: 'Build robots and participate in national competitions. Hands-on workshops.',
      members: 90,
      upcomingEvents: 1,
      logo: '🤖',
      isJoined: true,
      department: 'Electronics',
      tags: ['Robotics', 'IoT', 'Competitions'],
      established: '2022'
    },
    {
      id: 6,
      name: 'Photography Club',
      category: 'Arts',
      description: 'Capture moments and learn photography techniques. Photo walks and exhibitions.',
      members: 75,
      upcomingEvents: 1,
      logo: '📸',
      isJoined: false,
      department: 'Visual Arts',
      tags: ['Photography', 'Editing', 'Exhibitions'],
      established: '2020'
    }
  ];

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Arts', label: 'Arts & Culture' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Science', label: 'Science' },
    { value: 'Social', label: 'Social Service' },
    { value: 'Business', label: 'Business' }
  ];

  // Departments for filtering
  const departments = [
    'All Departments',
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Humanities',
    'Physical Education',
    'Visual Arts'
  ];

  // Sort options
  const sortOptions = [
    { value: 'members', label: 'Most Members' },
    { value: 'events', label: 'Most Events' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'newest', label: 'Newest First' }
  ];

  // Filter and sort clubs
  const filteredClubs = clubs
    .filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          club.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'members':
          return b.members - a.members;
        case 'events':
          return b.upcomingEvents - a.upcomingEvents;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.established) - new Date(a.established);
        default:
          return 0;
      }
    });

  const handleJoinClub = (clubId) => {
    // In a real app, this would make an API call
    console.log(`Joining club ${clubId}`);
    alert('Join request sent!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Clubs</h1>
              <p className="mt-2 text-gray-600">
                Discover and join clubs that match your interests
              </p>
            </div>
            <Link to="/create-club" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Create Club
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clubs by name, description, or interests..."
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

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters (Desktop) */}
          <div className="hidden lg:block mt-4">
            <div className="flex flex-wrap gap-2">
              {departments.map(dept => (
                <button
                  key={dept}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 text-sm"
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
              <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredClubs.length}</span> clubs
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Clubs Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <ClubCard 
                key={club.id} 
                club={club} 
                onJoin={handleJoinClub}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters to find more clubs.
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

// Club Card Component
const ClubCard = ({ club, onJoin }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden">
      {/* Club Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{club.logo}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
              <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full mt-1">
                {club.category}
              </span>
            </div>
          </div>
          {club.isJoined && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Joined
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">{club.description}</p>
      </div>

      {/* Club Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Users className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">{club.members}</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
          <div>
            <Calendar className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">{club.upcomingEvents}</div>
            <div className="text-xs text-gray-500">Events</div>
          </div>
          <div>
            <Star className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-gray-900">{club.established}</div>
            <div className="text-xs text-gray-500">Est.</div>
          </div>
        </div>
      </div>

      {/* Club Details */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            Department: {club.department}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {club.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {club.isJoined ? (
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200 flex items-center justify-center">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </button>
          ) : (
            <>
              <button 
                onClick={() => onJoin(club.id)}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
              >
                Join Club
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <Eye className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;