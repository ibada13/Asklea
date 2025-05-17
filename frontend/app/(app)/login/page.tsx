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
  }, [isDoctor, isAdmin, isPatient, redirect, router]);

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
