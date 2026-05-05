import { NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.join(os.tmpdir(), 'rfid_last_scan.json');

export async function GET() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const stats = fs.statSync(CACHE_FILE);
      // Check if file is newer than 60 seconds
      if (Date.now() - stats.mtimeMs < 60000) {
        const content = fs.readFileSync(CACHE_FILE, 'utf-8');
        return new NextResponse(content, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  } catch (e) {
    // Ignore fs errors safely
  }
  return NextResponse.json({ uid: null });
}

export async function DELETE() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
    }
  } catch (e) {
    // Ignore fs errors safely
  }
  return NextResponse.json({ status: 'cleared' });
}
