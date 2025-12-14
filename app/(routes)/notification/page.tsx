'use client';

import { useRouter } from 'next/navigation';

// Mock notification data
const notifications = [
  {
    id: '1',
    type: 'transport_success',
    title: 'จองรถสำเร็จ',
    message: 'การจองรถของคุณได้รับการยืนยันแล้ว รถจะมารับคุณตามเวลาที่กำหนด',
    timestamp: '2025-12-14T10:30:00Z',
    isRead: false,
    icon: 'car',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: '2',
    type: 'service_completed',
    title: 'งานเสร็จสิ้น',
    message: 'งานบริการของคุณได้เสร็จสิ้นเรียบร้อยแล้ว ขอบคุณที่ใช้บริการของเรา',
    timestamp: '2025-12-13T16:45:00Z',
    isRead: true,
    icon: 'check',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: '3',
    type: 'appointment_reminder',
    title: 'แจ้งเตือนนัดหมาย',
    message: 'ถึงเวลานัดหมายครั้งถัดไป กรุณาเข้ามากรอกข้อมูลการนัดหมาย',
    timestamp: '2025-12-12T09:00:00Z',
    isRead: false,
    icon: 'calendar',
    color: 'bg-purple-100 text-purple-600'
  }
];

const formatRelativeTime = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'เมื่อไม่นานนี้';
  } else if (diffInHours < 24) {
    return `${diffInHours} ชั่วโมงที่แล้ว`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} วันที่แล้ว`;
  }
};

const getIcon = (iconType: string, colorClass: string) => {
  const iconClass = `w-6 h-6 ${colorClass}`;
  
  switch (iconType) {
    case 'car':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M5 17h14l-1-5H6l-1 5zM6 12V7a1 1 0 011-1h10a1 1 0 011 1v5" />
        </svg>
      );
    case 'check':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export default function NotificationPage() {
  const router = useRouter();

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (notification.type === 'appointment_reminder') {
      // For appointment reminders, go to book-appointment page
      router.push('/book-appointment');
    } else {
      // For other notifications, go to detail page
      router.push(`/notification/detail?id=${notification.id}`);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center p-4">
          <button 
            onClick={handleBackClick}
            className="mr-3 p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">การแจ้งเตือน</h1>
        </div>
      </div>

      {/* Notification List */}
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500">ไม่มีการแจ้งเตือน</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? 'border-l-4 border-l-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                  {getIcon(notification.icon, notification.color.split(' ')[1])}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="shrink-0 w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${!notification.isRead ? 'text-gray-600' : 'text-gray-500'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatRelativeTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}