import { Link } from 'react-router-dom';
import { useTasks } from '../context';
import { useTheme } from '../context/ThemeContext';

export default function IssuesPage() {
  const { darkMode } = useTheme();
  const { tasks } = useTasks();

  const statusLabel = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' };
  const statusColor = { todo: '#3B82F6', in_progress: '#F97316', done: '#22C55E' };

  return (
    <div>
      <h1 style={{ ...styles.heading, color: darkMode ? '#F8FAFC' : '#0F172A' }}>Issues</h1>
      <p style={{ ...styles.subtitle, color: darkMode ? '#94A3B8' : '#64748B' }}>
        {tasks.length} total issues across all columns
      </p>

      <div style={styles.tableWrap}>
        <table style={{ ...styles.table, color: darkMode ? '#F8FAFC' : '#0F172A' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}` }}>
              {['ID', 'Title', 'Status', 'Assignee', 'Due Date'].map((h) => (
                <th key={h} style={{ ...styles.th, color: darkMode ? '#94A3B8' : '#64748B' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9'}` }}>
                <td style={styles.td}>
                  <span style={{ ...styles.idBadge, color: darkMode ? '#94A3B8' : '#64748B' }}>{task.id}</span>
                </td>
                <td style={styles.td}>
                  <Link to={`/tasks/${task.id}`} style={{ color: '#3B82F6', textDecoration: 'none' }}>
                    {task.title}
                  </Link>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.statusPill, background: statusColor[task.status] || '#64748B' }}>
                    {statusLabel[task.status] || task.status}
                  </span>
                </td>
                <td style={styles.td}>{task.assignee || task.assigneeInitials || '—'}</td>
                <td style={styles.td}>{task.dueDate || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  heading: { fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.25rem 0' },
  subtitle: { fontSize: '0.85rem', margin: '0 0 1.5rem 0' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '0.7rem 0.75rem' },
  idBadge: { fontFamily: 'monospace', fontSize: '0.8rem' },
  statusPill: { color: '#fff', fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: '9999px' },
};
