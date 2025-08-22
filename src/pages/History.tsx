import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Filter, Download, Trash2, Eye } from 'lucide-react';

const History = () => {
  const { diseases } = useApp();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredDiseases = diseases.filter(disease => {
    if (filter === 'all') return true;
    if (filter === 'crop') return disease.type === 'crop';
    if (filter === 'livestock') return disease.type === 'livestock';
    if (filter === 'high') return disease.severity === 'high';
    return true;
  });

  const sortedDiseases = [...filteredDiseases].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'severity') {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    if (sortBy === 'confidence') return b.confidence - a.confidence;
    return 0;
  });

  const exportData = () => {
    const csvContent = [
      'Date,Name,Type,Severity,Confidence,Location,Description',
      ...diseases.map(d => 
        `${d.date},"${d.name}",${d.type},${d.severity},${d.confidence}%,"${d.location}","${d.description}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'disease-history.csv';
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Disease History</h1>
          <p className="text-gray-600">Track and manage all your past disease detections</p>
        </div>
        <button
          onClick={exportData}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Types</option>
              <option value="crop">Crops Only</option>
              <option value="livestock">Livestock Only</option>
              <option value="high">High Severity</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="date">Date</option>
              <option value="severity">Severity</option>
              <option value="confidence">Confidence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{diseases.length}</div>
          <div className="text-sm text-gray-600">Total Records</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {diseases.filter(d => d.type === 'crop').length}
          </div>
          <div className="text-sm text-gray-600">Crop Diseases</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {diseases.filter(d => d.type === 'livestock').length}
          </div>
          <div className="text-sm text-gray-600">Livestock Issues</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {diseases.filter(d => d.severity === 'high').length}
          </div>
          <div className="text-sm text-gray-600">High Severity</div>
        </div>
      </div>

      {/* Disease Records */}
      <div className="space-y-4">
        {sortedDiseases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' ? 'No disease detections yet.' : 'No records match your current filter.'}
            </p>
            <button
              onClick={() => setFilter('all')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          sortedDiseases.map((disease) => (
            <div key={disease.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex-shrink-0">
                    <img
                      src={disease.image}
                      alt={disease.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {disease.name}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        disease.severity === 'high' ? 'bg-red-100 text-red-800' :
                        disease.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {disease.severity}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {disease.type === 'crop' ? '🌱 Crop' : '🐄 Livestock'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{disease.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(disease.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{disease.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{disease.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <Eye className="mr-1 h-3 w-3" />
                      View Details
                    </button>
                    <button className="flex items-center px-3 py-1 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Treatment Summary */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Treatment Applied:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {disease.treatment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;