import { NextResponse } from 'next/server';
import { meowMeow394 } from '@/lib/lookup';

export const runtime = 'edge';

export async function POST(request: Request) {
  const { code } = await request.json();
  const lookupdata = await meowMeow394(code)
  return NextResponse.json(lookupdata);
}
