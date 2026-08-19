import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <Router>
      <div
        style={{
          ...styles.app,
          background: theme.background,
          color: theme.text,
        }}
      >
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div style={styles.content}>
          <Routes>
            <Route
              path="/"
              element={<Board darkMode={darkMode} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Board({ darkMode }) {
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '2.3rem' }}>
        <div
          style={{
            ...styles.sprintBadge,
            backgroundColor: theme.badgeBackground,
            border: `1px solid ${theme.badgeBorder}`,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#60A5FA',
              boxShadow: '0 0 8px rgba(96,165,250,0.8)',
            }}
          />

          ACTIVE SPRINT
        </div>

        <h1
          style={{
            ...styles.title,
            color: theme.heading,
          }}
        >
          Active Sprint
        </h1>

        <p
          style={{
            ...styles.subtitle,
            color: theme.mutedText,
          }}
        >
          Drag and drop tasks to update their status across the workflow.
        </p>
      </div>

      {/* Board */}
      <div style={styles.board}>
        <Column
          title="Backlog"
          count="3"
          accentColor="#64748B"
          darkMode={darkMode}
        />

        <Column
          title="In Progress"
          count="2"
          accentColor="#3B82F6"
          darkMode={darkMode}
        />

        <Column
          title="In Review"
          count="1"
          accentColor="#A855F7"
          darkMode={darkMode}
        />

        <Column
          title="Done"
          count="5"
          accentColor="#22C55E"
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

function Column({ title, count, accentColor, darkMode }) {
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <div
      style={{
        ...styles.column,
        background: theme.columnBackground,
        border: `1px solid ${theme.border}`,
        borderTop: `3px solid ${accentColor}`,
        boxShadow: theme.columnShadow,
      }}
    >
      {/* Column Header */}
      <div
        style={{
          ...styles.columnHeader,
          borderBottom: `1px solid ${theme.innerBorder}`,
        }}
      >
        <div style={styles.columnTitle}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}66`,
            }}
          />

          <span
            style={{
              fontWeight: '600',
              fontSize: '0.9rem',
              color: theme.heading,
            }}
          >
            {title}
          </span>
        </div>

        <span
          style={{
            ...styles.count,
            backgroundColor: theme.countBackground,
            border: `1px solid ${theme.border}`,
            color: theme.mutedText,
          }}
        >
          {count}
        </span>
      </div>

      {/* Column Body */}
      <div style={styles.columnBody}>
        {/* Task Card */}
        <div
          style={{
            ...styles.taskCard,
            background: theme.cardBackground,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
          }}
        >
          <p
            style={{
              ...styles.taskText,
              color: theme.taskText,
            }}
          >
            Setup initial React architecture and routing
          </p>

          <div style={styles.taskFooter}>
            <span
              style={{
                ...styles.taskId,
                backgroundColor: theme.countBackground,
                border: `1px solid ${theme.border}`,
                color: theme.mutedText,
              }}
            >
              TSK-01
            </span>

            <div style={styles.smallAvatar}>RW</div>
          </div>
        </div>

        {/* Add Task */}
        <div
          style={{
            ...styles.addTask,
            backgroundColor: theme.addTaskBackground,
            border: `1px dashed ${theme.addTaskBorder}`,
            color: theme.mutedText,
          }}
        >
          + Add Task
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    transition: 'background 0.3s ease, color 0.3s ease',
  },

  content: {
    padding: '2.8rem 3.5rem',
  },

  sprintBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '5px 10px',
    marginBottom: '12px',
    borderRadius: '20px',
    color: '#60A5FA',
    fontSize: '0.72rem',
    fontWeight: '600',
    letterSpacing: '0.4px',
  },

  title: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '-0.7px',
  },

  subtitle: {
    margin: 0,
    fontSize: '0.95rem',
  },

  board: {
    display: 'flex',
    gap: '1.2rem',
    overflowX: 'auto',
    paddingBottom: '1.5rem',
  },

  column: {
    borderRadius: '12px',
    width: '320px',
    minHeight: '600px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },

  columnHeader: {
    padding: '1.15rem 1.2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
  },

  count: {
    padding: '3px 9px',
    borderRadius: '20px',
    fontSize: '0.72rem',
    fontWeight: '600',
  },

  columnBody: {
    padding: '0.9rem 1rem 1rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  taskCard: {
    borderRadius: '9px',
    padding: '1rem',
    cursor: 'grab',
    transition: 'all 0.2s ease',
  },

  taskText: {
    margin: '0 0 14px 0',
    fontSize: '0.88rem',
    lineHeight: '1.5',
    fontWeight: '500',
  },

  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taskId: {
    fontSize: '0.7rem',
    padding: '4px 7px',
    borderRadius: '5px',
    fontWeight: '600',
    letterSpacing: '0.2px',
  },

  smallAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #292929, #181818)',
    border: '1px solid #333333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.6rem',
    color: '#A3A3A3',
    fontWeight: '600',
  },

  addTask: {
    borderRadius: '9px',
    padding: '0.85rem',
    textAlign: 'center',
    fontSize: '0.82rem',
    marginTop: '0.4rem',
    transition: 'all 0.2s ease',
  },
};

const darkTheme = {
  background:
    'radial-gradient(circle at top, #111827 0%, #050505 38%, #000000 100%)',
  text: '#EDEDED',
  heading: '#FFFFFF',
  mutedText: '#777777',
  border: '#292929',
  innerBorder: '#181818',
  columnBackground:
    'linear-gradient(180deg, rgba(15,15,15,0.98), rgba(9,9,9,0.98))',
  cardBackground:
    'linear-gradient(145deg, #171717 0%, #111111 100%)',
  cardShadow: '0 5px 15px rgba(0,0,0,0.25)',
  columnShadow:
    '0 12px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.025)',
  countBackground: '#181818',
  taskText: '#D9D9D9',
  addTaskBackground: 'rgba(255,255,255,0.01)',
  addTaskBorder: '#303030',
  badgeBackground: 'rgba(96,165,250,0.08)',
  badgeBorder: 'rgba(96,165,250,0.15)',
};

const lightTheme = {
  background:
    'radial-gradient(circle at top, #EFF6FF 0%, #F8FAFC 38%, #FFFFFF 100%)',
  text: '#171717',
  heading: '#111827',
  mutedText: '#64748B',
  border: '#E2E8F0',
  innerBorder: '#EEF2F7',
  columnBackground:
    'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
  cardBackground:
    'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
  cardShadow: '0 5px 15px rgba(15,23,42,0.06)',
  columnShadow: '0 12px 30px rgba(15,23,42,0.07)',
  countBackground: '#F1F5F9',
  taskText: '#334155',
  addTaskBackground: 'rgba(59,130,246,0.02)',
  addTaskBorder: '#CBD5E1',
  badgeBackground: 'rgba(59,130,246,0.07)',
  badgeBorder: 'rgba(59,130,246,0.15)',
};

export default App;