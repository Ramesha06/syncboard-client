import Column from './Column';
import TaskCard from './TaskCard';
import { DEFAULT_COLUMNS } from '../constants/columns';
import styles from './Board.module.css';

export default function Board({
  darkMode = true,
  columns = DEFAULT_COLUMNS,
  tasks = [],
  doneCount = 0,
  totalCount = 0,
  onAddTask,
  children,
}) {
  const titleClass = `${styles.title} ${darkMode ? styles.titleDark : styles.titleLight}`;
  const subtitleClass = `${styles.subtitle} ${darkMode ? styles.subtitleDark : styles.subtitleLight}`;
  const avatarClass = `${styles.avatarItem} ${!darkMode ? styles.avatarLight : ''}`;

  const getTasksForColumn = (columnId) => {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter(
      (task) =>
        task.status === columnId ||
        task.columnId === columnId
    );
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.sprintHeader}>
        <div className={styles.headerTitleSection}>
          <div className={styles.titleGroup}>
            <div className={styles.titleRow}>
              <h1 className={titleClass}>SyncBoard</h1>
            </div>
            <p className={subtitleClass}>
              {doneCount} of {totalCount} done
            </p>
          </div>

          <div className={styles.avatarStack}>
            <div className={avatarClass} style={{ backgroundColor: '#EF4444' }}>RW</div>
            <div className={avatarClass} style={{ backgroundColor: '#3B82F6' }}>GT</div>
            <div className={avatarClass} style={{ backgroundColor: '#10B981' }}>KS</div>
          </div>
        </div>
      </div>

      <div className={styles.columnsWrapper}>
        {children || columns.map((col) => {
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
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} darkMode={darkMode} />
              ))}
            </Column>
          );
        })}
      </div>
    </div>
  );
}
