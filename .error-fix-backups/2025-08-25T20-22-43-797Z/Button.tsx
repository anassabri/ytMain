import React, { ReactNode, FC } from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
 size?: 'xs' | 'sm' | 'md' | 'lg';
 isLoading?: boolean;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
 children,
 variant = 'primary',
 size = 'md',
 isLoading = false,
 leftIcon,
 rightIcon,
 className = '',
 disabled,
 ...props
}) => {
 const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 transition-all duration-150 ease-in-out';

 const variantClasses = {
 primary: `bg-sky-600 hover:bg-sky-700 text-white focus-visible:ring-sky-500 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
 secondary: `bg-neutral-200 hover:bg-neutral-300 text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-100 focus-visible:ring-neutral-500 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
 danger: `bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
 ghost: `bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700/70 text-neutral-700 dark:text-neutral-200 focus-visible:ring-sky-500 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}`,
 link: `bg-transparent hover:underline text-sky-600 dark:text-sky-400 focus-visible:ring-sky-500 p-0 ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''}` };

 const sizeClasses = {
 xs: 'px-2.5 py-1.5 text-xs',
 sm: 'px-3 py-2 text-sm',
 md: 'px-4 py-2 text-sm',
 lg: 'px-6 py-3 text-base' };

 const iconSizeClasses = {
 xs: 'w-3.5 h-3.5',
 sm: 'w-4 h-4',
 md: 'w-5 h-5',
 lg: 'w-5 h-5' };

 return (
 <button
// FIXED:  type="button"
// FIXED:  className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
// FIXED:  disabled={disabled || isLoading}
 {...props}
 >
 {isLoading && (
 <svg
  className={`animate-spin h-5 w-5 ${children ? (leftIcon ? 'mr-2' : '-ml-1 mr-2') : ''} text-current`}
  xmlns="http://www.w3.org/2000/svg"
 fill="none"
 viewBox="0 0 24 24"
 >
 <circle
  className="opacity-25"
  cx="12"
  cy="12"
  r="10"
  stroke="currentColor"
  strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      )}
 {leftIcon && !isLoading && <span className={`${children ? 'mr-2' : ''} ${iconSizeClasses[size]}`}>{leftIcon}</span>}
 {children}
 {rightIcon && !isLoading && <span className={`${children ? 'ml-2' : ''} ${iconSizeClasses[size]}`}>{rightIcon}</span>}
  </button>
 );
};

export default Button;