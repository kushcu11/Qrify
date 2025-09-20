'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const urlSchema = z.object({
  url: z.string().min(1, { message: 'Please enter a URL or search term.' }),
  userId: z.string().optional(),
});

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;

export async function generateQrCodeAction(data: { url: string; userId?: string }, origin: string) {
    const validatedFields = urlSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.errors[0].message,
        };
    }

    const { url, userId } = validatedFields.data;
    let finalUrl = url;
    let isSingleUse = true;

    try {
        if (URL_REGEX.test(url)) {
            const httpUrl = url.startsWith('http') ? url : `https://${url}`;
            finalUrl = httpUrl;
        } else {
           isSingleUse = false;
           finalUrl = url;
        }
        
        let scanUrl;
        if (isSingleUse) {
             const docData: { url: string; createdAt: any; userId?: string } = {
                url: finalUrl,
                createdAt: serverTimestamp(),
            };
            if (userId) {
                docData.userId = userId;
            }

             const qrCodeDocRef = await addDoc(collection(db, 'qr-codes'), docData);
            const qrCodeId = qrCodeDocRef.id;
            scanUrl = `${origin}/api/qr/${qrCodeId}`;
        } else {
            scanUrl = finalUrl;
        }

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(scanUrl)}`;
        
        return {
            success: true,
            qrCodeUrl,
            finalUrl,
            error: null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        if (errorMessage.includes('Failed to generate content') || errorMessage.includes('upstream') || errorMessage.includes('permission-denied')) {
            return {
                success: false,
                error: 'The AI service or database is currently unavailable. Please try again later.'
            };
        }
        return {
            success: false,
            error: errorMessage,
        };
    }
}
