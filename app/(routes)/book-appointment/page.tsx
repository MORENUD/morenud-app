'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { bookAppointmentTexts } from './texts';

function BookAppointmentContent() {
  const router = useRouter();

  const handleManualEntry = () => {
    router.push('/book-appointment/manual');
  };

  const handleOCRScan = () => {
    router.push('/book-appointment/ocr-scan');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <PageHeader 
          title={bookAppointmentTexts.pageTitle} 
          showBackButton={true}
          className="bg-blue-50"
        />

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {bookAppointmentTexts.selectMethod.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {bookAppointmentTexts.selectMethod.subtitle}
            </p>
          </div>

          {/* Manual Entry Card */}
          <button
            onClick={handleManualEntry}
            className="w-full bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {bookAppointmentTexts.selectMethod.manual.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {bookAppointmentTexts.selectMethod.manual.description}
                </p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* OCR Scan Card */}
          <button
            onClick={handleOCRScan}
            className="w-full bg-white border-2 border-green-200 hover:border-green-400 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {bookAppointmentTexts.selectMethod.ocr.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {bookAppointmentTexts.selectMethod.ocr.description}
                </p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
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
