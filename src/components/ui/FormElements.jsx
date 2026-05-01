// src/components/ui/FormElements.jsx
import LogoW from "../../assets/LogoW.png";
import img5 from "../../assets/img5.webp";

// WM Logo SVG component
export const WMLogo = ({ size = 40, white = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wm-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={white ? "#ffffff" : "#a855f7"} />
        <stop offset="50%" stopColor={white ? "#e0d4ff" : "#6c47ff"} />
        <stop offset="100%" stopColor={white ? "#bfefff" : "#00c2ff"} />
      </linearGradient>
    </defs>

    <path
      d="M2 8 L18 52 L32 20 L46 52 L62 8"
      stroke="url(#wm-grad)"
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    <path
      d="M54 8 L70 52 L84 20 L98 8"
      stroke="url(#wm-grad)"
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);


// Right panel layout wrapper
export const AuthLayout = ({ children, rightTitle, rightSubtitle, rightStats }) => (
  <div className="auth-page">

    <div className="auth-left">
      {children}
    </div>

<div className="auth-right">
  <div className="orb orb-1" />
  <div className="orb orb-2" />
      {/* background image */}

      <div className="auth-right-content">

        <div className="right-brand">
          <img src={LogoW} alt="logo" className="right-logo"/>
          <span className="right-brand-name">WorkManager</span>
        </div>

        <div className="auth-mockup">

          <div className="mockup-bar">
            <div className="mockup-dot" />
            <div className="mockup-dot" />
            <div className="mockup-dot" />
          </div>

          <div className="mockup-lines">
            <div className="mockup-line" style={{ width: '80%' }} />
            <div className="mockup-line" style={{ width: '60%' }} />
            <div className="mockup-line" style={{ width: '90%' }} />
            <div className="mockup-line" style={{ width: '45%' }} />
          </div>

        </div>

        <h2>{rightTitle}</h2>
        <p>{rightSubtitle}</p>

        {rightStats && (
          <div className="auth-stats">
            {rightStats.map((s, i) => (
              <div key={i} className="auth-stat">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>

  </div>
);


// Input component
export const Input = ({ label, error, icon, ...props }) => (
  <div className="form-group">

    {label && <label className="form-label">{label}</label>}

    <div className="input-wrapper">
      {icon && <span className="input-icon">{icon}</span>}

      <input
        className={`form-input ${icon ? 'with-icon' : ''} ${error ? 'input-error' : ''}`}
        {...props}
      />
    </div>

    {error && <span className="error-message">{error}</span>}

  </div>
);


// Button
export const Button = ({ children, isLoading, variant = 'primary', ...props }) => (
  <button
    className={`btn btn-${variant}`}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading ? (
      <span className="btn-spinner">
        <span className="spinner-sm" /> Processing...
      </span>
    ) : children}
  </button>
);


// Alert
export const Alert = ({ type = 'error', message }) => {

  if (!message) return null;

  const icons = {
    error: '⚠️',
    success: '✅',
    info: 'ℹ️'
  };

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );

};


// Google Button
export const GoogleButton = ({ onClick, isLoading }) => (

  <button
    className="btn-google"
    onClick={onClick}
    disabled={isLoading}
    type="button"
  >

    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>

    {isLoading ? "Connecting..." : "Continue with Google"}

  </button>

);