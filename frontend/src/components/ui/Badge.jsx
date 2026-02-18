import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
    const variants = {
        default: 'bg-gray-100 dark:bg-[#313244] text-gray-700 dark:text-[#a6adc8]',
        primary: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
        success: 'bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400',
        warning: 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
        danger: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400',
        info: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
};

export default Badge;