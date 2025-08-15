import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'QR code ID is missing.' }, { status: 400 });
    }

    const qrDocRef = doc(db, 'qr-codes', id);
    const qrDoc = await getDoc(qrDocRef);

    if (qrDoc.exists()) {
      const { url } = qrDoc.data();
      await deleteDoc(qrDocRef);
      return NextResponse.redirect(url);
    } else {
      return NextResponse.json({ error: 'This QR code is invalid or has already been scanned.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error handling QR code scan:', error);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
}
