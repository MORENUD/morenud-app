'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Swal from 'sweetalert2';
import { bookAppointmentTexts } from './texts';

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    patientName: '',
    pickupDate: '',
    pickupTime: '',
    phone: '',
    pickupAddress: '',
    destinationAddress: '',
    comment: ''
  });

  // Load datetime from query params on mount
  useEffect(() => {
    const datetimeParam = searchParams.get('datetime');
    if (datetimeParam) {
      try {
        const date = new Date(datetimeParam);
        if (!isNaN(date.getTime())) {
          const isoString = date.toISOString();
          const dateStr = isoString.split('T')[0];
          const timeStr = isoString.split('T')[1]?.substring(0, 5) || '';
          
          setFormData(prev => ({
            ...prev,
            pickupDate: dateStr,
            pickupTime: timeStr
          }));
        }
      } catch {
        // Invalid datetime, skip
      }
    }
  }, [searchParams]);

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
        console.log('Caregiver schedule data:', formData);
        
        // Create caregiver schedule via API
        const response = await fetch('/api/appointments/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to create caregiver schedule');
        }

        const result = await response.json();
        const bookingId = result.data.id;
        
        console.log('Caregiver schedule created with ID:', bookingId);

        // Show success message
        await Swal.fire({
          title: bookAppointmentTexts.alerts.success.title,
          text: bookAppointmentTexts.alerts.success.text,
          icon: 'success',
          confirmButtonText: bookAppointmentTexts.alerts.success.confirmButton,
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          window.location.href = `/caregiver/book-appointment/card?id=${bookingId}`; 
        });

        // Reset form after successful booking
        setFormData({
          patientName: '',
          pickupDate: '',
          pickupTime: '',
          phone: '',
          pickupAddress: '',
          destinationAddress: '',
          comment: ''
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto bg-white min-h-screen">
        {/* Header */}
        <PageHeader 
          title={bookAppointmentTexts.pageTitle} 
          showBackButton={true}
          className="bg-blue-50"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.patientName}
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.patientName}
              className="w-full input"
              required
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Pickup Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {bookAppointmentTexts.labels.pickupDate}
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  min={today}
                  className="w-full input"
                  required
                />
              </div>
            </div>
            {/* Pickup Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {bookAppointmentTexts.labels.pickupTime}
              </label>
              <select
                name="pickupTime"
                value={formData.pickupTime}
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

          {/* Pickup Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.pickupAddress}
            </label>
            <textarea
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.pickupAddress}
              className="w-full input min-h-20 resize-none"
              required
            />
          </div>

          {/* Destination Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.destinationAddress}
            </label>
            <textarea
              name="destinationAddress"
              value={formData.destinationAddress}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.destinationAddress}
              className="w-full input min-h-20 resize-none"
              required
            />
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

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookAppointmentTexts.labels.comment}
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder={bookAppointmentTexts.placeholders.comment}
              className="w-full input min-h-24 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            {bookAppointmentTexts.buttons.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookAppointment() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BookAppointmentContent />
    </Suspense>
  );
}
