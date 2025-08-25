import React, { useState, useRef } from 'react';

interface VideoUploadPageProps {
  className?: string;
}

interface VideoDetails {
  title: string;
  description: string;
  visibility: 'public' | 'unlisted' | 'private';
  category: string;
  tags: string[];
  thumbnail?: File;
  monetization: boolean;
  ageRestriction: boolean;
}

const VideoUploadPage: React.FC<VideoUploadPageProps> = ({ className }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'details' | 'publish'>('upload');
  const [videoDetails, setVideoDetails] = useState<VideoDetails>({
    title: '',
    description: '',
    visibility: 'public',
    category: 'Entertainment',
    tags: [],
    monetization: false,
    ageRestriction: false
  });
  const [tagInput, setTagInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Entertainment', 'Music', 'Gaming', 'Sports', 'News & Politics',
    'Education', 'Science & Technology', 'Comedy', 'Film & Animation',
    'Autos & Vehicles', 'Pets & Animals', 'Travel & Events'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoDetails(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setVideoDetails(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setCurrentStep('details');
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  const handleDetailsChange = (field: keyof VideoDetails, value: any) => {
    setVideoDetails(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !videoDetails.tags.includes(tagInput.trim())) {
      setVideoDetails(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setVideoDetails(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleThumbnailSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoDetails(prev => ({ ...prev, thumbnail: file }));
    }
  };

  const handlePublish = () => {
    setCurrentStep('publish');
    // Simulate publishing process
    setTimeout(() => {
      alert('Video published successfully!');
      // Reset form
      setSelectedFile(null);
      setUploadProgress(0);
      setCurrentStep('upload');
      setVideoDetails({
        title: '',
        description: '',
        visibility: 'public',
        category: 'Entertainment',
        tags: [],
        monetization: false,
        ageRestriction: false
      });
    }, 2000);
  };

  return (
    <div className={`video-upload-page ${className || ''}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Upload Video</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center ${
            currentStep === 'upload' ? 'text-blue-600' : 
            currentStep === 'details' || currentStep === 'publish' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'upload' ? 'bg-blue-600 text-white' :
              currentStep === 'details' || currentStep === 'publish' ? 'bg-green-600 text-white' : 'bg-gray-300'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Upload</span>
          </div>
          
          <div className="flex-1 h-1 mx-4 bg-gray-300">
            <div className={`h-full ${
              currentStep === 'details' || currentStep === 'publish' ? 'bg-green-600' : 'bg-gray-300'
            }`} style={{ width: currentStep === 'details' || currentStep === 'publish' ? '100%' : '0%' }}></div>
          </div>
          
          <div className={`flex items-center ${
            currentStep === 'details' ? 'text-blue-600' :
            currentStep === 'publish' ? 'text-green-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'details' ? 'bg-blue-600 text-white' :
              currentStep === 'publish' ? 'bg-green-600 text-white' : 'bg-gray-300'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Details</span>
          </div>
          
          <div className="flex-1 h-1 mx-4 bg-gray-300">
            <div className={`h-full ${
              currentStep === 'publish' ? 'bg-green-600' : 'bg-gray-300'
            }`} style={{ width: currentStep === 'publish' ? '100%' : '0%' }}></div>
          </div>
          
          <div className={`flex items-center ${
            currentStep === 'publish' ? 'text-blue-600' : 'text-gray-400'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 'publish' ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Publish</span>
          </div>
        </div>

        {/* Upload Step */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your video</h3>
                <p className="text-gray-600 mb-4">Drag and drop video files to upload</p>
                <p className="text-sm text-gray-500 mb-4">Your videos will be private until you publish them.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  SELECT FILES
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{selectedFile.name}</h3>
                    <p className="text-gray-600 text-sm">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                {isUploading && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {!isUploading && uploadProgress === 0 && (
                  <button
                    onClick={simulateUpload}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  >
                    Start Upload
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Details Step */}
        {currentStep === 'details' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Video Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (required)</label>
                  <input
                    type="text"
                    value={videoDetails.title}
                    onChange={(e) => handleDetailsChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a title that describes your video"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">{videoDetails.title.length}/100</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={videoDetails.description}
                    onChange={(e) => handleDetailsChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Tell viewers about your video"
                    maxLength={5000}
                  />
                  <p className="text-xs text-gray-500 mt-1">{videoDetails.description.length}/5000</p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag"
                    />
                    <button
                      onClick={addTag}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {videoDetails.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {videoDetails.thumbnail ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{videoDetails.thumbnail.name}</p>
                        <button
                          onClick={() => handleDetailsChange('thumbnail', undefined)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Upload a custom thumbnail</p>
                        <button
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
                        >
                          Upload Thumbnail
                        </button>
                      </div>
                    )}
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                  <select
                    value={videoDetails.visibility}
                    onChange={(e) => handleDetailsChange('visibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={videoDetails.category}
                    onChange={(e) => handleDetailsChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Additional Options */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={videoDetails.monetization}
                      onChange={(e) => handleDetailsChange('monetization', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm">Enable monetization</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={videoDetails.ageRestriction}
                      onChange={(e) => handleDetailsChange('ageRestriction', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-sm">Age restriction (18+)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('upload')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                onClick={handlePublish}
                disabled={!videoDetails.title.trim()}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Publish
              </button>
            </div>
          </div>
        )}

        {/* Publish Step */}
        {currentStep === 'publish' && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Publishing your video...</h2>
              <p className="text-gray-600">This may take a few moments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploadPage;