import type { Metadata } from 'next';
import DashboardSidebar from '@/components/dashboard-sidebar';

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
      <main className="flex-1 bg-secondary">{children}</main>
    </div>
  );
}
