'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '../../../components/PageHeader';

// Types
interface PredictionResult {
  prediction_class: number;
  prediction_label: string;
  probability_positive: number;
}

interface AlertResult {
  is_above_threshold: boolean;
  prediction_class: number;
  prediction_label: string;
  probability_positive: number;
  threshold_used: number;
}

interface ResultApi {
  alert?: AlertResult;
  cardiovascular?: PredictionResult;
  gastrointestinal_liver?: PredictionResult;
  infectious?: PredictionResult;
}

interface UserHealthData {
  userName?: string;
  disease?: string;
  healthScore?: number;
  answers?: unknown[];
  scanResult?: unknown;
  completedAt?: string;
  alertThreshold?: number;
  resultApi?: ResultApi;
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
      // Try to get disease from different possible locations
      userData.disease = scan.scanResult?.disease || scan.disease;
      userData.userName = scan.scanResult?.name || scan.name;
      userData.scanResult = scan.scanResult;
    }
    
    if (healthData) {
      const health = JSON.parse(healthData);
      userData.healthScore = health.healthScore;
      userData.answers = health.answers;
      userData.completedAt = health.completedAt;
      userData.alertThreshold = health.apiResult?.results.alert.threshold_used;
      userData.resultApi = health.apiResult.results;
    }

    console.log('Retrieved user health data:', userData);
    
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

interface ScanResult {
  name?: string;
  disease?: string;
  current_appointment?: string;
  debug_info?: {
    file: string;
    score: number;
  };
}

interface UserScanData {
  scanResult?: ScanResult;
  capturedImage?: string;
  scanStatus?: string;
  scanTimestamp?: string;
  scanDate?: string;
}

export default function ChatbotPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserHealthData>({});
  const [userScanData, setUserScanData] = useState<UserScanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleBackClick = () => {
    router.push('/home');
  };
  
  // กำหนด URL ตาม disease ที่ตรวจพบ และ alert จาก threshold_used
  const getStreamlitUrl = (): string => {
    const name = userData.userName || 'Peter';
    const diseaseParam = userScanData?.scanResult?.disease === 'Blood Pressure' ? 'Blood&20Pressure' : userScanData?.scanResult?.disease !== null ? userScanData?.scanResult?.disease : 'Diabetes';
    const thresholdUsed = userData.resultApi?.alert?.threshold_used || false;
    const giLiver = userData.resultApi?.gastrointestinal_liver?.prediction_label === 'Positive' ? 'Positive' : 'Negative';
    const cardio = userData.resultApi?.cardiovascular?.prediction_label === 'Positive' ? 'Positive' : 'Negative';
    const infectious = userData.resultApi?.infectious?.prediction_label === 'Positive' ? 'Positive' : 'Negative';
    const schedule = userScanData?.scanResult?.current_appointment || '2025-12-31';

    const link = `https://medical-frontend-wh8v.onrender.com/?user_name=${name}&disease=${diseaseParam}&is_alert=${thresholdUsed}&current_schedule=${schedule}&is_cardio=${cardio}&is_gi_liver=${giLiver}&is_infectious=${infectious}`;
    console.log('Generated Streamlit URL:', link);
    return link;
  };

  useEffect(() => {
    const initializeData = () => {
      const healthData = getUserHealthData();
      setUserData(healthData);
      
      // Get scan data and parse it properly
      const scanDataString = localStorage.getItem('userScanData');
      if (scanDataString) {
        try {
          const scanData = JSON.parse(scanDataString);
          setUserScanData(scanData);
        } catch (error) {
          console.error('Error parsing scan data:', error);
          setUserScanData(null);
        }
      }
      
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
  const streamlitUrl = getStreamlitUrl();
  const iframeUrl = `${streamlitUrl}&data=${encodedData}&source=morenud-app&embedded=true`;
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <PageHeader 
        title='AI Chatbot'
        backButtonText="กลับ"
        onBackClick={handleBackClick}
      />
      <div className="flex-1 overflow-hidden">
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
