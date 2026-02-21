const ProgressBar = ({
    progress = 0,
    size = 'md',
    color = 'indigo',
    showLabel = false,
    className = ''
}) => {
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    const colors = {
        indigo: 'bg-indigo-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500',
    };

    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className={className}>
            <div className={`w-full bg-gray-100 dark:bg-[#313244] rounded-full overflow-hidden ${sizes[size]}`}>
                <div
                    className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${normalizedProgress}%` }}
                />
            </div>
            {showLabel && (
                <div className="mt-1 text-xs text-gray-600 dark:text-[#9399b2] text-right">
                    {normalizedProgress}%
                </div>
            )}
        </div>
    );
};

export default ProgressBar;