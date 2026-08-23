import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import FormField from './FormField';
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

export default function AddTaskForm({
    onClose,
    onSubmit,
    darkMode = true,
    defaultColumnId = DEFAULT_COLUMNS[0].id,
    columns = DEFAULT_COLUMNS,
}) {
    const [values, setValues] = useState({ ...EMPTY_FORM, status: defaultColumnId });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const titleInputRef = useRef(null);

    useEffect(() => { titleInputRef.current?.focus(); }, []);

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleChange = (field) => (event) => {
        const { value } = event.target;
        setValues((prev) => ({ ...prev, [field]: value }));
        if (touched[field] || submitAttempted) {
            setErrors(validateTaskForm({ ...values, [field]: value }).errors);
        }
    };

    const handleBlur = (field) => () => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        setErrors(validateTaskForm(values).errors);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitAttempted(true);
        const { errors: nextErrors, isValid } = validateTaskForm(values);
        setErrors(nextErrors);
        if (!isValid) {
            document.getElementById(`task-${Object.keys(nextErrors)[0]}`)?.focus();
            return;
        }
        onSubmit({
            title: values.title.trim(),
            description: values.description.trim(),
            category: values.category,
            status: values.status,
            dueDate: formatDate(values.dueDate),
            assigneeInitials: values.assigneeInitials.trim().toUpperCase() || 'NA',
        });
        onClose?.();
    };

    const inputClass = (field) =>
        `${styles.input} ${darkMode ? styles.inputDark : styles.inputLight} ${errors[field] ? styles.inputError : ''}`;

    return (
        <div
            className={`${styles.overlay} ${darkMode ? styles.overlayDark : styles.overlayLight}`}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
            <div
                className={`${styles.dialog} ${darkMode ? styles.dialogDark : styles.dialogLight}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-task-heading"
            >
                <div className={styles.dialogHeader}>
                    <h2 id="add-task-heading" className={styles.heading}>Add Task</h2>
                    <Button variant="ghost" size="icon-sm" darkMode={darkMode} onClick={onClose} aria-label="Close">
                        ×
                    </Button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <FormField id="task-title" label="Title" required error={errors.title} darkMode={darkMode}>
                        <input id="task-title" ref={titleInputRef} type="text" className={inputClass('title')}
                            value={values.title} onChange={handleChange('title')} onBlur={handleBlur('title')}
                            placeholder="e.g. Wireframe landing page" aria-invalid={Boolean(errors.title)} />
                    </FormField>

                    <FormField id="task-description" label="Description" error={errors.description} darkMode={darkMode}>
                        <textarea id="task-description" className={inputClass('description')}
                            value={values.description} onChange={handleChange('description')} onBlur={handleBlur('description')}
                            placeholder="Optional details for the team" rows={3} />
                    </FormField>

                    <div className={styles.row}>
                        <FormField id="task-category" label="Category" required error={errors.category} darkMode={darkMode}>
                            <select id="task-category" className={inputClass('category')}
                                value={values.category} onChange={handleChange('category')} onBlur={handleBlur('category')}>
                                {CATEGORY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </FormField>

                        <FormField id="task-status" label="Column" darkMode={darkMode}>
                            <select id="task-status" className={inputClass('status')}
                                value={values.status} onChange={handleChange('status')}>
                                {columns.map((col) => <option key={col.id} value={col.id}>{col.title}</option>)}
                            </select>
                        </FormField>
                    </div>

                    <div className={styles.row}>
                        <FormField id="task-dueDate" label="Due date" required error={errors.dueDate} darkMode={darkMode}>
                            <input id="task-dueDate" type="date" className={inputClass('dueDate')}
                                value={values.dueDate} min={todayIso()} onChange={handleChange('dueDate')} onBlur={handleBlur('dueDate')} />
                        </FormField>

                        <FormField id="task-assigneeInitials" label="Assignee initials" error={errors.assigneeInitials} darkMode={darkMode}>
                            <input id="task-assigneeInitials" type="text" className={inputClass('assigneeInitials')}
                                value={values.assigneeInitials} onChange={handleChange('assigneeInitials')} onBlur={handleBlur('assigneeInitials')}
                                placeholder="e.g. RW" maxLength={3} />
                        </FormField>
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="secondary" darkMode={darkMode} onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" darkMode={darkMode}>Add Task</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
