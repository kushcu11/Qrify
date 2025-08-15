'use server';

import { z } from 'zod';
import { enhanceRedirectURL } from '@/ai/flows/enhance-redirect-flow';
import { validateRedirectURL } from '@/ai/flows/validate-redirect-url-flow';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

    const { url } = validatedFields.data;
    let finalUrl = url;

    try {
        if (URL_REGEX.test(url)) {
            const httpUrl = url.startsWith('http') ? url : `https://${url}`;
            const validation = await validateRedirectURL({ url: httpUrl });
            if (!validation.isValid) {
                throw new Error(validation.reason || 'The provided URL is not valid or safe.');
            }
            finalUrl = httpUrl;
        } else {
            const result = await enhanceRedirectURL({ userInput: url });
            if (!result.enhancedURL) {
                throw new Error('Could not find a valid URL for your search term.');
            }
            finalUrl = result.enhancedURL;
        }
        
        const qrCodeDocRef = await addDoc(collection(db, 'qr-codes'), {
            url: finalUrl,
            createdAt: serverTimestamp(),
        });

        const qrCodeId = qrCodeDocRef.id;
        const scanUrl = `${origin}/api/qr/${qrCodeId}`;

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(scanUrl)}`;
        
        return {
            success: true,
            qrCodeUrl,
            finalUrl,
            error: null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        if (errorMessage.includes('Failed to generate content') || errorMessage.includes('upstream')) {
            return {
                success: false,
                error: 'The AI service is currently unavailable. Please try again later.'
            };
        }
        return {
            success: false,
            error: errorMessage,
        };
    }
}
