import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Board from './components/Board';

// Mock task data structured for JERRAA Template Design
const JERRAA_MOCK_TASKS = [
  {
    id: 'TSK-01',
    title: 'Usability Testing',
    description: 'Testing App ke user (16-20 y.o)',
    category: 'UX Design',
    status: 'todo',
    dueDate: '09 Nov 2021',
    assigneeInitials: 'RW',
  },
  {
    id: 'TSK-02',
    title: 'Designing 3D Travel App',
    description: 'Membuat 3D Design untuk Aplikasi Travel App.',
    category: '3D Design',
    status: 'todo',
    dueDate: '10 Nov 2021',
    assigneeInitials: 'MB',
  },
  {
    id: 'TSK-03',
    title: 'Wireframe Landing Page',
    description: 'Wireframing desktop & mobile views',
    category: 'UX Design',
    status: 'todo',
    dueDate: '10 Nov 2021',
    assigneeInitials: 'DS',
  },
  {
    id: 'TSK-04',
    title: 'Landing Page Brainout',
    description: 'Redesign main marketing page',
    category: 'UI Design',
    status: 'in_progress',
    dueDate: '12-14 Nov 2021',
    assigneeInitials: 'M2',
  },
  {
    id: 'TSK-05',
    title: 'Designing 3D Envato Assets',
    description: 'Set Tema, Set Character, Membuat color pallete',
    category: '3D Design',
    status: 'in_progress',
    dueDate: '12-15 Nov 2021',
    assigneeInitials: 'M3',
  },
  {
    id: 'TSK-06',
    title: 'Flat Illustration Hero Pack',
    description: 'Ilustrasi simple untuk marketing',
    category: 'Illustration',
    status: 'in_review',
    dueDate: '12 Nov 2021',
    assigneeInitials: 'M4',
  },
  {
    id: 'TSK-07',
    title: 'Wireframing Mobile Flow',
    description: 'Selesai wireframe & user journey',
    category: 'UX Design',
    status: 'in_review',
    dueDate: '11 Nov 2021',
    assigneeInitials: 'M9',
  },
  {
    id: 'TSK-08',
    title: 'Component Library & Design Tokens',
    description: 'DS setup completed',
    category: 'UI Design',
    status: 'done',
    dueDate: '08 Nov 2021',
    assigneeInitials: 'M1',
  },
];

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState(JERRAA_MOCK_TASKS);

  const theme = darkMode ? darkTheme : lightTheme;

  const handleAddTask = (columnId) => {
    console.log(`Add task clicked for column: ${columnId}`);
  };

  return (
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
              element={
                <Board
                  darkMode={darkMode}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
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