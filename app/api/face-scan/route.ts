import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, timestamp } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Log the received image (first 100 characters for debugging)
    console.log('Received face scan image:', image.substring(0, 100) + '...');
    console.log('Timestamp:', timestamp);

    // Here you can process the base64 image:
    // 1. Save to file system
    // 2. Upload to cloud storage (AWS S3, Google Cloud, etc.)
    // 3. Send to AI/ML service for face recognition
    // 4. Store in database

    // Example: Extract base64 data without the data URL prefix
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // You can convert to buffer if needed
    const imageBuffer = Buffer.from(base64Data, 'base64');
    console.log('Image size:', imageBuffer.length, 'bytes');

    // Simulate processing time (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));

    // Mock response with user data
    const mockResponse = {
      user_name: "Peter",
      disease: "Typhoid",
      appointment_day: 21,
      _debug: {
        file: "Peter.jpg",
        score: 0.3
      },
      success: true,
      message: 'Face scan processed successfully',
      imageSize: imageBuffer.length,
      timestamp: timestamp
    };

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Error processing face scan:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET request for testing
export async function GET() {
  return NextResponse.json({
    message: 'Face scan API endpoint is working',
    methods: ['POST'],
    expectedPayload: {
      image: 'base64 string (data:image/jpeg;base64,...)',
      timestamp: 'ISO string'
    }
  });
}
