import { NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';
import mockData from '@/data/mock.json';

const CACHE_FILE = path.join(os.tmpdir(), 'rfid_last_scan.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const uid = body.uid?.toUpperCase().trim();

    if (!uid) {
      return NextResponse.json({ status: 'error', message: 'UID required' }, { status: 400 });
    }

    // Find student in mock.json
    const student = mockData.students.find(s => s.uid === uid);

    if (!student) {
      const result = {
        status: 'unknown',
        uid: uid,
        message: 'Card not registered',
        timestamp: new Date().toISOString(),
      };
      fs.writeFileSync(CACHE_FILE, JSON.stringify(result));
      return NextResponse.json(result);
    }

    const result = {
      status: 'success',
      uid: uid,
      name: student.nameEN, // ESP screen will show English name
      student_id: student.id,
      known: true,
      already: false, // We always return false here, Next.js frontend handles the actual duplication logic
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(CACHE_FILE, JSON.stringify(result));
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ status: 'error', message: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active', message: 'Scan API is running' });
}
