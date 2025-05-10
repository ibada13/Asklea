'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/app/hooks/auth';

const LoginPage = () => {
  const { login, loading, isDoctor, isAdmin, isPatient, checkUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser().then(() => {
      if (isDoctor) {
        router.push('/doctor-dashboard');
      } else if (isAdmin) {
        router.push('/admin-dashboard');
      } else if (isPatient) {
        router.push('/patient-dashboard');
      }
    });
  }, [isDoctor, isAdmin, isPatient, checkUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password).then(() => {
      if (isDoctor) {
        router.push('/doctor-dashboard');
      } else if (isAdmin) {
        router.push('/admin-dashboard');
      } else if (isPatient) {
        router.push('/patient-dashboard');
      }
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
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
