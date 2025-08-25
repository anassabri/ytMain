import React, { _FC, _ReactNode, _ReactElement, InputHTMLAttributes } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
 icon?: React.ReactNode;
 containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
 label,
 error,
 icon,
 id,
 type = 'text',
 className = '',
 containerClassName = '',
 ...props
}) => {
 const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

 return (
 <div className={`mb-4 ${containerClassName}`}>
 {label && (
 <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
 {label}
// FIXED:  </label>
 )}
 <div className="relative rounded-md shadow-sm">
 {icon && (
 <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
 {React.cloneElement(icon as React._ReactElement, { className: 'h-5 w-5 text-neutral-400 dark:text-neutral-500' })}
// FIXED:  </div>
 )}
 <input
        id={inputId}
        type={type}
        className={`block w-full rounded-md border px-3 py-2 text-sm
        ${icon ? 'pl-10' : ''}
        ${error ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
        : 'border-neutral-300 dark:border-neutral-600 focus:ring-sky-500 focus:border-sky-500'}
        bg-white dark:bg-neutral-700/30 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500
        focus:outline-none transition duration-150 ease-in-out ${className}`}
        {...props}
      />
 {error && (
 <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
 {/* You could add an error icon here if desired */}
// FIXED:  </div>
 )}
// FIXED:  </div>
 {error && (
 <p className="mt-1.5 text-xs text-red-600 dark:text-red-400" id={`${inputId}-error`}>
 {error}
// FIXED:  </p>
 )}
// FIXED:  </div>
 );
};

export default Input;