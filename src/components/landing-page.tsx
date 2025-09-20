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
import { Check, ShieldCheck, Zap, BarChartBig } from 'lucide-react';
import QrGenerator from './qr-generator';

const features = [
  { 
    name: 'Single-Use Codes', 
    description: 'Create QR codes that expire after a single scan for maximum security.',
    icon: <ShieldCheck className="h-8 w-8 text-primary" />
  },
  { 
    name: 'AI-Powered URLs', 
    description: 'Turn any search term into a valid, scannable URL automatically.',
    icon: <Zap className="h-8 w-8 text-primary" />
  },
  { 
    name: 'Usage Analytics', 
    description: 'See how many times your QR codes are scanned (coming soon).',
    icon: <BarChartBig className="h-8 w-8 text-primary" />
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <svg
              width="32"
              height="32"
              viewBox="0 0 100 100"
              className="text-primary"
            >
              <path
                fill="currentColor"
                d="M10 10h30v30H10z m5 5v20h20V15z m35-5h30v30H50z m5 5v20h20V15z M10 50h30v30H10z m5 5v20h20V55z m42.5 12.5h20v20h-20z m22.5 10h5v2.5h-5z m-5-5h2.5v5h-5v-2.5h2.5z m-2.5-5h5v5h-5z m-2.5 12.5h2.5v2.5h-2.5z m-12.5-17.5h5v5h-5z m10 2.5h2.5v5h-2.5z m-5-10h2.5v5h-2.5z m15 5h2.5v2.5h-2.5z m-10 12.5h5v2.5h-5z m5 5h2.5v2.5h-2.5z m10-2.5h2.5v5h-2.5z m2.5 5h2.5v2.5h-2.5z m-2.5 2.5h-2.5v5h5v-2.5h-2.5z m-12.5 0h-2.5v2.5h5v-2.5h-2.5z m-5-10h-2.5v2.5h2.5z m-2.5-2.5v-2.5h-5v5h2.5v-2.5h2.5z M50 50h2.5v2.5H50V50zm5 0h2.5v2.5H55V50zm-5 5h2.5v2.5H50v-2.5zm5 0h2.5v2.5H55v-2.5z"
              />
            </svg>
            <h1 className="text-2xl font-bold tracking-tighter">QRify</h1>
        </div>
        <nav>
          <Button asChild>
            <Link href="/dashboard">Get Started Free</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center flex flex-col items-center">
          <h2 className="text-5xl font-extrabold tracking-tight lg:text-6xl max-w-3xl">
            The Smart Way to Create Secure QR Codes
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Create secure, single-use QR codes with the power of AI. Perfect for tickets, private links, and one-time offers.
          </p>
          <Button asChild size="lg" className="mt-10">
            <Link href="/dashboard">Generate Your First QR Code</Link>
          </Button>
        </section>

        <section className="bg-secondary py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Why Choose QRify?</h3>
                    <p className="text-muted-foreground text-lg mt-3 max-w-2xl mx-auto">Everything you need to create intelligent, secure QR codes in one simple platform.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.name} className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="items-center text-center">
                                <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mb-4 border-8 border-primary/5">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl">{feature.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-24">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold tracking-tight">Try It Now</h3>
                    <p className="text-muted-foreground text-lg mt-3 max-w-2xl mx-auto">Generate a single-use QR code in seconds. No sign-up required.</p>
                </div>
                <div className="flex justify-center">
                  <QrGenerator />
                </div>
            </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} QRify. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
