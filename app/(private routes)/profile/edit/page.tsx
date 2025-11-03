'use client';

import { useAuthStore } from '@/lib/store/authStore';
import css from '../../../../components/EditProfilePage/EditProfilePage.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { updateMe } from '@/lib/api/clientApi';

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || username === user?.username) {
      toast.error('No changes to save');
      return;
    }
    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      toast.success('Profile updated!');
      router.push('/profile');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={
            user?.avatar ||
            'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'
          }
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
