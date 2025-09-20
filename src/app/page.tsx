import QrGenerator from '@/components/qr-generator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/40">
      <div className="w-full max-w-lg">
        <QrGenerator />
      </div>
    </main>
  );
}
