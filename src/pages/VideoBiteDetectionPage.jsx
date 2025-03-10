 
import React from 'react';
import VideoBiteDetector from '../components/VideoBiteDetection/VideoBiteDetector';

const VideoBiteDetectionPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Video Bite Detection</h1>
      <VideoBiteDetector />
    </div>
  );
};

export default VideoBiteDetectionPage;