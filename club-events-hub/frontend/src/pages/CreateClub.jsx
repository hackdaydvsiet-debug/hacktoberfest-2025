import React, { useState } from 'react';
import { 
  ArrowLeft,
  Upload,
  Users,
  Calendar,
  MapPin,
  Globe,
  BookOpen,
  Tag,
  X,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateClubPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    category: '',
    description: '',
    mission: '',
    
    // Contact Information
    email: '',
    phone: '',
    website: '',
    meetingSchedule: '',
    meetingLocation: '',
    
    // Social Media
    socialMedia: {
      instagram: '',
      linkedin: '',
      twitter: '',
      facebook: ''
    },
    
    // Club Details
    tags: [],
    membershipFee: '',
    maxMembers: '',
    requirements: '',
    
    // Leadership
    leadershipTeam: [
      { role: 'President', name: '', email: '' },
      { role: 'Vice President', name: '', email: '' }
    ],
    
    // Files
    logo: null,
    banner: null
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newLeader, setNewLeader] = useState({ role: '', name: '', email: '' });

  // Categories
  const categories = [
    'Technology',
    'Arts & Culture',
    'Sports & Fitness',
    'Science & Research',
    'Business & Entrepreneurship',
    'Social Service',
    'Media & Publications',
    'Cultural',
    'Academic',
    'Hobbies & Special Interests'
  ];

  // Role options for leadership team
  const roleOptions = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Event Coordinator',
    'Technical Lead',
    'Marketing Head',
    'Social Media Manager',
    'Faculty Advisor'
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Club name and description' },
    { number: 2, title: 'Details', description: 'Meeting info and requirements' },
    { number: 3, title: 'Leadership', description: 'Team members and contacts' },
    { number: 4, title: 'Review', description: 'Finalize and submit' }
  ];

  const handleInputChange = (section, field, value) => {
    if (section === 'socialMedia') {
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleLeaderChange = (index, field, value) => {
    const updatedLeaders = [...formData.leadershipTeam];
    updatedLeaders[index] = {
      ...updatedLeaders[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      leadershipTeam: updatedLeaders
    }));
  };

  const addLeader = () => {
    if (newLeader.role && newLeader.name && newLeader.email) {
      setFormData(prev => ({
        ...prev,
        leadershipTeam: [...prev.leadershipTeam, newLeader]
      }));
      setNewLeader({ role: '', name: '', email: '' });
    }
  };

  const removeLeader = (index) => {
    setFormData(prev => ({
      ...prev,
      leadershipTeam: prev.leadershipTeam.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Club name is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.mission.trim()) newErrors.mission = 'Mission statement is required';
    }

    if (step === 2) {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.meetingSchedule.trim()) newErrors.meetingSchedule = 'Meeting schedule is required';
      if (!formData.meetingLocation.trim()) newErrors.meetingLocation = 'Meeting location is required';
    }

    if (step === 3) {
      formData.leadershipTeam.forEach((leader, index) => {
        if (!leader.name.trim()) newErrors[`leader_name_${index}`] = 'Name is required';
        if (!leader.email.trim()) newErrors[`leader_email_${index}`] = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(leader.email)) newErrors[`leader_email_${index}`] = 'Email is invalid';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(4)) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Club created:', formData);
        alert('Club created successfully!');
        navigate('/clubs');
      } catch (error) {
        console.error('Error creating club:', error);
        alert('Failed to create club. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} errors={errors} onChange={handleInputChange} categories={categories} />;
      case 2:
        return <DetailsStep formData={formData} errors={errors} onChange={handleInputChange} />;
      case 3:
        return <LeadershipStep 
          formData={formData} 
          errors={errors} 
          onLeaderChange={handleLeaderChange}
          onAddLeader={addLeader}
          onRemoveLeader={removeLeader}
          newLeader={newLeader}
          setNewLeader={setNewLeader}
          roleOptions={roleOptions}
          onTagChange={setNewTag}
          newTag={newTag}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Club</h1>
            <p className="mt-2 text-gray-600">
              Start a new student club and build your community
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-indigo-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 mx-4 ${
                    currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Club...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Club
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Step 1: Basic Information
const BasicInfoStep = ({ formData, errors, onChange, categories }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
      
      {/* Club Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Club Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('', 'name', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter club name"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => onChange('', 'category', e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.category ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('', 'description', e.target.value)}
          rows="4"
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Describe what your club is about, its activities, and goals..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Mission Statement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mission Statement *
        </label>
        <textarea
          value={formData.mission}
          onChange={(e) => onChange('', 'mission', e.target.value)}
          rows="3"
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.mission ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="What is the core purpose and vision of your club?"
        />
        {errors.mission && <p className="mt-1 text-sm text-red-600">{errors.mission}</p>}
      </div>
    </div>
  );
};

// Step 2: Details
const DetailsStep = ({ formData, errors, onChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Club Details</h2>
      
      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange('', 'email', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="club@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('', 'phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => onChange('', 'website', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="https://yourclub.com"
        />
      </div>

      {/* Meeting Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Schedule *
          </label>
          <input
            type="text"
            value={formData.meetingSchedule}
            onChange={(e) => onChange('', 'meetingSchedule', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.meetingSchedule ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Every Wednesday, 3:00 PM"
          />
          {errors.meetingSchedule && <p className="mt-1 text-sm text-red-600">{errors.meetingSchedule}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meeting Location *
          </label>
          <input
            type="text"
            value={formData.meetingLocation}
            onChange={(e) => onChange('', 'meetingLocation', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.meetingLocation ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., CS Department Lab, Room 301"
          />
          {errors.meetingLocation && <p className="mt-1 text-sm text-red-600">{errors.meetingLocation}</p>}
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Membership Fee
          </label>
          <input
            type="text"
            value={formData.membershipFee}
            onChange={(e) => onChange('', 'membershipFee', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., $10 per semester"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Members
          </label>
          <input
            type="number"
            value={formData.maxMembers}
            onChange={(e) => onChange('', 'maxMembers', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Leave empty for unlimited"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Membership Requirements
        </label>
        <textarea
          value={formData.requirements}
          onChange={(e) => onChange('', 'requirements', e.target.value)}
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Any prerequisites or requirements to join the club..."
        />
      </div>
    </div>
  );
};

// Step 3: Leadership & Tags
const LeadershipStep = ({ 
  formData, 
  errors, 
  onLeaderChange, 
  onAddLeader, 
  onRemoveLeader, 
  newLeader, 
  setNewLeader,
  roleOptions,
  newTag,
  onTagChange,
  onAddTag,
  onRemoveTag
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Leadership Team</h2>

      {/* Existing Leadership Team */}
      {formData.leadershipTeam.map((leader, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">{leader.role}</h3>
            {index >= 2 && (
              <button
                type="button"
                onClick={() => onRemoveLeader(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name *</label>
              <input
                type="text"
                value={leader.name}
                onChange={(e) => onLeaderChange(index, 'name', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors[`leader_name_${index}`] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Full name"
              />
              {errors[`leader_name_${index}`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`leader_name_${index}`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email *</label>
              <input
                type="email"
                value={leader.email}
                onChange={(e) => onLeaderChange(index, 'email', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors[`leader_email_${index}`] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="email@example.com"
              />
              {errors[`leader_email_${index}`] && (
                <p className="mt-1 text-sm text-red-600">{errors[`leader_email_${index}`]}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add New Leader */}
      <div className="border border-gray-200 rounded-lg p-4 border-dashed">
        <h3 className="font-medium text-gray-900 mb-4">Add Leadership Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              value={newLeader.role}
              onChange={(e) => setNewLeader(prev => ({ ...prev, role: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select role</option>
              {roleOptions.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={newLeader.name}
              onChange={(e) => setNewLeader(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={newLeader.email}
              onChange={(e) => setNewLeader(prev => ({ ...prev, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onAddLeader}
          disabled={!newLeader.role || !newLeader.name || !newLeader.email}
          className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Leader
        </button>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Club Tags</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-2 hover:text-indigo-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => onTagChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Add a tag (e.g., programming, web-dev, AI)"
          />
          <button
            type="button"
            onClick={onAddTag}
            disabled={!newTag}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 4: Review
const ReviewStep = ({ formData }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review Your Club</h2>
      
      {/* Basic Information Review */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Club Name</p>
            <p className="font-medium">{formData.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium">{formData.category}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Description</p>
            <p className="font-medium">{formData.description}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600">Mission</p>
            <p className="font-medium">{formData.mission}</p>
          </div>
        </div>
      </div>

      {/* Contact Information Review */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{formData.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Website</p>
            <p className="font-medium">{formData.website || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Meeting Schedule</p>
            <p className="font-medium">{formData.meetingSchedule}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Meeting Location</p>
            <p className="font-medium">{formData.meetingLocation}</p>
          </div>
        </div>
      </div>

      {/* Leadership Team Review */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Leadership Team</h3>
        <div className="space-y-3">
          {formData.leadershipTeam.map((leader, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{leader.role}</p>
                <p className="text-sm text-gray-600">{leader.name} • {leader.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Review */}
      {formData.tags.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Club Tags</h3>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateClubPage;