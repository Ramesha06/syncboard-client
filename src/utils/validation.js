/**
 * Validation helpers for the Add Task form.
 *
 * Kept as small, pure functions with no React and no DOM dependency so they
 * can be unit-tested directly with Jest in Session 4 (Testing) without
 * rendering any component.
 *
 * Session 1 rule this follows: "A controlled form with validation: title
 * required, minimum three characters, due date not in the past."
 * (Assignment 1 - Functional Requirements)
 *
 * Reminder from Session 2: this is a *courtesy to the user*, not security.
 * The server must re-validate everything with its own schema (zod) once the
 * Express API is wired up - never trust the client.
 */

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 80;
const DESCRIPTION_MAX_LENGTH = 300;
// 1-3 letters, e.g. "RW", "M2" would fail this (initials should be letters) -
// tweak to /^[A-Za-z0-9]{1,3}$/ if your team wants to allow "M2"-style ids.
const ASSIGNEE_PATTERN = /^[A-Za-z]{1,3}$/;

/** Returns today's date at local midnight, so time-of-day never affects the comparison. */
export function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Validates a task title.
 * @param {string} title
 * @returns {string|null} an error message, or null if valid
 */
export function validateTitle(title) {
    const value = (title ?? '').trim();

    if (!value) {
        return 'Title is required.';
    }
    if (value.length < TITLE_MIN_LENGTH) {
        return `Title must be at least ${TITLE_MIN_LENGTH} characters.`;
    }
    if (value.length > TITLE_MAX_LENGTH) {
        return `Title must be under ${TITLE_MAX_LENGTH} characters.`;
    }
    return null;
}

/**
 * Validates the (optional) task description.
 * @param {string} description
 * @returns {string|null}
 */
export function validateDescription(description) {
    const value = (description ?? '').trim();
    if (value.length > DESCRIPTION_MAX_LENGTH) {
        return `Description must be under ${DESCRIPTION_MAX_LENGTH} characters.`;
    }
    return null;
}

/**
 * Validates a due date string (expects an ISO "yyyy-mm-dd" value, which is
 * what a native <input type="date"> gives you). Rejects missing/unparseable
 * dates and any date before today.
 * @param {string} dueDate
 * @returns {string|null}
 */
export function validateDueDate(dueDate) {
    if (!dueDate) {
        return 'Due date is required.';
    }

    const parsed = new Date(`${dueDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
        return 'Enter a valid date.';
    }

    if (parsed < startOfToday()) {
        return 'Due date cannot be in the past.';
    }

    return null;
}

/**
 * Validates the optional assignee initials field.
 * @param {string} initials
 * @returns {string|null}
 */
export function validateAssignee(initials) {
    const value = (initials ?? '').trim();
    if (!value) return null; // optional field
    if (!ASSIGNEE_PATTERN.test(value)) {
        return 'Use 1-3 letters only (e.g. "RW").';
    }
    return null;
}

/**
 * Validates that a category has been selected.
 * @param {string} category
 * @returns {string|null}
 */
export function validateCategory(category) {
    if (!category || !category.trim()) {
        return 'Choose a category.';
    }
    return null;
}

/**
 * Runs every field validator against a form values object.
 * @param {{title: string, description?: string, category: string, dueDate: string, assigneeInitials?: string}} values
 * @returns {{errors: Record<string, string>, isValid: boolean}}
 */
export function validateTaskForm(values) {
    const errors = {};

    const titleError = validateTitle(values.title);
    if (titleError) errors.title = titleError;

    const descriptionError = validateDescription(values.description);
    if (descriptionError) errors.description = descriptionError;

    const categoryError = validateCategory(values.category);
    if (categoryError) errors.category = categoryError;

    const dueDateError = validateDueDate(values.dueDate);
    if (dueDateError) errors.dueDate = dueDateError;

    const assigneeError = validateAssignee(values.assigneeInitials);
    if (assigneeError) errors.assigneeInitials = assigneeError;

    return { errors, isValid: Object.keys(errors).length === 0 };
}