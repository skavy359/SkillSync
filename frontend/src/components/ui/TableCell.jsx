const TableCell = ({ 
  children, 
  header = false,
  align = 'left',
  width,
  className = '' 
}) => {
  const Tag = header ? 'th' : 'td';
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  return (
    <Tag
      style={{ width }}
      className={`
        px-6 py-4
        ${header 
          ? 'text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50' 
          : 'text-sm text-gray-900'
        }
        ${alignClasses[align]}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
};

export default TableCell;