import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the session cookie
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    return NextResponse.json({ success: true, message: 'Session cleared successfully' });
  } catch (error) {
    console.error('Error clearing session:', error);
    return NextResponse.json({ success: false, message: 'Failed to clear session' }, { status: 500 });
  }
}
