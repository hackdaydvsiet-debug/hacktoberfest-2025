import React from 'react';
import { Calendar, Users, Star, ArrowRight, Club, Camera, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Sample data for demonstration
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Workshop: React Fundamentals",
      date: "2024-01-15",
      time: "3:00 PM",
      venue: "CS Department Lab",
      club: "Coding Club"
    },
    {
      id: 2,
      title: "Cultural Fest 2024",
      date: "2024-01-20",
      time: "10:00 AM",
      venue: "Main Auditorium",
      club: "Cultural Club"
    }
  ];

  const featuredClubs = [
    {
      id: 1,
      name: "Coding Club",
      category: "Technology",
      members: 150,
      description: "Learn, code, and build amazing projects together"
    },
    {
      id: 2,
      name: "Drama Club",
      category: "Arts",
      members: 80,
      description: "Express yourself through theater and performance"
    },
    {
      id: 3,
      name: "Sports Club",
      category: "Sports",
      members: 200,
      description: "Stay active and compete in various sports"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      {/* <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Club className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ClubHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                Login
              </Link>
              <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect. Collaborate. <span className="text-indigo-600">Celebrate.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join your campus community, discover amazing events, and create unforgettable memories with fellow students.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/clubs" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center justify-center">
              <Users className="mr-2 h-5 w-5" />
              Join a Club
            </Link>
            <Link to="/create-club" className="bg-white text-indigo-600 border border-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition duration-200 flex items-center justify-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Create Club
            </Link>
            <Link to="/events" className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 flex items-center justify-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Events
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">Active Clubs</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Calendar className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">100+</div>
              <div className="text-gray-600">Events Monthly</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Star className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">2K+</div>
              <div className="text-gray-600">Students Connected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <button className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition duration-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <Calendar className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                </div>
                <p className="text-gray-600 mb-2">{event.club}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>📅 {event.date}</p>
                  <p>⏰ {event.time}</p>
                  <p>📍 {event.venue}</p>
                </div>
                <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
                  RSVP Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Clubs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover clubs that match your interests and connect with like-minded students
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredClubs.map((club) => (
              <div key={club.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{club.name}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                    {club.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{club.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{club.members} members</span>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                    Join Club <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Camera className="h-12 w-12 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already building their campus community through clubs and events.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
              Create Your Account
            </Link>
            <Link to="/clubs" className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200">
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Club className="h-6 w-6 text-indigo-400" />
                <span className="ml-2 text-lg font-bold">ClubHub</span>
              </div>
              <p className="text-gray-400">
                Connecting students through clubs and events.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Browse Clubs</a></li>
                <li><a href="#" className="hover:text-white">Events Calendar</a></li>
                <li><a href="#" className="hover:text-white">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ClubHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;