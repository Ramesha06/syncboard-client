import React from 'react';
import Column from './Column';
import Badge from './Badge';
import Button from './Button';
import { useTasks } from '../context';
import styles from './Board.module.css';

/**
 * Default JERRAA Template Columns Definition
 */
const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do', accentColor: '#2563EB' },
  { id: 'in_progress', title: 'In Progress', accentColor: '#FF8A00' },
  { id: 'in_review', title: 'Submitted', accentColor: '#10B981' },
  { id: 'done', title: 'Done', accentColor: '#16A34A' },
];

/**
 * Board Component (JERRAA Template Layout with Global State Integration)
 */
export default function Board({
  darkMode = true,
  columns = DEFAULT_COLUMNS,
  tasks: propTasks,
  renderTask,
  onAddTask,
  children,
}) {
  const {
    tasks: contextTasks = [],
    filteredTasks = [],
    searchQuery = '',
    setSearchQuery,
    addTask: contextAddTask,
  } = useTasks();

  // Use props tasks if explicitly provided, otherwise use global filtered tasks
  const activeTasks = propTasks !== undefined ? propTasks : filteredTasks || contextTasks;

  const [activeView, setActiveView] = React.useState('board');

  const titleClass = `${styles.title} ${
    darkMode ? styles.titleDark : styles.titleLight
  }`;
  const subtitleClass = `${styles.subtitle} ${
    darkMode ? styles.subtitleDark : styles.subtitleLight
  }`;
  const avatarClass = `${styles.avatarItem} ${
    !darkMode ? styles.avatarLight : ''
  }`;
  const searchBarClass = `${styles.searchBar} ${
    darkMode ? styles.searchBarDark : styles.searchBarLight
  }`;
  const searchInputClass = `${styles.searchInput} ${
    darkMode ? styles.searchInputDark : styles.searchInputLight
  }`;
  const viewToggleClass = `${styles.viewToggle} ${
    darkMode ? styles.viewToggleDark : styles.viewToggleLight
  }`;

  // Helper to group tasks by column ID
  const getTasksForColumn = (columnId) => {
    if (Array.isArray(activeTasks)) {
      return activeTasks.filter(
        (task) =>
          task.status === columnId ||
          task.columnId === columnId ||
          task.status?.toLowerCase().replace(' ', '_') === columnId
      );
    }
    if (activeTasks && typeof activeTasks === 'object') {
      return activeTasks[columnId] || [];
    }
    return [];
  };

  const handleAddTaskClick = (columnId) => {
    if (onAddTask) {
      onAddTask(columnId);
      return;
    }

    const categoryList = ['UX Design', '3D Design', 'UI Design', 'Illustration'];
    const randomCategory = categoryList[Math.floor(Math.random() * categoryList.length)];
    const dateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    contextAddTask({
      title: `New ${randomCategory} Task`,
      description: 'Newly added task item in ' + columnId,
      category: randomCategory,
      status: columnId,
      dueDate: dateStr,
      assigneeInitials: 'SB',
    });
  };

  return (
    <div className={styles.boardContainer}>
      {/* Board Workspace Header */}
      <div className={styles.sprintHeader}>
        <div className={styles.headerTitleSection}>
          <div className={styles.titleGroup}>
            <div className={styles.titleRow}>
              <h1 className={titleClass}>RNI Studio Space</h1>
              <span className={styles.caretIcon}>▼</span>
            </div>
            <p className={subtitleClass}>
              {contextTasks.length} Active Tasks & Projects
            </p>
          </div>

          {/* Member Avatar Stack */}
          <div className={styles.avatarStack}>
            <div className={avatarClass} style={{ backgroundColor: '#FF6B6B' }}>
              🎨
            </div>
            <div className={avatarClass} style={{ backgroundColor: '#4D96FF' }}>
              💻
            </div>
            <div className={avatarClass} style={{ backgroundColor: '#6BCB77' }}>
              ⚡
            </div>
            <div className={`${avatarClass} ${styles.avatarMore}`}>50+</div>
          </div>
        </div>

        {/* Header Right Controls (Search & View Toggles) */}
        <div className={styles.headerControls}>
          <div className={searchBarClass}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search tasks or categories..."
              className={searchInputClass}
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>

          <div className={viewToggleClass}>
            <Button
              type="button"
              variant={activeView === 'board' ? 'primary' : 'ghost'}
              size="sm"
              darkMode={darkMode}
              onClick={() => setActiveView('board')}
            >
              ⊞ Board
            </Button>
            <Button
              type="button"
              variant={activeView === 'list' ? 'primary' : 'ghost'}
              size="sm"
              darkMode={darkMode}
              onClick={() => setActiveView('list')}
            >
              ≡ List
            </Button>
          </div>
        </div>
      </div>

      {/* Columns Container */}
      <div className={styles.columnsWrapper}>
        {children ? (
          children
        ) : (
          columns.map((col) => {
            const colTasks = getTasksForColumn(col.id);

            return (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                count={colTasks.length}
                accentColor={col.accentColor}
                darkMode={darkMode}
                onAddTask={handleAddTaskClick}
              >
                {colTasks.map((task, index) =>
                  renderTask ? (
                    renderTask(task, col.id, index)
                  ) : (
                    <DefaultTaskCard
                      key={task.id || index}
                      task={task}
                      darkMode={darkMode}
                    />
                  )
                )}
              </Column>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * Task Card Renderer matching JERRAA Template floating card design
 * Utilizes reusable Badge UI component for category tags
 */
function DefaultTaskCard({ task, darkMode }) {
  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '1.2rem',
        cursor: 'grab',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        background: darkMode ? '#1F1F2A' : '#FFFFFF',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #FFFFFF',
        boxShadow: darkMode
          ? '0 6px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 14px rgba(15, 23, 42, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {/* Category Tag using Reusable Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge
          category={task.category || 'UX Design'}
          variant="subtle"
          size="sm"
          pill
          darkMode={darkMode}
        />
        <span style={{ color: '#94A3B8', fontSize: '1rem', cursor: 'pointer' }}>⋮</span>
      </div>

      {/* Task Title */}
      <h3
        style={{
          margin: 0,
          fontSize: '0.96rem',
          fontWeight: '700',
          color: darkMode ? '#F8FAFC' : '#0F172A',
          letterSpacing: '-0.2px',
        }}
      >
        {task.title || task.text || 'Usability Testing'}
      </h3>

      {/* Task Subtitle / Details */}
      {task.description && (
        <p
          style={{
            margin: 0,
            fontSize: '0.82rem',
            color: darkMode ? '#94A3B8' : '#64748B',
            lineHeight: '1.4',
          }}
        >
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '6px',
          paddingTop: '8px',
        }}
      >
        {/* Assignees */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: '700',
              border: darkMode ? '2px solid #1F1F2A' : '2px solid #FFFFFF',
            }}
          >
            {task.assigneeInitials || 'RW'}
          </div>
        </div>

        {/* Due Date */}
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: '600',
            color: darkMode ? '#64748B' : '#94A3B8',
          }}
        >
          {task.dueDate || '10 Nov 2021'}
        </span>
      </div>
    </div>
  );
}

