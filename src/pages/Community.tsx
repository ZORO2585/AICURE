import React, { useState } from 'react';
import { MessageSquare, Users, ThumbsUp, Clock, Search, Plus, Star, MapPin } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const discussions = [
    {
      id: 1,
      title: 'Effective organic pest control methods for tomatoes',
      author: 'John Smith',
      expertise: 'Organic Farming Expert',
      location: 'California, USA',
      replies: 15,
      likes: 23,
      timeAgo: '2 hours ago',
      category: 'Pest Control',
      content: 'I\'ve been experimenting with companion planting and beneficial insects for pest control in my tomato fields. Here are some methods that have worked well for me...'
    },
    {
      id: 2,
      title: 'Dairy cattle mastitis prevention strategies',
      author: 'Dr. Sarah Johnson',
      expertise: 'Veterinarian',
      location: 'Wisconsin, USA',
      replies: 8,
      likes: 18,
      timeAgo: '5 hours ago',
      category: 'Livestock Health',
      content: 'Mastitis remains one of the most costly diseases in dairy farming. Here are evidence-based prevention strategies that can significantly reduce incidence rates...'
    },
    {
      id: 3,
      title: 'Soil health improvement techniques that actually work',
      author: 'Maria Garcia',
      expertise: 'Soil Scientist',
      location: 'Texas, USA',
      replies: 22,
      likes: 35,
      timeAgo: '1 day ago',
      category: 'Soil Management',
      content: 'After 10 years of soil research, I want to share practical techniques that have shown consistent results in improving soil health across different crop systems...'
    }
  ];

  const experts = [
    {
      id: 1,
      name: 'Dr. Michael Chen',
      title: 'Plant Pathologist',
      specialty: 'Crop Diseases',
      rating: 4.9,
      reviews: 127,
      location: 'UC Davis, California',
      available: true,
      bio: 'Specializing in fungal diseases of field crops with 15+ years experience'
    },
    {
      id: 2,
      name: 'Dr. Emily Rodriguez',
      title: 'Veterinarian',
      specialty: 'Livestock Health',
      rating: 4.8,
      reviews: 89,
      location: 'Cornell University, NY',
      available: false,
      bio: 'Expert in large animal medicine and dairy herd health management'
    },
    {
      id: 3,
      name: 'James Wilson',
      title: 'Agricultural Engineer',
      specialty: 'Precision Farming',
      rating: 4.7,
      reviews: 156,
      location: 'Iowa State University',
      available: true,
      bio: 'Focuses on IoT applications in agriculture and sustainable farming practices'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Farmer Community</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with fellow farmers, share experiences, and get expert advice from agricultural professionals worldwide.
        </p>
      </div>

      {/* Search and New Post */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions, topics, or experts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <button className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          New Discussion
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'discussions', name: 'Discussions', icon: MessageSquare },
            { id: 'experts', name: 'Expert Network', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'discussions' && (
        <div className="space-y-6">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {discussion.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {discussion.category}
                      </span>
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{discussion.timeAgo}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                      {discussion.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{discussion.author}</span>
                        <span className="text-sm text-gray-600 ml-1">• {discussion.expertise}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {discussion.location}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {discussion.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{discussion.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>{discussion.replies} replies</span>
                        </button>
                      </div>
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'experts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {experts.map((expert) => (
            <div key={expert.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${expert.available ? 'bg-green-400' : 'bg-gray-400'}`} />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{expert.title}</p>
                    <p className="text-sm font-medium text-blue-600 mb-2">{expert.specialty}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(expert.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {expert.rating} ({expert.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {expert.location}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{expert.bio}</p>
                    
                    <div className="flex space-x-3">
                      <button className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        expert.available
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      }`}>
                        {expert.available ? 'Contact Expert' : 'Currently Unavailable'}
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community Stats */}
      <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Community Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">12,450</div>
            <div className="text-green-100">Active Farmers</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">1,287</div>
            <div className="text-green-100">Expert Consultations</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">5,634</div>
            <div className="text-green-100">Problems Solved</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">89%</div>
            <div className="text-green-100">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;