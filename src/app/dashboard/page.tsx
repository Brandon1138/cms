'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				router.push('/login');
			} else {
				setCurrentUser(user);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				Loading...
			</div>
		);
	}

	if (!currentUser) {
		return null; // or a spinner
	}

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>
			<p className="mt-2">Logged in as: {currentUser.email}</p>
			{/* Place your dashboard components here */}
		</div>
	);
}
