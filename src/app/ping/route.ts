import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const timestamp = now.toISOString().split('.')[0] + 'Z';

  return NextResponse.json(
    { status: 'ok', service: 'eq16', timestamp },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    }
  );
}