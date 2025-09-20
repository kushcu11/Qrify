'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const urlSchema = z.object({
  url: z.string().min(1, { message: 'Please enter a URL or search term.' }),
  userId: z.string().optional(),
});

export async function generateQrCodeAction(data: { url: string; userId?: string }, origin: string) {
    const validatedFields = urlSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.errors[0].message,
        };
    }

    const { url, userId } = validatedFields.data;
    
    try {
        const docData: { url: string; createdAt: any; userId?: string } = {
            url: url,
            createdAt: serverTimestamp(),
        };
        if (userId) {
            docData.userId = userId;
        }

        const qrCodeDocRef = await addDoc(collection(db, 'qr-codes'), docData);
        const qrCodeId = qrCodeDocRef.id;
        const scanUrl = `${origin}/api/qr/${qrCodeId}`;

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(scanUrl)}`;
        
        return {
            success: true,
            qrCodeUrl,
            finalUrl: url,
            error: null,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        if (errorMessage.includes('permission-denied')) {
            return {
                success: false,
                error: 'Database operation failed. Please check Firestore security rules.'
            };
        }
        return {
            success: false,
            error: errorMessage,
        };
    }
}
