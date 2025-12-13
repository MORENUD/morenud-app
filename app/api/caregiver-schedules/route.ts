import { NextRequest, NextResponse } from 'next/server';
import { mockCaregiverSchedules, mockCaregiverAppointments } from './shared';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    // Return caregiver schedules (transport/care services)
    if (type === 'schedules') {
      const schedules = Object.values(mockCaregiverSchedules);
      return NextResponse.json({
        success: true,
        data: schedules
      });
    }
    
    // Return caregiver appointments (medical appointments)
    const appointments = Object.values(mockCaregiverAppointments);
    return NextResponse.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching caregiver data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch caregiver data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    // Create new caregiver schedule
    if (type === 'schedules') {
      const newSchedule = {
        id: Date.now().toString(),
        ...body,
        createdAt: new Date().toISOString()
      };
      
      mockCaregiverSchedules[newSchedule.id] = newSchedule;
      
      return NextResponse.json({
        success: true,
        data: newSchedule
      });
    }
    
    // Create new caregiver appointment
    const newAppointment = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    };
    
    mockCaregiverAppointments[newAppointment.id] = newAppointment;
    
    return NextResponse.json({
      success: true,
      data: newAppointment
    });
  } catch (error) {
    console.error('Error creating caregiver data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create caregiver data' 
      },
      { status: 500 }
    );
  }
}