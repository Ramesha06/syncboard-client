import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NotFoundPage() {
  const { darkMode } = useTheme();

  return (
    <div style={styles.container}>
      <h1 style={{ ...styles.code, color: darkMode ? '#3B82F6' : '#2563EB' }}>404</h1>
      <h2 style={{ ...styles.heading, color: darkMode ? '#F8FAFC' : '#0F172A' }}>
        Page not found
      </h2>
      <p style={{ ...styles.text, color: darkMode ? '#94A3B8' : '#64748B' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={styles.link}>Back to Board</Link>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '4rem 1rem',
  },
  code: {
    fontSize: '4rem',
    fontWeight: 800,
    margin: '0 0 0.5rem 0',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 0.75rem 0',
  },
  text: {
    fontSize: '1rem',
    margin: '0 0 2rem 0',
  },
  link: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
};
