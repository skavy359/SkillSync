import React from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { Clock, X, ChevronRight, Sparkles } from 'lucide-react';

const SkillCard = ({
    skill,
    onClick,
    onRemoveCategory
}) => {
    const levelColors = {
        Beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
        Intermediate: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
        Advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    };

    const statusBadge = {
        active: 'success',
        completed: 'primary',
        paused: 'default',
    };

    const totalHours = Math.round((skill.totalMinutes || 0) / 60);
    const progress = skill.progress || 0;

    return (
        <div 
            onClick={onClick}
            className="group relative flex flex-col bg-white dark:bg-[#1e1e2e] rounded-2xl p-5 border border-gray-200 dark:border-[#313244] hover:border-indigo-500/50 dark:hover:border-indigo-400/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
        >
            {/* Header Area */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {skill.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${levelColors[skill.level] || levelColors.Beginner}`}>
                            {skill.level}
                        </span>
                        <Badge variant={statusBadge[skill.status?.toLowerCase()] || 'default'} size="sm">
                            {skill.status}
                        </Badge>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#272739] flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[#6c7086] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </div>
            </div>

            {/* Progress Area */}
            <div className="mb-5 mt-auto">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-[#a6adc8]">Mastery</span>
                    <span className="text-sm font-black text-gray-900 dark:text-[#cdd6f4]">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-black/20 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Footer / Meta */}
            <div className={`flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#313244]/50 ${!skill.category ? 'pb-1' : ''}`}>
                <div className="flex items-center text-sm font-medium text-gray-500 dark:text-[#7f849c]">
                    <Clock className="w-4 h-4 mr-1.5" />
                    <span>{totalHours}h <span className="hidden sm:inline">logged</span></span>
                </div>
                
                {skill.category && (
                    <div className="flex items-center gap-1.5 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 max-w-[120px] truncate">
                            <Sparkles className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{skill.category}</span>
                        </span>
                        {onRemoveCategory && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveCategory(skill.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                title="Remove category"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillCard;