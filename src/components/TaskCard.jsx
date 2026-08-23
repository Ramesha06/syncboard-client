import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge';
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import { useTasks } from '../context';
import { DEFAULT_COLUMNS } from '../constants/columns';
import styles from './TaskCard.module.css';

/**
 * TaskCard
 *
 * Visual card matching the "Clean & Minimal" style, plus the Move
 * left/right buttons and Delete-with-confirmation flow this ticket
 * asks for. Reads moveTask/deleteTask straight from TaskContext
 * (useTasks) - the same pattern AddTaskForm already uses for addTask -
 * so no callback props need to be threaded down from Board.
 */
export default function TaskCard({ task, darkMode = true }) {
    const { moveTask, deleteTask } = useTasks();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const cardClass = `${styles.card} ${darkMode ? styles.cardDark : styles.cardLight}`;

    const columnIndex = DEFAULT_COLUMNS.findIndex((col) => col.id === task.status);
    const canMoveLeft = columnIndex > 0;
    const canMoveRight = columnIndex > -1 && columnIndex < DEFAULT_COLUMNS.length - 1;

    const handleMoveLeft = () => {
        if (canMoveLeft) moveTask(task.id, DEFAULT_COLUMNS[columnIndex - 1].id);
    };

    const handleMoveRight = () => {
        if (canMoveRight) moveTask(task.id, DEFAULT_COLUMNS[columnIndex + 1].id);
    };

    const handleConfirmDelete = () => {
        deleteTask(task.id);
        setIsConfirmOpen(false);
    };

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
                <Link to={`/tasks/${task.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {task.title || task.text || 'Untitled task'}
                </Link>
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

            {/* Move / Delete Actions */}
            <div className={`${styles.actionRow} ${darkMode ? styles.actionRowDark : styles.actionRowLight}`}>
                <div className={styles.moveGroup}>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        darkMode={darkMode}
                        disabled={!canMoveLeft}
                        onClick={handleMoveLeft}
                        aria-label={`Move "${task.title}" to the previous column`}
                        title="Move left"
                    >
                        <ChevronIcon direction="left" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        darkMode={darkMode}
                        disabled={!canMoveRight}
                        onClick={handleMoveRight}
                        aria-label={`Move "${task.title}" to the next column`}
                        title="Move right"
                    >
                        <ChevronIcon direction="right" />
                    </Button>
                </div>

                <Button
                    variant="danger"
                    size="icon-sm"
                    darkMode={darkMode}
                    onClick={() => setIsConfirmOpen(true)}
                    aria-label={`Delete "${task.title}"`}
                    title="Delete task"
                >
                    <TrashIcon />
                </Button>
            </div>

            {isConfirmOpen && (
                <ConfirmModal
                    darkMode={darkMode}
                    danger
                    title="Delete this task?"
                    message={`"${task.title}" will be permanently removed. This can't be undone.`}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}
        </div>
    );
}

function ChevronIcon({ direction = 'left' }) {
    const rotate = direction === 'right' ? 'rotate(180deg)' : 'none';
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: rotate }} aria-hidden="true">
            <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}