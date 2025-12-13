import { NextRequest, NextResponse } from 'next/server';
import { mockCaregiverSchedules } from './shared';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Get all caregiver schedules from mock storage
    const schedules = Object.values(mockCaregiverSchedules);
    
    // Sort by creation date (newest first)
    schedules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      data: schedules,
      total: schedules.length
    });
    
  } catch (error) {
    console.error('Error fetching caregiver schedules:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการตารางงานผู้ดูแล' },
      { status: 500 }
    );
  }
}