'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Mock notification data (same as in the list page)
const notifications = [
  {
    id: '1',
    type: 'transport_success',
    title: 'จองรถสำเร็จ',
    message: 'การจองรถของคุณได้รับการยืนยันแล้ว รถจะมารับคุณตามเวลาที่กำหนด',
    timestamp: '2025-12-14T10:30:00Z',
    isRead: false,
    icon: 'car',
    color: 'bg-green-100 text-green-600',
    details: {
      driverName: 'นายสมชาย ใจดี',
      caregiver: 'นางสาว มานี ใจเย็น',
      carModel: 'Toyota Camry',
      licensePlate: 'กข 1234 กรุงเทพฯ',
      pickupTime: '14:30',
      pickupLocation: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      destination: 'โรงพยาบาลบำรุงราษฎร์',
      estimatedArrival: '15:15',
      contactNumber: '081-234-5678'
    }
  },
  {
    id: '2',
    type: 'service_completed',
    title: 'งานเสร็จสิ้น',
    message: 'งานบริการของคุณได้เสร็จสิ้นเรียบร้อยแล้ว ขอบคุณที่ใช้บริการของเรา',
    timestamp: '2025-12-13T16:45:00Z',
    isRead: true,
    icon: 'check',
    color: 'bg-blue-100 text-blue-600',
    details: {
      serviceType: 'การดูแลผู้สูงอายุ',
      caregiver: 'นางสาว สาวใส จิตใจงาม',
      duration: '4 ชั่วโมง',
      startTime: '12:45',
      endTime: '16:45',
      servicesProvided: [
        'ให้ยาตามเวลา',
        'วัดความดันโลหิต',
        'ช่วยเหลือการเคลื่อนไหว',
        'จัดเตรียมอาหาร'
      ],
      notes: 'ผู้ป่วยมีสภาพแข็งแรงดี ความดันโลหิตปกติ แนะนำให้ออกกำลังกายเบาๆ',
      nextAppointment: '2025-12-20T12:45:00Z'
    }
  }
];

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getIcon = (iconType: string, colorClass: string) => {
  const iconClass = `w-8 h-8 ${colorClass}`;
  
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
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

function NotificationDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<typeof notifications[0] | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);

  useEffect(() => {
    // Handle case where searchParams might be null during prerendering
    if (!searchParams) return;
    
    const id = searchParams.get('id');
    if (id) {
      const found = notifications.find(n => n.id === id);
      setNotification(found || null);
    }
  }, [searchParams]);

  const handleBackClick = () => {
    router.back();
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    setHasRated(true);
    setShowRatingSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowRatingSuccess(false);
    }, 3000);
    
    // Here you would typically send the rating to your backend
    console.log('Rating submitted:', stars);
  };

  const StarRating = ({ currentRating, onRate, isInteractive = true }: { 
    currentRating: number; 
    onRate?: (rating: number) => void;
    isInteractive?: boolean;
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => isInteractive && onRate && onRate(star)}
            onMouseEnter={() => isInteractive && setHoveredRating(star)}
            onMouseLeave={() => isInteractive && setHoveredRating(0)}
            disabled={!isInteractive || hasRated}
            className={`${isInteractive && !hasRated ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <svg
              className={`w-8 h-8 ${
                star <= (hoveredRating || currentRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({currentRating > 0 ? `${currentRating}/5` : 'ยังไม่ได้ประเมิน'})
        </span>
      </div>
    );
  };

  // Show loading state during prerendering or when searchParams is not available
  if (!searchParams || !notification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            {!searchParams ? 'กำลังโหลด...' : 'ไม่พบการแจ้งเตือน'}
          </p>
          {searchParams && (
            <button 
              onClick={handleBackClick}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              กลับ
            </button>
          )}
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold text-gray-900">รายละเอียดการแจ้งเตือน</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Notification Header */}
        <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${notification.color}`}>
              {getIcon(notification.icon, notification.color.split(' ')[1])}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{notification.title}</h2>
              <p className="text-gray-600 mb-3">{notification.message}</p>
              <p className="text-sm text-gray-400">{formatDateTime(notification.timestamp)}</p>
            </div>
          </div>
        </div>

        {/* Rating Section - Only for service completed */}
        {notification.type === 'service_completed' && (
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-yellow-100 mt-4 mb-4">
            <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">ประเมิน {notification.details?.caregiver}</h3>
                  <p className="text-sm text-gray-500">ผู้ดูแลของคุณ</p>
                </div>
                <p className="text-gray-600 mb-8">โปรดให้คะแนนการบริการของ {notification.details?.caregiver}</p>
                
                {!hasRated ? (
                  <div className="mb-4">
                    <StarRating 
                      currentRating={rating}
                      onRate={handleRating}
                      isInteractive={true}
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <StarRating 
                      currentRating={rating}
                      isInteractive={false}
                    />
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">ขอบคุณสำหรับการประเมิน!</span>
                      </div>
                    </div>
                  </div>
                )}

                {showRatingSuccess && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 font-medium">
                      ✨ ขอบคุณที่ให้คะแนน {rating} ดาวสำหรับ {notification.details?.caregiver}! 
                    </p>
                    <p className="text-blue-600 text-sm mt-1">
                      การประเมินของคุณจะช่วยให้ {notification.details?.caregiver} ปรับปรุงการบริการให้ดียิ่งขึ้น
                    </p>
                  </div>
                )}

                {!hasRated && (
                  <p className="text-xs text-gray-400">
                    การประเมินจะช่วยให้ {notification.details?.caregiver} ทราบผลการบริการและปรับปรุงให้ดียิ่งขึ้น
                  </p>
                )}
              </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">รายละเอียด</h3>
          
          {notification.type === 'transport_success' && notification.details && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">คนขับ</label>
                  <p className="text-gray-900">{notification.details.driverName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ผู้ดูแล</label>
                  <p className="text-gray-900">{notification.details.caregiver}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">รุ่นรถ</label>
                  <p className="text-gray-900">{notification.details.carModel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ทะเบียนรถ</label>
                  <p className="text-gray-900">{notification.details.licensePlate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">เวลารับ</label>
                  <p className="text-gray-900">{notification.details.pickupTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">เวลาถึงโดยประมาณ</label>
                  <p className="text-gray-900">{notification.details.estimatedArrival}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">เบอร์ติดต่อ</label>
                  <p className="text-gray-900">{notification.details.contactNumber}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">สถานที่รับ</label>
                <p className="text-gray-900">{notification.details.pickupLocation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ปลายทาง</label>
                <p className="text-gray-900">{notification.details.destination}</p>
              </div>
            </div>
          )}

          {notification.type === 'service_completed' && notification.details && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">ประเภทบริการ</label>
                  <p className="text-gray-900">{notification.details.serviceType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ผู้ดูแล</label>
                  <p className="text-gray-900">{notification.details.caregiver}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ระยะเวลา</label>
                  <p className="text-gray-900">{notification.details.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">เวลา</label>
                  <p className="text-gray-900">{notification.details.startTime} - {notification.details.endTime}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">หมายเหตุ</label>
                <p className="text-gray-900">{notification.details.notes}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">นัดหมายครั้งถัดไป</label>
                <p className="text-gray-900">{notification.details.nextAppointment ? formatDateTime(notification.details.nextAppointment) : 'ไม่ได้กำหนด'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleBackClick}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            กลับไปที่การแจ้งเตือน
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <NotificationDetailContent />
    </Suspense>
  );
}