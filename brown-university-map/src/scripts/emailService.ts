import emailjs from '@emailjs/browser';

// Configuration - replace these with your actual values
const EMAILJS_SERVICE_ID = 'service_le51f1v';
const EMAILJS_TEMPLATE_ID = 'template_mbwjq1r';
const EMAILJS_PUBLIC_KEY = 'jxCihD5Ovzml9xH9Y';

export const sendInvitationEmail = async (toEmail: string, mapId: string, toName: string = 'Friend') => {
  try {
    const templateParams = {
      to_email: toEmail,
      to_name: toName,
      mapId,
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

    console.log(`Invitation email sent to ${toEmail}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed.');
  }
};