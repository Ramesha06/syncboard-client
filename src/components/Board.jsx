import React from 'react';
import Column from './Column';
import Badge from './Badge';
import { useTasks } from '../context';
import styles from './Board.module.css';
import TaskCard from './TaskCard'

/**
 * Default JERRAA Template Columns Definition
 */
const DEFAULT_COLUMNS = [
  { id: 'todo', title: 'To Do', accentColor: '#3B82F6' },
  { id: 'in_progress', title: 'In Progress', accentColor: '#F97316' },
  { id: 'in_review', title: 'Submitted', accentColor: '#10B981' },
  { id: 'done', title: 'Done', accentColor: '#22C55E' },
];

/**
 * Board Component (Clean, Minimal, Modern Layout)
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

  const titleClass = `${styles.title} ${darkMode ? styles.titleDark : styles.titleLight
    }`;
  const subtitleClass = `${styles.subtitle} ${darkMode ? styles.subtitleDark : styles.subtitleLight
    }`;
  const avatarClass = `${styles.avatarItem} ${!darkMode ? styles.avatarLight : ''
    }`;
  const searchBarClass = `${styles.searchBar} ${darkMode ? styles.searchBarDark : styles.searchBarLight
    }`;
  const searchInputClass = `${styles.searchInput} ${darkMode ? styles.searchInputDark : styles.searchInputLight
    }`;
  const viewToggleClass = `${styles.viewToggle} ${darkMode ? styles.viewToggleDark : styles.viewToggleLight
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
      assigneeInitials: 'RW',
    });
  };

  return (
    <div className={styles.boardContainer}>
      {/* Board Header */}
      <div className={styles.sprintHeader}>
        <div className={styles.headerTitleSection}>
          <div className={styles.titleGroup}>
            <div className={styles.titleRow}>
              <h1 className={titleClass}>RNI Studio Space</h1>
            </div>
            <p className={subtitleClass}>
              {contextTasks.length} Active Tasks & Projects
            </p>
          </div>

          {/* Member Avatar Stack */}
          <div className={styles.avatarStack}>
            <div className={avatarClass} style={{ backgroundColor: '#EF4444' }}>
              🎨
            </div>
            <div className={avatarClass} style={{ backgroundColor: '#3B82F6' }}>
              💻
            </div>
            <div className={avatarClass} style={{ backgroundColor: '#10B981' }}>
              ⚡
            </div>
            <div className={`${avatarClass} ${styles.avatarMore}`}>+5</div>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className={styles.headerControls}>
          <div className={searchBarClass}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Filter tasks..."
              className={searchInputClass}
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>

          <div className={viewToggleClass}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${activeView === 'board'
                ? darkMode
                  ? styles.toggleBtnActiveDark
                  : styles.toggleBtnActiveLight
                : ''
                }`}
              onClick={() => setActiveView('board')}
            >
              Board
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${activeView === 'list'
                ? darkMode
                  ? styles.toggleBtnActiveDark
                  : styles.toggleBtnActiveLight
                : ''
                }`}
              onClick={() => setActiveView('list')}
            >
              List
            </button>
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
 * Clean & Minimal Task Card
 */
function DefaultTaskCard({ task, darkMode }) {
  return (
    <div
      style={{
        borderRadius: '10px',
        padding: '12px 14px',
        cursor: 'grab',
        transition: 'all 0.15s ease',
        background: darkMode ? '#13141C' : '#FFFFFF',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
        boxShadow: darkMode
          ? '0 1px 3px rgba(0, 0, 0, 0.2)'
          : '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Category Tag & Task ID */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge
          category={task.category || 'UX Design'}
          variant="subtle"
          size="sm"
          pill
          darkMode={darkMode}
        />
        <span
          style={{
            color: '#64748B',
            fontSize: '0.7rem',
            fontWeight: '600',
            letterSpacing: '0.3px',
          }}
        >
          {task.id || 'TSK'}
        </span>
      </div>

      {/* Task Title */}
      <h3
        style={{
          margin: 0,
          fontSize: '0.88rem',
          fontWeight: '600',
          color: darkMode ? '#F8FAFC' : '#0F172A',
          letterSpacing: '-0.2px',
          lineHeight: '1.3',
        }}
      >
        {task.title || task.text || 'Usability Testing'}
      </h3>

      {/* Task Subtitle / Details */}
      {task.description && (
        <p
          style={{
            margin: 0,
            fontSize: '0.78rem',
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
          marginTop: '2px',
          paddingTop: '6px',
          borderTop: darkMode
            ? '1px solid rgba(255, 255, 255, 0.04)'
            : '1px solid #F1F5F9',
        }}
      >
        {/* Assignees */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.62rem',
              fontWeight: '700',
              border: darkMode
                ? '1px solid rgba(59, 130, 246, 0.3)'
                : '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            {task.assigneeInitials || 'RW'}
          </div>
        </div>

        {/* Due Date */}
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: '500',
            color: darkMode ? '#64748B' : '#94A3B8',
          }}
        >
          {task.dueDate || '10 Nov'}
        </span>
      </div>
    </div>
  );
}
