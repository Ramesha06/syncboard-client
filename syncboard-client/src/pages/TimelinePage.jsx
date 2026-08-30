import { Link } from 'react-router-dom';
import { useTasks } from '../context';
import { useTheme } from '../context/ThemeContext';

export default function TimelinePage() {
  const { darkMode } = useTheme();
  const { tasks } = useTasks();

  const statusColor = { todo: '#3B82F6', in_progress: '#F97316', done: '#22C55E' };
  const statusLabel = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };

  const sorted = [...tasks].sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  return (
    <div>
      <h1 style={{ ...styles.heading, color: darkMode ? '#F8FAFC' : '#0F172A' }}>Timeline</h1>
      <p style={{ ...styles.subtitle, color: darkMode ? '#94A3B8' : '#64748B' }}>
        Tasks ordered by due date
      </p>

      <div style={styles.timeline}>
        {sorted.map((task) => (
          <div key={task.id} style={{
            ...styles.item,
            background: darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0'}`,
          }}>
            <div style={{ ...styles.dateBadge, color: darkMode ? '#94A3B8' : '#64748B' }}>
              {task.dueDate || 'No date'}
            </div>
            <div style={styles.itemContent}>
              <div style={styles.itemHeader}>
                <Link to={`/tasks/${task.id}`}
                  style={{ ...styles.itemTitle, color: darkMode ? '#F8FAFC' : '#0F172A' }}>
                  {task.title}
                </Link>
                <span style={{ ...styles.statusDot, background: statusColor[task.status] || '#64748B' }}>
                  {statusLabel[task.status]}
                </span>
              </div>
              <p style={{ ...styles.itemDesc, color: darkMode ? '#94A3B8' : '#64748B' }}>
                {task.description || 'No description'}
              </p>
              <span style={{ fontSize: '0.78rem', color: darkMode ? '#64748B' : '#94A3B8' }}>
                {task.assignee || task.assigneeInitials || '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heading: { fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.25rem 0' },
  subtitle: { fontSize: '0.85rem', margin: '0 0 1.5rem 0' },
  timeline: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  item: { display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '10px' },
  dateBadge: { fontSize: '0.78rem', fontWeight: 600, minWidth: '90px', paddingTop: '2px' },
  itemContent: { flex: 1 },
  itemHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' },
  itemTitle: { fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' },
  itemDesc: { fontSize: '0.82rem', margin: '0 0 0.3rem 0' },
  statusDot: { color: '#fff', fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px' },
};
