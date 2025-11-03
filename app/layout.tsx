import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
  weight: ['400', '600', '700'],
  variable: '--font-roboto',
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NoteHub - Fast and Modern Note-Taking App',
  description:
    'NoteHub is a fast, modern, and user-friendly note-taking app. Create, edit, search, and organize your notes with tags and categories - all instantly and seamlessly.',
  openGraph: {
    title: 'NoteHub - Fast and Modern Note-Taking App',
    description:
      'Create, organize, and search your notes effortlessly with NoteHub. A modern web app for efficient note management.',
    url: 'https://08-zustand-six-blue.vercel.app/',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'note title',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoteHub - Fast and Modern Note-Taking App',
    description:
      'Create, organize, and search your notes effortlessly with NoteHub - a modern, fast note-taking experience.',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            {children}
            {modal}
            <Footer />
            <Toaster position="top-center" />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
