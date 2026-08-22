import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Board from './components/Board';
import { TaskProvider } from './context/TaskContext';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <TaskProvider>
      <Router>
        <div
          style={{
            ...styles.app,
            background: theme.background,
            color: theme.text,
          }}
        >
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

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
    </TaskProvider>
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
    padding: '2.5rem 3rem',
  },
};

const darkTheme = {
  background: '#0C0C0E',
  text: '#EDEDED',
};

const lightTheme = {
  background: '#F8FAFC',
  text: '#171717',
};

export default App;