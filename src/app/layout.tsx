import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import InitialLoader from '@/components/InitialLoader';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hodor-devora.vercel.app'),
  title: 'Hodor — RFID Attendance',
  description: 'Real-time bilingual RFID attendance tracking system by Devora',
  keywords: ['attendance', 'RFID', 'university', 'lecture'],
  authors: [{ name: 'Devora' }],
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className={`${inter.variable} ${cairo.variable} antialiased min-h-screen`}>
        <Providers>
          <InitialLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
