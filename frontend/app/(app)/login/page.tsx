'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UseAuth } from '@/app/state/AuthProvider';
import Loading from '../extra/Loading';
import Auth from '@/app/hooks/useAuth';

const LoginPage = () => {
  const { handleLogin, role, authToken, handleGetUser } = UseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    handleGetUser();
  }, []);

  useEffect(() => {
    if (authToken && role) {
      if (redirect) router.push(redirect);
      else if (role === 'DOCTOR') router.push('/doctor');
      else if (role === 'ADMIN') router.push('/admin');
      else if (role === 'PATIENT') router.push('/patient');
    }
  }, [authToken, role, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await handleLogin(email, password);

      const userRole = res?.role || role;

      if (redirect) router.push(redirect);
      else if (userRole === 'DOCTOR') router.push('/doctor');
      else if (userRole === 'ADMIN') router.push('/admin');
      else if (userRole === 'PATIENT') router.push('/patient');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <Auth redirectIfAuth='/byrole'>

    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-green-100">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username"
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
            </Auth>
  );
};

export default LoginPage;
