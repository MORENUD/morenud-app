'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { homeTexts } from './texts';

// Types
interface ScanResult {
  id?: string;
  status?: string;
  message?: string;
  data?: Record<string, unknown>;
  name?: string;
}

interface UserScanData {
  scanResult?: ScanResult;
  capturedImage?: string;
  scanStatus: 'pending' | 'completed' | 'failed';
  uploadTimestamp: string;
  scanTimestamp: string;
  scanDate: string;
  name?: string;
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
  const router = useRouter();
  const [userName, setUserName] = useState('Elizabeth');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  useEffect(() => {
    const loadUserName = () => {
      const userData = getUserScanData();
      if (userData?.name) {
        setUserName(userData.name);
      } else if (userData?.scanResult?.name) {
        setUserName(userData.scanResult.name);
      }
    };
    
    loadUserName();
  }, []);

  const handleCancelConsent = async () => {
    const result = await Swal.fire({
      title: homeTexts.settings.title,
      text: homeTexts.settings.cancelConsentConfirm,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: homeTexts.settings.confirmCancel,
      cancelButtonText: homeTexts.settings.keepConsent,
      reverseButtons: true
    });

    if (result.isConfirmed) {
      // Clear all user data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.clear(); // Clear all localStorage data
      }
      
      // Show success message
      await Swal.fire({
        title: 'สำเร็จ!',
        text: homeTexts.settings.success,
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#10b981'
      });

      // Redirect to login page
      router.push('/login');
    }
    
    setShowSettingsMenu(false);
  };

  const handleSettingsClick = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  const handleCancelConsentClick = () => {
    handleCancelConsent();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSettingsMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.settings-menu') && !target.closest('.settings-button')) {
          setShowSettingsMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettingsMenu]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 pb-8">
        <div className="flex items-center space-x-3 relative">
          <button 
            onClick={handleSettingsClick}
            className="settings-button w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm hover:bg-purple-200 transition-colors cursor-pointer"
          >
            {userName.charAt(0).toUpperCase()}
          </button>
          <div>
            <p className="text-sm text-gray-600">Hello {userName}</p>
            <p className="text-xs text-gray-400">How are you today?</p>
          </div>

          {/* Settings Menu */}
          {showSettingsMenu && (
            <div className="settings-menu absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">{homeTexts.settings.title}</p>
              </div>
              <button
                onClick={handleCancelConsentClick}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                {homeTexts.settings.cancelConsent}
              </button>
            </div>
          )}
        </div>
        <button 
          onClick={() => router.push('/notification')}
          className="relative hover:opacity-70 transition-opacity"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
