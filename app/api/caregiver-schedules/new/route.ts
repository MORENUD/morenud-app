import { NextRequest, NextResponse } from 'next/server';
import { mockCaregiverSchedules, mockCaregiverAppointments } from '../shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    if (type === 'schedules') {
      const newSchedule = {
        id: Date.now().toString(),
        bookingNumber: `CS${String(Date.now()).slice(-6)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...body
      };
      
      mockCaregiverSchedules[newSchedule.id] = newSchedule;
      
      return NextResponse.json({
        success: true,
        data: newSchedule,
        message: 'Caregiver schedule created successfully'
      });
    }
    
    // Create new caregiver appointment
    const newAppointment = {
      id: Date.now().toString(),
      appointmentNumber: `CG${String(Date.now()).slice(-6)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...body
    };
    
    mockCaregiverAppointments[newAppointment.id] = newAppointment;
    
    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: 'Caregiver appointment created successfully'
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