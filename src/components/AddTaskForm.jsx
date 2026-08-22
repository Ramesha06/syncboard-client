import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { useTasks } from '../context';
import { DEFAULT_COLUMNS } from '../constants/columns';
import { validateTaskForm } from '../utils/validation';
import { formatDate, todayIso } from '../utils/formatDate';
import styles from './AddTaskForm.module.css';

const CATEGORY_OPTIONS = ['UX Design', 'UI Design', '3D Design', 'Illustration', 'Other'];

const EMPTY_FORM = {
    title: '',
    description: '',
    category: CATEGORY_OPTIONS[0],
    status: DEFAULT_COLUMNS[0].id,
    dueDate: '',
    assigneeInitials: '',
};

/**
 * AddTaskForm (Add Task UI + validation - this member's responsibility)
 *
 * A controlled modal form: every input's value is driven by React state
 * (values), never read from the DOM. Reads `addTask` straight from
 * TaskContext (useTasks) so it dispatches ADD_TASK the same way every other
 * part of the app does - no separate prop-drilled callback needed.
 *
 * IMPORTANT: this component expects the PARENT to mount/unmount it
 * (`{isAddTaskOpen && <AddTaskForm ... />}`) rather than hiding itself with
 * an `isOpen` prop. Mounting fresh on every open gives us a clean form for
 * free, with no reset-on-open effect (and no cascading-render lint warning).
 */
