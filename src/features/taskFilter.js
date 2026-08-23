import React, { useState } from 'react';

// TODO: Replace this placeholder with the real Task Filter UI.
// This is a small, safe starter component added on feature/task-filter-UI branch.

export default function TaskFilter() {
  const [query, setQuery] = useState('');

  // Sample placeholder data — real data should come from props or app state.
  const sampleTasks = [
    { id: 1, title: 'Sync user profile' },
    { id: 2, title: 'Fix sync conflict' },
    { id: 3, title: 'Improve filter UI' },
    { id: 4, title: 'Write tests for sync' },
  ];

  const filtered = sampleTasks.filter(t =>
    t.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="task-filter">
      <label htmlFor="task-filter-input">Filter tasks</label>
      <input
        id="task-filter-input"
        type="search"
        placeholder="Search tasks..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ display: 'block', margin: '8px 0', padding: '6px' }}
      />

      <ul>
        {filtered.length === 0 ? (
          <li>No tasks match your filter.</li>
        ) : (
          filtered.map(task => (
            <li key={task.id}>{task.title}</li>
          ))
        )}
      </ul>

      {/* TODO: wire this component up to real task data and styling */}
    </div>
  );
}
