'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Swal from 'sweetalert2';
import { bookAppointmentTexts } from '../../texts';

function OCRConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    hn: '',
    confirmationStatus: 'confirmed', // Always confirmed for OCR
    doctorName: '',
    department: '',
    hospital: '',
    queueNumber: '',
    appointmentDate: '',
    appointmentTime: '',
    phone: '',
    address: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from query params
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const data = JSON.parse(dataParam);
        setFormData(prev => ({
          ...prev,
          ...data,
          confirmationStatus: 'confirmed' // Force confirmed for OCR
        }));
      } catch (error) {
        console.error('Error parsing OCR data:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลได้',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#ef4444'
        }).then(() => {
          router.push('/book-appointment');
        });
      }
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show confirmation dialog first
    const result = await Swal.fire({
      title: bookAppointmentTexts.alerts.confirmation.title,
      text: bookAppointmentTexts.alerts.confirmation.text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: bookAppointmentTexts.alerts.confirmation.confirmButton,
      cancelButtonText: bookAppointmentTexts.alerts.confirmation.cancelButton,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444'
    });

    // If user confirms, proceed with booking
    if (result.isConfirmed) {
      try {
        console.log('Appointment data from OCR:', formData);
        
        // Create appointment via API
        const response = await fetch('/api/appointments/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, source: 'ocr' })
        });

        if (!response.ok) {
          throw new Error('Failed to create appointment');
        }

        const result = await response.json();
        const appointmentId = result.data.id;
        
        console.log('Appointment created with ID:', appointmentId);

        // Show success message
        await Swal.fire({
          title: bookAppointmentTexts.alerts.success.title,
          text: bookAppointmentTexts.alerts.success.text,
          icon: 'success',
          confirmButtonText: bookAppointmentTexts.alerts.success.confirmButton,
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          window.location.href = `/book-appointment/card?id=${appointmentId}`; 
        });

      } catch {
        // Show error message if something goes wrong
        await Swal.fire({
          title: bookAppointmentTexts.alerts.error.title,
          text: bookAppointmentTexts.alerts.error.text,
          icon: 'error',
          confirmButtonText: bookAppointmentTexts.alerts.error.confirmButton,
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <PageHeader 
            title="ยืนยันข้อมูล"
            showBackButton={true}
            className="bg-green-50"
          />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          title="ยืนยันข้อมูล"
          showBackButton={true}
          className="bg-green-50"
        />

        {/* Info Banner */}
        <div className="p-4">
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-green-900 mb-1">อ่านข้อมูลสำเร็จ</h3>
                <p className="text-sm text-green-800">
                  กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนยืนยัน คุณสามารถแก้ไขข้อมูลได้
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* HN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.hn}
            </label>
            <input
              type="text"
              name="hn"
              value={formData.hn}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.hn}
              className="w-full input"
              required
            />
          </div>

          {/* Confirmation Status - Display Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.confirmationStatus}
            </label>
            <div className="w-full bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">
                {bookAppointmentTexts.confirmationStatus.confirmed}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ใบนัดที่สแกนจากโรงพยาบาลถือว่ายืนยันแล้วโดยอัตโนมัติ
            </p>
          </div>

          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.doctorName}
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.doctorName}
              className="w-full input"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.department}
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.department}
              className="w-full input"
              required
            />
          </div>

          {/* Hospital */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.hospital}
            </label>
            <input
              type="text"
              name="hospital"
              value={formData.hospital}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.hospital}
              className="w-full input"
              required
            />
          </div>

          {/* Queue Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.queueNumber}
            </label>
            <input
              type="text"
              name="queueNumber"
              value={formData.queueNumber}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.queueNumber}
              className="w-full input"
              required
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Appointment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {bookAppointmentTexts.labels.appointmentDate}
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="w-full input"
                  required
                />
              </div>
            </div>
            {/* Appointment Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {bookAppointmentTexts.labels.appointmentTime}
              </label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                className="select"
                required
              >
                <option value="">{bookAppointmentTexts.placeholders.selectTime}</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.phone}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.phone}
              className="w-full input"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.address}
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.address}
              className="w-full input"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full bg-green-600 hover:bg-green-700"
          >
            {bookAppointmentTexts.buttons.confirmOCR}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OCRConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    }>
      <OCRConfirmContent />
    </Suspense>
  );
}
