import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignIn({ label }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!CLIENT_ID) return;

    const initGSI = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          try {
            await googleLogin(response.credential);
            navigate('/');
          } catch (err) {
            setError(err.message);
          }
        },
        cancel_on_tap_outside: false,
      });
      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          type: 'standard',
          shape: 'pill',
          theme: 'outline',
          text: label === 'signup' ? 'signup_with' : 'signin_with',
          size: 'large',
          width: btnRef.current.offsetWidth || 320,
          logo_alignment: 'left',
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGSI();
    } else {
      const check = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(check);
          initGSI();
        }
      }, 100);
      return () => clearInterval(check);
    }
  }, [googleLogin, navigate, label]);

  if (!CLIENT_ID) {
    return (
      <div className="text-xs text-gray-500 text-center py-2 px-4 rounded-xl border border-white/[0.06]">
        Google Sign-In not configured (add VITE_GOOGLE_CLIENT_ID)
      </div>
    );
  }

  return (
    <div>
      <div ref={btnRef} className="flex justify-center min-h-[40px]" />
      {error && (
        <p className="text-xs text-red-400 text-center mt-2">{error}</p>
      )}
    </div>
  );
}
