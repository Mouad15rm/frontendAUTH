import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert, GoogleButton, AuthLayout, WMLogo } from '../components/ui/FormElements';
import LogoW from "../assets/LogoW.png";
const getStrength = (p) => {
  let s = 0;
  if (p.length >= 8) s++; if (p.length >= 12) s++;
  if (/[A-Z]/.test(p)) s++; if (/[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++; if (/[!@#$%^&*(),.?":{}|<>]/.test(p)) s++;
  if (s <= 2) return { label: 'Weak', color: '#ef4444', width: '25%' };
  if (s <= 3) return { label: 'Fair', color: '#f59e0b', width: '50%' };
  if (s <= 4) return { label: 'Good', color: '#3b82f6', width: '75%' };
  return { label: 'Strong', color: '#10b981', width: '100%' };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }); }, [isAuthenticated, navigate]);

  const strength = form.password ? getStrength(form.password) : null;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Must include uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Must include a number';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) e.password = 'Must include special character';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { message } = await register(form.name.trim(), form.email, form.password);
      setSuccessMsg(message || 'Account created! Check your email to verify.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <AuthLayout
      rightTitle="Join thousands of teams already using our platform"
      rightSubtitle="Secure, fast, and reliable authentication for your entire organization."
      rightStats={[{ value: '50K+', label: 'Users' }, { value: '4.9★', label: 'Rating' }, { value: '99%', label: 'Uptime' }]}
    >
       <div className="auth-brand">
      <img src={LogoW} className="auth-logo" alt="logo" />
      <span className="auth-brand-name">WorkManager</span>
      </div>

      <div className="auth-header">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start your journey today — it's free</p>
      </div>

      <Alert type="error" message={serverError} />
      <Alert type="success" message={successMsg} />

      <GoogleButton onClick={handleGoogle} />
      <div className="divider">or register with email</div>

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Full Name" type="text" placeholder="John Doe"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          error={errors.name} autoComplete="name"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />

        <Input label="Email Address" type="email" placeholder="you@example.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          error={errors.email} autoComplete="email"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrapper">
            <span className="input-icon"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
            <input type={showPwd ? 'text' : 'password'} className={`form-input with-icon ${errors.password ? 'input-error' : ''}`}
              placeholder="Min 8 chars, uppercase, number, symbol"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
          {strength && form.password && (
            <div className="password-strength">
              <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
              <span className="strength-text" style={{ color: strength.color }}>{strength.label} password</span>
            </div>
          )}
        </div>

        <Input label="Confirm Password" type="password" placeholder="Repeat your password"
          value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          error={errors.confirmPassword} autoComplete="new-password"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} />

        <Button type="submit" isLoading={isLoading}>Create Account →</Button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
