import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

interface Service {
	serviceDetails: string;
	serviceDuration: string;
	servicePrice: number;
}

interface DeviceData {
	deviceType: string;
	model: string;
	imageUrl: string;
	services: Service[];
}

// GET: List all devices
export async function GET() {
	try {
		const devicesRef = collection(db, 'devices');
		const snapshot = await getDocs(devicesRef);

		const devices = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return NextResponse.json({ devices }, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
	}
}

// POST: Create a new device
export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as DeviceData;
		const devicesRef = collection(db, 'devices');
		const docRef = await addDoc(devicesRef, body);

		return NextResponse.json({ id: docRef.id }, { status: 201 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
	}
}
