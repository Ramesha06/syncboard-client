import React from 'react';
import Badge from './Badge';
import Button from './Button';
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

  return (
    <div className={columnClass} data-column-id={id}>
      {/* Column Header */}
      <div className={styles.columnHeader}>
        <div className={styles.headerLeft}>
          {/* Solid Pill Status Badge using reusable Badge */}
          <Badge
            status={id}
            accentColor={accentColor}
            size="sm"
            pill
            darkMode={darkMode}
          >
            {title}
          </Badge>

          {/* Circle Count Badge */}
          <div
            className={circleCountClass}
            style={{ borderColor: accentColor, color: darkMode ? '#FFFFFF' : accentColor }}
          >
            {count}
          </div>
        </div>

        {/* Top-Right Quick Add Action using reusable Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={addBtnClass}
          onClick={() => onAddTask && onAddTask(id)}
          title={`Add task to ${title}`}
          darkMode={darkMode}
        >
          +
        </Button>
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

        {/* Bottom Add Task Button Slot using reusable Button */}
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