export default function AddTaskForm({
    onClose,
    darkMode = true,
    defaultColumnId = DEFAULT_COLUMNS[0].id,
    columns = DEFAULT_COLUMNS,
}) {
    const { addTask } = useTasks();

    const [values, setValues] = useState({ ...EMPTY_FORM, status: defaultColumnId });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const titleInputRef = useRef(null);

    // Focus the title field once, when the modal first mounts.
    useEffect(() => {
        titleInputRef.current?.focus();
    }, []);

    // Close on Escape, matching standard modal behaviour.
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleChange = (field) => (event) => {
        const { value } = event.target;
        setValues((prev) => ({ ...prev, [field]: value }));

        // Re-validate live once a field has been touched, so the error clears
        // the moment the user fixes it instead of waiting for another submit.
        if (touched[field] || submitAttempted) {
            const { errors: nextErrors } = validateTaskForm({ ...values, [field]: value });
            setErrors(nextErrors);
        }
    };

    const handleBlur = (field) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const { errors: nextErrors } = validateTaskForm(values);
        setErrors(nextErrors);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitAttempted(true);

        const { errors: nextErrors, isValid } = validateTaskForm(values);
        setErrors(nextErrors);

        if (!isValid) {
            // Move focus to the first invalid field so keyboard/screen-reader
            // users land straight on the problem.
            const firstInvalidField = Object.keys(nextErrors)[0];
            document.getElementById(`task-${firstInvalidField}`)?.focus();
            return;
        }

        // Don't set an id here - taskReducer's ADD_TASK already generates a
        // TSK-0X id when none is given, matching the style of the seeded mock
        // tasks. (Once Mongo _ids arrive in Session 3, the server will own ids
        // entirely and this concern goes away.)
        addTask({
            title: values.title.trim(),
            description: values.description.trim(),
            category: values.category,
            status: values.status,
            dueDate: formatDate(values.dueDate),
            assigneeInitials: values.assigneeInitials.trim().toUpperCase() || 'NA',
        });

        onClose?.();
    };

    const overlayClass = `${styles.overlay} ${darkMode ? styles.overlayDark : styles.overlayLight}`;
    const dialogClass = `${styles.dialog} ${darkMode ? styles.dialogDark : styles.dialogLight}`;
    const labelClass = `${styles.label} ${darkMode ? styles.labelDark : styles.labelLight}`;
    const inputClass = (field) =>
        `${styles.input} ${darkMode ? styles.inputDark : styles.inputLight} ${errors[field] ? styles.inputError : ''
        }`;

    return (
        <div
            className={overlayClass}
            onMouseDown={(event) => {
                // Close only when the backdrop itself is clicked, not the dialog.
                if (event.target === event.currentTarget) onClose?.();
            }}
        >
            <div
                className={dialogClass}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-task-heading"
            >
                <div className={styles.dialogHeader}>
                    <h2 id="add-task-heading" className={styles.heading}>
                        Add Task
                    </h2>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close add task form"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Title */}
                    <div className={styles.field}>
                        <label htmlFor="task-title" className={labelClass}>
                            Title <span className={styles.required}>*</span>
                        </label>
                        <input
                            id="task-title"
                            ref={titleInputRef}
                            type="text"
                            className={inputClass('title')}
                            value={values.title}
                            onChange={handleChange('title')}
                            onBlur={handleBlur('title')}
                            placeholder="e.g. Wireframe landing page"
                            aria-invalid={Boolean(errors.title)}
                            aria-describedby={errors.title ? 'task-title-error' : undefined}
                        />
                        {errors.title && (
                            <p id="task-title-error" className={styles.errorText}>
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className={styles.field}>
                        <label htmlFor="task-description" className={labelClass}>
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            className={inputClass('description')}
                            value={values.description}
                            onChange={handleChange('description')}
                            onBlur={handleBlur('description')}
                            placeholder="Optional details for the team"
                            rows={3}
                            aria-invalid={Boolean(errors.description)}
                            aria-describedby={errors.description ? 'task-description-error' : undefined}
                        />
                        {errors.description && (
                            <p id="task-description-error" className={styles.errorText}>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className={styles.row}>
                        {/* Category */}
                        <div className={styles.field}>
                            <label htmlFor="task-category" className={labelClass}>
                                Category <span className={styles.required}>*</span>
                            </label>
                            <select
                                id="task-category"
                                className={inputClass('category')}
                                value={values.category}
                                onChange={handleChange('category')}
                                onBlur={handleBlur('category')}
                            >
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className={styles.errorText}>{errors.category}</p>}
                        </div>

                        {/* Column / status */}
                        <div className={styles.field}>
                            <label htmlFor="task-status" className={labelClass}>
                                Column
                            </label>
                            <select
                                id="task-status"
                                className={inputClass('status')}
                                value={values.status}
                                onChange={handleChange('status')}
                            >
                                {columns.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        {/* Due date */}
                        <div className={styles.field}>
                            <label htmlFor="task-dueDate" className={labelClass}>
                                Due date <span className={styles.required}>*</span>
                            </label>
                            <input
                                id="task-dueDate"
                                type="date"
                                className={inputClass('dueDate')}
                                value={values.dueDate}
                                min={todayIso()}
                                onChange={handleChange('dueDate')}
                                onBlur={handleBlur('dueDate')}
                                aria-invalid={Boolean(errors.dueDate)}
                                aria-describedby={errors.dueDate ? 'task-dueDate-error' : undefined}
                            />
                            {errors.dueDate && (
                                <p id="task-dueDate-error" className={styles.errorText}>
                                    {errors.dueDate}
                                </p>
                            )}
                        </div>

                        {/* Assignee */}
                        <div className={styles.field}>
                            <label htmlFor="task-assigneeInitials" className={labelClass}>
                                Assignee initials
                            </label>
                            <input
                                id="task-assigneeInitials"
                                type="text"
                                className={inputClass('assigneeInitials')}
                                value={values.assigneeInitials}
                                onChange={handleChange('assigneeInitials')}
                                onBlur={handleBlur('assigneeInitials')}
                                placeholder="e.g. RW"
                                maxLength={3}
                                aria-invalid={Boolean(errors.assigneeInitials)}
                                aria-describedby={
                                    errors.assigneeInitials ? 'task-assigneeInitials-error' : undefined
                                }
                            />
                            {errors.assigneeInitials && (
                                <p id="task-assigneeInitials-error" className={styles.errorText}>
                                    {errors.assigneeInitials}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="secondary" darkMode={darkMode} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" darkMode={darkMode}>
                            Add Task
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}