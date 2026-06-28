import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const ERROR_MESSAGES = {
  'google token verification failed': 'Google sign-in failed. Please ensure the domain is authorized in the Google Cloud Console (Authorized JavaScript origins).',
  'database unavailable': 'Could not connect to the server. Please try again.',
  'database error': 'Something went wrong. Please try signing in again.',
};

function friendlyError(message) {
  const lower = message.toLowerCase();
  for (const [key, val] of Object.entries(ERROR_MESSAGES)) {
    if (lower.includes(key)) return val;
  }
  return message || 'Google sign-in failed. Please try again.';
}

export default function GoogleSignIn({ label, role }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCallback = useCallback(async (response) => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const user = await googleLogin(response.credential, role);
      navigate(user.role === 'provider' ? '/provider/dashboard' : '/');
    } catch (err) {
      setError(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  }, [googleLogin, navigate, loading, role]);

  useEffect(() => {
    if (!CLIENT_ID) return;

    const initGSI = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCallback,
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
  }, [handleCallback, label]);

  if (!CLIENT_ID) {
    return (
      <div className="text-xs text-gray-500 text-center py-2 px-4 rounded-xl border border-white/[0.06]">
        Google Sign-In not configured (add VITE_GOOGLE_CLIENT_ID)
      </div>
    );
  }

  return (
    <div>
      <div ref={btnRef} className={`flex justify-center min-h-[40px] ${loading ? 'opacity-50 pointer-events-none' : ''}`} />
      {loading && (
        <p className="text-xs text-gray-400 text-center mt-2">Signing in...</p>
      )}
      {error && (
        <p className="text-xs text-red-400 text-center mt-2">{error}</p>
      )}
    </div>
  );
}
