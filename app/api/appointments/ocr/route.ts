import { NextRequest, NextResponse } from 'next/server';

// This endpoint processes OCR requests for appointment card scanning
// In production, this would integrate with an LLM API like OpenAI GPT-4 Vision
// For now, it returns mock extracted data

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, timestamp } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    console.log('Received OCR request at:', timestamp);
    console.log('Image data size:', image.length);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // TODO: Integrate with LLM Vision API
    // Example with OpenAI GPT-4 Vision:
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract the following information from this Thai hospital appointment card in JSON format: HN (hospital number), doctorName, department, hospital, queueNumber, appointmentDate (YYYY-MM-DD), appointmentTime (HH:MM), phone. Return only valid JSON.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    const result = await response.json();
    const extractedData = JSON.parse(result.choices[0].message.content);
    */

    // Mock extracted data for development
    const mockExtractedData = {
      hn: 'AP001235',
      doctorName: 'นพ.กิตติชัย เก่งมาก',
      department: 'แผนกอายุรกรรม',
      hospital: 'โรงพยาบาลอนธรรมี',
      queueNumber: 'B-012',
      appointmentDate: '2567-12-16',
      appointmentTime: '10:00',
      phone: '089-567-8901',
      address: ''
    };

    return NextResponse.json({
      success: true,
      message: 'OCR processing completed successfully',
      data: mockExtractedData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing OCR:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process OCR request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
