// Appointment interface for caregiver schedules
export interface CaregiverAppointment {
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
  pickupDate?: string;
  pickupTime?: string;
}

// Caregiver schedule interface for transport/care services
export interface CaregiverSchedule {
  id: string;
  bookingNumber: string;
  patientName: string;
  pickupDate: string;
  pickupTime: string;
  phone: string;
  pickupAddress: string;
  destinationAddress: string;
  comment: string;
  status: string;
  createdAt: string;
  caregiverName?: string;
  estimatedDuration?: string;
  hospitalName?: string;
  queueNumber?: string;
}

// Mock caregiver appointments database mockCaregiverSchedules
export const mockCaregiverSchedules: { [key: string]: CaregiverAppointment } = {
  '1': {
    id: '1',
    appointmentNumber: 'CG001234',
    patientName: 'นาย ประยุทธ สมใจ',
    doctorName: 'นพ.สุชาติ ใจดี',
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
    appointmentNumber: 'CG001235',
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
    status: 'pending',
    createdAt: '2024-12-07T09:15:00Z',
    instructions: 'กรุณาเตรียมเอกสารแสดงตัวตนและบัตรประกันสุขภาพ'
  }
};

// Mock caregiver schedules database
export const mockCaregiverAppointments: { [key: string]: CaregiverSchedule } = {
  '1': {
    id: '1',
    bookingNumber: 'CS001234',
    patientName: 'นาย สมชาย ใจดี',
    pickupDate: '2024-12-15',
    pickupTime: '14:30',
    phone: '081-234-5678',
    pickupAddress: '123 หมู่ 4 ตำบลบางพลี อำเภอบางพลี จังหวัดสมุทรปราการ 10540',
    destinationAddress: 'โรงพยาบาลมอร์นัด 456 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
    comment: 'ผู้ป่วยใช้รถเข็น กรุณานำรถเข็นมาด้วย',
    status: 'confirmed',
    createdAt: '2024-12-06T10:30:00Z',
    caregiverName: 'คุณมาลี ใจดี',
    estimatedDuration: '2 ชั่วโมง',
    hospitalName: 'โรงพยาบาลกรุงเทพ',
    queueNumber: 'A-025'
  },
  '2': {
    id: '2',
    bookingNumber: 'CS001235',
    patientName: 'นางสาว สุดา รักดี',
    pickupDate: '2024-12-16',
    pickupTime: '10:00',
    phone: '089-567-8901',
    pickupAddress: '789 ซอยลาดพร้าว 15 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
    destinationAddress: 'โรงพยาบาลสิริราช 2 ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพมหานคร 10700',
    comment: 'การนัดหมายตรวจสุขภาพประจำปี',
    status: 'pending',
    createdAt: '2024-12-07T09:15:00Z',
    caregiverName: 'คุณประยุทธ สมใจ',
    estimatedDuration: '3 ชั่วโมง',
    hospitalName: 'โรงพยาบาลกรุงเทพ',
    queueNumber: 'A-045'

  }
};