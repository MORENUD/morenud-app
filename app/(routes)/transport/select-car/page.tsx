'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Swal from 'sweetalert2';
import { selectCarTexts } from './texts';
import { MapPin, Banknote } from 'lucide-react';

interface RouteInfo {
  pickupAddress: string;
  destinationAddress: string;
  distance: string;
  estimatedTime: string;
}

export default function SelectCar() {
  const router = useRouter();
  
  const [selectedCarType, setSelectedCarType] = useState('comfort');
  const [selectedCaregiver, setSelectedCaregiver] = useState('basic');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(() => {
    // Initialize from sessionStorage only on client side
    if (typeof window !== 'undefined') {
      const storedRoute = sessionStorage.getItem('rideRoute');
      if (storedRoute) {
        try {
          return JSON.parse(storedRoute);
        } catch (error) {
          console.error('Error parsing route info:', error);
        }
      }
    }
    return null;
  });

  const carTypes = selectCarTexts.carTypes;
  const caregiverTypes = selectCarTexts.caregiverTypes;

  const basePrice = carTypes[selectedCarType as keyof typeof carTypes]?.basePrice || 100;
  const caregiverFee = caregiverTypes[selectedCaregiver as keyof typeof caregiverTypes]?.fee || 0;
  const totalPrice = basePrice + caregiverFee;

  const handleContinue = async () => {
    if (!selectedCarType) {
      Swal.fire({
        title: selectCarTexts.alerts.selectCar.title,
        text: selectCarTexts.alerts.selectCar.text,
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!selectedCaregiver) {
      Swal.fire({
        title: selectCarTexts.alerts.selectCaregiver.title,
        text: selectCarTexts.alerts.selectCaregiver.text,
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    // Save booking info
    const bookingInfo = {
      carType: selectedCarType,
      caregiver: selectedCaregiver,
      basePrice,
      caregiverFee,
      totalPrice,
      timestamp: new Date().toISOString()
    };
    sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
    
    // Show success confirmation
    await Swal.fire({
      title: 'จองเรียบร้อย',
      text: 'ยืนยันการจองแล้ว',
      icon: 'success',
      confirmButtonColor: '#3b82f6'
    });

    // Redirect to home
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <PageHeader 
        title={selectCarTexts.title}
        showBackButton={true}
      />

      <div className="container max-w-md mx-auto px-6 py-8 space-y-6">
        
        {/* Route Summary */}
        {routeInfo && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {selectCarTexts.sections.route}
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex gap-3">
                <div className="text-lg">📍</div>
                <div className="flex-1 text-sm">
                  <p className="text-gray-600">{selectCarTexts.labels.from}: {routeInfo.pickupAddress}</p>
                  <p className="text-gray-600 mt-2">{selectCarTexts.labels.to}: {routeInfo.destinationAddress}</p>
                </div>
              </div>
              <div className="flex gap-4 pt-3 border-t border-gray-200">
                <div className="text-xs">
                  <p className="text-gray-600">{selectCarTexts.labels.distance}</p>
                  <p className="font-semibold text-gray-900">{routeInfo.distance}</p>
                </div>
                <div className="text-xs">
                  <p className="text-gray-600">{selectCarTexts.labels.estimatedTime}</p>
                  <p className="font-semibold text-gray-900">{routeInfo.estimatedTime}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Car Type Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="text-lg">🚗</span>
            {selectCarTexts.sections.carType}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(carTypes).map(([key, car]) => (
              <button
                key={key}
                onClick={() => setSelectedCarType(key)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedCarType === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{car.icon}</div>
                <h4 className="font-semibold text-sm text-gray-900">{car.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{car.description}</p>
                <p className="text-sm font-semibold text-blue-600 mt-2">฿{car.basePrice}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Caregiver Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="text-lg">👤</span>
            {selectCarTexts.sections.caregiver}
          </h3>
          <div className="space-y-2">
            {Object.entries(caregiverTypes).map(([key, caregiver]) => (
              <button
                key={key}
                onClick={() => setSelectedCaregiver(key)}
                className={`w-full p-4 rounded-lg border-2 transition text-left ${
                  selectedCaregiver === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{caregiver.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{caregiver.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedCaregiver === key
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedCaregiver === key && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-blue-600 mt-2">
                  {caregiver.fee > 0 ? `+฿${caregiver.fee}` : selectCarTexts.labels.noFee}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-600" />
            {selectCarTexts.sections.summary}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{selectCarTexts.labels.basePrice} ({carTypes[selectedCarType as keyof typeof carTypes]?.name}):</span>
              <span className="font-medium">฿{basePrice}</span>
            </div>
            {caregiverFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{selectCarTexts.labels.caregiverFee}:</span>
                <span className="font-medium">฿{caregiverFee}</span>
              </div>
            )}
            <div className="pt-2 border-t border-blue-200 flex justify-between">
              <span className="font-semibold text-gray-900">{selectCarTexts.labels.total}:</span>
              <span className="text-lg font-bold text-blue-600">฿{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => router.back()}
            className="flex-1 btn btn-outline"
          >
            {selectCarTexts.buttons.back}
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 btn btn-primary"
          >
            {selectCarTexts.buttons.continue}
          </button>
        </div>
      </div>
    </div>
  );
}
