import QrGenerator from '@/components/qr-generator';

export default function DashboardPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <QrGenerator />
    </div>
  );
}
