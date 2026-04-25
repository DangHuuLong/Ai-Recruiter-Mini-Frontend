import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import { ToastProvider } from '@/providers/toast-provider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Recruiter Mini',
  description: 'AI-powered recruitment screening system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={geistSans.variable} suppressHydrationWarning>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}