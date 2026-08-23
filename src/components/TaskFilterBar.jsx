import SearchBar from './SearchBar';
import FilterDropdowns from './FilterDropdowns';

export default function TaskFilterBar({
  searchQuery,
  onSearchChange,
  selectedAssignee,
  selectedStatus,
  onAssigneeChange,
  onStatusChange,
  onResetFilters,
  assignees,
}) {
  const hasActiveFilters = searchQuery || selectedAssignee || selectedStatus;

  return (
    <div className="task-filter-bar">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <FilterDropdowns
        selectedAssignee={selectedAssignee}
        selectedStatus={selectedStatus}
        onAssigneeChange={onAssigneeChange}
        onStatusChange={onStatusChange}
        assignees={assignees}
      />
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="btn-reset"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}