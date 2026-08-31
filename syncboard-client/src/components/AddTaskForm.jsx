import React, { useState } from 'react';
import { useTasks } from '../context';

export const AddTaskForm = ({ onTaskCreated, onClose, onSubmit, defaultColumnId = 'todo' }) => {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering',
    status: defaultColumnId || 'todo',
    dueDate: '',
    boardId: 'board-1',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setGeneralError('');

    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        category: formData.category || 'Engineering',
        status: formData.status || 'todo',
        dueDate: formData.dueDate,
        boardId: formData.boardId || 'board-1',
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await addTask(payload);
      }

      setFormData({ title: '', category: 'Engineering', status: defaultColumnId || 'todo', dueDate: '', boardId: 'board-1' });
      if (onTaskCreated) onTaskCreated();
      if (onClose) onClose();
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors)) {
        const errorMap = {};
        err.errors.forEach(({ field, message }) => {
          errorMap[field] = message;
        });
        setFieldErrors(errorMap);
      } else {
        setGeneralError(err?.message || 'Failed to create task');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {generalError && <div className="error-banner">{generalError}</div>}

      <div>
        <label>Title</label>
        <input name="title" value={formData.title} onChange={handleChange} />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </div>

      <div>
        <label>Due Date</label>
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        {fieldErrors.dueDate && <span className="field-error">{fieldErrors.dueDate}</span>}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default AddTaskForm;
