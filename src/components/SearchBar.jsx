export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search tasks by title..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        className="search-input"
      />
      {searchQuery && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => onSearchChange('')}
        >
          Clear
        </button>
      )}
    </div>
  );
}