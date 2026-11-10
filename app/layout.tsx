import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Inkloom AI - BrandGuard | Evidence-Grounded Brand Governance',
  description:
    'An evidence-grounded, multimodal, human-controlled brand governance platform that reviews content before it is published.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
