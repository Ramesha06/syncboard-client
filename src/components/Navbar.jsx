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
        boxShadow: theme.navShadow,
      }}
    >
      {/* Logo */}
      <div style={styles.logoContainer}>
        <div
          style={{
            ...styles.logoIcon,
            background: theme.logoBackground,
            border: `1px solid ${theme.logoBorder}`,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
        </div>

        <h2
          style={{
            ...styles.logoText,
            color: theme.heading,
          }}
        >
          SyncBoard
        </h2>
      </div>

      {/* Navigation */}
      <div style={styles.linksContainer}>
        <Link
          to="/"
          style={{
            ...styles.link,
            ...styles.activeLink,
            color: theme.activeText,
          }}
        >
          Board
        </Link>

        <Link to="#" style={{ ...styles.link, color: theme.mutedText }}>
          Issues
        </Link>

        <Link to="#" style={{ ...styles.link, color: theme.mutedText }}>
          Views
        </Link>

        <Link to="#" style={{ ...styles.link, color: theme.mutedText }}>
          Settings
        </Link>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <div
          style={{
            ...styles.searchWrapper,
            backgroundColor: theme.searchBackground,
            border: `1px solid ${theme.border}`,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.searchIcon}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>

          <input
            type="text"
            placeholder="Search..."
            style={{
              ...styles.searchInput,
              color: theme.text,
            }}
          />
        </div>

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
          {darkMode ? '☀' : '☾'}
        </button>

        {/* Avatar */}
        <div style={styles.avatar}>RW</div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2.5rem',
    height: '68px',
    position: 'relative',
    zIndex: 10,
    transition: 'all 0.3s ease',
  },

  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    minWidth: '180px',
  },

  logoIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    transition: 'all 0.3s ease',
  },

  logoText: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },

  linksContainer: {
    display: 'flex',
    height: '100%',
    gap: '2.2rem',
  },

  link: {
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    borderBottom: '2px solid transparent',
    padding: '0 2px',
    transition: 'all 0.2s ease',
  },

  activeLink: {
    borderBottom: '2px solid #60A5FA',
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    minWidth: '280px',
    justifyContent: 'flex-end',
  },

  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '9px',
    padding: '0 12px',
    width: '190px',
    height: '36px',
    transition: 'all 0.3s ease',
  },

  searchInput: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    fontSize: '0.85rem',
    width: '100%',
  },

  themeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '17px',
    transition: 'all 0.2s ease',
  },

  avatar: {
    width: '35px',
    height: '35px',
    background: 'linear-gradient(135deg, #60A5FA, #2563EB)',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
    boxShadow: '0 0 18px rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
};

const darkTheme = {
  navBackground: 'rgba(10, 10, 10, 0.96)',
  text: '#EDEDED',
  heading: '#FFFFFF',
  activeText: '#FFFFFF',
  mutedText: '#737373',
  border: '#252525',
  navShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  logoBackground:
    'linear-gradient(135deg, rgba(96,165,250,0.18), rgba(59,130,246,0.06))',
  logoBorder: 'rgba(96,165,250,0.2)',
  searchBackground: '#111111',
  searchIcon: '#737373',
  toggleBackground: '#151515',
  toggleText: '#FACC15',
};

const lightTheme = {
  navBackground: 'rgba(255, 255, 255, 0.95)',
  text: '#171717',
  heading: '#111827',
  activeText: '#111827',
  mutedText: '#737373',
  border: '#E5E7EB',
  navShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
  logoBackground:
    'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(59,130,246,0.04))',
  logoBorder: 'rgba(96,165,250,0.2)',
  searchBackground: '#F8FAFC',
  searchIcon: '#94A3B8',
  toggleBackground: '#F8FAFC',
  toggleText: '#334155',
};