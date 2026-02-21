import React from 'react';
import Button from './Button';

const PageHeader = ({
  title,
  description,
  action,
  actionLabel,
  actionIcon,
  onAction,
  breadcrumbs,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              <button
                className={`
                  ${index === breadcrumbs.length - 1
                    ? 'text-gray-900 font-medium'
                    : 'hover:text-gray-700'
                  }
                `}
                onClick={crumb.onClick}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 dark:text-[#9399b2] max-w-2xl">{description}</p>
          )}
        </div>

        {children ? (
          <div className="ml-4">{children}</div>
        ) : action && action !== false ? (
          <div className="ml-4">{typeof action === 'object' ? action : (
            <Button
              variant="primary"
              icon={actionIcon}
              onClick={onAction}
            >
              {actionLabel || 'Add New'}
            </Button>
          )}</div>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeader;