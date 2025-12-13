'use client';

import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;
  className?: string;
  showStatusBar?: boolean;
  showActionButton?: boolean;
  onActionClick?: () => void;
}

export default function PageHeader({ 
  title, 
  showBackButton = true, 
  backButtonText = "Back",
  onBackClick,
  className = "",
  showStatusBar = true,
  showActionButton = false,
  onActionClick
}: PageHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className={`bg-linear-to-b from-gray-50 to-white ${className}`}>

      {/* {showStatusBar && (
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <div className="text-sm font-medium text-gray-900">
            {new Date().toLocaleTimeString('th-TH', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>
          <div className="flex items-center space-x-1">

            <div className="flex items-end space-x-1">
              <div className="w-1 h-2 bg-gray-900 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-900 rounded-full"></div>
              <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
              <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
            </div>

            <svg className="w-4 h-4 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>

            <div className="ml-2 flex items-center">
              <div className="w-6 h-3 border border-gray-900 rounded-sm relative">
                <div className="w-4 h-1.5 bg-gray-900 rounded-sm absolute top-0.5 left-0.5"></div>
                <div className="w-0.5 h-1 bg-gray-900 rounded-r absolute -right-1 top-1"></div>
              </div>
            </div>
          </div>
        </div>
      )}
       */}
      
      {/* Header Content */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between relative">
          {showBackButton ? (
            <button
              onClick={handleBackClick}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 -ml-2"
              aria-label={backButtonText}
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-10 h-10"></div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h1>
          </div>
          
          {showActionButton ? (
            <button
              onClick={onActionClick}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 -mr-2"
              aria-label="Add new"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          ) : (
            <div className="w-10 h-10"></div>
          )}
        </div>
      </div>
      
      {/* Subtle bottom border */}
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
}