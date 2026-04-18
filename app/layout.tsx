import type { Metadata } from 'next';
import { Inter, Heebo } from 'next/font/google';
import './globals.css';
import '../styles/liquid-glass.css';
import { Providers } from '@/components/layout/Providers';
import { APP_NAME } from '@/lib/utils/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  variable: '--font-heebo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Elite Landing Page Builder`,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Build premium, Apple-style landing pages for your business in minutes. No design skills required.',
  keywords: ['landing page builder', 'business website', 'lead generation', 'no code'],
  openGraph: {
    title: `${APP_NAME} — Elite Landing Page Builder`,
    description: 'Build premium, Apple-style landing pages for your business in minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${inter.variable} ${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
