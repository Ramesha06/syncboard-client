import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BoardPage from './pages/BoardPage';
import TaskDetailPage from './pages/TaskDetailPage';
import IssuesPage from './pages/IssuesPage';
import TimelinePage from './pages/TimelinePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { TaskProvider } from './context';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppLayout() {
  const { darkMode, theme } = useTheme();

  return (
    <div
      style={{
        ...styles.app,
        background: theme.background,
        color: theme.text,
      }}
    >
      <Navbar />

      <main style={styles.content}>
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <AppLayout />
        </Router>
      </TaskProvider>
    </ThemeProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    transition: 'background 0.2s ease, color 0.2s ease',
  },
  content: {
    padding: '2rem 2.5rem',
    maxWidth: '1600px',
    margin: '0 auto',
  },
};

export default App;
