'use client';

import { useEffect } from 'react';
import Swal from 'sweetalert2';
import AppointmentCard from '../../../../components/AppointmentCard';
import AppointmentCalendar from '../../../../components/AppointmentCalendar';
import CategoryCard from '../../../../components/CategoryCard';
import Image from 'next/image';
import Link from 'next/link';
import appointmentImage from '../../../../public/pic/appointment.png';

// import appointmentImage from '../../../public/pic/appointment.png';
import chatBotImage from '../../../../public/pic/chat-bot.png';
import transportImage from '../../../../public/pic/rental-car.png';
import healthImage from '../../../../public/pic/health.png';
import stethoscopeImage from '../../../../public/pic/stethoscope.png';
import { homeTexts, mockCategories, mockAppointments } from './texts';

// Types for user data management
interface ScanResult {
  id?: string;
  status?: string;
  message?: string;
  data?: Record<string, unknown>;
  name?: string;
  disease?: string;
  appointment_day?: number;
}

interface UserScanData {
  scanResult?: ScanResult;
  capturedImage?: string;
  scanStatus: 'pending' | 'completed' | 'failed';
  uploadTimestamp: string;
  scanTimestamp: string;
  scanDate: string;
  name?: string;
}

// Helper function to get user data
const getUserScanData = (): UserScanData | null => {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem('userScanData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user scan data:', error);
    return null;
  }
};



export default function HomePage() {
  // Check for appointment notification on component mount
  useEffect(() => {
    const checkAppointment = () => {
      const userData = getUserScanData();

      if (userData?.scanResult?.appointment_day && userData.scanResult.appointment_day > 0) {
        const appointmentDays = userData.scanResult.appointment_day;
        const userName = userData.scanResult.name || userData.name || homeTexts.notification.defaultUserName;

        // Check if notification was already shown today
        const notificationKey = `appointment_notification_${userData.scanResult.id || 'default'}_${new Date().toDateString()}`;
        const hasShownToday = localStorage.getItem(notificationKey);

        if (!hasShownToday) {
          Swal.fire({
            title: homeTexts.notification.title,
            html: `
              <div class="text-left">
                <p class="text-lg mb-2">${homeTexts.notification.greeting} <strong>${userName}</strong></p>
                <p>${homeTexts.notification.appointmentMessage} <strong class="text-blue-600">${appointmentDays} ${homeTexts.notification.daysText}</strong></p>
                <p class="mt-2 text-sm text-gray-600">${homeTexts.notification.prepareMessage}</p>
              </div>
            `,
            icon: 'info',
            confirmButtonText: homeTexts.notification.confirmButton,
            confirmButtonColor: '#8B5CF6',
            background: '#ffffff',
            customClass: {
              popup: 'rounded-xl',
              title: 'text-xl font-semibold text-gray-800',
              htmlContainer: 'text-gray-700'
            }
          });

          // Mark notification as shown for today
          localStorage.setItem(notificationKey, 'true');
        }
      }
    };

    checkAppointment();
  }, []);

  return (
    <>

      {/* Search Bar */}
      {/* <div className="px-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search doctor..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full mb-1"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
              </div>
            </div>
          </div>
        </div> */}

      {/* MORENUD Banner */}
      <div className="mx-6 mb-8">
        <div className="bg-linear-to-r from-purple-400 to-purple-500 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">
                {homeTexts.banner.title}
              </h3>
              <p className="text-purple-100 text-sm leading-relaxed">
                {homeTexts.banner.description}
              </p>
            </div>
            <div className="shrink-0 ml-4">
              <Image
                src={stethoscopeImage}
                alt={homeTexts.altText.stethoscope}
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{homeTexts.sections.categories}</h3>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {mockCategories.map((category) => {
            const categoryImage = category.id === 1 ? healthImage :
              category.id === 2 ? transportImage :
                category.id === 3 ? appointmentImage : chatBotImage;
            return (
              <Link key={category.id} href={category.link}>
                <CategoryCard
                  name={homeTexts.categories[category.nameKey]}
                  bgColor={category.bgColor}
                  iconColor={category.iconColor}
                  iconShape={category.iconShape}
                  image={categoryImage}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Upcoming appointments */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{homeTexts.sections.upcomingAppointments}</h3>
        </div>

        <AppointmentCalendar
          appointments={mockAppointments}
          dateTimeTexts={homeTexts.dateTime}
          specialties={homeTexts.specialties}
        />
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </>
  );
}
