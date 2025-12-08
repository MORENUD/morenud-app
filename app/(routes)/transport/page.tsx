'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import MapPicker from '@/components/MapPicker';
import Swal from 'sweetalert2';
import { transportTexts } from './texts';
import { MapPin, Phone, Loader } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Destination {
  id: string;
  name: string;
  address: string;
  type: 'hospital' | 'clinic' | 'medicalCenter';
  latitude: number;
  longitude: number;
}

// Sample medical destinations
const MEDICAL_DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'โรงพยาบาลกรุงเทพ',
    address: '2 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย จ.กรุงเทพมหานคร',
    type: 'hospital',
    latitude: 12.8245,
    longitude: 100.9263
  },
  {
    id: '2',
    name: 'คลินิกเวชศาสตร์ฟื้นฟู',
    address: 'สุขสวัสดิ์ ซ.2 แขวงม่วงแม่ต เขตสัตหีบ จ.ชลบุรี',
    type: 'clinic',
    latitude: 12.8250,
    longitude: 100.9270
  },
  {
    id: '3',
    name: 'ศูนย์สุขภาพประชุมชน',
    address: '123 ถนนเมืองชลบุรี แขวงป่าแงม เขตเมืองชลบุรี จ.ชลบุรี',
    type: 'medicalCenter',
    latitude: 12.6673,
    longitude: 101.0901
  }
];

