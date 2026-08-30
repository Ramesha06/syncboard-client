import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

const darkTheme = {
  background: '#0B0C10',
  text: '#F8FAFC',
};

const lightTheme = {
  background: '#F8FAFC',
  text: '#0F172A',
};

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
