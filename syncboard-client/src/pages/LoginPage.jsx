import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const { darkMode } = useTheme();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = darkMode ? darkTheme : lightTheme;

  const [values, setValues] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState(null);

  const handleChange = (field) => (event) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    try {
      await login(values.email.trim(), values.password);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message);
    }
  };

  const inputStyle = {
    ...styles.input,
    background: theme.inputBg,
    border: `1px solid ${theme.border}`,
    color: theme.text,
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, background: theme.cardBg, border: `1px solid ${theme.border}` }}>
        <h1 style={{ ...styles.heading, color: theme.heading }}>Welcome back</h1>
        <p style={{ ...styles.subtext, color: theme.muted }}>Log in to your SyncBoard workspace.</p>

        {location.state?.registered && (
          <div style={styles.successBox}>Account created. You can log in now.</div>
        )}
        {formError && <div style={styles.errorBox}>{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email" style={{ ...styles.label, color: theme.muted }}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            style={inputStyle}
            value={values.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
          />

          <label htmlFor="login-password" style={{ ...styles.label, color: theme.muted }}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            style={inputStyle}
            value={values.password}
            onChange={handleChange('password')}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            darkMode={darkMode}
            fullWidth
            loading={loading}
            style={styles.submit}
          >
            Log in
          </Button>
        </form>

        <p style={{ ...styles.footerText, color: theme.muted }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.link}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const darkTheme = {
  cardBg: '#13141c',
  border: 'rgba(255, 255, 255, 0.08)',
  heading: '#F8FAFC',
  text: '#F8FAFC',
  muted: '#94A3B8',
  inputBg: 'rgba(255, 255, 255, 0.04)',
};

const lightTheme = {
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
  heading: '#0F172A',
  text: '#0F172A',
  muted: '#64748B',
  inputBg: '#F8FAFC',
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 58px)',
    padding: '2rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    borderRadius: '14px',
    padding: '2rem',
    boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)',
  },
  heading: {
    margin: '0 0 0.35rem 0',
    fontSize: '1.4rem',
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  subtext: {
    margin: '0 0 1.5rem 0',
    fontSize: '0.85rem',
  },
  label: {
    display: 'block',
    fontSize: '0.76rem',
    fontWeight: 600,
    marginBottom: '0.35rem',
    marginTop: '0.9rem',
  },
  input: {
    width: '100%',
    borderRadius: '8px',
    padding: '0.6rem 0.75rem',
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  submit: {
    marginTop: '1.5rem',
  },
  errorBox: {
    background: 'rgba(248, 113, 113, 0.12)',
    border: '1px solid rgba(248, 113, 113, 0.35)',
    color: '#f87171',
    fontSize: '0.8rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  successBox: {
    background: 'rgba(52, 211, 153, 0.12)',
    border: '1px solid rgba(52, 211, 153, 0.35)',
    color: '#34d399',
    fontSize: '0.8rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  footerText: {
    marginTop: '1.5rem',
    fontSize: '0.82rem',
    textAlign: 'center',
  },
  link: {
    color: '#3B82F6',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
