import React from 'react';
import Card from './Card';
import { PieChart } from 'lucide-react';

const DonutChartCard = ({
  title,
  description,
  data = [],
  size = 160,
  className = ''
}) => {
  const colors = [
    'stroke-indigo-500 fill-indigo-500',
    'stroke-blue-500 fill-blue-500',
    'stroke-purple-500 fill-purple-500',
    'stroke-green-500 fill-green-500',
    'stroke-yellow-500 fill-yellow-500',
    'stroke-red-500 fill-red-500',
    'stroke-pink-500 fill-pink-500',
    'stroke-orange-500 fill-orange-500',
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = -90; // Start from top

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const rotation = currentAngle;

    currentAngle += angle;

    return {
      ...item,
      percentage: percentage.toFixed(1),
      strokeDasharray,
      rotation,
      color: colors[index % colors.length]
    };
  });

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-[#9399b2] mt-1">{description}</p>
          )}
        </div>
        <PieChart className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
      </div>

      {data.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="12"
              />

              {/* Segments */}
              {segments.map((segment, index) => (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  className={segment.color}
                  strokeWidth="12"
                  strokeDasharray={segment.strokeDasharray}
                  strokeLinecap="round"
                  style={{
                    transform: `rotate(${segment.rotation}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                />
              ))}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">{total}</span>
              <span className="text-xs text-gray-500 dark:text-[#7f849c]">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2 min-w-0">
            {segments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${segment.color.replace('stroke-', 'bg-').split(' ')[1]}`}
                  />
                  <span className="text-sm text-gray-700 dark:text-[#a6adc8] truncate">
                    {segment.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">
                    {segment.value}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-[#7f849c]">
                    ({segment.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-400 dark:text-[#6c7086]">
          <p className="text-sm">No data available</p>
        </div>
      )}
    </Card>
  );
};

export default DonutChartCard;
