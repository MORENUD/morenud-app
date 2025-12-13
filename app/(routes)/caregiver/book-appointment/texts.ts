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
  pageTitle: "สร้างตารางงานผู้ดูแล",
  labels: {
    patientName: "ชื่อผู้รับบริการ",
    pickupDate: "วันที่ปฏิบัติงาน",
    pickupTime: "เวลาปฏิบัติงาน",
    phone: "เบอร์โทรศัพท์ติดต่อ",
    pickupAddress: "สถานที่เริ่มงาน",
    destinationAddress: "สถานที่ปลายทาง",
    comment: "คำแนะนำและหมายเหตุ"
  },
  placeholders: {
    selectTime: "เลือกเวลา",
    phone: "08XXXXXXXX",
    patientName: "ชื่อผู้รับบริการ",
    pickupAddress: "ที่อยู่สถานที่เริ่มต้นปฏิบัติงาน",
    destinationAddress: "โรงพยาบาล/สถานพยาบาลปลายทาง",
    comment: "รายละเอียดการปฏิบัติงาน คำแนะนำพิเศษ"
  },
  buttons: {
    submit: "สร้างตารางงาน"
  },
  alerts: {
    confirmation: {
      title: "ยืนยันการสร้างตารางงาน",
      text: "คุณต้องการยืนยันการสร้างตารางงานนี้หรือไม่?",
      confirmButton: "ใช่, ยืนยัน",
      cancelButton: "ยกเลิก"
    },
    success: {
      title: "สร้างตารางงานสำเร็จ!",
      text: "สร้างตารางงานผู้ดูแลเรียบร้อยแล้ว!",
      confirmButton: "ตกลง"
    },
    error: {
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถสร้างตารางงานได้ กรุณาลองใหม่อีกครั้ง",
      confirmButton: "ตกลง"
    }
  }
};
