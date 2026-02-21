const TableRow = ({ 
  children, 
  onClick,
  striped = false,
  hoverable = true,
  className = '' 
}) => {
  return (
    <tr
      onClick={onClick}
      className={`
        ${striped ? 'bg-gray-50' : 'bg-white'}
        ${hoverable ? 'hover:bg-gray-50 transition-colors' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </tr>
  );
};

export default TableRow;