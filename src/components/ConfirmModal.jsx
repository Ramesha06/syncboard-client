import { useEffect } from 'react';
import Button from './Button';
import styles from './ConfirmModal.module.css';

/**
 * ConfirmModal 
 *
 * Generic confirmation dialog, used here to confirm task deletion but
 * written with no knowledge of "tasks" so it can be reused for any other
 * destructive action later.
 *
 * Follows the same convention AddTaskForm established: the PARENT mounts
 * and unmounts this component (`{isConfirmOpen && <ConfirmModal ... />}`)
 * rather than this component hiding itself behind an `isOpen` prop.
 */
export default function ConfirmModal({
  darkMode = true,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  // Close on Escape, same as AddTaskForm.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const overlayClass = `${styles.overlay} ${darkMode ? styles.overlayDark : styles.overlayLight}`;
  const dialogClass = `${styles.dialog} ${darkMode ? styles.dialogDark : styles.dialogLight}`;
  const titleClass = `${styles.title} ${darkMode ? styles.titleDark : styles.titleLight}`;
  const messageClass = `${styles.message} ${darkMode ? styles.messageDark : styles.messageLight}`;

  return (
    <div
      className={overlayClass}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel?.();
      }}
    >
      <div
        className={dialogClass}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-heading"
        aria-describedby="confirm-modal-message"
      >
        {danger && (
          <div className={styles.iconWrap}>
            <WarningIcon />
          </div>
        )}

        <h2 id="confirm-modal-heading" className={titleClass}>
          {title}
        </h2>

        {message && (
          <p id="confirm-modal-message" className={messageClass}>
            {message}
          </p>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" darkMode={darkMode} onClick={onCancel} fullWidth>
            {cancelLabel}
          </Button>
          <Button
            autoFocus
            variant={danger ? 'danger' : 'primary'}
            darkMode={darkMode}
            onClick={onConfirm}
            fullWidth
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}