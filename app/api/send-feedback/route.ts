import { NextRequest, NextResponse } from 'next/server';
import { sendFeedbackEmail } from '@/src/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromEmail, message, category, diagnosticInfo } = body;

    if (!fromEmail || !message || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: fromEmail, message, and category are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    await sendFeedbackEmail({ fromEmail, message, category, diagnosticInfo });

    return NextResponse.json(
      { success: true, message: 'Feedback sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Feedback Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message || 'Unknown error',
        resend_error: error.response?.data || undefined
      },
      { status: 500 }
    );
  }
}