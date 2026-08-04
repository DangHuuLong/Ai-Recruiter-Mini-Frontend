import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

import { AuthProvider } from '@/features/auth/components/auth-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { routing } from '@/i18n/routing';

import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'AI Recruiter Mini',
  description: 'AI-powered recruitment screening system',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastProvider />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
