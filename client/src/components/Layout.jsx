import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen relative" style={{ background: '#050508' }}>
      {/* Grid lines */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-60"
        aria-hidden="true"
      />
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-ambient" aria-hidden="true" />

      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {children}
      </main>
    </div>
  );
}
