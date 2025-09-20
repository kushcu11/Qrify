'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateQrCodeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Copy, QrCode, AlertCircle, Link as LinkIcon, RotateCw } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const initialState = {
  message: '',
  qrCodeUrl: '',
  finalUrl: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <span className="animate-spin mr-2">
            <RotateCw className="h-4 w-4" />
          </span>
           Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Generate QR Code
        </>
      )}
    </Button>
  );
}

export default function QrGenerator() {
  const [state, formAction] = useFormState(generateQrCodeAction, initialState);
  const [origin, setOrigin] = useState('');
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);
  
  const showResult = state.message === 'success' && state.qrCodeUrl;
  const showError = state.message && state.message !== 'success';

  const handleCopy = () => {
    if (!state.finalUrl) return;
    navigator.clipboard.writeText(state.finalUrl)
      .then(() => {
        toast({
          title: 'Copied!',
          description: 'Destination URL copied to clipboard.',
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
    if (!state.qrCodeUrl) return;
    fetch(state.qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const filename = `${state.finalUrl.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 50)}_qr.png`;
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

  const handleFormAction = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl rounded-2xl border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          QR Code Generator
        </CardTitle>
        <CardDescription>Enter a URL or search term to generate a single-use QR code.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-6">
            <form action={handleFormAction} className="space-y-4">
              <Input name="url" placeholder="e.g., 'Firebase docs' or 'google.com'" required className="h-12 text-base" />
              <input type="hidden" name="origin" value={origin} />
              <SubmitButton />
            </form>
            {showError && (
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 bg-secondary p-6 rounded-lg h-full">
            {isPending && !showResult && (
              <div className="flex flex-col items-center justify-center gap-4 w-full">
                <Skeleton className="h-64 w-64 rounded-lg" />
                <Skeleton className="h-4 w-48" />
              </div>
            )}

            {!isPending && !showResult && (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                  <QrCode className="h-24 w-24 mb-4" />
                  <p className="font-medium">Your QR code will appear here</p>
                  <p className="text-sm">Enter a URL or search term to begin.</p>
              </div>
            )}

            {showResult && (
              <div className="flex flex-col items-center gap-4 animate-in fade-in-50 duration-500 w-full">
                <Image
                  src={state.qrCodeUrl}
                  alt="Generated QR Code"
                  width={256}
                  height={256}
                  className="rounded-lg shadow-lg border bg-white p-2"
                  priority
                />
                 <div className="flex items-center gap-2 text-sm text-muted-foreground text-center break-all max-w-full">
                  <LinkIcon className="h-4 w-4 shrink-0"/>
                  <a href={state.finalUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:text-primary underline-offset-4 hover:underline">
                    {state.finalUrl}
                  </a>
                </div>
                <div className="flex gap-2 w-full pt-2">
                  <Button variant="outline" onClick={handleDownload} className="flex-1">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button variant="outline" onClick={handleCopy} className="flex-1">
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
