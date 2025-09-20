import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import DashboardSidebar from '@/components/dashboard-sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'QRify Dashboard',
  description: 'Generate and manage your QR codes.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 bg-muted/40">{children}</main>
    </div>
  );
}
