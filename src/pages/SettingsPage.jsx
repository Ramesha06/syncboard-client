import Button from '../components/Button';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div>
      <h1 style={{ ...styles.heading, color: darkMode ? '#F8FAFC' : '#0F172A' }}>Settings</h1>
      <p style={{ ...styles.subtitle, color: darkMode ? '#94A3B8' : '#64748B' }}>
        Manage your board preferences
      </p>

      <div style={{
        ...styles.card,
        background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0'}`,
      }}>
        <div style={styles.settingRow}>
          <div>
            <h3 style={{ ...styles.settingLabel, color: darkMode ? '#F8FAFC' : '#0F172A' }}>
              Theme
            </h3>
            <p style={{ ...styles.settingDesc, color: darkMode ? '#94A3B8' : '#64748B' }}>
              Switch between dark and light mode
            </p>
          </div>
          <Button variant="secondary" size="sm" darkMode={darkMode} onClick={toggleTheme}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        <div style={{ borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0'}`, ...styles.settingRow }}>
          <div>
            <h3 style={{ ...styles.settingLabel, color: darkMode ? '#F8FAFC' : '#0F172A' }}>
              Language
            </h3>
            <p style={{ ...styles.settingDesc, color: darkMode ? '#94A3B8' : '#64748B' }}>
              Display language for the application
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: darkMode ? '#94A3B8' : '#64748B' }}>English</span>
        </div>

        <div style={{ borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0'}`, ...styles.settingRow }}>
          <div>
            <h3 style={{ ...styles.settingLabel, color: darkMode ? '#F8FAFC' : '#0F172A' }}>
              Notifications
            </h3>
            <p style={{ ...styles.settingDesc, color: darkMode ? '#94A3B8' : '#64748B' }}>
              Email notifications for task updates
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: darkMode ? '#94A3B8' : '#64748B' }}>Coming soon</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  heading: { fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.25rem 0' },
  subtitle: { fontSize: '0.85rem', margin: '0 0 1.5rem 0' },
  card: { borderRadius: '10px', overflow: 'hidden' },
  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem' },
  settingLabel: { fontSize: '0.92rem', fontWeight: 600, margin: '0 0 0.15rem 0' },
  settingDesc: { fontSize: '0.82rem', margin: 0 },
};
