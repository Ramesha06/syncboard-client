import styles from './Badge.module.css';

/**
 * Normalizes status strings to standard variant keys
 */
const STATUS_CLASS_MAP = {
  todo: 'statusTodo',
  'to do': 'statusTodo',
  in_progress: 'statusInProgress',
  'in progress': 'statusInProgress',
  in_review: 'statusInReview',
  'in review': 'statusInReview',
  submitted: 'statusInReview',
  done: 'statusDone',
};

const SUBTLE_STATUS_CLASS_MAP = {
  todo: 'subtleTodo',
  'to do': 'subtleTodo',
  in_progress: 'subtleInProgress',
  'in progress': 'subtleInProgress',
  in_review: 'subtleInReview',
  'in review': 'subtleInReview',
  submitted: 'subtleInReview',
  done: 'subtleDone',
};

const CATEGORY_CLASS_MAP = {
  'ux design': 'catUxDesign',
  '3d design': 'cat3dDesign',
  'ui design': 'catUiDesign',
  illustration: 'catIllustration',
};

const VARIANT_CLASS_MAP = {
  primary: 'variantPrimary',
  secondary: 'variantSecondary',
  success: 'variantSuccess',
  warning: 'variantWarning',
  danger: 'variantDanger',
  info: 'variantInfo',
  neutral: 'variantNeutral',
  outline: 'variantOutline',
};

/**
 * Reusable Badge UI Component
 *
 * Displays status badges, category tags, or general indicators with custom styling,
 * sizes, and shapes.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Badge content
 * @param {string} [props.label] - Badge text fallback
 * @param {string} [props.status] - Task status (e.g. 'todo', 'in_progress', 'in_review', 'done')
 * @param {string} [props.category] - Design category (e.g. 'UX Design', '3D Design', 'UI Design', 'Illustration')
 * @param {string} [props.variant='solid'] - Style variant ('solid', 'subtle', 'outline', 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral')
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Badge size
 * @param {boolean} [props.pill=true] - Fully rounded pill style vs soft rounded
 * @param {boolean} [props.dot=false] - Show small status circle dot
 * @param {string} [props.accentColor] - Custom background or accent color override
 * @param {string} [props.textColor] - Custom text color override
 * @param {boolean} [props.darkMode=true] - Dark mode theme flag
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 */
export default function Badge({
  children,
  label,
  status,
  category,
  variant = 'solid',
  size = 'md',
  pill = true,
  dot = false,
  accentColor,
  textColor,
  darkMode = true,
  onClick,
  className = '',
  style = {},
  ...rest
}) {
  const content = children || label || category || status || '';

  // Determine size class
  const sizeClass =
    size === 'sm'
      ? styles.sizeSm
      : size === 'lg'
      ? styles.sizeLg
      : styles.sizeMd;

  // Determine shape class
  const shapeClass = pill ? styles.pill : styles.rounded;

  // Determine color/style classes
  let colorClass;
  const normalizedStatus = (status || '').toLowerCase().trim();
  const normalizedCategory = (category || '').toLowerCase().trim();

  if (normalizedCategory && CATEGORY_CLASS_MAP[normalizedCategory]) {
    colorClass = styles[CATEGORY_CLASS_MAP[normalizedCategory]];
  } else if (normalizedStatus) {
    if (variant === 'subtle') {
      colorClass = styles[SUBTLE_STATUS_CLASS_MAP[normalizedStatus]] || styles.subtleTodo;
    } else {
      colorClass = styles[STATUS_CLASS_MAP[normalizedStatus]] || styles.statusTodo;
    }
  } else if (VARIANT_CLASS_MAP[variant]) {
    colorClass = styles[VARIANT_CLASS_MAP[variant]];
  } else if (variant === 'subtle') {
    colorClass = styles.variantNeutral;
  } else {
    colorClass = styles.variantPrimary;
  }

  const clickableClass = onClick ? styles.clickable : '';
  const themeClass = darkMode ? '' : styles.badgeLight;

  // Compute inline style overrides if custom colors are supplied
  const computedStyle = { ...style };
  if (accentColor) {
    if (variant === 'outline') {
      computedStyle.borderColor = accentColor;
      computedStyle.color = textColor || accentColor;
    } else if (variant === 'subtle') {
      computedStyle.backgroundColor = `${accentColor}20`; // ~12% opacity
      computedStyle.color = textColor || accentColor;
      computedStyle.borderColor = `${accentColor}40`;
    } else {
      computedStyle.backgroundColor = accentColor;
      computedStyle.color = textColor || '#FFFFFF';
    }
  } else if (textColor) {
    computedStyle.color = textColor;
  }

  return (
    <span
      className={`${styles.badge} ${sizeClass} ${shapeClass} ${colorClass} ${clickableClass} ${themeClass} ${className}`.trim()}
      style={computedStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {content}
    </span>
  );
}
