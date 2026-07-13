import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DezDownload | Free Universal Media Downloader',
  description: 'The ultimate, latency-optimized client routing architecture for extracting high-quality video, audio, and images from any social platform instantly. No ads, no limits.',
  keywords: 'media downloader, universal downloader, Next.js downloader, video extractor, DezDownload, DezReacher',
  manifest: '/manifest.json',
  authors: [{ name: 'DezReacher' }],
  creator: 'DezReacher',
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DezDownload"
  },
  openGraph: {
    title: 'DezDownload | Free Universal Media Downloader',
    description: 'The ultimate, latency-optimized client routing architecture for extracting high-quality video, audio, and images from any social platform instantly. No ads, no limits.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DezDownload | Free Universal Media Downloader',
    description: 'The ultimate, latency-optimized client routing architecture for extracting high-quality video, audio, and images from any social platform instantly. No ads, no limits.',
  }
};

export const viewport: Viewport = {
  themeColor: '#050505',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] text-[#fafafa] font-sans min-h-screen antialiased overflow-x-hidden w-full`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
