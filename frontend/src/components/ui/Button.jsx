const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    onClick,
    disabled = false,
    fullWidth = false
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm',
        secondary: 'bg-white dark:bg-[#1e1e2e] text-gray-700 dark:text-[#cdd6f4] border border-gray-300 dark:border-[#313244] hover:bg-gray-50 dark:hover:bg-[#272739] focus:ring-indigo-500',
        ghost: 'text-gray-600 dark:text-[#a6adc8] hover:bg-gray-100 dark:hover:bg-[#272739] focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
      `}
        >
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
        </button>
    );
};

export default Button;