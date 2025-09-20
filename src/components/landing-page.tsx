import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

const features = [
  { name: 'Single-Use QR Codes', description: 'Create QR codes that expire after a single scan for maximum security.' },
  { name: 'AI-Powered URL Enhancement', description: 'Turn any search term into a valid, scannable URL automatically.' },
  { name: 'Analytics & Tracking', description: 'See how many times your QR codes are scanned (coming soon).' },
  { name: 'Easy to Use', description: 'A simple, intuitive interface for quick QR code generation.' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <svg
              width="28"
              height="28"
              viewBox="0 0 100 100"
              className="text-primary"
            >
              <path
                fill="currentColor"
                d="M10 10h30v30H10z m5 5v20h20V15z m35-5h30v30H50z m5 5v20h20V15z M10 50h30v30H10z m5 5v20h20V55z m42.5 12.5h20v20h-20z m22.5 10h5v2.5h-5z m-5-5h2.5v5h-5v-2.5h2.5z m-2.5-5h5v5h-5z m-2.5 12.5h2.5v2.5h-2.5z m-12.5-17.5h5v5h-5z m10 2.5h2.5v5h-2.5z m-5-10h2.5v5h-2.5z m15 5h2.5v2.5h-2.5z m-10 12.5h5v2.5h-5z m5 5h2.5v2.5h-2.5z m10-2.5h2.5v5h-2.5z m2.5 5h2.5v2.5h-2.5z m-2.5 2.5h-2.5v5h5v-2.5h-2.5z m-12.5 0h-2.5v2.5h5v-2.5h-2.5z m-5-10h-2.5v2.5h2.5z m-2.5-2.5v-2.5h-5v5h2.5v-2.5h2.5z M50 50h2.5v2.5H50V50zm5 0h2.5v2.5H55V50zm-5 5h2.5v2.5H50v-2.5zm5 0h2.5v2.5H55v-2.5z"
              />
            </svg>
            <h1 className="text-2xl font-bold">QRify</h1>
        </div>
        <nav>
          <Button asChild variant="ghost">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            The Future of QR Codes is Here
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Create secure, single-use QR codes with the power of AI. Perfect for tickets, private links, and one-time offers.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/dashboard">Generate Your First QR Code</Link>
          </Button>
        </section>

        <section className="bg-muted/40 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold">Why Choose QRify?</h3>
                    <p className="text-muted-foreground mt-2">Everything you need to create intelligent, secure QR codes.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.name}>
                            <CardHeader>
                                <div className="bg-primary/10 text-primary h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                                    <Check className="h-6 w-6" />
                                </div>
                                <CardTitle>{feature.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} QRify. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
