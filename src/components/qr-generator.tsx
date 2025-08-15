'use client';

import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateQrCodeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Copy, Loader2, QrCode } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  url: z.string().min(1, 'Please enter a URL or search term.'),
});

type FormSchema = z.infer<typeof formSchema>;

interface QrResult {
  qrCodeUrl: string;
  finalUrl: string;
}

export default function QrGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<QrResult | null>(null);
  const [origin, setOrigin] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = (data: FormSchema) => {
    setResult(null);
    form.clearErrors();
    startTransition(async () => {
      const response = await generateQrCodeAction(data, origin);
      if (response.success && response.qrCodeUrl && response.finalUrl) {
        setResult({
          qrCodeUrl: response.qrCodeUrl,
          finalUrl: response.finalUrl,
        });
      } else {
        form.setError('url', { type: 'manual', message: response.error });
      }
    });
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.qrCodeUrl)
      .then(() => {
        toast({
          title: 'Copied!',
          description: 'QR code image URL copied to clipboard.',
        });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Oops!',
          description: 'Failed to copy URL.',
        });
      });
  };
  
  const handleDownload = () => {
      if (!result) return;
      // We are downloading the QR code image from the external API directly
      // as the scan URL itself is not an image.
      fetch(result.qrCodeUrl)
          .then(response => response.blob())
          .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              const filename = `${result.finalUrl.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0,50)}_qr.png`;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
          })
          .catch(() => {
              toast({
                  variant: 'destructive',
                  title: 'Download Failed',
                  description: 'Could not download the QR code image.',
              });
          });
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto flex items-center justify-center gap-2 mb-2">
            <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary"><path fill="currentColor" d="M10 10h30v30H10z m5 5v20h20V15z m35-5h30v30H50z m5 5v20h20V15z M10 50h30v30H10z m5 5v20h20V55z m42.5 12.5h20v20h-20z m22.5 10h5v2.5h-5z m-5-5h2.5v5h-5v-2.5h2.5z m-2.5-5h5v5h-5z m-2.5 12.5h2.5v2.5h-2.5z m-12.5-17.5h5v5h-5z m10 2.5h2.5v5h-2.5z m-5-10h2.5v5h-2.5z m15 5h2.5v2.5h-2.5z m-10 12.5h5v2.5h-5z m5 5h2.5v2.5h-2.5z m10-2.5h2.5v5h-2.5z m2.5 5h2.5v2.5h-2.5z m-2.5 2.5h-2.5v5h5v-2.5h-2.5z m-12.5 0h-2.5v2.5h5v-2.5h-2.5z m-5-10h-2.5v2.5h2.5z m-2.5-2.5v-2.5h-5v5h2.5v-2.5h2.5z M50 50h2.5v2.5H50V50zm5 0h2.5v2.5H55V50zm-5 5h2.5v2.5H50v-2.5zm5 0h2.5v2.5H55v-2.5z"/></svg>
            <CardTitle className="font-headline text-3xl">QRify</CardTitle>
        </div>
        <CardDescription>Enter a URL or search term to generate a single-use QR code.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">URL or Search Term</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., youtube.com or 'best tech news'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending || !origin}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Generate QR Code</>
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-6 flex flex-col items-center gap-4">
          {isPending && (
            <div className="flex flex-col items-center gap-4 w-full">
              <Skeleton className="h-64 w-64 rounded-lg" />
              <Skeleton className="h-4 w-48" />
            </div>
          )}
          {result && !isPending && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in-50 duration-500 w-full">
              <Image
                src={result.qrCodeUrl}
                alt="Generated QR Code"
                width={256}
                height={256}
                className="rounded-lg shadow-lg border bg-white"
                priority
              />
               <a href={result.finalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline break-all text-center px-4">
                {result.finalUrl}
              </a>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
            </div>
          )}
          {!result && !isPending && (
             <div className="h-64 w-64 flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed">
                <QrCode className="h-24 w-24 text-muted-foreground/50" />
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
