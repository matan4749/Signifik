import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('sub_status');
  return NextResponse.json({ success: true });
}
