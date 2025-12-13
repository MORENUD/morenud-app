// export const bookAppointmentTexts = {
//   pageTitle: 'Add doctor\'s appointment',
//   labels: {
//     appointmentDate: 'Appointment date',
//     appointmentTime: 'Appointment time',
//     phone: 'Phone'
//   },
//   placeholders: {
//     selectTime: 'Select time',
//     phone: '+1234567890'
//   },
//   buttons: {
//     submit: 'Book Appointment'
//   },
//   alerts: {
//     confirmation: {
//       title: 'Confirm Appointment',
//       text: 'Are you sure you want to book this appointment?',
//       confirmButton: 'Yes, Book It!',
//       cancelButton: 'Cancel'
//     },
//     success: {
//       title: 'Success!',
//       text: 'Appointment booked successfully!',
//       confirmButton: 'OK'
//     },
//     error: {
//       title: 'Error!',
//       text: 'Failed to book appointment. Please try again.',
//       confirmButton: 'OK'
//     }
//   }
// };

export const bookAppointmentTexts = {
  pageTitle: "เพิ่มการนัดพบแพทย์",
  selectMethod: {
    title: "เลือกวิธีการเพิ่มข้อมูล",
    subtitle: "กรุณาเลือกวิธีที่คุณต้องการใช้",
    manual: {
      title: "กรอกข้อมูลด้วยตัวเอง",
      description: "กรอกข้อมูลการนัดหมายด้วยตนเอง"
    },
    ocr: {
      title: "สแกนใบนัดหมาย",
      description: "ถ่ายภาพใบนัดหมายเพื่อดึงข้อมูลอัตโนมัติ"
    }
  },
  labels: {
    hn: "หมายเลข HN",
    confirmationStatus: "สถานะการยืนยัน",
    doctorName: "ชื่อนามสกุลแพทย์",
    department: "แผนก",
    hospital: "โรงพยาบาล",
    queueNumber: "หมายเลขคิว",
    appointmentDate: "วันที่นัดหมาย",
    appointmentTime: "เวลานัดหมาย",
    phone: "เบอร์โทรศัพท์",
    address: "ที่อยู่"
  },
  placeholders: {
    hn: "AP001235",
    doctorName: "นพ.สมชาย ใจดี",
    department: "แผนกอายุรกรรม",
    hospital: "โรงพยาบาลมอร์นัด",
    queueNumber: "B-012",
    selectTime: "เลือกเวลา",
    phone: "089-567-8901",
    address: "ที่อยู่ของคุณ"
  },
  buttons: {
    submit: "ยืนยันการนัดหมาย",
    startScan: "เริ่มสแกนใบนัด",
    retakeScan: "ถ่ายใหม่",
    confirmOCR: "ยืนยันข้อมูล"
  },
  confirmationStatus: {
    confirmed: "ยืนยันแล้ว",
    pending: "รอยืนยัน"
  },
  alerts: {
    confirmation: {
      title: "ยืนยันการนัดหมาย",
      text: "คุณต้องการยืนยันการนัดหมายนี้หรือไม่?",
      confirmButton: "ใช่, ยืนยัน",
      cancelButton: "ยกเลิก"
    },
    success: {
      title: "สำเร็จ!",
      text: "ทำการนัดหมายเรียบร้อยแล้ว!",
      confirmButton: "ตกลง"
    },
    error: {
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถทำการนัดหมายได้ กรุณาลองใหม่อีกครั้ง",
      confirmButton: "ตกลง"
    },
    ocrError: {
      title: "สแกนไม่สำเร็จ!",
      text: "ไม่สามารถอ่านข้อมูลจากใบนัดหมายได้ กรุณาลองใหม่อีกครั้ง",
      confirmButton: "ตกลง"
    }
  }
};
