import React from 'react';
import Button from './Button';
import Card from './Card';

const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
  secondary,
  className = '' 
}) => {
  return (
    <Card className={`p-12 ${className}`}>
      <div className="text-center max-w-md mx-auto">
        {Icon && (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
        )}
        
        {description && (
          <p className="text-gray-600 mb-6">
            {description}
          </p>
        )}
        
        {onAction && actionLabel && (
          <div className="flex items-center justify-center space-x-3">
            <Button 
              variant="primary" 
              icon={actionIcon}
              onClick={onAction}
            >
              {actionLabel}
            </Button>
            
            {secondary && (
              <Button variant="secondary" onClick={secondary.onClick}>
                {secondary.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmptyState;
