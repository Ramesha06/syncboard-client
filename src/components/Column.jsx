import React from 'react';
import styles from './Column.module.css';

/**
 * Column Component (Member 2 Responsibility - JERRAA Template Design)
 * Renders an individual Kanban column with solid pill header, circle count badge, top-right add button, and task slots.
 */
export default function Column({
  id,
  title,
  count = 0,
  accentColor = '#2563EB',
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
  const addTaskBtnClass = `${styles.addTaskBtn} ${
    darkMode ? styles.addTaskBtnDark : styles.addTaskBtnLight
  }`;

  return (
    <div className={columnClass} data-column-id={id}>
      {/* Column Header */}
      <div className={styles.columnHeader}>
        <div className={styles.headerLeft}>
          {/* Solid Pill Status Badge */}
          <div
            className={styles.statusPill}
            style={{ backgroundColor: accentColor }}
          >
            {title}
          </div>

          {/* Circle Count Badge */}
          <div
            className={circleCountClass}
            style={{ borderColor: accentColor, color: darkMode ? '#FFFFFF' : accentColor }}
          >
            {count}
          </div>
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

        {/* Bottom Add Task Button Slot */}
        <button
          type="button"
          className={addTaskBtnClass}
          onClick={() => onAddTask && onAddTask(id)}
        >
          <span>+ Add Task</span>
        </button>
      </div>
    </div>
  );
}
