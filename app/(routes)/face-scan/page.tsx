'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { faceScanTexts } from './texts';
import PageHeader from '../../../components/PageHeader';

// Types for user data management
interface ScanResult {
  id?: string;
  status?: string;
  message?: string;
  data?: Record<string, unknown>;
}

interface UserScanData {
  scanResult?: ScanResult;
  capturedImage?: string;
  scanStatus: 'pending' | 'completed' | 'failed';
  uploadTimestamp: string;
  scanTimestamp: string;
  scanDate: string;
}

// Helper functions for user data management
const saveUserScanData = (data: Partial<UserScanData>) => {
  try {
    localStorage.setItem('userScanData', JSON.stringify({
      ...data,
      scanTimestamp: new Date().toISOString(),
      scanDate: new Date().toLocaleDateString('th-TH')
    }));
    console.log('User scan data saved successfully');
  } catch (error) {
    console.error('Error saving user scan data:', error);
  }
};

export const getUserScanData = (): UserScanData | null => {
  try {
    const data = localStorage.getItem('userScanData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user scan data:', error);
    return null;
  }
};

export const clearUserScanData = () => {
  try {
    localStorage.removeItem('userScanData');
    console.log('User scan data cleared');
  } catch (error) {
    console.error('Error clearing user scan data:', error);
  }
};

export default function FaceScanPage() {
  const router = useRouter(); // Will be used for navigation after scan
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      setError(faceScanTexts.cameraError);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    const initCamera = async () => {
      await startCamera();
    };
    initCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const captureImageAsBase64 = (): Promise<string> => {
    return new Promise((resolve) => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Flip the image horizontally to match the mirror effect
          ctx.scale(-1, 1);
          ctx.drawImage(video, -canvas.width, 0);
          
          // Convert to base64
          const base64String = canvas.toDataURL('image/jpeg', 0.8);
          resolve(base64String);
        }
      }
      resolve('');
    });
  };

  const startScan = async () => {
    if (!isCameraReady) return;
    
    try {
      // Start photo capture phase
      setIsScanning(true);
      setScanProgress(0);
      setScanComplete(false);
      setError('');

      // Quick progress animation for taking photo
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 20;
        });
      }, 100);

      // Wait for progress animation and capture image
      setTimeout(async () => {
        const base64Image = await captureImageAsBase64();
        if (base64Image) {
          setCapturedImage(base64Image);
          setIsScanning(false);
          setScanComplete(true);
          
          // Send image to server immediately after capture
          await sendImageToServer(base64Image);
        } else {
          setError('Failed to capture image');
          setIsScanning(false);
        }
      }, 500);
      
    } catch (err) {
      console.error('Error during scan:', err);
      setError('เกิดข้อผิดพลาดในการถ่ายรูป');
      setIsScanning(false);
    }
  };


  //edit later
  const sendImageToServer = async (base64Image: string) => {
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      setError('');
      
      
      const response = await fetch('/api/face-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Image sent successfully:', result);
        
        // Save user scan data to localStorage
        saveUserScanData({
          scanResult: result,
        });
        
        setUploadSuccess(true);
        
        // Auto redirect after successful upload
        setTimeout(() => {
          router.push('/home');
        }, 2000);

      } else {
        const errorData = await response.json();
        console.error('Failed to send image to server:', errorData);
        setError(faceScanTexts.uploadError);
      }
    } catch (error) {
      console.error('Error sending image:', error);
      setError(faceScanTexts.uploadError);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      setError(faceScanTexts.fileUploadError);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(faceScanTexts.fileSizeError);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64String = e.target?.result as string;
      if (base64String) {
        setCapturedImage(base64String);
        console.log('File uploaded as base64:', base64String.substring(0, 100) + '...');
        
        // Show success state and send to server
        setScanComplete(true);
        setError('');
        
        // Send image to server
        await sendImageToServer(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const retryCamera = () => {
    setError('');
    setIsCameraReady(false);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <PageHeader 
        title={faceScanTexts.pageTitle}
        backButtonText={faceScanTexts.backButton}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          
          {/* Instructions */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{faceScanTexts.mainTitle}</h2>
            <p className="text-gray-600">
              {faceScanTexts.mainDescription}
            </p>
          </div>

          {/* Camera Container */}
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-square relative">
              {error ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-center p-6">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={retryCamera}
                    className="btn btn-primary btn-sm"
                  >
                    {faceScanTexts.retryButton}
                  </button>
                </div>
              ) : (
                <>
                  {/* Video Stream */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }} // Mirror effect
                  />

                  {/* Face Detection Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`relative w-48 h-48 border-4 rounded-full transition-all duration-300 ${
                      uploadSuccess 
                        ? 'border-green-500 shadow-lg shadow-green-500/30' 
                        : (isUploading || scanComplete)
                        ? 'border-blue-500 shadow-lg shadow-blue-500/30' 
                        : isScanning 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/30' 
                        : 'border-white/70'
                    }`}>
                      
                      {/* Corner Guides */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
                      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl"></div>

                      {/* Center Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {uploadSuccess ? (
                          <div className="text-green-500">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : isUploading ? (
                          <div className="text-blue-500">
                            <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                        ) : (scanComplete && capturedImage) ? (
                          <div className="text-blue-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                          </div>
                        ) : isScanning ? (
                          <div className="text-blue-500">
                            <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                        ) : (
                          <div className="text-white/70">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scanning Progress */}
                  {isScanning && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 rounded-lg p-3">
                        <div className="flex items-center justify-between text-white text-sm mb-2">
                          <span>{faceScanTexts.takingPhoto}</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Uploading Progress */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                      <div className="bg-white/95 rounded-xl p-6 text-center shadow-lg">
                        <div className="text-blue-500 mb-2">
                          <svg className="w-12 h-12 mx-auto animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{faceScanTexts.uploadingImage}</h3>
                        <p className="text-gray-600 text-sm">{faceScanTexts.processingImage}</p>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {uploadSuccess && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <div className="bg-white/95 rounded-xl p-6 text-center shadow-lg">
                        <div className="text-green-500 mb-2">
                          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">{faceScanTexts.uploadSuccess}</h3>
                        <p className="text-gray-600 text-sm">{faceScanTexts.redirecting}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center space-y-4">
            <button
              onClick={startScan}
              disabled={!isCameraReady || isScanning || isUploading || uploadSuccess || !!error}
              className={`btn btn-lg w-full ${
                uploadSuccess 
                  ? 'btn-success' 
                  : 'btn-primary'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {uploadSuccess ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {faceScanTexts.uploadSuccess}
                </>
              ) : isUploading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  {faceScanTexts.uploadingImage}
                </>
              ) : isScanning ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  {faceScanTexts.takingPhoto}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {faceScanTexts.startScanButton}
                </>
              )}
            </button>

            {/* File Upload Button */}
            {!isScanning && !isUploading && !uploadSuccess && (
              <button
                onClick={triggerFileUpload}
                disabled={!!error}
                className="btn btn-outline btn-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {faceScanTexts.captureButton}
              </button>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {/* Tips */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>{faceScanTexts.tipsTitle}</p>
              <ul className="space-y-1">
                {faceScanTexts.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for image processing */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
}
