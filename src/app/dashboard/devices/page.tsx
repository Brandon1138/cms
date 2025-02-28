'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Device {
	id: string;
	deviceType: string;
	model: string;
	imageUrl: string;
	services: {
		serviceDetails: string;
		serviceDuration: string;
		servicePrice: number;
	}[];
}

export default function DevicesPage() {
	const [devices, setDevices] = useState<Device[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const res = await fetch('/api/devices');
				const data = await res.json();
				setDevices(data.devices || []);
			} catch (err) {
				console.error('Failed to fetch devices:', err);
			}
		};
		fetchDevices();
	}, []);

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Devices</h2>
			<button
				className="bg-green-600 text-white px-4 py-2 mb-4"
				onClick={() => router.push('/dashboard/devices/new')}
			>
				Add New Device
			</button>

			<ul className="space-y-4">
				{devices.map((device) => (
					<li key={device.id} className="border p-4">
						<p className="font-bold">{device.model}</p>
						<p>Type: {device.deviceType}</p>
						<p>Services: {device.services.length}</p>
						<button
							className="bg-blue-600 text-white px-2 py-1 mt-2 mr-2"
							onClick={() => router.push(`/dashboard/devices/${device.id}`)}
						>
							Edit
						</button>
						<button
							className="bg-red-600 text-white px-2 py-1 mt-2"
							onClick={async () => {
								try {
									await fetch(`/api/devices/${device.id}`, {
										method: 'DELETE',
									});
									setDevices((prev) => prev.filter((d) => d.id !== device.id));
								} catch (err) {
									console.error('Delete failed:', err);
								}
							}}
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
