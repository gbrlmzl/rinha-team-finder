import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export async function GET() {
  const now = new Date();
  const timestamp = now.toISOString().split('.')[0] + 'Z';

  return NextResponse.json(
    { status: 'ok', service: 'eq16', timestamp },
    {
      status: 200,
      headers: CORS_HEADERS,
    }
  );
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}