import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Alert, GoogleButton, AuthLayout, WMLogo } from '../components/ui/FormElements';
import LogoW from "../assets/LogoW.png";
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') setSuccessMsg('Email verified! You can now sign in.');
    if (params.get('error')) setServerError('Google sign-in failed. Please try again.');
  }, [isAuthenticated, navigate, location]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <AuthLayout
      rightTitle="Start your journey with us today"
      rightSubtitle="Join thousands of users who trust our platform for their daily workflow."
      rightStats={[{ value: '50K+', label: 'Users' }, { value: '4.9', label: 'Rating' }, { value: '99%', label: 'Uptime' }]}
    >
     <div className="auth-brand">
  <img src={LogoW} className="auth-logo" alt="logo" />
  <span className="auth-brand-name">WorkManager</span>
  </div>

      <div className="auth-header">
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-subtitle">Enter your credentials to access your account</p>
      </div>

      <Alert type="error" message={serverError} />
      <Alert type="success" message={successMsg} />

      <GoogleButton onClick={handleGoogle} />
      <div className="divider">or sign in with email</div>

      <form onSubmit={handleSubmit} noValidate>
        <Input label="Email Address" type="email" placeholder="you@example.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          error={errors.email} icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
          autoComplete="email" />

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </span>
            <input type={showPassword ? 'text' : 'password'}
              className={`form-input with-icon ${errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}>
              {showPassword
                ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-row">
          <label className="remember-me">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="auth-link" style={{ fontSize: '13px' }}>Forgot password?</Link>
        </div>

        <Button type="submit" isLoading={isLoading}>Sign In →</Button>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
