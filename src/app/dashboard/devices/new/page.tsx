'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Service {
	serviceDetails: string;
	serviceDuration: string;
	servicePrice: number;
}

export default function NewDevicePage() {
	const router = useRouter();
	const [deviceType, setDeviceType] = useState('');
	const [model, setModel] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [services, setServices] = useState<Service[]>([
		{
			serviceDetails: '',
			serviceDuration: '',
			servicePrice: 0,
		},
	]);
	const [errorMsg, setErrorMsg] = useState('');

	// Handle adding new service rows
	const handleAddService = () => {
		setServices((prev) => [
			...prev,
			{ serviceDetails: '', serviceDuration: '', servicePrice: 0 },
		]);
	};

	// Handle changes in each service row
	const handleServiceChange = (
		index: number,
		field: keyof Service,
		value: string | number
	) => {
		setServices((prev) => {
			const updated = [...prev];
			// We cast value to match the type for servicePrice vs. strings
			if (field === 'servicePrice') {
				updated[index][field] = Number(value);
			} else {
				updated[index][field] = value as string;
			}
			return updated;
		});
	};

	// Submit the form
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg('');

		try {
			const newDevice = {
				deviceType,
				model,
				imageUrl,
				services,
			};

			const res = await fetch('/api/devices', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newDevice),
			});

			if (!res.ok) {
				const { error } = await res.json();
				throw new Error(error || 'Failed to create device');
			}

			// If successful, redirect to the devices list
			router.push('/dashboard/devices');
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMsg(error.message);
			} else {
				setErrorMsg('An unknown error occurred');
			}
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h2 className="text-xl font-semibold mb-4">Add New Device</h2>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div>
					<label className="block mb-1">Device Type</label>
					<input
						type="text"
						value={deviceType}
						onChange={(e) => setDeviceType(e.target.value)}
						className="border p-2 w-full"
						required
					/>
				</div>

				<div>
					<label className="block mb-1">Model</label>
					<input
						type="text"
						value={model}
						onChange={(e) => setModel(e.target.value)}
						className="border p-2 w-full"
						required
					/>
				</div>

				<div>
					<label className="block mb-1">Image URL</label>
					<input
						type="text"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						className="border p-2 w-full"
					/>
				</div>

				<div className="border p-2">
					<p className="font-bold mb-2">Services</p>
					{services.map((service, index) => (
						<div key={index} className="flex gap-2 mb-2">
							<input
								type="text"
								placeholder="Service details"
								value={service.serviceDetails}
								onChange={(e) =>
									handleServiceChange(index, 'serviceDetails', e.target.value)
								}
								className="border p-1 w-1/2"
								required
							/>
							<input
								type="text"
								placeholder="Duration (e.g., '60 minutes')"
								value={service.serviceDuration}
								onChange={(e) =>
									handleServiceChange(index, 'serviceDuration', e.target.value)
								}
								className="border p-1 w-1/4"
							/>
							<input
								type="number"
								placeholder="Price"
								value={service.servicePrice}
								onChange={(e) =>
									handleServiceChange(index, 'servicePrice', e.target.value)
								}
								className="border p-1 w-1/4"
								required
							/>
						</div>
					))}

					<button
						type="button"
						onClick={handleAddService}
						className="bg-gray-300 px-2 py-1"
					>
						+ Add Service
					</button>
				</div>

				{errorMsg && <p className="text-red-600">{errorMsg}</p>}

				<button
					type="submit"
					className="bg-green-600 text-white px-4 py-2 self-start"
				>
					Create Device
				</button>
			</form>
		</div>
	);
}
