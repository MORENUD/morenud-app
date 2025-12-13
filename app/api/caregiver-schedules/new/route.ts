import { NextRequest, NextResponse } from 'next/server';
import { mockCaregiverSchedules, CaregiverSchedule } from '../shared';

export async function POST(request: NextRequest) {
  try {
    const scheduleData = await request.json();
    
    // Generate new ID
    const newId = (Object.keys(mockCaregiverSchedules).length + 1).toString();
    
    // Generate schedule number
    const scheduleNumber = `CS${String(Date.now()).slice(-6)}`;
    
    // Create new schedule
    const newSchedule: CaregiverSchedule = {
      id: newId,
      scheduleNumber,
      caregiverName: scheduleData.caregiverName || '',
      patientName: scheduleData.patientName || '',
      serviceType: scheduleData.serviceType || '',
      scheduleDate: scheduleData.scheduleDate || '',
      scheduleTime: scheduleData.scheduleTime || '',
      duration: scheduleData.duration || '',
      phone: scheduleData.phone || '',
      address: scheduleData.address || '',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      instructions: scheduleData.instructions || 'กรุณาติดต่อผู้ป่วยก่อนมาให้บริการ 30 นาที'
    };
    
    // Save to mock database
    mockCaregiverSchedules[newId] = newSchedule;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json({
      success: true,
      data: newSchedule,
      message: 'สร้างตารางงานผู้ดูแลเรียบร้อยแล้ว'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating caregiver schedule:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างตารางงานผู้ดูแล' },
      { status: 500 }
    );
  }
}