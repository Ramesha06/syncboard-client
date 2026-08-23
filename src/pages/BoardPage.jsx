import { useState, useEffect } from 'react';
import Board from '../components/Board';
import AddTaskForm from '../components/AddTaskForm';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import FilterDropdowns from '../components/FilterDropdowns';
import Button from '../components/Button';
import { useTasks } from '../context';
import { useTheme } from '../context/ThemeContext';

export default function BoardPage() {
  const { darkMode } = useTheme();
  const { tasks, loading, error, setLoading, setError, addTask } = useTasks();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('todo');
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!initialLoad) return;
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setInitialLoad(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [initialLoad, setLoading]);

  const handleAddTask = (columnId) => {
    setTargetColumnId(columnId);
    setIsAddTaskOpen(true);
  };

  const handleRetry = () => {
    setError(null);
    setInitialLoad(true);
  };

  const assignees = [...new Set(
    tasks.map((t) => t.assignee || t.assigneeInitials).filter(Boolean)
  )];

  const filteredTasks = tasks.filter((task) => {
    const matchesAssignee = !selectedAssignee ||
      task.assignee === selectedAssignee ||
      task.assigneeInitials === selectedAssignee;
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      task.title?.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query);
    return matchesAssignee && matchesStatus && matchesSearch;
  });

  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const hasActiveFilters = selectedAssignee || selectedStatus || searchQuery;

  const resetFilters = () => {
    setSelectedAssignee('');
    setSelectedStatus('');
    setSearchQuery('');
  };

  if (loading) return <Spinner message="Loading board..." />;

  if (error) return <ErrorBanner message={error} onRetry={handleRetry} darkMode={darkMode} />;

  if (tasks.length === 0) {
    return (
      <EmptyState title="No tasks yet" description="Create your first task to get started."
        actionLabel="Add Task" onAction={() => handleAddTask('todo')} darkMode={darkMode} />
    );
  }

  return (
    <>
      <div style={filterBarStyle}>
        <input type="text" placeholder="Search tasks by title..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            ...searchInputStyle,
            background: darkMode ? 'rgba(255,255,255,0.04)' : '#F1F5F9',
            color: darkMode ? '#F8FAFC' : '#0F172A',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
          }}
        />
        <FilterDropdowns selectedAssignee={selectedAssignee} selectedStatus={selectedStatus}
          onAssigneeChange={setSelectedAssignee} onStatusChange={setSelectedStatus} assignees={assignees} />
        {hasActiveFilters && (
          <Button variant="secondary" size="sm" darkMode={darkMode} onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState title="No matching tasks" description="Try adjusting your filters or search query."
          actionLabel="Reset Filters" onAction={resetFilters} darkMode={darkMode} />
      ) : (
        <Board darkMode={darkMode} tasks={filteredTasks} doneCount={doneCount}
          totalCount={tasks.length} onAddTask={handleAddTask} />
      )}

      {isAddTaskOpen && (
        <AddTaskForm onClose={() => setIsAddTaskOpen(false)} onSubmit={addTask}
          darkMode={darkMode} defaultColumnId={targetColumnId} />
      )}
    </>
  );
}

const filterBarStyle = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  marginBottom: '1.25rem', flexWrap: 'wrap',
};

const searchInputStyle = {
  padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem',
  outline: 'none', width: '220px',
};
