'use client';

import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';

export default function AuthNavigation() {
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      toast.success('Logged out successfully');
      router.push('/sign-in');
    } catch {
      toast.error('Logout failed');
    }
  };

  if (isAuthenticated && user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user.email}</p>
          <button onClick={handleLogout} className={css.logoutButton}>
            Logout
          </button>
        </li>
      </>
    );
  }
  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
