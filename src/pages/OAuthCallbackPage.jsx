// src/pages/OAuthCallbackPage.jsx
// Handles redirect from Google OAuth, extracts token, sets auth state

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { setAuthFromToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Google sign-in failed. Redirecting...');
        setTimeout(() => navigate('/login?error=google_auth_failed'), 2000);
        return;
      }

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await setAuthFromToken(token);
        navigate('/dashboard', { replace: true });
      } catch {
        setError('Authentication failed. Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    processCallback();
  }, [searchParams, setAuthFromToken, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0f172a',
      gap: '20px'
    }}>
      {error ? (
        <p style={{ color: '#ef4444', fontSize: '16px' }}>{error}</p>
      ) : (
        <>
          <div className="spinner" />
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Completing sign-in...</p>
        </>
      )}
    </div>
  );
};

export default OAuthCallbackPage;
