import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Camera, TrendingUp, AlertTriangle, Users, Calendar, Wifi, WifiOff } from 'lucide-react';

const Dashboard = () => {
  const { diseases, isOnline } = useApp();
  
  const recentDiseases = diseases.slice(0, 3);
  const highSeverityCount = diseases.filter(d => d.severity === 'high').length;
  const cropDiseases = diseases.filter(d => d.type === 'crop').length;
  const livestockDiseases = diseases.filter(d => d.type === 'livestock').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              AI-Powered Agricultural Health
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Detect diseases instantly. Protect your crops and livestock with cutting-edge AI technology.
            </p>
            <Link
              to="/detection"
              className="inline-flex items-center px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Start Detection
            </Link>
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {isOnline ? 'Online Mode' : 'Offline Mode'}
                </span>
              </div>
              {highSeverityCount > 0 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {highSeverityCount} High Severity Alert{highSeverityCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Detections</p>
                <p className="text-3xl font-bold text-gray-900">{diseases.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crop Diseases</p>
                <p className="text-3xl font-bold text-gray-900">{cropDiseases}</p>
              </div>
              <div className="text-2xl">🌱</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Livestock Issues</p>
                <p className="text-3xl font-bold text-gray-900">{livestockDiseases}</p>
              </div>
              <div className="text-2xl">🐄</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Severity</p>
                <p className="text-3xl font-bold text-gray-900">{highSeverityCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/detection"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border hover:border-green-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Disease Detection</h3>
                <p className="text-gray-600 text-sm">Upload or capture images for instant AI analysis</p>
              </div>
            </div>
          </Link>

          <Link
            to="/community"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border hover:border-blue-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Farmer Community</h3>
                <p className="text-gray-600 text-sm">Connect with experts and fellow farmers</p>
              </div>
            </div>
          </Link>

          <Link
            to="/calendar"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 border hover:border-purple-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Crop Calendar</h3>
                <p className="text-gray-600 text-sm">Schedule reminders and track activities</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Detections */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Detections</h2>
          {recentDiseases.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No recent detections. Start by uploading an image!</p>
          ) : (
            <div className="space-y-4">
              {recentDiseases.map((disease) => (
                <div key={disease.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <img
                    src={disease.image}
                    alt={disease.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{disease.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        disease.severity === 'high' ? 'bg-red-100 text-red-800' :
                        disease.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {disease.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{disease.description}</p>
                    <p className="text-xs text-gray-500">
                      {disease.confidence}% confidence • {disease.location} • {disease.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;