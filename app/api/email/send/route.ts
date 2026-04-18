import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/sendgrid/notifications';

export async function POST(req: NextRequest) {
  try {
    const { type, name, email } = await req.json();

    if (type === 'welcome' && email && name) {
      await sendWelcomeEmail(email, name);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
