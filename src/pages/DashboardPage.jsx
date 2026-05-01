import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WMLogo } from '../components/ui/FormElements';
import LogoW from "../assets/LogoW.png";
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
          <div className="auth-brand">
        <img src={LogoW} className="auth-logo" alt="logo" />
        <span className="auth-brand-name">WorkManager</span>
        </div>
        <div className="nav-user">
          <span className="nav-username">{user?.name}</span>
          {user?.avatar
            ? <img src={user.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
            : <div className="avatar">{getInitials(user?.name)}</div>}
          <button className="btn-logout" onClick={handleLogout}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Welcome */}
        <div className="dashboard-card" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%)', borderColor: '#c7d2fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6c47ff' }} />
              : <div className="avatar" style={{ width: 60, height: 60, fontSize: '22px' }}>{getInitials(user?.name)}</div>}
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text)' }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '3px', fontSize: '14px' }}>You're securely signed in to your account.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
          <div className="dashboard-card">
            <h2>👤 Account Information</h2>
            <div className="user-info-grid">
              <div className="info-item"><label>Full Name</label><span>{user?.name}</span></div>
              <div className="info-item"><label>Email Address</label><span style={{ fontSize: '13px' }}>{user?.email}</span></div>
              <div className="info-item"><label>Role</label><span className="badge">{user?.role}</span></div>
              <div className="info-item"><label>Email Status</label>
                <span className={`badge ${user?.isEmailVerified ? 'verified' : 'unverified'}`}>
                  {user?.isEmailVerified ? '✅ Verified' : '⚠️ Unverified'}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2>🔐 Security Status</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Password Auth', status: !!user && !user.googleId, icon: '🔑' },
                { label: 'Google OAuth Linked', status: !!user?.googleId, icon: '🌐' },
                { label: 'Email Verified', status: user?.isEmailVerified, icon: '✉️' },
                { label: '2FA (Coming Soon)', status: false, icon: '📱', soon: true },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{item.icon} {item.label}</span>
                  <span className={`badge ${item.status ? 'verified' : item.soon ? '' : 'unverified'}`}>
                    {item.soon ? '🔜 Soon' : item.status ? '✅ Active' : '❌ Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>🛡️ Security Architecture</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
            {[
              { icon: '⚡', title: 'Access Token', desc: 'JWT • 15 min TTL' },
              { icon: '🔄', title: 'Refresh Token', desc: 'Rotated • 7d • HTTP-only' },
              { icon: '🛡️', title: 'Password', desc: 'bcrypt • 12 rounds' },
              { icon: '🚫', title: 'Rate Limiting', desc: '5 attempts / 15 min' },
              { icon: '🌐', title: 'CORS', desc: 'Origin-restricted' },
              { icon: '🔒', title: 'Helmet', desc: 'Secure HTTP headers' },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '3px', color: 'var(--text)' }}>{item.title}</div>
                <div style={{ color: 'var(--gray-400)', fontSize: '12px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
