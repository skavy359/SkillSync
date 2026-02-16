import React from 'react';
import { X, Check, AlertCircle, Info, Bell } from 'lucide-react';

const NotificationItem = ({ 
  type = 'info',
  title,
  message,
  timestamp,
  read = false,
  onDismiss,
  onClick,
  action,
  className = '' 
}) => {
  const typeConfig = {
    success: {
      icon: Check,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      dotColor: 'bg-green-500',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      dotColor: 'bg-red-500',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      dotColor: 'bg-yellow-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      dotColor: 'bg-blue-500',
    },
    default: {
      icon: Bell,
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      dotColor: 'bg-gray-500',
    },
  };
  
  const config = typeConfig[type] || typeConfig.default;
  const Icon = config.icon;
  
  return (
    <div
      onClick={onClick}
      className={`
        flex items-start space-x-3 p-4 rounded-lg transition-all
        ${read ? 'bg-white' : config.bgColor}
        ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}
        ${className}
      `}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            {!read && (
              <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
            )}
          </div>
          
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {message && (
          <p className="text-sm text-gray-600 mb-2">{message}</p>
        )}
        
        <div className="flex items-center justify-between">
          {timestamp && (
            <span className="text-xs text-gray-500">{timestamp}</span>
          )}
          
          {action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
