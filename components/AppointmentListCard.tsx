import { useRouter } from 'next/navigation';
import { Appointment } from '@/app/api/appointments/shared';

interface AppointmentListCardProps {
  appointment: Appointment;
  onClick?: (appointmentId: string) => void;
}

export default function AppointmentListCard({ appointment, onClick }: AppointmentListCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeString: string) => {
    return `${timeString} น.`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅ ยืนยันแล้ว';
      case 'pending':
        return '⏳ รอการยืนยัน';
      case 'cancelled':
        return '❌ ยกเลิกแล้ว';
      default:
        return status;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(appointment.id);
    } else {
      router.push(`/book-appointment/card?id=${appointment.id}`);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              {appointment.appointmentNumber}
            </h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">
              {appointment.queueNumber}
            </div>
            <div className="text-xs text-gray-500">หมายเลขคิว</div>
          </div>
        </div>

        {/* Appointment Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">👨‍⚕️</span>
            <span className="font-medium">{appointment.doctorName}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{appointment.department}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">📅</span>
            <span className="font-medium text-blue-600">
              {formatDate(appointment.appointmentDate)}
            </span>
            <span className="text-gray-500">•</span>
            <span className="font-medium text-blue-600">
              {formatTime(appointment.appointmentTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">🏥</span>
            <span className="text-gray-600 truncate">{appointment.hospitalName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">📱</span>
            <span className="text-gray-600">{appointment.phone}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            สร้างเมื่อ: {new Date(appointment.createdAt).toLocaleDateString('th-TH')}
          </div>
          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
            ดูใบนัด
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}