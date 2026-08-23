import Button from './Button';

export default function SearchBar({ searchQuery, onSearchChange, darkMode }) {
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
        <Button variant="ghost" size="sm" darkMode={darkMode} onClick={() => onSearchChange('')}>
          Clear
        </Button>
      )}
    </div>
  );
}
