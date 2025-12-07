interface AppointmentCardProps {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'soon' | 'confirmed' | 'pending';
  isUrgent?: boolean;
}

export default function AppointmentCard({ 
  doctor, 
  specialty, 
  date, 
  time, 
  status, 
  isUrgent = false 
}: AppointmentCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'soon':
        return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Soon' };
      case 'confirmed':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(status);
  
  const cardStyle = isUrgent 
    ? 'bg-purple-50 border-l-4 border-purple-400' 
    : 'bg-blue-50 border-l-4 border-blue-400';

  const timeStyle = isUrgent 
    ? 'font-medium text-purple-700' 
    : 'text-gray-600';

  return (
    <div className={`${cardStyle} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800 text-sm">{doctor}</h4>
        <span className="text-xs text-gray-500">{specialty}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={timeStyle}>{date} • {time}</span>
        <span className={`${statusConfig.bg} ${statusConfig.text} px-2 py-1 rounded-full`}>
          {statusConfig.label}
        </span>
      </div>
    </div>
  );
}
