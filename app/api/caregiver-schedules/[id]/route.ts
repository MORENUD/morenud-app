import { NextRequest, NextResponse } from 'next/server';
import { mockCaregiverSchedules } from '../shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { id: scheduleId } = await params;
    const schedule = mockCaregiverSchedules[scheduleId];
    
    if (!schedule) {
      return NextResponse.json(
        { error: 'ไม่พบรายการตารางงานผู้ดูแลที่ระบุ' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: schedule
    });
    
  } catch (error) {
    console.error('Error fetching caregiver schedule:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลตารางงานผู้ดูแล' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    const updates = await request.json();
    
    if (!mockCaregiverSchedules[scheduleId]) {
      return NextResponse.json(
        { error: 'ไม่พบรายการตารางงานผู้ดูแลที่ระบุ' },
        { status: 404 }
      );
    }
    
    // Update the schedule
    mockCaregiverSchedules[scheduleId] = {
      ...mockCaregiverSchedules[scheduleId],
      ...updates,
      id: scheduleId // Ensure ID doesn't change
    };
    
    return NextResponse.json({
      success: true,
      data: mockCaregiverSchedules[scheduleId]
    });
    
  } catch (error) {
    console.error('Error updating caregiver schedule:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตตารางงานผู้ดูแล' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: scheduleId } = await params;
    
    if (!mockCaregiverSchedules[scheduleId]) {
      return NextResponse.json(
        { error: 'ไม่พบรายการตารางงานผู้ดูแลที่ระบุ' },
        { status: 404 }
      );
    }
    
    // Delete the schedule
    delete mockCaregiverSchedules[scheduleId];
    
    return NextResponse.json({
      success: true,
      message: 'ลบตารางงานผู้ดูแลเรียบร้อยแล้ว'
    });
    
  } catch (error) {
    console.error('Error deleting caregiver schedule:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบตารางงานผู้ดูแล' },
      { status: 500 }
    );
  }
}