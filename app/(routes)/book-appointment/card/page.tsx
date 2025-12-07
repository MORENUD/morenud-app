'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';

interface AppointmentData {
  id: string;
  appointmentNumber: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  phone: string;
  address: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  queueNumber: string;
  status: string;
  createdAt: string;
  instructions: string;
}

function AppointmentCardContent() {
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const appointmentId = searchParams.get('id');

  const fetchAppointmentData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch appointment data from API
      const response = await fetch(`/api/appointments/${appointmentId}`);
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลการนัดหมายได้');
      }
      
      const result = await response.json();
      console.log('Appointment data from API:', result.data);
      setAppointmentData(result.data);
      
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลการนัดหมาย');
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    if (!appointmentId) {
      setError('ไม่พบ ID การนัดหมาย');
      setIsLoading(false);
      return;
    }

    fetchAppointmentData();
  }, [appointmentId, fetchAppointmentData]);

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
    router.push('/home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <PageHeader title="ใบนัดหมาย" showBackButton={true} className="bg-blue-50" />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointmentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <PageHeader title="ใบนัดหมาย" showBackButton={true} className="bg-blue-50" />
          <div className="p-6 text-center">
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error || 'ไม่พบข้อมูลการนัดหมาย'}</p>
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
            title="ใบนัดหมาย" 
            showBackButton={true} 
            className="bg-blue-50"
          />
        </div>

        {/* Appointment Card */}
        <div className="p-6 print:p-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg print:shadow-none print:border-2 print:border-gray-400">
            
            {/* Hospital Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg print:bg-gray-100 print:text-black">
              <div className="text-center">
                <h1 className="text-lg font-bold">{appointmentData.hospitalName}</h1>
                <p className="text-sm opacity-90 print:text-gray-600">{appointmentData.hospitalAddress}</p>
                <p className="text-sm opacity-90 print:text-gray-600">โทร: {appointmentData.hospitalPhone}</p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="p-6 print:p-4">
              
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">ใบนัดหมายแพทย์</h2>
                <div className="inline-block bg-gray-100 px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-gray-600">หมายเลขนัด: </span>
                  <span className="text-lg font-bold text-blue-600">{appointmentData.appointmentNumber}</span>
                </div>
              </div>

              {/* QR Code Area (Mock) */}
              <div className="text-center mb-6">
                <div className="inline-block border-2 border-gray-300 p-4 rounded">
                  <div className="w-16 h-16 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs text-gray-500">QR Code</span>
                  </div>
                  <p className="text-xs text-gray-500">แสกนเพื่อเช็คอิน</p>
                </div>
              </div>

              {/* Patient Information */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">ชื่อผู้ป่วย:</span>
                  <span className="col-span-2 font-medium">{appointmentData.patientName}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">แพทย์:</span>
                  <span className="col-span-2 font-medium">{appointmentData.doctorName}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">แผนก:</span>
                  <span className="col-span-2 font-medium">{appointmentData.department}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">วันที่นัด:</span>
                  <span className="col-span-2 font-medium text-blue-600">{formatDate(appointmentData.appointmentDate)}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">เวลา:</span>
                  <span className="col-span-2 font-medium text-blue-600">{formatTime(appointmentData.appointmentTime)}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">หมายเลขคิว:</span>
                  <span className="col-span-2 font-bold text-lg text-green-600">{appointmentData.queueNumber}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-gray-600">เบอร์โทร:</span>
                  <span className="col-span-2 font-medium">{appointmentData.phone}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-yellow-800 mb-2">📋 ข้อปฏิบัติ:</h3>
                <p className="text-sm text-yellow-700">{appointmentData.instructions}</p>
              </div>

              {/* Status */}
              <div className="text-center mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  appointmentData.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointmentData.status === 'confirmed' ? '✅ ยืนยันการนัดหมาย' : '⏳ รอการยืนยัน'}
                </span>
              </div>

              {/* Print Info */}
              <div className="text-center text-xs text-gray-500 border-t pt-4">
                <p>พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</p>
                <p>กรุณาเก็บใบนัดหมายนี้ไว้และนำมาแสดงในวันนัดหมาย</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 print:hidden">
            <button 
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🖨️ พิมพ์ใบนัด
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

export default function AppointmentCard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 p-4">
        <PageHeader title="ใบนัดหมาย" showBackButton />
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
      <AppointmentCardContent />
    </Suspense>
  );
}
