import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'eq16',
    timestamp: new Date().toISOString(),
  });
}
