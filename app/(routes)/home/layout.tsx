'use client';

import { useEffect, useState } from 'react';

// Types
interface ScanResult {
  id?: string;
  status?: string;
  message?: string;
  data?: Record<string, unknown>;
  user_name?: string;
}

interface UserScanData {
  scanResult?: ScanResult;
  capturedImage?: string;
  scanStatus: 'pending' | 'completed' | 'failed';
  uploadTimestamp: string;
  scanTimestamp: string;
  scanDate: string;
  user_name?: string;
}

// Helper function to get user data
const getUserScanData = (): UserScanData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem('userScanData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user scan data:', error);
    return null;
  }
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState('Elizabeth');

  useEffect(() => {
    const loadUserName = () => {
      const userData = getUserScanData();
      if (userData?.user_name) {
        setUserName(userData.user_name);
      } else if (userData?.scanResult?.user_name) {
        setUserName(userData.scanResult.user_name);
      }
    };
    
    loadUserName();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 pb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-gray-600">Hello {userName}</p>
            <p className="text-xs text-gray-400">How are you today?</p>
          </div>
        </div>
        <div className="relative">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
