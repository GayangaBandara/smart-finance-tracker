import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'sm',
  disabled = false,
  className = '',
  ariaLabel,
  ariaPressed,
  leftIcon,
  rightIcon,
  loading = false,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 relative overflow-hidden';

  const variantClasses = {
    primary:
      'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500/20 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500/20 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/20 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    success:
      'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500/20 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'border border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 hover:bg-green-50 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px] gap-1.5 rounded-md',
    md: 'px-4 py-2 text-sm min-h-[36px] gap-2 rounded-lg',
    lg: 'px-6 py-2.5 text-base min-h-[44px] gap-2.5 rounded-lg',
  };

  const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';
  const loadingClasses = loading ? 'cursor-wait' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${loadingClasses} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      {...props}
    >
      <div className="flex items-center justify-center gap-1.5">
        {loading && (
          <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
        )}
        {leftIcon && !loading && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && !loading && <span className="flex-shrink-0">{rightIcon}</span>}
      </div>
    </button>
  );
};

export default Button;
