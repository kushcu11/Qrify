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
  url: z.string().min(1, 'Please enter a URL or text.'),
});

type FormSchema = z.infer<typeof formSchema>;

interface QrResult {
  qrCodeUrl: string;
  finalUrl: string;
}

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;

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
      try {
        const response = await generateQrCodeAction({ url: data.url }, origin);

        if (response.success && response.qrCodeUrl && response.finalUrl) {
          setResult({
            qrCodeUrl: response.qrCodeUrl,
            finalUrl: response.finalUrl,
          });
        } else {
          form.setError('url', { type: 'manual', message: response.error || 'Failed to generate QR code.' });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        if (errorMessage.includes('Failed to generate content') || errorMessage.includes('upstream')) {
          form.setError('url', { type: 'manual', message: 'The AI service is currently unavailable. Please try again later.' });
        } else {
          form.setError('url', { type: 'manual', message: errorMessage });
        }
      }
    });
  };

  const handleCopy = () => {
    if (!result) return;
    const isUrl = URL_REGEX.test(result.finalUrl);
    const textToCopy = isUrl ? result.qrCodeUrl : result.finalUrl;
    const description = isUrl ? 'QR code image URL copied to clipboard.' : 'Encoded text copied to clipboard.';

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: 'Copied!',
          description: description,
        });
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Oops!',
          description: 'Failed to copy.',
        });
      });
  };

  const handleDownload = () => {
    if (!result) return;
    fetch(result.qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const filename = `${result.finalUrl.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 50)}_qr.png`;
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

  const renderResultContent = () => {
    if (!result) return null;

    const isUrl = URL_REGEX.test(result.finalUrl);

    if (isUrl) {
      return (
        <a href={result.finalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline break-all text-center px-4">
          {result.finalUrl}
        </a>
      );
    }
    
    return (
       <p className="text-sm text-muted-foreground break-all text-center px-4">
          Encoded Text: "{result.finalUrl}"
        </p>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <svg width="24" height="24" viewBox="0 0 100 100" className="text-primary"><path fill="currentColor" d="M10 10h30v30H10z m5 5v20h20V15z m35-5h30v30H50z m5 5v20h20V15z M10 50h30v30H10z m5 5v20h20V55z m42.5 12.5h20v20h-20z m22.5 10h5v2.5h-5z m-5-5h2.5v5h-5v-2.5h2.5z m-2.5-5h5v5h-5z m-2.5 12.5h2.5v2.5h-2.5z m-12.5-17.5h5v5h-5z m10 2.5h2.5v5h-2.5z m-5-10h2.5v5h-2.5z m15 5h2.5v2.5h-2.5z m-10 12.5h5v2.5h-5z m5 5h2.5v2.5h-2.5z m10-2.5h2.5v5h-2.5z m2.5 5h2.5v2.5h-2.5z m-2.5 2.5h-2.5v5h5v-2.5h-2.5z m-12.5 0h-2.5v2.5h5v-2.5h-2.5z m-5-10h-2.5v2.5h2.5z m-2.5-2.5v-2.5h-5v5h2.5v-2.5h2.5z M50 50h2.5v2.5H50V50zm5 0h2.5v2.5H55V50zm-5 5h2.5v2.5H50v-2.5zm5 0h2.5v2.5H55v-2.5z"/></svg>
          QRify
        </CardTitle>
        <CardDescription>Enter a URL for a single-use QR code, or any text to encode it directly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">URL or Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a URL or any text" {...field} />
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
               {renderResultContent()}
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </div>
          )}
          {!result && !isPending && (
             <div className="w-full h-64 flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed">
                <QrCode className="h-24 w-24 text-muted-foreground/50" />
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
