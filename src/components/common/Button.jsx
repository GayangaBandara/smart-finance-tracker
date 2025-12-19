import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-0 relative overflow-hidden';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white focus:ring-indigo-500/20 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    secondary:
      'bg-white/8 hover:bg-white/15 backdrop-blur-sm border border-white/15 hover:border-white/25 text-gray-700 hover:text-gray-900 focus:ring-white/30 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    danger:
      'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500/20 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    success:
      'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500/20 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    outline:
      'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white focus:ring-indigo-500/20 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'hover:bg-white/10 text-gray-600 hover:text-gray-900 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px] gap-2',
    md: 'px-6 py-3 text-base min-h-[48px] gap-3',
    lg: 'px-8 py-4 text-lg min-h-[56px] gap-4',
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
      {/* Shimmer effect for primary buttons */}
      {variant === 'primary' && (
        <>
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </>
      )}

      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {leftIcon && !loading && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && !loading && <span className="flex-shrink-0">{rightIcon}</span>}
      </div>
    </button>
  );
};

export default Button;
