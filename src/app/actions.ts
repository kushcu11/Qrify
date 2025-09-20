'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { enhanceRedirectURL } from '@/ai/flows/enhance-redirect-flow';

const urlSchema = z.object({
  url: z.string().min(1, { message: 'Please enter a URL or search term.' }),
});

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;

export async function generateQrCodeAction(data: { url: string }, origin: string) {
  const validatedFields = urlSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.errors[0].message,
    };
  }

  let finalUrl = validatedFields.data.url;
  let isSingleUse = true;

  try {
    if (URL_REGEX.test(finalUrl)) {
      finalUrl = finalUrl.startsWith('http') ? finalUrl : `https://${finalUrl}`;
    } else {
      isSingleUse = false;
    }

    if (isSingleUse) {
      const docData = {
        url: finalUrl,
        createdAt: serverTimestamp(),
      };
      const qrCodeDocRef = await addDoc(collection(db, 'qr-codes'), docData);
      const qrCodeId = qrCodeDocRef.id;
      const scanUrl = `${origin}/api/qr/${qrCodeId}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(scanUrl)}`;

      return {
        success: true,
        qrCodeUrl,
        finalUrl: finalUrl,
      };
    } else {
      // Not a URL, treat as plain text
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(finalUrl)}`;
      return {
        success: true,
        qrCodeUrl,
        finalUrl: finalUrl,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