export default function Transport() {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showLocationConfirm, setShowLocationConfirm] = useState(false);
  const [showMapSelection, setShowMapSelection] = useState(false);

  // Initialize Google Maps API once
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'ตำแหน่งปัจจุบัน'
          };
          setCurrentLocation(location);
          setShowLocationConfirm(true);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          Swal.fire({
            title: transportTexts.alerts.locationError.title,
            text: transportTexts.alerts.locationError.text,
            icon: 'error',
            confirmButtonText: transportTexts.alerts.locationError.confirmButton,
            confirmButtonColor: '#ef4444'
          });
          setIsLoadingLocation(false);
        }
      );
    } else {
      Swal.fire({
        title: transportTexts.alerts.locationError.title,
        text: 'เบราว์เซอร์ของคุณไม่รองรับ Geolocation',
        icon: 'error',
        confirmButtonText: transportTexts.alerts.locationError.confirmButton,
        confirmButtonColor: '#ef4444'
      });
      setIsLoadingLocation(false);
    }
  };

  const handleCallRide = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentLocation) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: 'กรุณาเลือกจุดรับส่ง',
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!selectedDestination) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: transportTexts.messages.selectingDestination,
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!phone.trim()) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: 'กรุณากรอกเบอร์โทรศัพท์',
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: transportTexts.alerts.confirmation.title,
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>จุดรับส่ง:</strong> ${currentLocation.address}</p>
          <p><strong>ปลายทาง:</strong> ${selectedDestination.name}</p>
          <p style="font-size: 0.9em; color: #666;">${selectedDestination.address}</p>
          <p><strong>เบอร์ติดต่อ:</strong> ${phone}</p>
          ${note ? `<p><strong>หมายเหตุ:</strong> ${note}</p>` : ''}
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: transportTexts.alerts.confirmation.confirmButton,
      cancelButtonText: transportTexts.alerts.confirmation.cancelButton,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        // Prepare ride request data
        const rideData = {
          pickupLocation: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            address: currentLocation.address
          },
          destination: {
            id: selectedDestination.id,
            name: selectedDestination.name,
            address: selectedDestination.address,
            latitude: selectedDestination.latitude,
            longitude: selectedDestination.longitude,
            type: selectedDestination.type
          },
          phone: phone.trim(),
          note: note.trim(),
          purpose: 'medical',
          timestamp: new Date().toISOString()
        };

        // Log for now (would call API in production)
        console.log('Ride request data:', rideData);

        // Redirect to car selection page
        setPhone('');
        setNote('');
        setSelectedDestination(null);
        router.push('/transport/select-car');
      } catch (error) {
        console.error('Error calling ride:', error);
        Swal.fire({
          title: transportTexts.alerts.error.title,
          text: transportTexts.alerts.error.text,
          icon: 'error',
          confirmButtonText: transportTexts.alerts.error.confirmButton,
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  // Mini map component to show current location
  const LocationMap = ({ lat, lng }: { lat: number; lng: number }) => {
    if (!isLoaded) {
      return <div className="w-full h-full bg-gray-100 flex items-center justify-center">กำลังโหลดแผนที่...</div>;
    }

    return (
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat, lng }}
        zoom={16}
        options={{
          scrollwheel: false,
          zoomControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false
        }}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      <PageHeader 
        title={transportTexts.title} 
        showBackButton={true}
      />

      <div className="container max-w-md mx-auto px-6 py-8">
        
        {/* Location Confirmation Modal */}
        {showLocationConfirm && currentLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 space-y-4 h-[85vh] flex flex-col">
              <h3 className="text-lg font-bold text-gray-900">
                {transportTexts.labels.currentLocation}
              </h3>
              
              {/* Mini Map */}
              <div className="flex-1 rounded-lg overflow-hidden border border-gray-200">
                <LocationMap 
                  lat={currentLocation.latitude} 
                  lng={currentLocation.longitude}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{currentLocation.address}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  📍 {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLocationConfirm(false);
                    setShowMapSelection(true);
                  }}
                  className="flex-1 btn btn-outline"
                >
                  {transportTexts.buttons.changeLocation}
                </button>
                <button
                  onClick={() => setShowLocationConfirm(false)}
                  className="flex-1 btn btn-primary"
                >
                  {transportTexts.buttons.useLocation}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Selection Modal */}
        {showMapSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 h-[95vh] flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {transportTexts.labels.selectFromMap}
              </h3>
              <div className="flex-1 flex flex-col overflow-hidden">
                <MapPicker
                  initialLat={currentLocation?.latitude}
                  initialLng={currentLocation?.longitude}
                  onLocationSelect={(lat: number, lng: number, address: string) => {
                    setCurrentLocation({
                      latitude: lat,
                      longitude: lng,
                      address: address
                    });
                    setShowMapSelection(false);
                  }}
                  onClose={() => setShowMapSelection(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleCallRide} className="space-y-6">
          
          {/* Pickup Location Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {transportTexts.sections.pickupLocation}
            </h3>
            
            {isLoadingLocation ? (
              <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-gray-700">{transportTexts.messages.gettingLocation}</span>
              </div>
            ) : currentLocation ? (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <span>{currentLocation.address}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    📍 {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMapSelection(true)}
                  className="w-full px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                >
                  📍 {transportTexts.buttons.changeLocation}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-full p-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {transportTexts.buttons.useLocation}
              </button>
            )}
          </div>

          {/* Destination Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              {transportTexts.sections.destination}
            </h3>
            
            <div className="space-y-2">
              {MEDICAL_DESTINATIONS.map((destination) => (
                <div
                  key={destination.id}
                  onClick={() => setSelectedDestination(destination)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedDestination?.id === destination.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{destination.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{destination.address}</p>
                      <span className={`inline-block text-xs font-medium mt-2 px-2 py-1 rounded ${
                        destination.type === 'hospital' ? 'bg-red-100 text-red-700' :
                        destination.type === 'clinic' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {destination.type === 'hospital' ? '🏥 โรงพยาบาล' :
                         destination.type === 'clinic' ? '🏨 คลินิก' :
                         '💚 ศูนย์สุขภาพ'}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedDestination?.id === destination.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedDestination?.id === destination.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              {transportTexts.sections.rideDetails}
            </h3>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {transportTexts.labels.phone} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={transportTexts.placeholders.phone}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {transportTexts.labels.note}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={transportTexts.placeholders.note}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn btn-outline"
            >
              {transportTexts.buttons.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
            >
              {transportTexts.buttons.callRide}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
