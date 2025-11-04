import css from '../../../components/ProfilePage/ProfilePage.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getMeServer } from '@/lib/api/serverApi';

export const metadata: Metadata = {
  title: 'Your Profile - NoteHub',
  description: 'View and manage your profile information on NoteHub.',
  openGraph: {
    title: 'Your Profile - NoteHub',
    description: 'Manage your account details and preferences on NoteHub.',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Profile page preview on NoteHub',
      },
    ],
  },
};

export default async function ProfilePage() {
  const user = await getMeServer();

  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
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
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
