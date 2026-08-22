import React from 'react';
import Badge from './Badge';
import Button from './Button';
import styles from './Column.module.css';

/**
 * Clean & Minimal Column Component
 * Renders an individual Kanban column with a subtle status badge, count indicator, and task slots.
 */
export default function Column({
  id,
  title,
  count = 0,
  accentColor = '#3B82F6',
  darkMode = true,
  children,
  onAddTask,
}) {
  const columnClass = `${styles.column} ${
    darkMode ? styles.columnDark : styles.columnLight
  }`;
  const circleCountClass = `${styles.circleCount} ${
    darkMode ? styles.circleCountDark : styles.circleCountLight
  }`;
  const addBtnClass = `${styles.headerAddBtn} ${
    darkMode ? styles.headerAddBtnDark : styles.headerAddBtnLight
  }`;

  return (
    <div className={columnClass} data-column-id={id}>
      {/* Column Header */}
      <div className={styles.columnHeader}>
        <div className={styles.headerLeft}>
          <Badge
            status={id}
            accentColor={accentColor}
            variant="subtle"
            size="sm"
            pill
            dot
            darkMode={darkMode}
          >
            {title}
          </Badge>

          <span className={circleCountClass}>
            {count}
          </span>
        </div>

        {/* Top-Right Quick Add Action */}
        <button
          type="button"
          className={addBtnClass}
          onClick={() => onAddTask && onAddTask(id)}
          title={`Add task to ${title}`}
        >
          +
        </button>
      </div>

      {/* Column Body & Task Card Slots */}
      <div className={styles.columnBody}>
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <div className={styles.emptyState}>
            <span>No tasks in {title}</span>
          </div>
        )}

        {/* Bottom Add Task Button */}
        <Button
          type="button"
          variant="dashed"
          fullWidth
          size="sm"
          darkMode={darkMode}
          onClick={() => onAddTask && onAddTask(id)}
        >
          + Add Task
        </Button>
      </div>
    </div>
  );
}
