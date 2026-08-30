import SearchBar from './SearchBar';
import FilterDropdowns from './FilterDropdowns';
import Button from './Button';

export default function TaskFilterBar({
  searchQuery,
  onSearchChange,
  selectedAssignee,
  selectedStatus,
  onAssigneeChange,
  onStatusChange,
  onResetFilters,
  assignees,
  darkMode,
}) {
  const hasActiveFilters = searchQuery || selectedAssignee || selectedStatus;

  return (
    <div className="task-filter-bar">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        darkMode={darkMode}
      />
      <FilterDropdowns
        selectedAssignee={selectedAssignee}
        selectedStatus={selectedStatus}
        onAssigneeChange={onAssigneeChange}
        onStatusChange={onStatusChange}
        assignees={assignees}
      />
      {hasActiveFilters && (
        <Button
          variant="secondary"
          size="sm"
          darkMode={darkMode}
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
}
