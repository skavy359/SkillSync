import React from 'react';

const Section = ({
  title,
  description,
  action,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      {(title || description || action) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-600 dark:text-[#9399b2]">{description}</p>
            )}
          </div>

          {action && (
            <div className="ml-4">{action}</div>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default Section;
