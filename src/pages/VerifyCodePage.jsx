import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import { Button, Alert, AuthLayout, WMLogo } from '../components/ui/FormElements';
import LogoW from "../assets/LogoW.png";
const VerifyCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => { if (!email) navigate('/forgot-password'); }, [email, navigate]);
  useEffect(() => { if (countdown > 0) { const t = setTimeout(() => setCountdown(countdown - 1), 1000); return () => clearTimeout(t); } }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!code || code.length !== 6) return setError('Please enter the 6-digit code');
    if (!/^\d{6}$/.test(code)) return setError('Code must contain only numbers');
    setIsLoading(true);
    try {
      await authAPI.verifyResetCode({ email, code });
      navigate('/reset-password', { state: { email, code } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally { setIsLoading(false); }
  };

  const handleResend = async () => {
    try { await authAPI.forgotPassword(email); } catch {}
    setResendMsg('New code sent! Check your inbox.'); setCountdown(60); setCode('');
  };

  return (
    <AuthLayout
      rightTitle="Check your inbox for the reset code"
      rightSubtitle="We sent a 6-digit verification code to your email. It expires in 10 minutes."
      rightStats={[{ value: '6', label: 'Digit Code' }, { value: '10m', label: 'Expiry' }, { value: '🔒', label: 'Secure' }]}
    >
       <div className="auth-brand">
      <img src={LogoW} className="auth-logo" alt="logo" />
      <span className="auth-brand-name">WorkManager</span>
      </div>

      <div className="auth-header">
        <h1 className="auth-title">Enter reset code</h1>
        <p className="auth-subtitle">Code sent to <strong style={{ color: 'var(--primary)' }}>{email}</strong></p>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={resendMsg} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>VERIFICATION CODE</label>
          <input type="text" inputMode="numeric" maxLength={6} className="form-input code-input"
            placeholder="000000" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} autoComplete="one-time-code" />
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-400)', marginTop: '8px' }}>⏱ Expires in 10 minutes</p>
        </div>
        <Button type="submit" isLoading={isLoading}>Verify Code →</Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text-muted)' }}>
        Didn't receive it?{' '}
        {countdown > 0 ? <span style={{ color: 'var(--gray-400)' }}>Resend in {countdown}s</span>
          : <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: 'inherit' }}>Resend code</button>}
      </div>
      <div className="auth-footer"><Link to="/forgot-password" className="auth-link">← Use different email</Link></div>
    </AuthLayout>
  );
};

export default VerifyCodePage;
