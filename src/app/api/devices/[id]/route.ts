import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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

// GET: Retrieve a single device by ID
export async function GET(
	_req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	try {
		const deviceDoc = doc(db, 'devices', id);
		const snapshot = await getDoc(deviceDoc);

		if (!snapshot.exists()) {
			return NextResponse.json({ error: 'Device not found' }, { status: 404 });
		}

		return NextResponse.json(
			{ id: snapshot.id, ...snapshot.data() },
			{ status: 200 }
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
	}
}

// PATCH: Update a device
export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	try {
		const body = (await req.json()) as Partial<DeviceData>;
		const deviceDoc = doc(db, 'devices', id);

		await updateDoc(deviceDoc, body);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
	}
}

// DELETE: Remove a device
export async function DELETE(
	_req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	try {
		const deviceDoc = doc(db, 'devices', id);
		await deleteDoc(deviceDoc);

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}
		return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
	}
}
