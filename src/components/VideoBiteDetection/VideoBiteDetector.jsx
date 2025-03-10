 
import React, { useState, useEffect, useRef } from 'react';

const VideoBiteDetector = () => {
  const [userId] = useState(`user-${Math.random().toString(36).substring(2, 10)}`);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, success, error
  const [results, setResults] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // API URLs - replace with your actual endpoints
  const apiGatewayUrl = 'https://d91qd4my5h.execute-api.eu-west-3.amazonaws.com/FirstDeployment';
  const ecsApiUrl = 'http://15.237.211.15';
  
  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${ecsApiUrl}/`);
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }
        const health = await response.json();
        setApiStatus(health.health_check === 'OK' ? 'online' : 'offline');
      } catch (error) {
        console.error('Health check error:', error);
        setApiStatus('offline');
      }
    };
    
    checkApiHealth();
  }, []);
  
  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/avi'];
    if (!validTypes.includes(selectedFile.type)) {
      setFileError('Please select a valid video file (MP4, MOV, or AVI)');
      setFile(null);
      return;
    }
    
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (selectedFile.size > maxSize) {
      setFileError('File size exceeds 100MB limit');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setFileError(null);
    
    // Create a preview URL
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(selectedFile);
    }
  };
  
  // Get a presigned URL for uploading
  const getPresignedUrl = async (userId, fileName) => {
    try {
      const response = await fetch(
        `${apiGatewayUrl}/get-upload-url?user_id=${encodeURIComponent(userId)}&file_name=${encodeURIComponent(fileName)}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get presigned URL: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return {
        uploadUrl: data.presigned_url,
        s3Key: data.key
      };
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      throw error;
    }
  };

  // Upload to S3 with progress tracking
  const uploadToS3 = async (presignedUrl, file, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            success: true,
            status: xhr.status
          });
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out'));
      });
      
      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  };

  // Process the video with the API
  const processVideo = async (s3Key) => {
    try {
      const response = await fetch(`${ecsApiUrl}/process-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          s3_key: s3Key
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    }
  };

  // Handle upload and processing
  const handleSubmit = async () => {
    if (!file) {
      setFileError('Please select a file first');
      return;
    }
    
    setError(null);
    setResults(null);
    
    try {
      // Start uploading
      setStatus('uploading');
      setUploadProgress(0);
      
      // Step 1: Get presigned URL
      const { uploadUrl, s3Key } = await getPresignedUrl(userId, file.name);
      
      // Step 2: Upload file to S3
      await uploadToS3(uploadUrl, file, (progress) => {
        setUploadProgress(progress);
      });
      
      setUploadProgress(100);
      
      // Step 3: Process the video
      setStatus('processing');
      const processingResults = await processVideo(s3Key);
      
      // Success!
      setStatus('success');
      setResults(processingResults);
      
    } catch (error) {
      setStatus('error');
      setError(error.message || 'An error occurred');
      console.error('Error in upload flow:', error);
    }
  };
  
  // Handle video playback
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Update current time during playback
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Jump to a specific bite timestamp
  const jumpToBiteTimestamp = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Render API status indicator
  const renderApiStatus = () => {
    if (apiStatus === null) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Checking API...</span>;
    } else if (apiStatus === 'online') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">API Online</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">API Offline</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Bite Detector</h1>
        {renderApiStatus()}
      </div>
      
      {/* Video Preview */}
      <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-contain"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={results ? false : true}
        />
        
        {results && (
          <div className="p-4 bg-gray-800">
            <div className="flex items-center mb-2">
              <button
                onClick={togglePlayPause}
                className="mr-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <div className="text-sm text-white">
                Current Time: {currentTime.toFixed(1)}s
              </div>
            </div>
            
            {/* Bite timestamp markers */}
            <div className="relative h-6 bg-gray-700 rounded overflow-hidden">
              {results.bite_timestamps && results.bite_timestamps.map((timestamp, index) => (
                <button
                  key={index}
                  className="absolute h-full w-1 bg-yellow-400 hover:bg-yellow-300 cursor-pointer"
                  style={{ left: `${(timestamp / (videoRef.current?.duration || 1)) * 100}%` }}
                  onClick={() => jumpToBiteTimestamp(timestamp)}
                  title={`Bite at ${timestamp.toFixed(1)}s`}
                />
              ))}
              
              {/* Playback progress */}
              <div 
                className="absolute h-full bg-blue-600 opacity-30"
                style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Video
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/avi"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={status === 'uploading' || status === 'processing'}
          />
          <button
            onClick={handleSubmit}
            disabled={!file || status === 'uploading' || status === 'processing'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {status === 'idle' && 'Analyze Video'}
            {status === 'uploading' && 'Uploading...'}
            {status === 'processing' && 'Processing...'}
            {status === 'success' && 'Analyze Again'}
            {status === 'error' && 'Try Again'}
          </button>
        </div>
        {fileError && (
          <p className="mt-2 text-sm text-red-600">{fileError}</p>
        )}
      </div>
      
      {/* Upload Progress */}
      {status === 'uploading' && (
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-700">Uploading Video</span>
            <span className="text-sm font-medium text-blue-700">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        </div>
      )}
      
      {/* Processing Indicator */}
      {status === 'processing' && (
        <div className="mb-6 flex items-center p-4 bg-blue-50 rounded-lg">
          <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-700">Processing video... This may take a minute.</span>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-700">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Results Display */}
      {results && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-lg font-medium">{results.bite_count || 0} Bites Detected</p>
              {results.total_duration && (
                <p className="text-sm text-gray-600">Video Duration: {results.total_duration.toFixed(1)} seconds</p>
              )}
            </div>
            
            {results.bite_timestamps && results.bite_timestamps.length > 0 && (
              <div>
                <p className="font-medium mb-2">Bite Timestamps:</p>
                <div className="flex flex-wrap gap-2">
                  {results.bite_timestamps.map((timestamp, index) => (
                    <button
                      key={index}
                      onClick={() => jumpToBiteTimestamp(timestamp)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 focus:outline-none"
                    >
                      {timestamp.toFixed(1)}s
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {results.confidence_scores && (
              <div className="mt-4">
                <p className="font-medium mb-2">Average Confidence: {(results.avg_confidence * 100).toFixed(1)}%</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBiteDetector;