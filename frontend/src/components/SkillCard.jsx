import Card from './ui/Card';
import Badge from './ui/Badge';
import ProgressBar from './ui/ProgressBar';
import { Clock } from 'lucide-react';

const SkillCard = ({
    skill,
    onClick
}) => {
    const levelColors = {
        Beginner: 'success',
        Intermediate: 'warning',
        Advanced: 'danger',
    };

    const statusColors = {
        active: 'primary',
        completed: 'success',
        paused: 'default',
    };

    const totalHours = Math.round(skill.totalMinutes / 60);

    return (
        <Card hover onClick={onClick} className="p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">
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
                    <span className="text-sm text-gray-600 dark:text-[#9399b2]">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">{skill.progress}%</span>
                </div>
                <ProgressBar progress={skill.progress} size="md" />
            </div>

            <div className="flex items-center pt-3 border-t border-gray-100 dark:border-[#272739]">
                <div className="flex items-center text-sm text-gray-500 dark:text-[#7f849c]">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{totalHours}h logged</span>
                </div>
            </div>

            {skill.category && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#272739]">
                    <span className="inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/15 px-2 py-1 rounded-md">
                        {skill.category}
                    </span>
                </div>
            )}
        </Card>
    );
};

export default SkillCard;