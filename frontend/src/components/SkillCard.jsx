import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import ProgressBar from './ui/ProgressBar';
import { Clock, Calendar } from 'lucide-react';

const SkillCard = ({
                       skill,
                       onClick
                   }) => {
    const levelColors = {
        Beginner: 'success',
        Intermediate: 'warning',
        Advanced: 'danger',
        Expert: 'purple',
    };

    const statusColors = {
        active: 'primary',
        completed: 'success',
        paused: 'default',
    };

    return (
        <Card hover onClick={onClick} className="p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {skill.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Badge variant={levelColors[skill.level]} size="sm">
                            {skill.level}
                        </Badge>
                        <Badge variant={statusColors[skill.status]} size="sm">
                            {skill.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{skill.progress}%</span>
                </div>
                <ProgressBar progress={skill.progress} size="md" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{skill.totalHours}h logged</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>{skill.lastPracticed}</span>
                </div>
            </div>

            {skill.category && (
                <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            {skill.category}
          </span>
                </div>
            )}
        </Card>
    );
};

export default SkillCard;