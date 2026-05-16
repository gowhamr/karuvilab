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
    to: ['support@karuvilab.com'],
    subject: `[KaruviLab ${category}] New feedback from ${fromEmail}`,
    text: `Message: ${message}\n\nDiagnostic Info: ${diagnosticInfo || 'None'}`,
  });

  if (error) throw new Error('Failed to send feedback');
  return { success: true, data };
}