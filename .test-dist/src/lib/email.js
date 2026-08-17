// Initialize lazily to avoid build-time errors if API key is missing
let resend = null;
const getResend = async () => {
    if (!resend) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.warn('RESEND_API_KEY is not defined. Email functionality will not work.');
            return null;
        }
        try {
            const { Resend } = await import('resend');
            resend = new Resend(apiKey);
        }
        catch (e) {
            console.error('Failed to load Resend:', e);
            return null;
        }
    }
    return resend;
};
export async function sendFeedbackEmail({ fromEmail, message, category, diagnosticInfo, ticketId, serverTimestamp, attachment, }) {
    const client = await getResend();
    if (!client) {
        throw new Error('Email service is not configured (missing API key)');
    }
    // Parse diagnostic info if it's a JSON string
    let parsedInfo = {};
    try {
        parsedInfo = diagnosticInfo ? JSON.parse(diagnosticInfo) : {};
    }
    catch (e) {
        // leave empty if failed
    }
    const htmlBody = `
    <h2>New Feedback: ${category}</h2>
    <p><strong>From:</strong> ${fromEmail}</p>
    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p><strong>Submitted At:</strong> ${serverTimestamp} (UTC) | Local: ${parsedInfo.timestamp || 'N/A'}</p>
    <hr/>
    <p><strong>Message:</strong></p>
    <p style="white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    <hr/>
    <p><strong>Diagnostic Info:</strong></p>
    <ul>
      <li>Browser: ${parsedInfo.browser || 'N/A'}</li>
      <li>OS: ${parsedInfo.os || 'N/A'}</li>
      <li>Device: ${parsedInfo.device || 'N/A'}</li>
      <li>Screen Size: ${parsedInfo.screenSize || 'N/A'}</li>
      <li>Timezone: ${parsedInfo.timezone || 'N/A'}</li>
      <li>Language: ${parsedInfo.language || 'N/A'}</li>
      <li>Theme: ${parsedInfo.theme || 'N/A'}</li>
      <li>App Version: ${parsedInfo.appVersion || 'N/A'}</li>
    </ul>
  `;
    // Send to support team
    const { data, error } = await client.emails.send({
        from: 'KaruviLab Feedback <onboarding@resend.dev>',
        to: ['gowtham.rg@outlook.com'],
        reply_to: fromEmail,
        subject: `[${ticketId}] New feedback from ${fromEmail}`,
        html: htmlBody,
        attachments: attachment ? [attachment] : undefined,
    });
    if (error) {
        console.error('Resend SDK Error:', error);
        throw new Error(error.message || 'Failed to send email via Resend');
    }
    // Auto-acknowledgement to the user
    try {
        await client.emails.send({
            from: 'KaruviLab Support <onboarding@resend.dev>', // Should ideally be a verified domain, but onboarding@resend.dev works for testing
            to: [fromEmail],
            subject: `We've received your feedback [${ticketId}]`,
            html: `
        <h2>Thank you for your feedback!</h2>
        <p>Hi there,</p>
        <p>We've successfully received your message (Ticket ID: <strong>${ticketId}</strong>).</p>
        <p>Our team will review your report and get back to you if we need any more information.</p>
        <br/>
        <p>Best regards,<br/>The KaruviLab Team</p>
      `,
        });
    }
    catch (ackError) {
        // We don't want to throw if the ack email fails, just log it
        console.error('Failed to send acknowledgement email:', ackError);
    }
    return { success: true, data };
}
