import Card from './Card';
import { BarChart3 } from 'lucide-react';

const BarChartCard = ({
  title,
  description,
  data = [],
  color = 'indigo',
  showValues = true,
  className = ''
}) => {
  const colorClasses = {
    indigo: 'bg-indigo-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const maxValue = Math.max(...data.map(d => d.value || 0), 1);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-[#9399b2] mt-1">{description}</p>
          )}
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
      </div>

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-[#a6adc8]">
                    {item.label}
                  </span>
                  {showValues && (
                    <span className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">
                      {item.value}
                      {item.unit || ''}
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#313244] rounded-full h-2 overflow-hidden">
                  <div
                    className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-gray-400 dark:text-[#6c7086]">
          <p className="text-sm">No data available</p>
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#272739]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-[#9399b2]">Total</span>
            <span className="font-bold text-gray-900 dark:text-[#cdd6f4]">
              {data.reduce((sum, item) => sum + item.value, 0)}
              {data[0]?.unit || ''}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BarChartCard;