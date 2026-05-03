import { use } from 'react';
import StudentProfileClient from './StudentProfileClient';

export default function StudentPage({ params }: { params: Promise<{ uid: string }> }) {
  // In Next.js 15+, params is a promise.
  const resolvedParams = use(params);
  
  return <StudentProfileClient uid={resolvedParams.uid} />;
}
