import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const { data, error } = await resend.emails.send({
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