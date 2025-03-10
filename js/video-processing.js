// Video Bite Analysis API Integration
/**
 * Configuration
 */
const CONFIG = {
    // API endpoints
    API_GATEWAY_URL: 'https://d91qd4my5h.execute-api.eu-west-3.amazonaws.com/FirstDeployment',
    PROCESSING_API_URL: 'http://15.237.211.15:80',
    
    // S3 bucket for videos
    S3_BUCKET: 'vit-bites',
    
    // User configuration - replace with actual user authentication when available
    DEFAULT_USER_ID: 'test_user_id',
    
    // Upload configuration
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB in bytes
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/avi', 'video/quicktime'],
    
    // Debug mode - set to true for detailed console logging
    DEBUG: true
  };

  /**
   * Video Bite Analysis Integration
   * This class handles all API interactions for video upload and processing
   */
  class VideoBiteAnalysis {
    constructor(options = {}) {
      this.config = { ...CONFIG, ...options };
      this.userId = options.userId || this.config.DEFAULT_USER_ID;
      this.onProgress = options.onProgress || (() => {});
      this.onStatusChange = options.onStatusChange || (() => {});
    }
    
    /**
     * Initialize the integration and check API status
     */
    async initialize() {
      try {
        this.updateStatus('Checking API status...');
        const status = await this.checkApiStatus();
        
        if (status.status !== 'ready') {
          throw new Error('Processing API is not ready. Please try again later.');
        }
        
        this.updateStatus('Ready for video upload');
        return true;
      } catch (error) {
        this.updateStatus('Error: ' + error.message);
        throw error;
      }
    }
    
    /**
     * Check processing API status
     */
    async checkApiStatus() {
      try {
        const response = await fetch(`${this.config.PROCESSING_API_URL}/info`);
        
        if (!response.ok) {
          throw new Error(`API status check failed: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error checking API status:', error);
        throw new Error('Unable to connect to processing API');
      }
    }
    
    /**
     * Get presigned URL for S3 upload from API Gateway
     */
    async getPresignedUrl() {
      try {
        this.updateStatus('Getting upload URL...');
        
        // For a real implementation, you would need a proper token from your authentication system
        // This implementation uses the API Gateway which will handle calling the Lambda function
        const response = await fetch(`${this.config.API_GATEWAY_URL}?user_id=${this.userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to get upload URL: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.presigned_url) {
          throw new Error('Invalid response from server');
        }
        
        return data;
      } catch (error) {
        console.error('Error getting presigned URL:', error);
        this.updateStatus('Error: ' + error.message);
        throw error;
      }
    }
    
    /**
     * Upload a video file to S3 using presigned URL
     */
    async uploadToS3(presignedUrl, file) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Set up progress tracking
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            this.onProgress(percentComplete);
            this.updateStatus(`Uploading: ${percentComplete}%`);
          }
        });
        
        // Set up completion handler
        xhr.onload = () => {
          if (xhr.status === 200) {
            this.updateStatus('Upload complete');
            resolve(true);
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };
        
        // Set up error handler
        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };
        
        // Start upload
        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    }
    
    /**
     * Process an uploaded video
     */
    async processVideo(videoPath) {
      try {
        this.updateStatus('Processing video...');
        
        const response = await fetch(`${this.config.PROCESSING_API_URL}/process-video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            video_path: videoPath
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `Processing failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        this.updateStatus('Processing complete');
        return result;
      } catch (error) {
        console.error('Error processing video:', error);
        this.updateStatus('Error: ' + error.message);
        throw error;
      }
    }
    
    /**
     * Complete workflow: upload and process a video
     */
    async uploadAndProcessVideo(file) {
      try {
        // Validate file
        this.validateFile(file);
        
        // Initialize
        await this.initialize();
        
        // Step 1: Get presigned URL
        const { presigned_url, key } = await this.getPresignedUrl();
        
        // Step 2: Upload to S3
        await this.uploadToS3(presigned_url, file);
        
        // Step 3: Process the video
        // Extract filename from the S3 key and create path for processing API
        const fileName = key.split('/').pop();
        const videoPath = `./uploads/${fileName}`;
        
        const result = await this.processVideo(videoPath);
        
        return {
          success: true,
          s3Key: key,
          result: result
        };
      } catch (error) {
        console.error('Error in upload and process workflow:', error);
        this.updateStatus('Error: ' + error.message);
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    /**
     * Validate video file before upload
     */
    validateFile(file) {
      // Check file type
      if (!this.config.ALLOWED_VIDEO_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed types: ${this.config.ALLOWED_VIDEO_TYPES.join(', ')}`);
      }
      
      // Check file size
      if (file.size > this.config.MAX_FILE_SIZE) {
        const maxSizeMB = this.config.MAX_FILE_SIZE / (1024 * 1024);
        throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`);
      }
    }
    
    /**
     * Update status through callback
     */
    updateStatus(status) {
      console.log('[VideoBiteAnalysis]', status);
      this.onStatusChange(status);
    }
    
    /**
     * Set user ID
     */
    setUserId(userId) {
      this.userId = userId;
    }
  }
  
  /**
   * Initialize the UI components
   */
  function initializeUI() {
    // DOM elements
    const uploadForm = document.getElementById('videoUploadForm');
    const fileInput = document.getElementById('videoFileInput');
    const submitButton = document.getElementById('uploadSubmitButton');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const resultContainer = document.getElementById('resultContainer');
    
    // Hide progress initially
    progressContainer.style.display = 'none';
    
    // Create VideoBiteAnalysis instance
    const analyzer = new VideoBiteAnalysis({
      onProgress: (percent) => {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `Uploading video... ${percent}%`;
      },
      onStatusChange: (status) => {
        progressText.textContent = status;
      }
    });
    
    // Form submission handler
    uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Get the video file
      const videoFile = fileInput.files[0];
      
      if (!videoFile) {
        alert('Please select a video file');
        return;
      }
      
      // Disable form elements during processing
      submitButton.disabled = true;
      fileInput.disabled = true;
      
      // Show progress container
      progressContainer.style.display = 'block';
      progressFill.style.width = '0%';
      progressText.textContent = 'Initializing...';
      
      // Clear previous results
      resultContainer.innerHTML = '';
      
      try {
        // Process the video
        const result = await analyzer.uploadAndProcessVideo(videoFile);
        
        // Display results
        if (result.success) {
          resultContainer.innerHTML = `
            <div class="success">
              <h3>Analysis Complete!</h3>
              <p>Total frames: ${result.result.total_frames}</p>
              <p>Total bites detected: ${result.result.total_bites}</p>
              <h4>Bite Timestamps:</h4>
              <ul>
                ${result.result.bite_timestamps.map(timestamp => `<li>${timestamp}</li>`).join('')}
              </ul>
            </div>
          `;
        } else {
          resultContainer.innerHTML = `
            <div class="error">
              <h3>Error</h3>
              <p>${result.error}</p>
            </div>
          `;
        }
      } catch (error) {
        resultContainer.innerHTML = `
          <div class="error">
            <h3>Error</h3>
            <p>${error.message}</p>
          </div>
        `;
      } finally {
        // Re-enable form elements
        submitButton.disabled = false;
        fileInput.disabled = false;
        
        // Hide progress after a short delay
        setTimeout(() => {
          if (progressContainer.style.display !== 'none') {
            progressContainer.style.display = 'none';
          }
        }, 2000);
      }
    });
    
    // Initialize
    analyzer.initialize().catch(error => {
      resultContainer.innerHTML = `
        <div class="error">
          <h3>Initialization Error</h3>
          <p>${error.message}</p>
          <p>Please try refreshing the page.</p>
        </div>
      `;
    });
  }
  
  // Initialize UI when the document is ready
  document.addEventListener('DOMContentLoaded', initializeUI);