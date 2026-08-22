/**
 * Default column definitions for the board.
 * Lives in its own module (not inside Board.jsx) so both Board and
 * AddTaskForm can import the same list without a component file
 * exporting a non-component value (which breaks React Fast Refresh).
 *
 * Keep this in sync with Board.jsx if the columns ever change - Board
 * imports this same constant rather than redefining it.
 */
export const DEFAULT_COLUMNS = [
    { id: 'todo', title: 'To Do', accentColor: '#3B82F6' },
    { id: 'in_progress', title: 'In Progress', accentColor: '#F97316' },
    { id: 'in_review', title: 'Submitted', accentColor: '#10B981' },
    { id: 'done', title: 'Done', accentColor: '#22C55E' },
];