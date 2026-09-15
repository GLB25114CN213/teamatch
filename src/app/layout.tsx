import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'TeamMatch — GLBITM Teammate Discovery & Matching Platform',
  description: 'Evidence-based student profiles and intelligent teammate matching strictly for verified GLBITM students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F7F5] text-gray-900 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="bg-[#051A14] text-[#9BB0A6] border-t border-[#B7F34A]/15 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs">
            <p className="font-extrabold text-[#F8F7F5]">TeamMatch GLBITM Edition © 2026</p>
            <p className="mt-1 text-[#9BB0A6]">Private teammate discovery platform for GL Bajaj Institute of Technology and Management.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
