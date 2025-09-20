'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { enhanceRedirectURL } from '@/ai/flows/enhance-redirect-flow';
import { validateRedirectURL } from '@/ai/flows/validate-redirect-url-flow';

const urlSchema = z.object({
  url: z.string().min(1, { message: 'Please enter a URL or search term.' }),
});

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;

async function getFinalUrl(input: string): Promise<string> {
  if (URL_REGEX.test(input)) {
    const urlToValidate = input.startsWith('http') ? input : `https://${input}`;
    const validationResult = await validateRedirectURL({ url: urlToValidate });
    if (validationResult.isValid) {
      return urlToValidate;
    }
    throw new Error(validationResult.reason || 'Invalid or unsafe URL provided.');
  } else {
    const enhancementResult = await enhanceRedirectURL({ userInput: input });
    return enhancementResult.enhancedURL;
  }
}

export async function generateQrCodeAction(
  prevState: any,
  formData: FormData
) {
  const data = {
    url: formData.get('url') as string,
  };
  const origin = formData.get('origin') as string;

  const validatedFields = urlSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.errors[0].message,
    };
  }

  try {
    const finalUrl = await getFinalUrl(validatedFields.data.url);

    if (!finalUrl) {
      return { message: 'Could not determine a valid URL.' };
    }
    
    const docData = {
      url: finalUrl,
      createdAt: serverTimestamp(),
    };

    const qrCodeDocRef = await addDoc(collection(db, 'qr-codes'), docData);
    const qrCodeId = qrCodeDocRef.id;
    const scanUrl = `${origin}/api/qr/${qrCodeId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(scanUrl)}`;

    return {
      qrCodeUrl,
      finalUrl,
      message: 'success',
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      message: errorMessage,
    };
  }
}
