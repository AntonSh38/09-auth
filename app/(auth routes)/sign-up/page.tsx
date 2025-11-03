'use client';

import { useRouter } from 'next/navigation';
import css from '../../../components/SignUpPage/SignUpPage.module.css';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store/authStore';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // const formData = new FormData(e.currentTarget);
    // const email = formData.get('email');
    // const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Registration failed');

      await fetch('/api/auth/session', { method: 'GET' });

      const userRes = await fetch('/api/users/me');
      if (!userRes.ok) throw new Error('Failed to fetch user');

      const user = await userRes.json();
      setUser(user);
      toast.success('Registration successful!');
      router.push('/profile');
    } catch (err) {
      console.error(err);
      setError('Registration failed');
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            className={css.input}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            className={css.input}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
