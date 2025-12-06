'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../../../components/PageHeader';

// Types
interface UserHealthData {
  userName?: string;
  disease?: string;
  healthScore?: number;
  answers?: unknown[];
  scanResult?: unknown;
  completedAt?: string;
}

// Helper functions
const getUserHealthData = (): UserHealthData => {
  if (typeof window === 'undefined') return {};
  
  try {
    const scanData = localStorage.getItem('userScanData');
    const healthData = localStorage.getItem('healthCheckResults');
    
    const userData: UserHealthData = {};
    
    if (scanData) {
      const scan = JSON.parse(scanData);
      userData.userName = scan.scanResult?.user_name || scan.user_name;
      userData.disease = scan.scanResult?.disease;
      userData.scanResult = scan.scanResult;
    }
    
    if (healthData) {
      const health = JSON.parse(healthData);
      userData.healthScore = health.healthScore;
      userData.answers = health.answers;
      userData.completedAt = health.completedAt;
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting user health data:', error);
    return {};
  }
};

const saveDataForStreamlit = (data: UserHealthData) => {
  try {
    // Save to sessionStorage (persists during browser session)
    sessionStorage.setItem('streamlitData', JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      source: 'morenud-app'
    }));
    
    // Also save to localStorage as backup
    localStorage.setItem('streamlitSessionData', JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
      source: 'morenud-app'
    }));
    
    return true;
  } catch (error) {
    console.error('Error saving data for Streamlit:', error);
    return false;
  }
};

const encodeDataForURL = (data: UserHealthData): string => {
  try {
    // Create a compressed data object for URL
    const urlData = {
      u: data.userName || '',
      d: data.disease || '',
      s: data.healthScore || 0,
      t: Date.now()
    };
    
    return btoa(JSON.stringify(urlData)); // Base64 encode
  } catch (error) {
    console.error('Error encoding data for URL:', error);
    return '';
  }
};

export default function ChatbotPage() {
  const [userData, setUserData] = useState<UserHealthData>({});
  const [isLoading, setIsLoading] = useState(true);
  const streamlitUrl = 'http://localhost:8501'; // Fixed URL

  useEffect(() => {
    const initializeData = () => {
      const healthData = getUserHealthData();
      setUserData(healthData);
      // Save data for Streamlit immediately
      saveDataForStreamlit(healthData);
      setIsLoading(false);
    };
    
    initializeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-purple-500"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Always show iframe - embedded Streamlit
  const encodedData = encodeDataForURL(userData);
  const iframeUrl = `${streamlitUrl}?data=${encodedData}&source=morenud-app&embedded=true`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PageHeader 
        title='AI Chatbot'
        backButtonText="กลับ"
      />
      <div className="flex-1">
        <iframe
          src={iframeUrl}
          className="w-full h-full border-none"
          title="Streamlit Chatbot"
          allow="camera; microphone"
        />
      </div>
    </div>
  );
}
