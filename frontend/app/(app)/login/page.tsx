'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/hooks/auth';

const LoginPage = () => {
  const { login, isAuth, loading, isDoctor, isAdmin, isPatient, getUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (isAuth) {
      if (redirect) {
        router.push(redirect);
      } else if (isDoctor) {
        router.push('/doctor');
      } else if (isAdmin) {
        router.push('/admin');
      } else if (isPatient) {
        router.push('/patient');
      }
    }
  }, [isAuth, isDoctor, isAdmin, isPatient, redirect, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password).then(() => {
      if (redirect) {
        router.push(redirect);
      } else if (isDoctor) {
        router.push('/doctor');
      } else if (isAdmin) {
        router.push('/admin');
      } else if (isPatient) {
        router.push('/patient');
      }
    });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-green-100">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="username"
            required
            className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
