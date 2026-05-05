import { NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

export const dynamic = 'force-dynamic';

const ATTENDEES_FILE = path.join(os.tmpdir(), 'rfid_active_attendees.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const attendees = body.attendees || [];
    
    // Store the attendees of the currently active lecture
    fs.writeFileSync(ATTENDEES_FILE, JSON.stringify(attendees));
    
    return NextResponse.json({ status: 'success' });
  } catch (err) {
    return NextResponse.json({ status: 'error' }, { status: 400 });
  }
}
