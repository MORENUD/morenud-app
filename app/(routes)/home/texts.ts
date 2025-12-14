// Text content for Home page in Thai
export const homeTexts = {
  // Banner content
  banner: {
    title: 'MORENUD',
    description: 'เชื่อมต่อการเยี่ยมแพทย์ด้วยการยืนยันการนัดหมาย ประเมินอาการเบื้องต้น และแนะนำการตัดสินใจด้านสุขภาพที่ฉลาด'
  },

  // Category names
  categories: {
    healthSurvey: 'แบบสำรวจสุขภาพ',
    transport: 'บริการผู้ดูแล',
    bookAppointment: 'การนัดหมาย',
    aiAssistant: 'ผู้ช่วย AI'
  },

  // Section headings
  sections: {
    categories: 'หมวดหมู่',
    upcomingAppointments: 'การนัดหมายที่จะมาถึง',
    seeAll: 'ดูทั้งหมด'
  },

  // Medical specialties
  specialties: {
    typhoid: 'แพทย์ทั่วไป (GP)',
    diabetes: 'แพทย์อายุรกรรมทั่วไป'
  },

  // Time and date
  dateTime: {
    tomorrow: 'พรุ่งนี้',
    am: 'น.',
    pm: 'บ.'
  },

  // Notification messages
  notification: {
    title: '🏥 แจ้งเตือนการนัดหมาย',
    greeting: 'สวัสดี',
    appointmentMessage: 'คุณมีการนัดหมายแพทย์ในอีก',
    daysText: 'วัน',
    prepareMessage: 'กรุณาเตรียมตัวและมาตามเวลาที่กำหนด',
    confirmButton: 'รับทราบ',
    defaultUserName: 'คุณ'
  },

  // Search placeholder (commented out)
  search: {
    placeholder: 'ค้นหาแพทย์...'
  },

  // Alt texts
  altText: {
    stethoscope: 'หูฟัง'
  },

  // Settings menu
  settings: {
    title: 'ตั้งค่า',
    cancelConsent: 'ยกเลิก ข้อตกลงการใช้บริการ',
    cancelConsentConfirm: 'คุณต้องการยกเลิก ข้อตกลงการใช้บริการ หรือไม่?',
    confirmCancel: 'ยกเลิก',
    keepConsent: 'คงไว้',
    success: 'ยกเลิก ข้อตกลงการใช้บริการ เรียบร้อยแล้ว'
  }
};

// Mock data with Thai translations
export const mockCategories = [
  {
    id: 1,
    nameKey: 'healthSurvey' as keyof typeof homeTexts.categories,
    bgColor: 'bg-blue-200 ',
    iconColor: 'bg-purple-500',
    iconShape: 'square' as const,
    link: '/health-check'
  },
  {
    id: 2,
    nameKey: 'transport' as keyof typeof homeTexts.categories,
    bgColor: 'bg-green-200',
    iconColor: 'bg-red-500',
    iconShape: 'circle' as const,
    link: '/transport'
  },
  {
    id: 3,
    nameKey: 'bookAppointment' as keyof typeof homeTexts.categories,
    bgColor: 'bg-red-200',
    iconColor: 'bg-blue-500',
    iconShape: 'square' as const,
    link: '/book-appointment/list'
  },
  {
    id: 4,
    nameKey: 'aiAssistant' as keyof typeof homeTexts.categories,
    bgColor: 'bg-purple-200',
    iconColor: 'bg-green-500',
    iconShape: 'circle' as const,
    link: '/chatbot'
  }
];

export const mockAppointments = [
  {
    id: 1,
    doctor: 'ดร. สมศักดิ์ ศศิธรากิจ',
    specialtyKey: 'typhoid' as keyof typeof homeTexts.specialties,
    dateKey: 'tomorrow' as keyof typeof homeTexts.dateTime,
    time: '10:00',
    timeFormat: 'am' as keyof typeof homeTexts.dateTime,
    status: 'soon' as const,
    isUrgent: true
  },
  {
    id: 2,
    doctor: 'ดร. ซาฮารา ซียิวา',
    specialtyKey: 'diabetes' as keyof typeof homeTexts.specialties,
    date: '9 ธ.ค. 2568',
    time: '2:30',
    timeFormat: 'pm' as keyof typeof homeTexts.dateTime,
    status: 'confirmed' as const,
    isUrgent: false
  }
];