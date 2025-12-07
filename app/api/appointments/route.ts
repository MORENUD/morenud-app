import { NextRequest, NextResponse } from 'next/server';
import { mockAppointments } from './shared';

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Get all appointments from mock storage
    const appointments = Object.values(mockAppointments);
    
    // Sort by creation date (newest first)
    appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      data: appointments,
      total: appointments.length
    });
    
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรายการนัดหมาย' },
      { status: 500 }
    );
  }
}