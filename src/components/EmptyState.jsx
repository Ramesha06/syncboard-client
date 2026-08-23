import Button from './Button';

export default function EmptyState({
  title = "No tasks found",
  description = "Get started by creating your first task or clearing your active filters.",
  actionLabel,
  onAction,
  darkMode,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">📋</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" darkMode={darkMode} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
