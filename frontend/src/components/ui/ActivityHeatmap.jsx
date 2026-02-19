import React, { useState } from 'react';
import Card from './Card';
import { TrendingUp } from 'lucide-react';

const ActivityHeatmap = ({
  title,
  description,
  data = [], // Array of { date, label, minutes }
  className = ''
}) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Determine color intensity based on minutes
  const getIntensityColor = (minutes) => {
    if (minutes === 0) {
      return {
        light: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-400 dark:text-gray-600'
      };
    }
    if (minutes < 60) {
      return {
        light: 'bg-green-100 dark:bg-green-900/40',
        text: 'text-green-700 dark:text-green-300'
      };
    }
    if (minutes < 120) {
      return {
        light: 'bg-green-300 dark:bg-green-700/60',
        text: 'text-green-800 dark:text-green-200'
      };
    }
    if (minutes < 180) {
      return {
        light: 'bg-green-500 dark:bg-green-600',
        text: 'text-white'
      };
    }
    return {
      light: 'bg-green-700 dark:bg-green-500',
      text: 'text-white'
    };
  };

  // Format time display
  const formatTime = (minutes) => {
    if (minutes === 0) return 'No activity';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-[#9399b2] mt-1">{description}</p>
          )}
        </div>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-600 dark:text-[#a6adc8] uppercase tracking-wide">
            Week Activity
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 grid grid-cols-7 gap-2">
            {data.map((day, index) => {
              const colors = getIntensityColor(day.minutes || 0);
              const isHovered = hoveredDay === index;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  onMouseEnter={() => setHoveredDay(index)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div
                    className={`
                      w-full aspect-square rounded-lg transition-all duration-200
                      ${colors.light}
                      ${isHovered ? 'ring-2 ring-indigo-500 shadow-lg scale-110' : 'hover:shadow-md'}
                      cursor-pointer flex items-center justify-center relative
                    `}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
                          {formatTime(day.minutes || 0)}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    )}

                    {/* Day initials or icon */}
                    <span className={`text-xs font-bold ${colors.text}`}>
                      {(day.minutes || 0) > 0 ? '✓' : ''}
                    </span>
                  </div>

                  {/* Day label */}
                  <p className="text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mt-2">
                    {day.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#313244]">
        <p className="text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-3">Intensity</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700"></div>
            <span className="text-xs text-gray-600 dark:text-[#9399b2]">None</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/40"></div>
            <span className="text-xs text-gray-600 dark:text-[#9399b2]">&lt;1h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-300 dark:bg-green-700/60"></div>
            <span className="text-xs text-gray-600 dark:text-[#9399b2]">1-2h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-600"></div>
            <span className="text-xs text-gray-600 dark:text-[#9399b2]">2-3h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-700 dark:bg-green-500"></div>
            <span className="text-xs text-gray-600 dark:text-[#9399b2]">&gt;3h</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
