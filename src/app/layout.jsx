import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'Developer Notebook',
  description: 'A baseline note-taking application for practicing Server Actions and data fetching patterns in Next.js.',
  openGraph: {
    title: 'Developer Notebook',
    description: 'A note-taking app demonstrating server-side data fetching and Server Actions with the Next.js App Router.',
    siteName: 'Developer Notebook',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-neo-bg text-black selection:bg-neo-yellow selection:text-black">
        <main className="min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
