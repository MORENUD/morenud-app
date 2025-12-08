'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Search } from 'lucide-react';

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
}

interface SearchResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const defaultCenter = {
  lat: 12.8245,
  lng: 100.9263
};

export default function MapPicker({ 
  onLocationSelect, 
  onClose, 
  initialLat = defaultCenter.lat,
  initialLng = defaultCenter.lng 
}: MapPickerProps) {
  const [center, setCenter] = useState({
    lat: initialLat,
    lng: initialLng
  });
  const [markerPosition, setMarkerPosition] = useState({
    lat: initialLat,
    lng: initialLng
  });
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // Initialize autocomplete service
  useEffect(() => {
    if (isLoaded) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      
      setMarkerPosition({ lat, lng });
      setCenter({ lat, lng });
      
      // Get address from coordinates
      setIsLoadingAddress(true);
      try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat, lng } });
        
        if (response.results && response.results[0]) {
          const address = response.results[0].formatted_address;
          setSelectedAddress(address);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setSelectedAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
      setIsLoadingAddress(false);
    }
  }, []);

  const handleConfirm = () => {
    onLocationSelect(markerPosition.lat, markerPosition.lng, selectedAddress || `${markerPosition.lat.toFixed(4)}, ${markerPosition.lng.toFixed(4)}`);
    onClose();
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim() || !autocompleteServiceRef.current) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const predictions = await autocompleteServiceRef.current.getPlacePredictions({
        input: query,
        componentRestrictions: { country: 'th' },
        location: new google.maps.LatLng(center.lat, center.lng),
        radius: 50000
      });

      if (predictions.predictions && predictions.predictions.length > 0) {
        // Get details for each prediction
        const placesService = new google.maps.places.PlacesService(
          document.createElement('div')
        );

        const detailedResults: SearchResult[] = [];

        for (const prediction of predictions.predictions.slice(0, 5)) {
          try {
            const details = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
              placesService.getDetails(
                { placeId: prediction.place_id },
                (result, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                    resolve(result);
                  } else {
                    reject(new Error(status));
                  }
                }
              );
            });

            if (details.geometry?.location) {
              detailedResults.push({
                name: prediction.structured_formatting?.main_text || prediction.description,
                address: prediction.description,
                lat: details.geometry.location.lat(),
                lng: details.geometry.location.lng()
              });
            }
          } catch (error) {
            console.error('Error getting place details:', error);
          }
        }

        setSearchResults(detailedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsSearching(false);
  }, [center]);

  const handleSelectSearchResult = (result: SearchResult) => {
    setMarkerPosition({ lat: result.lat, lng: result.lng });
    setCenter({ lat: result.lat, lng: result.lng });
    setSelectedAddress(result.address);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100">
        <p className="text-gray-600">กำลังโหลดแผนที่...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="space-y-3 relative z-30">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาสถานที่... (โรงพยาบาล, คลินิก)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => handleSelectSearchResult(result)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
              >
                <div className="font-medium text-sm text-gray-900">{result.name}</div>
                <div className="text-xs text-gray-600 mt-1">{result.address}</div>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <div className="text-sm text-gray-600 px-3 py-2">
            ⏳ กำลังค้นหา...
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
          👆 คลิกบนแผนที่เพื่อเลือกตำแหน่งรับส่ง หรือใช้ค้นหาด้านบน
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden rounded-lg">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={15}
          onClick={handleMapClick}
          options={{
            scrollwheel: true,
            zoomControl: true,
            fullscreenControl: true,
            streetViewControl: false
          }}
        >
          <Marker
            position={markerPosition}
            title="ตำแหน่งที่เลือก"
          />
        </GoogleMap>
      </div>

      <div className="space-y-4 max-h-32 overflow-y-auto">
        <div className="text-sm text-gray-600">
          📍 {markerPosition.lat.toFixed(4)}, {markerPosition.lng.toFixed(4)}
        </div>

        {selectedAddress && (
          <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800 border border-green-200">
            ✓ {selectedAddress}
          </div>
        )}

        {isLoadingAddress && (
          <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            ⏳ กำลังค้นหาที่อยู่...
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 btn btn-outline"
        >
          ยกเลิก
        </button>
        <button
          ref={confirmButtonRef}
          type="button"
          onClick={handleConfirm}
          disabled={!selectedAddress}
          className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
}
