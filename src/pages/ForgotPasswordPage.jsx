import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import { Input, Button, Alert, AuthLayout, WMLogo } from '../components/ui/FormElements';
import LogoW from "../assets/LogoW.png";
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Email is required');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Enter a valid email address');
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
    } catch {}
    setSuccess('If this email exists, a reset code has been sent.');
    setTimeout(() => navigate('/verify-code', { state: { email } }), 2000);
    setIsLoading(false);
  };

  return (
    <AuthLayout
      rightTitle="Forgot your password? No worries."
      rightSubtitle="We'll send a secure code to your email so you can reset your password safely."
      rightStats={[{ value: '🔐', label: 'Secure' }, { value: '⚡', label: 'Instant' }, { value: '✅', label: 'Easy' }]}
    >
          <div className="auth-brand">
        <img src={LogoW} className="auth-logo" alt="logo" />
        <span className="auth-brand-name">WorkManager</span>
        </div>

      <div className="auth-header">
        <h1 className="auth-title">Forgot password?</h1>
        <p className="auth-subtitle">We'll send a reset code to your email</p>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Email Address" type="email" placeholder="Enter your registered email"
          value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
        <Button type="submit" isLoading={isLoading}>Send Reset Code →</Button>
      </form>

      <div className="auth-footer">
        <Link to="/login" className="auth-link">← Back to sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
