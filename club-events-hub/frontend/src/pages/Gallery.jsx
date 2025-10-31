import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Image as ImageIcon,
  Video,
  Upload,
  Plus,
  Download,
  Share2,
  Heart,
  MapPin,
  Calendar,
  Users,
  X,
  ChevronDown,
  Play
} from 'lucide-react';

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [mediaType, setMediaType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Sample data
  const clubs = [
    { id: 'all', name: 'All Clubs' },
    { id: 'coding', name: 'Coding Club', logo: '💻' },
    { id: 'drama', name: 'Drama Club', logo: '🎭' },
    { id: 'sports', name: 'Sports Club', logo: '⚽' },
    { id: 'music', name: 'Music Club', logo: '🎵' },
    { id: 'photography', name: 'Photography Club', logo: '📸' }
  ];

  const events = [
    { id: 'all', name: 'All Events' },
    { id: 'cultural-fest', name: 'Cultural Fest 2024', club: 'drama' },
    { id: 'react-workshop', name: 'React Workshop', club: 'coding' },
    { id: 'basketball-tournament', name: 'Basketball Tournament', club: 'sports' },
    { id: 'music-concert', name: 'Classical Music Night', club: 'music' },
    { id: 'photo-exhibition', name: 'Campus Life Exhibition', club: 'photography' }
  ];

  // Sample media items
  const mediaItems = [
    {
      id: 1,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=150&fit=crop',
      title: 'Cultural Fest Performance',
      description: 'Amazing dance performance at the main stage',
      club: 'drama',
      event: 'cultural-fest',
      uploadDate: '2024-01-20',
      likes: 45,
      uploader: 'John Doe',
      tags: ['dance', 'performance', 'cultural']
    },
    {
      id: 2,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=150&fit=crop',
      title: 'React Workshop Session',
      description: 'Students learning React fundamentals',
      club: 'coding',
      event: 'react-workshop',
      uploadDate: '2024-01-15',
      likes: 32,
      uploader: 'Sarah Wilson',
      tags: ['workshop', 'coding', 'react']
    },
    {
      id: 3,
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-partying-happily-4640-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=200&h=150&fit=crop',
      title: 'Basketball Finals',
      description: 'Thrilling final moments of the tournament',
      club: 'sports',
      event: 'basketball-tournament',
      uploadDate: '2024-01-25',
      likes: 78,
      uploader: 'Mike Johnson',
      tags: ['sports', 'basketball', 'tournament']
    },
    {
      id: 4,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=150&fit=crop',
      title: 'Music Concert',
      description: 'Student band performing classical pieces',
      club: 'music',
      event: 'music-concert',
      uploadDate: '2024-01-14',
      likes: 56,
      uploader: 'Emma Davis',
      tags: ['music', 'concert', 'performance']
    },
    {
      id: 5,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=200&h=150&fit=crop',
      title: 'Photography Exhibition',
      description: 'Best photos from campus life competition',
      club: 'photography',
      event: 'photo-exhibition',
      uploadDate: '2024-01-12',
      likes: 89,
      uploader: 'Alex Chen',
      tags: ['photography', 'exhibition', 'campus']
    },
    {
      id: 6,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=150&fit=crop',
      title: 'Environmental Drive',
      description: 'Students participating in cleanup activity',
      club: 'sports',
      event: 'basketball-tournament',
      uploadDate: '2024-01-28',
      likes: 34,
      uploader: 'Lisa Park',
      tags: ['environment', 'cleanup', 'volunteer']
    }
  ];

  // Filter media items
  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesClub = selectedClub === 'all' || item.club === selectedClub;
    const matchesEvent = selectedEvent === 'all' || item.event === selectedEvent;
    const matchesType = mediaType === 'all' || item.type === mediaType;
    
    return matchesSearch && matchesClub && matchesEvent && matchesType;
  });

  // Cloudinary upload function (simulated)
  const handleUpload = async (files) => {
    setUploading(true);
    
    // Simulate Cloudinary upload
    try {
      // In real implementation, you would:
      // 1. Get upload preset from Cloudinary
      // 2. Upload each file to Cloudinary
      // 3. Get back URLs and store in database
      
      console.log('Uploading files to Cloudinary:', files);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Files uploaded successfully!');
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = (mediaId) => {
    // In real app, update like count in database
    console.log('Liked media:', mediaId);
  };

  const handleDownload = (mediaUrl, mediaTitle) => {
    // Create temporary link for download
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = mediaTitle;
    link.click();
  };

  const getClubInfo = (clubId) => {
    return clubs.find(club => club.id === clubId);
  };

  const getEventInfo = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Gallery</h1>
              <p className="mt-2 text-gray-600">
                Relive the memories from campus events and activities
              </p>
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Media
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
                placeholder="Search photos and videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              {/* Club Filter */}
              <div className="relative">
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Event Filter */}
              <div className="relative">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {events
                    .filter(event => selectedClub === 'all' || event.club === selectedClub || event.id === 'all')
                    .map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Media Type Filter */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setMediaType('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                    mediaType === 'all'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMediaType('image')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                    mediaType === 'image'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Photos
                </button>
                <button
                  onClick={() => setMediaType('video')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                    mediaType === 'video'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Videos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredMedia.length}</span> media items
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Media Grid */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map(media => (
              <MediaCard 
                key={media.id} 
                media={media} 
                onSelect={setSelectedMedia}
                onLike={handleLike}
                onDownload={handleDownload}
                getClubInfo={getClubInfo}
                getEventInfo={getEventInfo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters to find more media.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClub('all');
                setSelectedEvent('all');
                setMediaType('all');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <MediaModal 
          media={selectedMedia} 
          onClose={() => setSelectedMedia(null)}
          onLike={handleLike}
          onDownload={handleDownload}
          getClubInfo={getClubInfo}
          getEventInfo={getEventInfo}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          uploading={uploading}
          clubs={clubs.filter(c => c.id !== 'all')}
          events={events.filter(e => e.id !== 'all')}
        />
      )}
    </div>
  );
};

// Media Card Component
const MediaCard = ({ media, onSelect, onLike, onDownload, getClubInfo, getEventInfo }) => {
  const clubInfo = getClubInfo(media.club);
  const eventInfo = getEventInfo(media.event);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden group cursor-pointer">
      {/* Media Thumbnail */}
      <div 
        className="relative h-48 bg-gray-200 overflow-hidden"
        onClick={() => onSelect(media)}
      >
        {media.type === 'image' ? (
          <img
            src={media.thumbnail}
            alt={media.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={media.thumbnail}
              alt={media.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
        )}
        
        {/* Media Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs rounded-full ${
            media.type === 'image' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {media.type === 'image' ? 'PHOTO' : 'VIDEO'}
          </span>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onLike(media.id);
              }}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition duration-200"
            >
              <Heart className="h-5 w-5 text-gray-700" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDownload(media.url, media.title);
              }}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition duration-200"
            >
              <Download className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{clubInfo?.logo}</span>
            <span className="text-sm text-gray-600">{clubInfo?.name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Heart className="h-4 w-4 mr-1" />
            {media.likes}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {media.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {media.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{eventInfo?.name}</span>
          <span>{new Date(media.uploadDate).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {media.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              #{tag}
            </span>
          ))}
          {media.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{media.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Media Modal Component
const MediaModal = ({ media, onClose, onLike, onDownload, getClubInfo, getEventInfo }) => {
  const clubInfo = getClubInfo(media.club);
  const eventInfo = getEventInfo(media.event);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Media Display */}
          <div className="flex-1 bg-black flex items-center justify-center min-h-[400px]">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={media.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="max-w-full max-h-[70vh]"
              />
            )}
          </div>

          {/* Media Info Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Media Details</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold text-gray-900 text-lg mb-1">
                  {media.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {media.description}
                </p>
              </div>

              {/* Club & Event */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{clubInfo?.logo}</span>
                  <div>
                    <p className="font-medium text-gray-900">{clubInfo?.name}</p>
                    <p className="text-sm text-gray-600">{eventInfo?.name}</p>
                  </div>
                </div>
              </div>

              {/* Upload Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Uploaded by:</span>
                  <span className="font-medium">{media.uploader}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(media.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Likes:</span>
                  <span className="font-medium">{media.likes}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Tags</h5>
                <div className="flex flex-wrap gap-1">
                  {media.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              <button 
                onClick={() => onLike(media.id)}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <Heart className="h-4 w-4 mr-2" />
                Like ({media.likes})
              </button>
              <button 
                onClick={() => onDownload(media.url, media.title)}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload Modal Component
const UploadModal = ({ onClose, onUpload, uploading, clubs, events }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadData, setUploadData] = useState({
    club: '',
    event: '',
    title: '',
    description: '',
    tags: ''
  });

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload.');
      return;
    }
    onUpload(selectedFiles);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Upload Media</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, GIF, MP4 up to 10MB each
                </p>
              </label>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-900">Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600 truncate flex-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Club Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club
            </label>
            <select
              required
              value={uploadData.club}
              onChange={(e) => setUploadData(prev => ({ ...prev, club: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select a club</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event
            </label>
            <select
              required
              value={uploadData.event}
              onChange={(e) => setUploadData(prev => ({ ...prev, event: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select an event</option>
              {events.filter(event => event.club === uploadData.club).map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={uploadData.title}
              onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter a title for your media"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={uploadData.description}
              onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe your media"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={uploadData.tags}
              onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., workshop, coding, react"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={uploading || selectedFiles.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;