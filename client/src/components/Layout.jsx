import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen relative bg-surface">
      {/* Blueprint grid */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-blueprint" />
      {/* Scan line */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-scan-line" />
      {/* Ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-ambient-glow" />
      <Navbar />
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
