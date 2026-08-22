import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Board from './components/Board';
import { TaskProvider } from './context';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <TaskProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div
          style={{
            ...styles.app,
            background: theme.background,
            color: theme.text,
          }}
        >
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

          <main style={styles.content}>
            <Routes>
              <Route
                path="/"
                element={<Board darkMode={darkMode} />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </TaskProvider>
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

const darkTheme = {
  background: '#0B0C10',
  text: '#F8FAFC',
};

const lightTheme = {
  background: '#F8FAFC',
  text: '#0F172A',
};

export default App;