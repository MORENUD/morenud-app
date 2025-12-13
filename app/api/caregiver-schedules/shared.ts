// Caregiver Schedule interface
export interface CaregiverSchedule {
  id: string;
  scheduleNumber: string;
  caregiverName: string;
  patientName: string;
  serviceType: string;
  scheduleDate: string;
  scheduleTime: string;
  duration: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
  instructions: string;
}

// Mock caregiver schedule database (in real app, this would be a database)
export const mockCaregiverSchedules: { [key: string]: CaregiverSchedule } = {
  '1': {
    id: '1',
    scheduleNumber: 'CS001234',
    caregiverName: 'นางสาว สุนิสา ใจดี',
    patientName: 'นาย สมชาย ใจดี',
    serviceType: 'ดูแลผู้สูงอายุ',
    scheduleDate: '2024-12-15',
    scheduleTime: '08:00',
    duration: '4 ชั่วโมง',
    phone: '081-234-5678',
    address: '123 หมู่ 4 ตำบลบางพลี อำเภอบางพลี จังหวัดสมุทรปราการ 10540',
    status: 'confirmed',
    createdAt: '2024-12-06T10:30:00Z',
    instructions: 'กรุณาติดต่อผู้ป่วยก่อนมาให้บริการ 30 นาที'
  },
  '2': {
    id: '2',
    scheduleNumber: 'CS001235',
    caregiverName: 'นาย ประยุทธ สุขใจ',
    patientName: 'นางสาว มาลี รักดี',
    serviceType: 'ดูแลผู้ป่วย',
    scheduleDate: '2024-12-16',
    scheduleTime: '14:00',
    duration: '6 ชั่วโมง',
    phone: '089-567-8901',
    address: '789 ซอยลาดพร้าว 15 แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
    status: 'confirmed',
    createdAt: '2024-12-06T14:15:00Z',
    instructions: 'กรุณาติดต่อผู้ป่วยก่อนมาให้บริการ 30 นาที'
  }
};