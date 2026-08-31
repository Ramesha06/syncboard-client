import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import { useTheme } from '../context/ThemeContext';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadTask = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await taskApi.getById(id);
        if (!active) return;
        setTask(response.data || response);
      } catch (err) {
        if (!active) return;

        if (err.status === 404) {
          setTask(null);
        } else {
          setError(err.message || 'Unable to load task');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTask();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <Spinner message="Loading task..." />;
  }

  if (error) {
    return <ErrorBanner message={error} onRetry={() => window.location.reload()} darkMode={darkMode} />;
  }

  if (!task) {
    return (
      <div style={styles.container}>
        <h2 style={{ color: darkMode ? '#F8FAFC' : '#0F172A' }}>Task not found</h2>
        <p style={{ color: darkMode ? '#94A3B8' : '#64748B' }}>
          No task with ID "{id}" exists.
        </p>
        <Link to="/" style={styles.backLink}>Back to Board</Link>
      </div>
    );
  }

  const statusLabel = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Board</Link>

      <div
        style={{
          ...styles.card,
          background: darkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
        }}
      >
        <div style={styles.header}>
          <span style={{ ...styles.taskId, color: darkMode ? '#94A3B8' : '#64748B' }}>{task.id}</span>
          <span
            style={{
              ...styles.statusBadge,
              background: task.status === 'done' ? '#22C55E' : task.status === 'in_progress' ? '#F97316' : '#3B82F6',
            }}
          >
            {statusLabel[task.status] || task.status}
          </span>
        </div>

        <h1 style={{ ...styles.title, color: darkMode ? '#F8FAFC' : '#0F172A' }}>{task.title}</h1>

        {task.description && (
          <p style={{ ...styles.description, color: darkMode ? '#CBD5E1' : '#475569' }}>{task.description}</p>
        )}

        <div style={styles.details}>
          <DetailRow label="Assignee" value={task.assignee || task.assigneeInitials || '—'} darkMode={darkMode} />
          <DetailRow label="Category" value={task.category || '—'} darkMode={darkMode} />
          <DetailRow label="Due Date" value={task.dueDate || '—'} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, darkMode }) {
  return (
    <div style={styles.detailRow}>
      <span style={{ ...styles.detailLabel, color: darkMode ? '#94A3B8' : '#64748B' }}>{label}</span>
      <span style={{ ...styles.detailValue, color: darkMode ? '#F8FAFC' : '#0F172A' }}>{value}</span>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  backLink: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'inline-block',
    marginBottom: '1.5rem',
  },
  card: {
    borderRadius: '12px',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  taskId: {
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  statusBadge: {
    color: '#FFFFFF',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '9999px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 0.75rem 0',
  },
  description: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
    margin: '0 0 1.5rem 0',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(148,163,184,0.1)',
  },
  detailLabel: {
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  detailValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
  },
};
