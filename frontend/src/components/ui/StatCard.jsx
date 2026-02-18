import React from 'react';
import Card from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = 'indigo',
    subtitle
}) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
        blue: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
        green: 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400',
        purple: 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
        yellow: 'bg-yellow-50 dark:bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
        red: 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',
        orange: 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400',
    };

    const trendColors = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600',
    };

    return (
        <Card className="p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-[#9399b2] mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">{value}</p>

                    {(trend || subtitle) && (
                        <div className="flex items-center space-x-2">
                            {trend && trendValue && (
                                <div className={`flex items-center text-sm font-medium ${trendColors[trend]}`}>
                                    {trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                                    {trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                                    <span>{trendValue}</span>
                                </div>
                            )}
                            {subtitle && (
                                <p className="text-sm text-gray-500 dark:text-[#7f849c]">{subtitle}</p>
                            )}
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default StatCard;