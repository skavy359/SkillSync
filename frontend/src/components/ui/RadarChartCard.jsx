import Card from './Card';
import { Radar } from 'lucide-react';

const RadarChartCard = ({
  title,
  description,
  data = [],
  size = 280,
  className = ''
}) => {
  const colors = [
    { stroke: '#6366f1', fill: 'rgba(99, 102, 241, 0.1)' },    // indigo
    { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.1)' },    // blue
    { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.1)' },    // purple
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)' },    // green
    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.1)' },    // yellow
    { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.1)' },     // red
    { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.1)' },    // pink
    { stroke: '#f97316', fill: 'rgba(249, 115, 22, 0.1)' },    // orange
  ];

  if (data.length === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-[#9399b2] mt-1">{description}</p>
            )}
          </div>
          <Radar className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
        </div>
        <div className="flex items-center justify-center py-12 text-gray-400 dark:text-[#6c7086]">
          <p className="text-sm">No data available</p>
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value || 0));
  
  // Return empty state if maxValue is 0 or NaN
  if (!maxValue || maxValue === 0) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-[#9399b2] mt-1">{description}</p>
            )}
          </div>
          <Radar className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
        </div>
        <div className="flex items-center justify-center py-12 text-gray-400 dark:text-[#6c7086]">
          <p className="text-sm">No data available yet</p>
        </div>
      </Card>
    );
  }

  const levels = 5;
  const angleSlice = (Math.PI * 2) / data.length;
  const radius = size / 2 - 50;

  // Calculate points for radar polygon
  const points = data.map((item, index) => {
    const angle = angleSlice * index - Math.PI / 2;
    const ratio = (item.value || 0) / maxValue;
    const x = size / 2 + ratio * radius * Math.cos(angle);
    const y = size / 2 + ratio * radius * Math.sin(angle);
    return { x, y, ...item };
  });

  // Generate concentric circles
  const concentricCircles = Array.from({ length: levels }, (_, i) => {
    const levelRadius = (radius / levels) * (i + 1);
    return levelRadius;
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
        <Radar className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
            {/* Concentric circles */}
            {concentricCircles.map((levelRadius, index) => (
              <circle
                key={`circle-${index}`}
                cx={size / 2}
                cy={size / 2}
                r={levelRadius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
                className="dark:stroke-[#404959]"
              />
            ))}

            {/* Axis lines */}
            {data.map((_, index) => {
              const angle = angleSlice * index - Math.PI / 2;
              const x = size / 2 + radius * Math.cos(angle);
              const y = size / 2 + radius * Math.sin(angle);
              return (
                <line
                  key={`axis-${index}`}
                  x1={size / 2}
                  y1={size / 2}
                  x2={x}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  className="dark:stroke-[#404959]"
                />
              );
            })}

            {/* Data polygon */}
            {points.length > 0 && (
              <>
                <polygon
                  points={points.map(p => `${p.x},${p.y}`).join(' ')}
                  fill={colors[0].fill}
                  stroke={colors[0].stroke}
                  strokeWidth="2"
                />

                {/* Data points with unique colors */}
                {points.map((point, index) => (
                  <circle
                    key={`point-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={colors[index % colors.length].stroke}
                    stroke="white"
                    strokeWidth="2"
                    className="dark:stroke-[#1e1e2e]"
                  />
                ))}
              </>
            )}

          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3 min-w-0">
          <div className="grid gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: colors[index % colors.length].stroke }}
                  />
                  <span className="text-sm text-gray-700 dark:text-[#a6adc8] truncate">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">
                    {item.value.toFixed(1)}h
                  </span>
                  <span className="text-xs text-gray-500 dark:text-[#7f849c]">
                    ({((item.value / maxValue) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Scale indicator */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#404959]">
            <div className="text-xs text-gray-600 dark:text-[#9399b2] space-y-1">
              <p>
                <span className="font-medium">Max:</span> {maxValue.toFixed(1)}h
              </p>
              <p>
                <span className="font-medium">Total:</span> {data.reduce((sum, item) => sum + item.value, 0).toFixed(1)}h
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RadarChartCard;
