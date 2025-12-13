import { NextRequest, NextResponse } from 'next/server';
import { mockAppointments, type Appointment } from '../shared';

// POST endpoint for creating appointments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate random appointment ID
    const appointmentId = Math.random().toString(36).substr(2, 9);
    
    // Use provided HN or generate one
    const appointmentNumber = body.hn || `AP${Date.now().toString().slice(-6)}`;
    
    // Use provided queue number or generate one
    const queueNumber = body.queueNumber || 
      `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`;
    
    // Determine status based on confirmation status or source
    let status = 'pending';
    if (body.confirmationStatus === 'confirmed' || body.source === 'ocr') {
      status = 'confirmed';
    } else if (body.confirmationStatus === 'pending') {
      status = 'pending';
    }
    
    // Create new appointment with form data
    const newAppointment: Appointment = {
      id: appointmentId,
      appointmentNumber,
      patientName: 'นาย สมชาย ใจดี', // This would come from user profile in real app
      doctorName: body.doctorName || 'นพ.ประยุทธ สุขใจ',
      department: body.department || 'แผนกอายุรกรรม',
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      phone: body.phone,
      address: body.address || '123 หมู่ 4 ตำบลบางพลี อำเภอบางพลี จังหวัดสมุทรปราการ 10540',
      hospitalName: body.hospital || 'โรงพยาบาลมอร์นัด',
      hospitalAddress: '456 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
      hospitalPhone: '02-123-4567',
      queueNumber,
      status,
      createdAt: new Date().toISOString(),
      instructions: 'กรุณามาก่อนเวลานัด 30 นาที และแสดงใบนัดหมายนี้ที่เคาน์เตอร์ลงทะเบียน'
    };
    
    // Save to mock database
    mockAppointments[appointmentId] = newAppointment;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`Appointment created via ${body.source || 'manual'} entry:`, {
      id: appointmentId,
      hn: appointmentNumber,
      status,
      source: body.source
    });
    
    return NextResponse.json({
      success: true,
      data: newAppointment
    });
    
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างนัดหมาย' },
      { status: 500 }
    );
  }
}