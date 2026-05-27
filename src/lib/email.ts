import { Resend } from 'resend';

// Initialize lazily to avoid build-time errors if API key is missing
let resend: Resend | null = null;

const getResend = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is not defined. Email functionality will not work.');
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

interface FeedbackEmailProps {
  fromEmail: string;
  message: string;
  category: string;
  diagnosticInfo?: string;
}

export async function sendFeedbackEmail({
  fromEmail,
  message,
  category,
  diagnosticInfo,
}: FeedbackEmailProps) {
  const client = getResend();
  
  if (!client) {
    throw new Error('Email service is not configured (missing API key)');
  }

  const { data, error } = await client.emails.send({
    from: 'KaruviLab Feedback <onboarding@resend.dev>',
    to: ['gowtham.rg@outlook.com'],
    subject: `[KaruviLab ${category}] New feedback from ${fromEmail}`,
    text: `Message: ${message}\n\nDiagnostic Info: ${diagnosticInfo || 'None'}`,
  });

  if (error) {
    console.error('Resend SDK Error:', error);
    throw new Error(error.message || 'Failed to send email via Resend');
  }
  
  return { success: true, data };
}