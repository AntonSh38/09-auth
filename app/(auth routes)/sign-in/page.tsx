'use client';

import { useState } from 'react';
import css from '../../../components/SignInPage/SignInPage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setUser = useAuthStore(state => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login({ email, password });
      setUser(user);
      toast.success('Welcome back');
      router.push('/profile');
    } catch {
      const errorMessage = 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <main className={css.mainContent}>
      <form onSubmit={handleSubmit} className={css.form}>
        <h1 className={css.formTitle}>Sign in</h1>

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
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}
