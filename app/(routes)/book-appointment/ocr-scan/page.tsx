'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Swal from 'sweetalert2';
import { bookAppointmentTexts } from '../texts';

export default function OCRScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      await Swal.fire({
        title: 'ไม่สามารถเข้าถึงกล้องได้',
        text: 'กรุณาอนุญาตให้เข้าถึงกล้องหรือเลือกอัพโหลดรูปภาพแทน',
        icon: 'error',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageData);
        stopCamera();
        processImage(imageData);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'ไฟล์ไม่ถูกต้อง',
          text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#ef4444'
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'ไฟล์ใหญ่เกินไป',
          text: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#ef4444'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      console.log('Sending image to OCR API...');
      
      const response = await fetch('/api/appointments/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('OCR processing failed');
      }

      const result = await response.json();
      console.log('OCR Result:', result);

      if (result.success && result.data) {
        setExtractedData(result.data);
        
        // Show success and redirect to confirmation
        await Swal.fire({
          title: 'สแกนสำเร็จ!',
          text: 'กำลังนำคุณไปยืนยันข้อมูล',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirect to confirmation page with extracted data
        const queryParams = new URLSearchParams({
          data: JSON.stringify(result.data),
          source: 'ocr'
        }).toString();
        
        router.push(`/book-appointment/ocr-scan/confirm?${queryParams}`);
      } else {
        throw new Error('No data extracted');
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      await Swal.fire({
        title: bookAppointmentTexts.alerts.ocrError.title,
        text: bookAppointmentTexts.alerts.ocrError.text,
        icon: 'error',
        confirmButtonText: bookAppointmentTexts.alerts.ocrError.confirmButton,
        confirmButtonColor: '#ef4444'
      });
      setCapturedImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setExtractedData(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <PageHeader 
          title="สแกนใบนัดหมาย"
          showBackButton={true}
          className="bg-green-50"
        />

        <div className="p-6 space-y-4">
          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">คำแนะนำ</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• วางใบนัดหมายบนพื้นที่เรียบ</li>
                  <li>• ถ่ายในที่ที่มีแสงสว่างเพียงพอ</li>
                  <li>• ให้ใบนัดอยู่ในกรอบทั้งหมด</li>
                  <li>• หรืออัพโหลดรูปถ่ายที่มีอยู่แล้ว</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Camera View / Captured Image */}
          <div className="relative bg-black rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Overlay Guide */}
                    <div className="absolute inset-4 border-4 border-white border-dashed rounded-2xl opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-white text-center bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium">วางใบนัดหมายในกรอบ</p>
                      </div>
                    </div>
                  </div>
                )}

                {!cameraActive && !isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-lg font-medium">กล้องยังไม่เปิด</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={capturedImage}
                  alt="Captured appointment card"
                  className="w-full h-full object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                      <p className="text-lg font-medium">กำลังอ่านข้อมูล...</p>
                      <p className="text-sm opacity-75 mt-2">โปรดรอสักครู่</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="space-y-3">
            {!cameraActive && !capturedImage && !isProcessing && (
              <>
                <button
                  onClick={startCamera}
                  className="btn btn-primary w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {bookAppointmentTexts.buttons.startScan}
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white border-2 border-blue-300 text-blue-600 py-3 px-6 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  เลือกรูปจากอัลบั้ม
                </button>
              </>
            )}

            {cameraActive && !capturedImage && (
              <button
                onClick={captureImage}
                className="btn btn-primary w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                ถ่ายรูป
              </button>
            )}

            {capturedImage && !isProcessing && (
              <button
                onClick={retake}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {bookAppointmentTexts.buttons.retakeScan}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
