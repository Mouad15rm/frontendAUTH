import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../api/auth.api';
import { Input, Button, Alert, AuthLayout, WMLogo } from '../components/ui/FormElements';
import LogoW from "../assets/LogoW.png";
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (!email || !code) navigate('/forgot-password'); }, [email, code, navigate]);

  const validate = () => {
    const e = {};
    const p = form.newPassword;
    if (!p) e.newPassword = 'Password is required';
    else if (p.length < 8) e.newPassword = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(p)) e.newPassword = 'Must include uppercase letter';
    else if (!/[0-9]/.test(p)) e.newPassword = 'Must include a number';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(p)) e.newPassword = 'Must include special character';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setServerError('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authAPI.resetPassword({ email, code, newPassword: form.newPassword, confirmPassword: form.confirmPassword });
      navigate('/login', { state: { message: 'Password reset successfully! Please sign in.' } });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to reset password.');
    } finally { setIsLoading(false); }
  };

  return (
    <AuthLayout
      rightTitle="Create a strong new password"
      rightSubtitle="Your new password must be at least 8 characters and include uppercase, number, and special character."
      rightStats={[{ value: '🔐', label: 'Encrypted' }, { value: '✅', label: 'Secure' }, { value: '🚀', label: 'Instant' }]}
    >
        <div className="auth-brand">
       <img src={LogoW} className="auth-logo" alt="logo" />
       <span className="auth-brand-name">WorkManager</span>
       </div>
      <div className="auth-header">
        <h1 className="auth-title">Set new password</h1>
        <p className="auth-subtitle">Create a strong, unique password for your account</p>
      </div>
      <Alert type="error" message={serverError} />
      <form onSubmit={handleSubmit} noValidate>
        <Input label="New Password" type="password" placeholder="Min 8 chars, uppercase, number, symbol"
          value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })}
          error={errors.newPassword} autoComplete="new-password"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} />
        <Input label="Confirm New Password" type="password" placeholder="Repeat new password"
          value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          error={errors.confirmPassword} autoComplete="new-password"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} />
        <Button type="submit" isLoading={isLoading}>Reset Password →</Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
