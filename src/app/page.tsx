'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMsg('');

		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push('/dashboard/devices');
		} catch (err) {
			setErrorMsg('Invalid credentials');
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<form onSubmit={handleSubmit} className="border p-4 flex flex-col gap-2">
				<h1 className="text-xl font-bold mb-2">Login</h1>
				<input
					type="email"
					placeholder="Email"
					className="border p-2"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="border p-2"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				{errorMsg && <p className="text-red-500">{errorMsg}</p>}
				<button
					type="submit"
					className="bg-blue-600 text-white p-2 hover:bg-blue-700"
				>
					Login
				</button>
			</form>
		</div>
	);
}
