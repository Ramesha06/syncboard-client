import styles from './AddTaskForm.module.css';

export default function FormField({
  id,
  label,
  required,
  error,
  darkMode = true,
  children,
}) {
  const labelClass = `${styles.label} ${darkMode ? styles.labelDark : styles.labelLight}`;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
}
