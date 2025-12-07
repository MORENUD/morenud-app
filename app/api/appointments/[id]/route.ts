import { NextRequest, NextResponse } from 'next/server';
import { mockAppointments } from '../shared';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const appointment = mockAppointments[id];
    
    if (!appointment) {
      // If appointment not found in storage, create a mock one for demo purposes
      console.log(`Appointment ${id} not found, creating mock data`);
      const mockAppointment = {
        id: id,
        appointmentNumber: `AP${Date.now().toString().slice(-6)}`,
        patientName: 'นาย สมชาย ใจดี',
        doctorName: 'นพ.ประยุทธ สุขใจ',
        department: 'แผนกอายุรกรรม',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appointmentTime: '14:30',
        phone: '081-234-5678',
        address: '123 หมู่ 4 ตำบลบางพลี อำเภอบางพลี จังหวัดสมุทรปราการ 10540',
        hospitalName: 'โรงพยาบาลมอร์นัด',
        hospitalAddress: '456 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
        hospitalPhone: '02-123-4567',
        queueNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        instructions: 'กรุณามาก่อนเวลานัด 30 นาที และแสดงใบนัดหมายนี้ที่เคาน์เตอร์ลงทะเบียน'
      };
      
      // Save to mock storage
      mockAppointments[id] = mockAppointment;
      
      return NextResponse.json({
        success: true,
        data: mockAppointment
      });
    }
    
    return NextResponse.json({
      success: true,
      data: appointment
    });
    
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

