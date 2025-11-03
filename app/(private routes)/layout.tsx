import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View and manage your personal profile on NoteHub.',
  openGraph: {
    title: 'Profile | NoteHub',
    description: 'View and manage your personal profile on NoteHub.',
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
