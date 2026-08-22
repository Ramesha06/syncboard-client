import Badge from './Badge';
import styles from './TaskCard.module.css';

/**
 * TaskCard
 * Plain, presentational task card — display only, no actions.
 * Matches the "Clean & Minimal" visual style introduced in this commit
 * (see the Column/Badge/Button components) rather than the older
 * JERRAA rounded-card look.
 *
 * Pure function of `task` and `darkMode` — no state, no callbacks, and
 * no dependency on TaskContext. Move/Delete controls, if added later,
 * belong in a separate layer on top of this component (the reducer
 * already has moveTask/deleteTask ready for that).
 */
export default function TaskCard({ task, darkMode = true }) {
    const cardClass = `${styles.card} ${darkMode ? styles.cardDark : styles.cardLight}`;

    return (
        <div className={cardClass}>
            {/* Category Tag & Task ID */}
            <div className={styles.topRow}>
                <Badge
                    category={task.category || 'UX Design'}
                    variant="subtle"
                    size="sm"
                    pill
                    darkMode={darkMode}
                />
                <span className={styles.taskId}>{task.id || 'TSK'}</span>
            </div>

            {/* Task Title */}
            <h3 className={`${styles.taskTitle} ${darkMode ? styles.taskTitleDark : styles.taskTitleLight}`}>
                {task.title || task.text || 'Untitled task'}
            </h3>

            {/* Task Subtitle / Details */}
            {task.description && (
                <p className={`${styles.taskDescription} ${darkMode ? styles.taskDescriptionDark : styles.taskDescriptionLight}`}>
                    {task.description}
                </p>
            )}

            {/* Task Footer - assignee + due date */}
            <div className={`${styles.footer} ${darkMode ? styles.footerDark : styles.footerLight}`}>
                <div className={styles.assigneeWrap}>
                    <div className={`${styles.assignee} ${darkMode ? styles.assigneeDark : styles.assigneeLight}`}>
                        {task.assigneeInitials || '—'}
                    </div>
                </div>
                <span className={`${styles.dueDate} ${darkMode ? styles.dueDateDark : styles.dueDateLight}`}>
                    {task.dueDate || 'No due date'}
                </span>
            </div>
        </div>
    );
}