'use client';

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

interface Appointment {
  id: number;
  doctor: string;
  specialtyKey: string;
  dateKey?: string;
  time: string;
  timeFormat: string;
  status: string;
  isUrgent: boolean;
  date?: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  dateTimeTexts: Record<string, string>;
  specialties: Record<string, string>;
}

export default function AppointmentCalendar({
  appointments,
  dateTimeTexts,
  specialties,
}: AppointmentCalendarProps) {
  // Helper function to convert time to 24-hour format
  const convertTo24HourFormat = (time: string, timeFormat: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    
    // If it's "pm" (บ.) and hours is not 12, add 12
    // If it's "am" (น.) and hours is 12, set to 0
    if (timeFormat === 'pm' || timeFormat === 'บ.') {
      if (hours !== 12) {
        return `${String(hours + 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
    } else if (timeFormat === 'am' || timeFormat === 'น.') {
      if (hours === 12) {
        return `00:${String(minutes).padStart(2, '0')}`;
      }
    }
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Helper function to convert Thai date to actual date
  const parseThaiDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    // Handle "tomorrow" - set to tomorrow's date
    if (dateString === 'พรุ่งนี้') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    // Try to parse Thai date format (e.g., "9 ธ.ค. 2568")
    const thaiMonths: Record<string, number> = {
      'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
      'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12
    };

    const parts = dateString.split(' ');
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const monthStr = parts[1];
      const yearThai = parseInt(parts[2]);

      const month = thaiMonths[monthStr];
      if (month && day && yearThai) {
        // Convert Thai year to Gregorian (Thai year is 543 years ahead)
        const year = yearThai - 543;
        return new Date(year, month - 1, day);
      }
    }

    return null;
  };

  // Convert appointments to FullCalendar events
  const events = appointments.map((appointment) => {
    const displayDate = appointment.dateKey
      ? dateTimeTexts[appointment.dateKey]
      : appointment.date;

    const specialtyName = specialties[appointment.specialtyKey] || appointment.specialtyKey;
    const eventDate = displayDate ? parseThaiDate(displayDate) : null;

    return {
      id: appointment.id.toString(),
      title: `${appointment.doctor}`,
      start: eventDate ? eventDate.toISOString().split('T')[0] : displayDate,
      extendedProps: {
        doctor: appointment.doctor,
        specialty: specialtyName,
        time: appointment.time,
        timeFormat: appointment.timeFormat,
        status: appointment.status,
        isUrgent: appointment.isUrgent,
      },
      backgroundColor: appointment.isUrgent ? '#EF4444' : '#8B5CF6',
      borderColor: appointment.isUrgent ? '#DC2626' : '#7C3AED',
    };
  });

  return (
    <div className="bg-white rounded-lg p-2 sm:p-4 shadow-sm overflow-hidden">
      <style>{`
        .fc {
          font-size: 0.875rem;
        }
        
        @media (max-width: 640px) {
          .fc {
            font-size: 0.75rem;
          }
          
          .fc .fc-button-primary {
            padding: 0.25rem 0.5rem;
            font-size: 0.65rem;
          }
          
          .fc .fc-col-header-cell {
            padding: 4px 2px !important;
          }
          
          .fc .fc-daygrid-day-number {
            padding: 4px 2px;
            font-size: 0.7rem;
          }
          
          .fc .fc-daygrid-day-frame {
            min-height: 60px;
          }
          
          .fc .fc-event-title {
            font-size: 0.6rem;
            padding: 1px 2px;
          }
          
          .fc .fc-toolbar {
            gap: 4px;
            margin-bottom: 8px;
          }
          
          .fc .fc-toolbar-chunk {
            flex-wrap: wrap;
          }
        }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        events={events}
        eventClick={(info) => {
          const props = info.event.extendedProps;
          const time24Hour = convertTo24HourFormat(props.time, props.timeFormat);
          Swal.fire({
            title: 'รายละเอียดการนัดหมาย',
            html: `
              <div class="text-left">
                <p class="mb-2"><strong>แพทย์:</strong> ${props.doctor}</p>
                <p class="mb-2"><strong>แผนก:</strong> ${props.specialty}</p>
                <p><strong>เวลา:</strong> ${time24Hour} น.</p>
              </div>
            `,
            icon: props.isUrgent ? 'warning' : 'info',
            confirmButtonText: 'ปิด',
            confirmButtonColor: '#8B5CF6',
            background: '#ffffff',
            customClass: {
              popup: 'rounded-xl',
              title: 'text-lg font-semibold text-gray-800',
              htmlContainer: 'text-gray-700'
            }
          });
        }}
        height="auto"
        contentHeight="auto"
        dayCellClassNames="text-center"
      />
    </div>
  );
}
