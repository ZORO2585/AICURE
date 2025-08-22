import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const activities = [
    {
      id: 1,
      title: 'Apply Fertilizer - Field A',
      date: '2024-01-15',
      time: '08:00',
      type: 'fertilization',
      status: 'pending',
      crop: 'Corn',
      location: 'Field A-North',
      notes: 'Use nitrogen-rich fertilizer, 50kg per hectare'
    },
    {
      id: 2,
      title: 'Vaccination Schedule - Cattle',
      date: '2024-01-16',
      time: '14:00',
      type: 'healthcare',
      status: 'completed',
      crop: 'Livestock',
      location: 'Barn B',
      notes: 'FMD vaccination for 25 cattle'
    },
    {
      id: 3,
      title: 'Pest Inspection - Tomatoes',
      date: '2024-01-17',
      time: '10:00',
      type: 'inspection',
      status: 'upcoming',
      crop: 'Tomatoes',
      location: 'Greenhouse C',
      notes: 'Check for aphids and whiteflies'
    },
    {
      id: 4,
      title: 'Irrigation System Check',
      date: '2024-01-18',
      time: '06:00',
      type: 'maintenance',
      status: 'pending',
      crop: 'All Fields',
      location: 'Main Irrigation Hub',
      notes: 'Weekly maintenance and pressure check'
    }
  ];

  const cropStages = [
    { crop: 'Corn', stage: 'Vegetative Growth', daysLeft: 45, nextActivity: 'Fertilization' },
    { crop: 'Tomatoes', stage: 'Flowering', daysLeft: 30, nextActivity: 'Pest Control' },
    { crop: 'Wheat', stage: 'Grain Filling', daysLeft: 20, nextActivity: 'Harvest Prep' },
    { crop: 'Soybeans', stage: 'Pod Development', daysLeft: 60, nextActivity: 'Irrigation' }
  ];

  const upcomingReminders = [
    { id: 1, title: 'Soil pH Testing Due', time: '2 days', priority: 'high' },
    { id: 2, title: 'Cattle Deworming Schedule', time: '5 days', priority: 'medium' },
    { id: 3, title: 'Equipment Maintenance', time: '1 week', priority: 'low' },
    { id: 4, title: 'Market Price Review', time: '3 days', priority: 'medium' }
  ];

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'fertilization': return '🌱';
      case 'healthcare': return '💊';
      case 'inspection': return '🔍';
      case 'maintenance': return '🔧';
      default: return '📅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop Calendar</h1>
          <p className="text-gray-600">Manage your farming activities and get personalized reminders</p>
        </div>
        <button className="mt-4 lg:mt-0 flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calendar Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar Header */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'month' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    view === 'week' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Week
                </button>
              </div>
            </div>
            
            {/* Simple Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-2 font-medium text-gray-600 bg-gray-50 rounded">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6);
                const hasActivity = activities.some(a => new Date(a.date).toDateString() === date.toDateString());
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={i}
                    className={`py-2 cursor-pointer rounded transition-colors ${
                      isToday ? 'bg-green-600 text-white' :
                      hasActivity ? 'bg-blue-100 text-blue-800' :
                      'hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                    {hasActivity && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Activities */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activities</h3>
            <div className="space-y-3">
              {activities.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No activities scheduled for today</p>
              ) : (
                activities
                  .filter(a => new Date(a.date).toDateString() === new Date().toDateString())
                  .map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                      <div className="text-2xl">{getActivityTypeIcon(activity.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.time} • {activity.location}</p>
                        <p className="text-xs text-gray-500">{activity.notes}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activity.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Crop Growth Stages */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Growth Stages</h3>
            <div className="space-y-4">
              {cropStages.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {crop.crop[0]}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{crop.crop}</h4>
                      <p className="text-sm text-gray-600">{crop.stage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{crop.daysLeft} days</p>
                    <p className="text-xs text-gray-600">until {crop.nextActivity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Reminders */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Reminders</h3>
            </div>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{reminder.title}</h4>
                    <p className="text-xs text-gray-600">Due in {reminder.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(reminder.priority)}`}>
                    {reminder.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Today's Weather</h3>
            <div className="text-center">
              <div className="text-4xl mb-2">☀️</div>
              <div className="text-2xl font-bold">24°C</div>
              <div className="text-blue-100 text-sm">Sunny, 5% chance of rain</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-blue-100 text-xs">Humidity</div>
                <div className="font-semibold">65%</div>
              </div>
              <div>
                <div className="text-blue-100 text-xs">Wind</div>
                <div className="font-semibold">12 km/h</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Activities Completed</span>
                <span className="font-semibold text-green-600">18/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overdue Tasks</span>
                <span className="font-semibold text-red-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Upcoming Deadlines</span>
                <span className="font-semibold text-yellow-600">7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;