import { Link } from 'react-router-dom';

export default function Navbar({ darkMode, setDarkMode }) {
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <nav
      style={{
        ...styles.nav,
        background: theme.navBackground,
        color: theme.text,
        borderBottom: `1px solid ${theme.border}`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Brand Logo */}
      <div style={styles.logoContainer}>
        <div
          style={{
            ...styles.logoIcon,
            background: theme.logoBackground,
            border: `1px solid ${theme.logoBorder}`,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M9 3v18" />
            <path d="M15 9h6" />
            <path d="M15 15h6" />
          </svg>
        </div>

        <span
          style={{
            ...styles.logoText,
            color: theme.heading,
          }}
        >
          SyncBoard
        </span>
      </div>

      {/* Navigation */}
      <div style={styles.linksContainer}>
        <Link
          to="/"
          style={{
            ...styles.link,
            color: theme.activeText,
            backgroundColor: theme.activeLinkBg,
          }}
        >
          Board
        </Link>

        <Link
          to="#"
          style={{
            ...styles.link,
            color: theme.mutedText,
          }}
        >
          Issues
        </Link>

        <Link
          to="#"
          style={{
            ...styles.link,
            color: theme.mutedText,
          }}
        >
          Timeline
        </Link>

        <Link
          to="#"
          style={{
            ...styles.link,
            color: theme.mutedText,
          }}
        >
          Settings
        </Link>
      </div>

      {/* Right Controls */}
      <div style={styles.rightSection}>
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            ...styles.themeButton,
            backgroundColor: theme.toggleBackground,
            border: `1px solid ${theme.border}`,
            color: theme.toggleText,
          }}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* User Avatar */}
        <div
          style={{
            ...styles.avatar,
            background: theme.avatarBg,
            border: `1px solid ${theme.avatarBorder}`,
            color: theme.avatarText,
          }}
        >
          RW
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '58px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    transition: 'background 0.2s ease, border-color 0.2s ease',
  },

  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    minWidth: '150px',
  },

  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '8px',
  },

  logoText: {
    fontSize: '0.96rem',
    fontWeight: '700',
    letterSpacing: '-0.3px',
  },

  linksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  link: {
    textDecoration: 'none',
    fontSize: '0.84rem',
    fontWeight: '500',
    padding: '5px 12px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'flex-end',
    minWidth: '150px',
  },

  themeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.15s ease',
  },

  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.72rem',
    fontWeight: '600',
  },
};

const darkTheme = {
  navBackground: 'rgba(13, 14, 20, 0.88)',
  text: '#E2E8F0',
  heading: '#F8FAFC',
  activeText: '#F8FAFC',
  activeLinkBg: 'rgba(255, 255, 255, 0.08)',
  mutedText: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.06)',
  logoBackground: 'rgba(59, 130, 246, 0.12)',
  logoBorder: 'rgba(59, 130, 246, 0.25)',
  toggleBackground: 'rgba(255, 255, 255, 0.04)',
  toggleText: '#F8FAFC',
  avatarBg: 'rgba(59, 130, 246, 0.2)',
  avatarBorder: 'rgba(59, 130, 246, 0.4)',
  avatarText: '#93C5FD',
};

const lightTheme = {
  navBackground: 'rgba(255, 255, 255, 0.92)',
  text: '#1E293B',
  heading: '#0F172A',
  activeText: '#0F172A',
  activeLinkBg: '#F1F5F9',
  mutedText: '#64748B',
  border: '#E2E8F0',
  logoBackground: 'rgba(59, 130, 246, 0.08)',
  logoBorder: 'rgba(59, 130, 246, 0.2)',
  toggleBackground: '#F8FAFC',
  toggleText: '#475569',
  avatarBg: '#EFF6FF',
  avatarBorder: '#BFDBFE',
  avatarText: '#2563EB',
};