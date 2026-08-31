import { useState, useEffect } from 'react';
import Board from '../components/Board';
import AddTaskForm from '../components/AddTaskForm';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import FilterDropdowns from '../components/FilterDropdowns';
import { useTasks } from '../context';
import { useTheme } from '../context/ThemeContext';

export default function BoardPage() {
  const { darkMode } = useTheme();
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('todo');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = (columnId) => {
    setTargetColumnId(columnId);
    setIsAddTaskOpen(true);
  };

  const assignees = [...new Set(
    tasks.map((task) => task.assignee || task.assigneeInitials).filter(Boolean)
  )];

  const filteredTasks = tasks.filter((task) => {
    const matchesAssignee = !selectedAssignee || task.assignee === selectedAssignee || task.assigneeInitials === selectedAssignee;
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || task.title?.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query);
    return matchesAssignee && matchesStatus && matchesSearch;
  });

  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const hasActiveFilters = !!(selectedAssignee || selectedStatus || searchQuery);

  const resetFilters = () => {
    setSelectedAssignee('');
    setSelectedStatus('');
    setSearchQuery('');
  };

  if (loading) return <Spinner message="Loading board..." />;

  if (error) {
    return <ErrorBanner message={error} onRetry={fetchTasks} darkMode={darkMode} />;
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to get started."
        actionLabel="Add Task"
        onAction={() => handleAddTask('todo')}
        darkMode={darkMode}
      />
    );
  }

  return (
    <>
      <FilterDropdowns
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAssignee={selectedAssignee}
        selectedStatus={selectedStatus}
        onAssigneeChange={setSelectedAssignee}
        onStatusChange={setSelectedStatus}
        assignees={assignees}
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
        darkMode={darkMode}
      />

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No matching tasks"
          description="Try adjusting your filters or search query."
          actionLabel="Reset Filters"
          onAction={resetFilters}
          darkMode={darkMode}
        />
      ) : (
        <Board
          darkMode={darkMode}
          tasks={filteredTasks}
          doneCount={doneCount}
          totalCount={tasks.length}
          onAddTask={handleAddTask}
        />
      )}

      {isAddTaskOpen && (
        <AddTaskForm
          onClose={() => setIsAddTaskOpen(false)}
          onTaskCreated={() => {
            setIsAddTaskOpen(false);
            fetchTasks();
          }}
          darkMode={darkMode}
          defaultColumnId={targetColumnId}
        />
      )}
    </>
  );
}
