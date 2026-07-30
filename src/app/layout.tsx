import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/features/auth/components/auth-provider';
import { ToastProvider } from '@/providers/toast-provider';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
