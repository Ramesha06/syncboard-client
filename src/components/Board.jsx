import React from 'react';
import Column from './Column';
import { useTasks } from '../context';
import { DEFAULT_COLUMNS } from '../constants/columns';
import styles from './Board.module.css';
import TaskCard from './TaskCard'

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
                    <TaskCard
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