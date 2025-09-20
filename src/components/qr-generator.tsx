'use client';

import { useState, useTransition, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateQrCodeAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Download, Copy, QrCode, AlertCircle } from 'lucide-react';
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
        <span className="animate-spin">…</span>
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
  const [formKey, setFormKey] = useState(Date.now()); // Used to reset the form
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);
  
  const showResult = state.message === 'success';
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

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <svg width="24" height="24" viewBox="0 0 100 100" className="text-primary"><path fill="currentColor" d="M10 10h30v30H10z m5 5v20h20V15z m35-5h30v30H50z m5 5v20h20V15z M10 50h30v30H10z m5 5v20h20V55z m42.5 12.5h20v20h-20z m22.5 10h5v2.5h-5z m-5-5h2.5v5h-5v-2.5h2.5z m-2.5-5h5v5h-5z m-2.5 12.5h2.5v2.5h-2.5z m-12.5-17.5h5v5h-5z m10 2.5h2.5v5h-2.5z m-5-10h2.5v5h-2.5z m15 5h2.5v2.5h-2.5z m-10 12.5h5v2.5h-5z m5 5h2.5v2.5h-2.5z m10-2.5h2.5v5h-2.5z m2.5 5h2.5v2.5h-2.5z m-2.5 2.5h-2.5v5h5v-2.5h-2.5z m-12.5 0h-2.5v2.5h5v-2.5h-2.5z m-5-10h-2.5v2.5h2.5z m-2.5-2.5v-2.5h-5v5h2.5v-2.5h2.5z M50 50h2.5v2.5H50V50zm5 0h2.5v2.5H55V50zm-5 5h2.5v2.5H50v-2.5zm5 0h2.5v2.5H55v-2.5z"/></svg>
          QR Code Generator
        </CardTitle>
        <CardDescription>Enter a URL or search term to generate a single-use QR code.</CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} action={formAction} className="space-y-6">
          <Input name="url" placeholder="e.g., 'Firebase docs' or 'https://google.com'" required />
          <input type="hidden" name="origin" value={origin} />
          {showError && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>

        <div className="mt-6 flex flex-col items-center gap-4">
          {!showResult && (
             <div className="w-full h-64 flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed">
                <QrCode className="h-24 w-24 text-muted-foreground/50" />
             </div>
          )}

          {showResult && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in-50 duration-500 w-full">
              <Image
                src={state.qrCodeUrl}
                alt="Generated QR Code"
                width={256}
                height={256}
                className="rounded-lg shadow-lg border bg-white"
                priority
              />
              <a href={state.finalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline break-all text-center px-4">
                {state.finalUrl}
              </a>
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
        </div>
      </CardContent>
    </Card>
  );
}
