import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Users, 
  Calendar, 
  Heart, 
  Image as ImageIcon,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Search
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in (you can replace this with your auth logic)
  const isLoggedIn = true; // Change this based on your authentication state
  const user = {
    name: 'John Doe',
    email: 'john.doe@student.edu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Clubs', href: '/clubs', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Volunteer', href: '/volunteer', icon: Heart },
    { name: 'Gallery', href: '/gallery', icon: ImageIcon },
  ];

  const authNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Login', href: '/login', icon: null },
    { name: 'Sign Up', href: '/signup', icon: null },
  ];

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/');
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ClubHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                    isActiveRoute(item.href)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>

            {isLoggedIn ? (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition duration-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isLoggedIn && (
              <>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Bell className="h-5 w-5" />
                </button>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                    isActiveRoute(item.href)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Mobile Auth Links */}
            {!isLoggedIn && (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile User Links */}
            {isLoggedIn && (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
                >
                  <User className="h-5 w-5" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;