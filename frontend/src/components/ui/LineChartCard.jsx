import React from 'react';
import Card from './Card';
import { TrendingUp } from 'lucide-react';

const LineChartCard = ({
  title,
  description,
  data = [],
  height = 200,
  color = 'indigo',
  showGrid = true,
  className = ''
}) => {
  const colorClasses = {
    indigo: 'stroke-indigo-500 fill-indigo-50',
    blue: 'stroke-blue-500 fill-blue-50',
    green: 'stroke-green-500 fill-green-50',
    purple: 'stroke-purple-500 fill-purple-50',
    red: 'stroke-red-500 fill-red-50',
  };

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.value || 0), 1);
  const minValue = Math.min(...data.map(d => d.value || 0), 0);
  const range = maxValue - minValue || 1;

  // Generate SVG path
  const generatePath = () => {
    if (data.length === 0) return '';

    const width = 100;
    const segmentWidth = width / (data.length - 1 || 1);

    return data.map((point, index) => {
      const x = index * segmentWidth;
      const y = 100 - ((point.value - minValue) / range) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = () => {
    if (data.length === 0) return '';

    const width = 100;
    const segmentWidth = width / (data.length - 1 || 1);

    const topPath = data.map((point, index) => {
      const x = index * segmentWidth;
      const y = 100 - ((point.value - minValue) / range) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return `${topPath} L 100 100 L 0 100 Z`;
  };

  const path = generatePath();
  const areaPath = generateAreaPath();

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-[#9399b2] mt-1">{description}</p>
          )}
        </div>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        {data.length > 0 ? (
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {showGrid && (
              <>
                <line x1="0" y1="0" x2="100" y2="0" stroke="#E5E7EB" strokeWidth="0.3" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#E5E7EB" strokeWidth="0.3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#E5E7EB" strokeWidth="0.3" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#E5E7EB" strokeWidth="0.3" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="#E5E7EB" strokeWidth="0.3" />
              </>
            )}

            <path
              d={areaPath}
              className={colorClasses[color]}
              fillOpacity="0.3"
            />

            <path
              d={path}
              className={colorClasses[color]}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-[#6c7086]">
            <p className="text-sm">No data available</p>
          </div>
        )}
      </div>

      {/* Data labels */}
      {data.length > 0 && (
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-[#7f849c]">
          <span>{data[0]?.label || ''}</span>
          <span>{data[data.length - 1]?.label || ''}</span>
        </div>
      )}
    </Card>
  );
};

export default LineChartCard;
