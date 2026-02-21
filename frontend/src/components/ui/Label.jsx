const Label = ({ 
  children, 
  htmlFor,
  required = false,
  optional = false,
  className = '',
  ...props
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && <span className="text-gray-400 ml-1 font-normal">(optional)</span>}
    </label>
  );
};

export default Label;