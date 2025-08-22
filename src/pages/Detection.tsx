import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const Detection = () => {
  const { addDisease } = useApp();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockDiseases = [
    {
      name: 'Leaf Spot Disease',
      type: 'crop' as const,
      confidence: 89,
      severity: 'medium' as const,
      description: 'Fungal infection causing circular spots on leaves',
      treatment: 'Apply fungicide spray, remove affected leaves, improve air circulation'
    },
    {
      name: 'Foot and Mouth Disease',
      type: 'livestock' as const,
      confidence: 94,
      severity: 'high' as const,
      description: 'Viral disease affecting cloven-hoofed animals',
      treatment: 'Immediate isolation, contact veterinarian, disinfect area'
    },
    {
      name: 'Powdery Mildew',
      type: 'crop' as const,
      confidence: 76,
      severity: 'low' as const,
      description: 'Fungal disease causing white powdery coating on leaves',
      treatment: 'Increase air circulation, apply sulfur-based fungicide'
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    const detectionResult = {
      ...randomDisease,
      id: Date.now().toString(),
      image: selectedImage,
      date: new Date().toISOString().split('T')[0],
      location: 'Current Location'
    };

    setResult(detectionResult);
    setIsAnalyzing(false);
  };

  const handleSaveResult = () => {
    if (result) {
      addDisease(result);
      // Reset form
      setSelectedImage(null);
      setResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Disease Detection</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload or capture an image of your crops or livestock for instant AI-powered disease detection
          and treatment recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Upload</h2>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-w-full h-64 object-cover mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Drop your image here or click to browse</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, WebP up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="flex space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </button>
            </div>

            {selectedImage && (
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Image'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
          
          {!result && !isAnalyzing && (
            <div className="text-center py-12 text-gray-500">
              <Camera className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>Upload an image and click "Analyze" to see results</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-12">
              <Loader className="mx-auto h-12 w-12 animate-spin text-green-600 mb-4" />
              <p className="text-gray-600">Analyzing image with AI...</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>• Processing image quality</p>
                <p>• Identifying patterns</p>
                <p>• Matching with disease database</p>
                <p>• Generating recommendations</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {result.severity === 'high' ? (
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                    <p className="text-sm text-gray-600">
                      {result.confidence}% confidence • {result.type === 'crop' ? '🌱 Crop' : '🐄 Livestock'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Severity Level</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      result.severity === 'high' ? 'bg-red-100 text-red-800' :
                      result.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                    <p className="text-gray-600 text-sm">{result.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Recommended Treatment</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm">{result.treatment}</p>
                    </div>
                  </div>

                  {result.severity === 'high' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-800 text-sm font-medium">
                        ⚠️ High severity detected. Consider contacting a veterinarian or agricultural expert immediately.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSaveResult}
                className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Save to History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📸 Tips for Better Detection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Image Quality</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Use good lighting conditions</li>
              <li>• Focus clearly on the affected area</li>
              <li>• Avoid blurry or dark images</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">What to Capture</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Show symptoms clearly</li>
              <li>• Include healthy areas for comparison</li>
              <li>• Multiple angles if possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detection;