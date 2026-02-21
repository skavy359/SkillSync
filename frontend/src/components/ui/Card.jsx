const Card = ({ children, className = '', hover = false, onClick }) => {
    const hoverClass = hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : '';

    return (
        <div
            onClick={onClick}
            className={`
        bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] shadow-sm
        transition-all duration-200
        ${hoverClass}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;