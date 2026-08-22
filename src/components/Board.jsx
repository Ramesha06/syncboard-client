import React from 'react';
import Column from './Column';
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
 * Board Component (Member 2 Responsibility - JERRAA Template Layout)
 */
export default function Board({
  darkMode = true,
  columns = DEFAULT_COLUMNS,
  tasks = [],
  renderTask,
  onAddTask,
  children,
}) {
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
  const toggleActiveBtnClass = `${styles.toggleBtn} ${
    darkMode ? styles.toggleBtnActiveDark : styles.toggleBtnActiveLight
  }`;

  // Helper to group tasks by column ID
  const getTasksForColumn = (columnId) => {
    if (Array.isArray(tasks)) {
      return tasks.filter(
        (task) =>
          task.status === columnId ||
          task.columnId === columnId ||
          task.status?.toLowerCase().replace(' ', '_') === columnId
      );
    }
    if (tasks && typeof tasks === 'object') {
      return tasks[columnId] || [];
    }
    return [];
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
            <p className={subtitleClass}>17 Running Projects</p>
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
              placeholder="Search tasks..."
              className={searchInputClass}
            />
          </div>

          <div className={viewToggleClass}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${toggleActiveBtnClass}`}
            >
              ⊞ Board
            </button>
            <button type="button" className={styles.toggleBtn}>
              ≡ List
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
                onAddTask={onAddTask}
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
 */
function DefaultTaskCard({ task, darkMode }) {
  const tagColorMap = {
    'UX Design': { bg: 'rgba(255, 138, 0, 0.12)', text: '#FF8A00' },
    '3D Design': { bg: 'rgba(6, 182, 212, 0.12)', text: '#06B6D4' },
    'UI Design': { bg: 'rgba(236, 72, 153, 0.12)', text: '#EC4899' },
    Illustration: { bg: 'rgba(168, 85, 247, 0.12)', text: '#A855F7' },
  };

  const tagStyle = tagColorMap[task.category] || {
    bg: 'rgba(99, 102, 241, 0.12)',
    text: '#6366F1',
  };

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
      {/* Category Pill Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.74rem',
            fontWeight: '700',
            backgroundColor: tagStyle.bg,
            color: tagStyle.text,
          }}
        >
          {task.category || 'UX Design'}
        </span>
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
