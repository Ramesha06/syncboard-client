import Button from './Button';

export default function ErrorBanner({ message, onRetry, darkMode }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <div className="error-content">
        <span className="error-icon" aria-hidden="true">⚠️</span>
        <span className="error-message">{message}</span>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" darkMode={darkMode} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
