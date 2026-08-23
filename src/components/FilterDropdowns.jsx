import styles from './FilterDropdowns.module.css';

export default function FilterDropdowns({
  searchQuery = '',
  onSearchChange,
  selectedAssignee,
  selectedStatus,
  onAssigneeChange,
  onStatusChange,
  assignees = [],
  hasActiveFilters = false,
  onReset,
  darkMode = true,
}) {
  const inputClass = `${styles.searchInput} ${darkMode ? styles.searchInputDark : styles.searchInputLight}`;
  const selectClass = `${styles.select} ${darkMode ? styles.selectDark : styles.selectLight}`;
  const resetClass = `${styles.resetBtn} ${darkMode ? styles.resetBtnDark : styles.resetBtnLight}`;

  return (
    <div className={styles.filterBar}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>
          <svg className={styles.searchIconSvg} viewBox="0 0 24 24" fill="none"
            stroke={darkMode ? '#64748B' : '#94A3B8'} strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <select value={selectedAssignee} onChange={(e) => onAssigneeChange(e.target.value)}
        className={selectClass}>
        <option value="">All Assignees</option>
        {assignees.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>

      <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)}
        className={selectClass}>
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {hasActiveFilters && (
        <button type="button" className={resetClass} onClick={onReset}>
          Clear
        </button>
      )}
    </div>
  );
}
