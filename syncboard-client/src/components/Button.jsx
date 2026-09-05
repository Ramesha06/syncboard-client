import styles from './Button.module.css';

const VARIANT_CLASS_MAP = {
  primary: styles.variantPrimary,
  secondary: styles.variantSecondary,
  outline: styles.variantOutline,
  ghost: styles.variantGhost,
  danger: styles.variantDanger,
  accent: styles.variantAccent,
  dashed: styles.variantDashed,
  icon: styles.variantGhost,
};

const SIZE_CLASS_MAP = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  icon: styles.sizeIcon,
  'icon-sm': styles.sizeIconSm,
};

/**
 * Reusable Button UI Component
 *
 * Supports multiple variants, sizes, icon alignments, loading spinners, and themes.
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Button content
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'|'accent'|'dashed'|'icon'} [props.variant='primary'] - Button style variant
 * @param {'sm'|'md'|'lg'|'icon'|'icon-sm'} [props.size='md'] - Button size
 * @param {boolean} [props.fullWidth=false] - Occupy 100% of container width
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.loading=false] - Loading indicator state
 * @param {string} [props.loadingText] - Optional text displayed during loading
 * @param {React.ReactNode} [props.icon] - Single icon (for icon buttons or default left icon)
 * @param {React.ReactNode} [props.startIcon] - Left icon
 * @param {React.ReactNode} [props.endIcon] - Right icon
 * @param {string} [props.type='button'] - HTML button type ('button', 'submit', 'reset')
 * @param {boolean} [props.darkMode=true] - Dark mode theme flag
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS class names
 * @param {Object} [props.style] - Inline style overrides
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  isLoading = false,
  loadingText,
  icon,
  startIcon,
  endIcon,
  type = 'button',
  darkMode = true,
  onClick,
  className = '',
  style = {},
  ...rest
}) {
  const isButtonLoading = loading || isLoading;
  const isButtonDisabled = disabled || isButtonLoading;

  const actualSize = size === 'icon' || (icon && !children) ? 'icon' : size;
  const sizeClass = SIZE_CLASS_MAP[actualSize] || styles.sizeMd;
  const variantClass = VARIANT_CLASS_MAP[variant] || styles.variantPrimary;
  const fullWidthClass = fullWidth ? styles.fullWidth : '';
  const disabledClass = isButtonDisabled ? styles.btnDisabled : '';
  const themeClass = darkMode ? '' : styles.btnLight;

  const leftIcon = startIcon || (icon && children ? icon : null);
  const centerIcon = icon && !children ? icon : null;

  return (
    <button
      type={type}
      className={`${styles.btn} ${sizeClass} ${variantClass} ${fullWidthClass} ${disabledClass} ${themeClass} ${className}`.trim()}
      style={style}
      disabled={isButtonDisabled}
      onClick={isButtonDisabled ? undefined : onClick}
      aria-busy={isButtonLoading}
      aria-disabled={isButtonDisabled}
      {...rest}
    >
      {isButtonLoading ? (
        <>
          <span className={styles.loadingSpinner} aria-hidden="true" />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          {leftIcon && <span className={styles.iconStart}>{leftIcon}</span>}
          {centerIcon || children}
          {endIcon && <span className={styles.iconEnd}>{endIcon}</span>}
        </>
      )}
    </button>
  );
}
