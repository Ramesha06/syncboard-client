export function filterTasks(tasks, { searchQuery, selectedAssignee, selectedStatus }) {
  return tasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesAssignee = selectedAssignee
      ? task.assignee === selectedAssignee
      : true;

    const matchesStatus = selectedStatus
      ? task.status === selectedStatus
      : true;

    return matchesSearch && matchesAssignee && matchesStatus;
  });
}