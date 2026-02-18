import React from 'react';

const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  rows = 4,
  required = false,
  disabled = false,
  maxLength,
  showCount = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-[#a6adc8] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-gray-900
          placeholder-gray-500 transition-all resize-none
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-indigo-500'
          }
        `}
        {...props}
      />

      <div className="flex items-center justify-between mt-1.5">
        {(error || helperText) && (
          <p className={`text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}

        {showCount && maxLength && (
          <p className="text-xs text-gray-500 ml-auto">
            {value?.length || 0} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default Textarea;
