import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'QRify Pro',
  description: 'The Ultimate Platform for Digital Engagement',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <div className={`${inter.variable} font-body antialiased`}>
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
