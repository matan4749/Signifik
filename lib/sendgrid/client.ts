import sgMail from '@sendgrid/mail';

let initialized = false;

export function getSendGrid() {
  if (!initialized) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error('SENDGRID_API_KEY is not set');
    sgMail.setApiKey(apiKey);
    initialized = true;
  }
  return sgMail;
}
