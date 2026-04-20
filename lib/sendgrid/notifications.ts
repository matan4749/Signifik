import { getSendGrid } from './client';
import { ADMIN_EMAIL, APP_NAME } from '@/lib/utils/constants';

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@signifik.app';

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendNewSiteLaunchedEmail(opts: {
  customerName: string;
  customerEmail: string;
  businessName: string;
  siteUrl: string;
  siteId: string;
}): Promise<void> {
  const sg = getSendGrid();
  await sg.send({
    to: ADMIN_EMAIL,
    from: FROM_EMAIL,
    subject: `[${APP_NAME}] New site launched: ${opts.businessName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #6366f1; font-size: 24px; margin-bottom: 8px;">New Site Launched 🚀</h1>
        <p style="color: #666; margin-bottom: 24px;">A new site has been deployed via ${APP_NAME}.</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 12px; background: #f9fafb; font-weight: 600; width: 40%;">Customer</td>
            <td style="padding: 12px; background: #f9fafb;">${escHtml(opts.customerName)} (${escHtml(opts.customerEmail)})</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: 600;">Business</td>
            <td style="padding: 12px;">${escHtml(opts.businessName)}</td>
          </tr>
          <tr>
            <td style="padding: 12px; background: #f9fafb; font-weight: 600;">Site ID</td>
            <td style="padding: 12px; background: #f9fafb;">${escHtml(opts.siteId)}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: 600;">Live URL</td>
            <td style="padding: 12px;"><a href="${escHtml(opts.siteUrl)}" style="color: #6366f1;">${escHtml(opts.siteUrl)}</a></td>
          </tr>
        </table>
        <a href="${escHtml(opts.siteUrl)}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">View Live Site</a>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const sg = getSendGrid();
  await sg.send({
    to: email,
    from: FROM_EMAIL,
    subject: `Welcome to ${APP_NAME} — Let's build your site`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #6366f1;">Welcome to ${APP_NAME}, ${escHtml(name)}! 👋</h1>
        <p>Your account is all set. Start your 30-day free trial and launch your first premium landing page in minutes.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 100px; font-weight: 600;">Go to Dashboard</a>
      </div>
    `,
  });
}

export async function sendTrialEndingEmail(email: string, name: string): Promise<void> {
  const sg = getSendGrid();
  await sg.send({
    to: email,
    from: FROM_EMAIL,
    subject: `Your ${APP_NAME} trial ends in 3 days`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #f59e0b;">Trial ending soon, ${escHtml(name)}</h1>
        <p>Your 30-day free trial ends in 3 days. Add a payment method to keep your sites live.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/billing" style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #f59e0b; color: #fff; text-decoration: none; border-radius: 100px; font-weight: 600;">Manage Billing</a>
      </div>
    `,
  });
}

export async function sendPaymentFailedEmail(email: string, name: string): Promise<void> {
  const sg = getSendGrid();
  await sg.send({
    to: email,
    from: FROM_EMAIL,
    subject: `Action required: Payment failed for ${APP_NAME}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #ef4444;">Payment Failed, ${escHtml(name)}</h1>
        <p>We couldn't process your payment. Please update your payment method to keep your sites live.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/billing" style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #ef4444; color: #fff; text-decoration: none; border-radius: 100px; font-weight: 600;">Update Payment</a>
      </div>
    `,
  });
}

export async function sendSiteDisabledEmail(email: string, name: string, businessName: string): Promise<void> {
  const sg = getSendGrid();
  await sg.send({
    to: email,
    from: FROM_EMAIL,
    subject: `Your ${APP_NAME} site has been paused`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #6b7280;">Site Paused: ${escHtml(businessName)}</h1>
        <p>Hi ${escHtml(name)}, your site has been paused due to a failed payment. Reactivate your subscription to restore it.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/billing" style="display: inline-block; margin-top: 24px; padding: 14px 28px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 100px; font-weight: 600;">Reactivate</a>
      </div>
    `,
  });
}
