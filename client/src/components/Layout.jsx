import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen relative bg-[#fafaf9]">
      {/* Subtle dot-grid texture */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-dot-grid opacity-[0.07]" />
      {/* Dim ambient orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.04) 0%, transparent 70%)' }} />
      <Navbar />
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
