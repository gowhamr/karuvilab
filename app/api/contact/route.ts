import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Lazy initialization to avoid build-time errors
let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return null;
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
};

export async function POST(req: Request) {
  try {
    const { name, email, message, subject } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    const { data, error } = await resend.emails.send({
      from: 'KaruviLab Contact <onboarding@resend.dev>',
      to: 'KaruviLab@proton.me',
      subject: subject || `New message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
