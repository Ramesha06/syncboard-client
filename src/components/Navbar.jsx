import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';
import { darkNavTheme, lightNavTheme } from '../constants/navTheme';

const NAV_LINKS = [
  { to: '/', label: 'Board' },
  { to: '/issues', label: 'Issues' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const theme = darkMode ? darkNavTheme : lightNavTheme;

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
      <div style={styles.logoContainer}>
        <div
          style={{
            ...styles.logoIcon,
            background: theme.logoBackground,
            border: `1px solid ${theme.logoBorder}`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="M9 3v18" />
            <path d="M15 9h6" />
            <path d="M15 15h6" />
          </svg>
        </div>
        <span style={{ ...styles.logoText, color: theme.heading }}>SyncBoard</span>
      </div>

      <div style={styles.linksContainer}>
        {NAV_LINKS.map(({ to, label }) => {
          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <Link key={to} to={to} style={{
              ...styles.link,
              color: isActive ? theme.activeText : theme.mutedText,
              backgroundColor: isActive ? theme.activeLinkBg : 'transparent',
            }}>
              {label}
            </Link>
          );
        })}
      </div>

      <div style={styles.rightSection}>
        <Button variant="ghost" size="icon-sm" darkMode={darkMode} onClick={toggleTheme}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? '☀️' : '🌙'}
        </Button>
        <div style={{
          ...styles.avatar, background: theme.avatarBg,
          border: `1px solid ${theme.avatarBorder}`, color: theme.avatarText,
        }}>
          RW
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 2rem', height: '58px', position: 'sticky', top: 0, zIndex: 50,
    transition: 'background 0.2s ease, border-color 0.2s ease',
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '9px', minWidth: '150px' },
  logoIcon: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '30px', height: '30px', borderRadius: '8px',
  },
  logoText: { fontSize: '0.96rem', fontWeight: '700', letterSpacing: '-0.3px' },
  linksContainer: { display: 'flex', alignItems: 'center', gap: '6px' },
  link: {
    textDecoration: 'none', fontSize: '0.84rem', fontWeight: '500',
    padding: '5px 12px', borderRadius: '6px', transition: 'all 0.15s ease',
  },
  rightSection: {
    display: 'flex', alignItems: 'center', gap: '10px',
    justifyContent: 'flex-end', minWidth: '150px',
  },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    fontSize: '0.72rem', fontWeight: '600',
  },
};
