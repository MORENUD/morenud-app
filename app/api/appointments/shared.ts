// Appointment interface
export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  phone: string;
  address: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  queueNumber: string;
  status: string;
  createdAt: string;
  instructions: string;
}

// Mock appointment database (in real app, this would be a database)
export const mockAppointments: { [key: string]: Appointment } = {
  '1': {
    id: '1',
    appointmentNumber: 'AP001234',
    patientName: 'นาย สมชาย ใจดี',
    doctorName: 'นพ.ประยุทธ สุขใจ',
    department: 'แผนกอายุรกรรม',
    appointmentDate: '2024-12-15',
    appointmentTime: '14:30',
    phone: '081-234-5678',
    address: '123 หมู่ 4 ตำบลบางพลี อำเภอบางพลี จังหวัดสมุทรปราการ 10540',
    hospitalName: 'โรงพยาบาลมอร์นัด',
    hospitalAddress: '456 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
    hospitalPhone: '02-123-4567',
    queueNumber: 'A-025',
    status: 'confirmed',
    createdAt: '2024-12-06T10:30:00Z',
    instructions: 'กรุณามาก่อนเวลานัด 30 นาที และแสดงใบนัดหมายนี้ที่เคาน์เตอร์ลงทะเบียน'
  },
  '2': {
    id: '2',
    appointmentNumber: 'AP001235',
    patientName: 'นางสาว มาลี รักดี',
    doctorName: 'นพ.กิตติชัย เก่งมาก',
    department: 'แผนกกุมารเวชกรรม',
    appointmentDate: '2024-12-16',
    appointmentTime: '10:00',
    phone: '089-567-8901',
    address: '789 ซอยลาดพร้าว 15 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
    hospitalName: 'โรงพยาบาลมอร์นัด',
    hospitalAddress: '456 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
    hospitalPhone: '02-123-4567',
    queueNumber: 'B-012',
    status: 'confirmed',
    createdAt: '2024-12-06T14:15:00Z',
    instructions: 'กรุณามาก่อนเวลานัด 30 นาที และแสดงใบนัดหมายนี้ที่เคาน์เตอร์ลงทะเบียน'
  }
};