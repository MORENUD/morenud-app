'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบข้อมูลผู้ใช้ใน localStorage
    const checkUserData = () => {
      try {
        // ตรวจสอบข้อมูลจากหลายแหล่ง
        const userData = localStorage.getItem('userData');
        
        // ถ้ามีข้อมูลผู้ใช้อย่างใดอย่างหนึ่ง ให้ไปหน้า home
        if (userData) {
          router.replace('/home');
        } else {
          // ถ้าไม่มีข้อมูลผู้ใช้ ให้ไปหน้า login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error checking user data:', error);
        // ถ้าเกิดข้อผิดพลาด ให้ไปหน้า login เป็นค่าเริ่มต้น
        router.replace('/login');
      }
    };

    checkUserData();
  }, [router]);

  // แสดง loading screen ระหว่างที่ตรวจสอบและเปลี่ยนเส้นทาง
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg">กำลังโหลด...</p>
      </div>
    </div>
  );
}
