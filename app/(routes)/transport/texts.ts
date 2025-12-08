export const transportTexts = {
  title: 'เดินทาง',
  
  sections: {
    pickupLocation: 'จุดรับส่ง',
    destination: 'ปลายทาง',
    rideDetails: 'รายละเอียดการเดินทาง'
  },

  labels: {
    currentLocation: 'ตำแหน่งปัจจุบัน',
    selectFromMap: 'เลือกจากแผนที่',
    hospital: 'โรงพยาบาล',
    clinic: 'คลินิก',
    medicalCenter: 'ศูนย์สุขภาพ',
    selectDestination: 'เลือกปลายทาง',
    phone: 'เบอร์ติดต่อ',
    note: 'หมายเหตุ'
  },

  buttons: {
    callRide: 'เรียกรถ',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    useLocation: 'ใช้ตำแหน่งนี้',
    changeLocation: 'เปลี่ยนตำแหน่ง'
  },

  alerts: {
    confirmation: {
      title: 'ยืนยันการเรียกรถ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการเรียกรถไปที่ปลายทางนี้?',
      confirmButton: 'ยืนยัน',
      cancelButton: 'ยกเลิก'
    },
    success: {
      title: 'เรียกรถสำเร็จ',
      text: 'รถของคุณจะมาถึงในไม่ช้า กรุณารอสักครู่',
      confirmButton: 'ปิด'
    },
    error: {
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเรียกรถได้ในขณะนี้ กรุณาลองใหม่',
      confirmButton: 'ปิด'
    },
    locationError: {
      title: 'ไม่สามารถรับตำแหน่ง',
      text: 'โปรดอนุญาตการเข้าถึง GPS และลองใหม่',
      confirmButton: 'ตกลง'
    }
  },

  placeholders: {
    phone: 'กรุณากรอกเบอร์โทรศัพท์',
    note: 'เพิ่มหมายเหตุเพิ่มเติม (ไม่บังคับ)'
  },

  messages: {
    gettingLocation: 'กำลังหาตำแหน่ง...',
    selectingDestination: 'กรุณาเลือกปลายทาง'
  }
};
