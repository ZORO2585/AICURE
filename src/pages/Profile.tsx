import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, MapPin, Phone, Mail, Settings, Globe, Shield, Bell } from 'lucide-react';

const Profile = () => {
  const { language, setLanguage, isOnline, setIsOnline } = useApp();
  const [notifications, setNotifications] = useState({
    diseases: true,
    weather: true,
    reminders: true,
    community: false
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'pt', name: 'Português' }
  ];

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">JS</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">John Smith</h2>
            <p className="text-gray-600 text-sm mb-4">Organic Farmer</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>California, USA</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>john.smith@email.com</span>
              </div>
            </div>

            <button className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </button>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Detections Made</span>
                <span className="font-semibold text-green-600">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Crops Monitored</span>
                <span className="font-semibold text-blue-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Community Posts</span>
                <span className="font-semibold text-purple-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Days Active</span>
                <span className="font-semibold text-orange-600">156</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Language & Region</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option>Pacific Standard Time (PST)</option>
                  <option>Mountain Standard Time (MST)</option>
                  <option>Central Standard Time (CST)</option>
                  <option>Eastern Standard Time (EST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries({
                diseases: 'Disease Detection Alerts',
                weather: 'Weather Warnings',
                reminders: 'Calendar Reminders',
                community: 'Community Updates'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-gray-700">{label}</span>
                  <button
                    onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[key as keyof typeof notifications] ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* App Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">App Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="text-gray-700 font-medium">Offline Mode</span>
                  <p className="text-sm text-gray-500">Use cached data when internet is unavailable</p>
                </div>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    !isOnline ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      !isOnline ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="text-gray-700 font-medium">Auto-sync Images</span>
                  <p className="text-sm text-gray-500">Automatically backup detection images</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <span className="text-gray-700 font-medium">High Accuracy Mode</span>
                  <p className="text-sm text-gray-500">Use advanced AI models for better results</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Change Password</div>
                <div className="text-sm text-gray-500">Update your account password</div>
              </button>
              
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Data Export</div>
                <div className="text-sm text-gray-500">Download your data and detection history</div>
              </button>
              
              <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Privacy Settings</div>
                <div className="text-sm text-gray-500">Control what data is shared and stored</div>
              </button>
              
              <button className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                <div className="font-medium">Delete Account</div>
                <div className="text-sm text-red-500">Permanently remove your account and data</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;