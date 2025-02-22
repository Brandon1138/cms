'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push('/dashboard');
		} catch (err) {
			console.error('Login error:', err);
			setErrorMsg('Invalid credentials');
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<form onSubmit={handleSubmit} className="p-4 border flex flex-col gap-2">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border p-2"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-2"
				/>
				{errorMsg && <p className="text-red-600">{errorMsg}</p>}
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
