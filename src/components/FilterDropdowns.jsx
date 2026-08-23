export default function FilterDropdowns({
  selectedAssignee,
  selectedStatus,
  onAssigneeChange,
  onStatusChange,
  assignees = [],
}) {
  return (
    <div className="filter-dropdowns">
      <select
        value={selectedAssignee}
        onChange={(event) => onAssigneeChange(event.target.value)}
        className="filter-select"
      >
        <option value="">All Assignees</option>
        {assignees.map((assignee) => (
          <option key={assignee} value={assignee}>
            {assignee}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(event) => onStatusChange(event.target.value)}
        className="filter-select"
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}