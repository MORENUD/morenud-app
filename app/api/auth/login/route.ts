import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Mock authentication - replace with real authentication logic
    if (username && password) {
      return NextResponse.json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ',
        user: {
          id: '1',
          username,
          name: 'ผู้ใช้ระบบ'
        }
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
}