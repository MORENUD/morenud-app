'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import AppointmentListCard from '@/components/AppointmentListCard';
import AppointmentCaregiverListCard from '@/components/AppointmentCaregiverListCard';

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

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/appointments');
      
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลรายการนัดหมายได้');
      }
      
      const result = await response.json();
      setAppointments(result.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลรายการนัดหมาย');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAppointment = (appointmentId: string) => {
    router.push(`/book-appointment/card?id=${appointmentId}`);
  };

  const handleNewAppointment = () => {
    router.push('/book-appointment');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <PageHeader title="รายการใบนัดหมาย" showBackButton={true} className="bg-blue-50" />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <PageHeader title="รายการใบนัดหมาย" showBackButton={true} className="bg-blue-50" />
          <div className="p-6 text-center">
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchAppointments}
              className="btn btn-primary mb-2"
            >
              ลองใหม่
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
        <PageHeader 
          title="รายการใบนัดหมาย" 
          showBackButton={true} 
          className="bg-blue-50"
        />

        {/* Content */}
        <div className="p-4">
          {/* Appointments List */}
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">ยังไม่มีการนัดหมาย</h3>
              <p className="text-gray-500 mb-6">เริ่มต้นด้วยการจองนัดหมายแพทย์</p>
              <button
                onClick={handleNewAppointment}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                จองนัดหมายเลย
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCaregiverListCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={handleViewAppointment}
                />
              ))}
            </div>
          )}

          {/* Summary */}
          {/* {appointments.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-blue-600">
                  รวมทั้งหมด <span className="font-bold">{appointments.length}</span> การนัดหมาย
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
