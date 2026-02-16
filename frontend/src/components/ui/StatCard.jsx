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
        indigo: 'bg-indigo-50 text-indigo-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        orange: 'bg-orange-50 text-orange-600',
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
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>

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
                                <p className="text-sm text-gray-500">{subtitle}</p>
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