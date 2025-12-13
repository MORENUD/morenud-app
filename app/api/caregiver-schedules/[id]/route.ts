import { NextRequest, NextResponse } from 'next/server';
import { mockCaregiverSchedules, mockCaregiverAppointments } from '../shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const { id } = await params;
    
    if (type === 'schedules') {
      const schedule = mockCaregiverSchedules[id];
      if (!schedule) {
        return NextResponse.json(
          { success: false, error: 'Schedule not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: schedule
      });
    }
    
    // Get appointment by ID
    const appointment = mockCaregiverAppointments[id];
    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: appointment
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const { id } = await params;
    
    if (type === 'schedules') {
      if (!mockCaregiverSchedules[id]) {
        return NextResponse.json(
          { success: false, error: 'Schedule not found' },
          { status: 404 }
        );
      }
      
      mockCaregiverSchedules[id] = {
        ...mockCaregiverSchedules[id],
        ...body
      };
      
      return NextResponse.json({
        success: true,
        data: mockCaregiverSchedules[id]
      });
    }
    
    // Update appointment
    if (!mockCaregiverAppointments[id]) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    mockCaregiverAppointments[id] = {
      ...mockCaregiverAppointments[id],
      ...body
    };
    
    return NextResponse.json({
      success: true,
      data: mockCaregiverAppointments[id]
    });
  } catch (error) {
    console.error('Error updating caregiver data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update caregiver data' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const { id } = await params;
    
    if (type === 'schedules') {
      if (!mockCaregiverSchedules[id]) {
        return NextResponse.json(
          { success: false, error: 'Schedule not found' },
          { status: 404 }
        );
      }
      
      delete mockCaregiverSchedules[id];
      
      return NextResponse.json({
        success: true,
        message: 'Schedule deleted successfully'
      });
    }
    
    // Delete appointment
    if (!mockCaregiverAppointments[id]) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    delete mockCaregiverAppointments[id];
    
    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting caregiver data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete caregiver data' 
      },
      { status: 500 }
    );
  }
}