import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const userId =
    'user_' +
    Math.random().toString(36).substr(2, 9) +
    '_' +
    Date.now().toString(36);
  cookieStore.set('userId', userId, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return new Response(JSON.stringify({ userId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return new Response(JSON.stringify({ userId: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ userId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
