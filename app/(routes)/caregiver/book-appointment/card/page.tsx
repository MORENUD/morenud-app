'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { CaregiverSchedule } from '@/app/api/caregiver-schedules/shared';

function CaregiverScheduleCardContent() {
  const [scheduleData, setScheduleData] = useState<CaregiverSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const bookingId = searchParams.get('id');

  const fetchScheduleData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch caregiver schedule data from API
      const response = await fetch(`/api/appointments/${bookingId}`);
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลตารางงานได้');
      }
      
      const result = await response.json();
      console.log('Caregiver schedule data from API:', result.data);
      setScheduleData(result.data);
      
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) {
      setError('ไม่พบ ID การจอง');
      setIsLoading(false);
      return;
    }

    fetchScheduleData();
  }, [bookingId, fetchScheduleData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return `${timeString} น.`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoHome = () => {
    router.push('/caregiver/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <PageHeader title="ตารางงานผู้ดูแล" showBackButton={true} className="bg-blue-50" />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scheduleData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <PageHeader title="ตารางงานผู้ดูแล" showBackButton={true} className="bg-blue-50" />
          <div className="p-6 text-center">
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error || 'ไม่พบข้อมูลตารางงาน'}</p>
            <button 
              onClick={handleGoHome}
              className="btn btn-primary"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="print:hidden">
          <PageHeader 
            title="ตารางงานผู้ดูแล" 
            showBackButton={true} 
            className="bg-blue-50"
          />
        </div>

        {/* Schedule Card */}
        <div className="p-6 print:p-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg print:shadow-none print:border-2 print:border-gray-400">
            
            {/* Service Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg print:bg-gray-100 print:text-black">
              <div className="text-center">
                <h1 className="text-lg font-bold">ตารางงานผู้ดูแล</h1>
                <p className="text-sm opacity-90 print:text-gray-600">Morenud Care Service</p>
                <p className="text-sm opacity-90 print:text-gray-600">โทร: 02-123-4567</p>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="p-6 print:p-4">
              
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">ตารางงานรายวัน</h2>
                <div className="inline-block bg-gray-100 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-600">รหัสงาน: </span>
                  <span className="text-lg font-bold text-blue-600">{scheduleData.bookingNumber || scheduleData.id}</span>
                </div>
              </div>

              {/* Work Schedule Information */}
              <div className="space-y-4 mb-6">
                {scheduleData.caregiverName && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-gray-600">👨‍⚕️ ผู้ดูแล:</span>
                      <span className="col-span-2 font-bold text-blue-700">{scheduleData.caregiverName}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">👤 ผู้รับบริการ:</span>
                  <span className="col-span-2 font-medium">{scheduleData.patientName}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">📅 วันที่ปฏิบัติงาน:</span>
                  <span className="col-span-2 font-medium text-blue-600">{formatDate(scheduleData.pickupDate)}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">⏰ เวลาปฏิบัติงาน:</span>
                  <span className="col-span-2 font-medium text-blue-600">{formatTime(scheduleData.pickupTime)}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">📞 เบอร์ติดต่อ:</span>
                  <span className="col-span-2 font-medium">{scheduleData.phone}</span>
                </div>

                {scheduleData.estimatedDuration && (
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <span className="text-gray-600">⏱️ ระยะเวลาโดยประมาณ:</span>
                    <span className="col-span-2 font-medium text-orange-600">{scheduleData.estimatedDuration}</span>
                  </div>
                )}
              </div>

              {/* Work Locations */}
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-sm text-gray-600 block mb-1">📍 สถานที่เริ่มงาน:</span>
                  <p className="text-sm font-medium bg-blue-50 p-3 rounded border">{scheduleData.pickupAddress}</p>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block mb-1">🏥 สถานที่ปลายทาง:</span>
                  <p className="text-sm font-medium bg-green-50 p-3 rounded border">{scheduleData.destinationAddress}</p>
                </div>
              </div>

              {/* Work Instructions */}
              {scheduleData.comment && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-yellow-800 mb-2">📝 คำแนะนำและหมายเหตุ:</h3>
                  <p className="text-sm text-yellow-700">{scheduleData.comment}</p>
                </div>
              )}

              {/* Work Status */}
              <div className="text-center mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  scheduleData.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {scheduleData.status === 'confirmed' ? '✅ ได้รับงานแล้ว' : '⏳ รอการยืนยัน'}
                </span>
              </div>

              {/* Print Info */}
              <div className="text-center text-xs text-gray-500 border-t pt-4">
                <p>พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</p>
                <p>กรุณาเก็บตารางงานนี้ไว้และปฏิบัติตามกำหนดเวลา</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 print:hidden">
            <button 
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🖨️ พิมพ์ตารางงาน
            </button>
            <button 
              onClick={handleGoHome}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              🏠 กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaregiverScheduleCard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-4">
        <PageHeader title="ตารางงานผู้ดูแล" showBackButton />
        <div className="max-w-md mx-auto mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <CaregiverScheduleCardContent />
    </Suspense>
  );
}
