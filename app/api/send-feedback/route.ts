import { NextRequest, NextResponse } from 'next/server';
import { sendFeedbackEmail } from '@/src/lib/email';

const recentSubmissions = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromEmail, message, category, diagnosticInfo, attachment, turnstileToken } = body;

    if (!fromEmail || !message || !category || !turnstileToken) {
      return NextResponse.json(
        { error: 'Missing required fields. Please ensure all fields and bot protection are completed.' },
        { status: 400 }
      );
    }

    // Verify Turnstile Token
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
    const turnstileVerifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}`,
    });
    const turnstileVerifyData = await turnstileVerifyRes.json();
    if (!turnstileVerifyData.success) {
      return NextResponse.json(
        { error: 'Bot protection check failed. Please try again.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message exceeds maximum length of 2000 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail) || fromEmail.length > 100) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Size limit check for attachment (approx 2MB in base64 is ~2.7MB length)
    if (attachment && attachment.content && attachment.content.length > 2.8 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Attachment exceeds maximum size of 2MB' },
        { status: 400 }
      );
    }

    // Duplicate submission detection (60 seconds)
    const submissionHash = `${fromEmail}:${message.substring(0, 100)}`;
    const now = Date.now();
    if (recentSubmissions.has(submissionHash)) {
      const lastSubmitted = recentSubmissions.get(submissionHash)!;
      if (now - lastSubmitted < 60000) {
        return NextResponse.json(
          { error: 'Duplicate submission detected. Please wait a moment before sending again.' },
          { status: 429 }
        );
      }
    }
    recentSubmissions.set(submissionHash, now);
    
    // Cleanup old submissions to prevent memory leak
    for (const [key, timestamp] of recentSubmissions.entries()) {
      if (now - timestamp > 120000) {
        recentSubmissions.delete(key);
      }
    }

    // Generate ticket ID: KL-YYYYMMDD-XXXXXX
    const dateStr = (new Date().toISOString().split('T')[0] || '').replace(/-/g, '');
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `KL-${dateStr}-${randomPart}`;
    const serverTimestamp = new Date().toISOString();

    await sendFeedbackEmail({ fromEmail, message, category, diagnosticInfo, ticketId, attachment, serverTimestamp });

    return NextResponse.json(
      { success: true, message: 'Feedback sent successfully', ticketId },
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