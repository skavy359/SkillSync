import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Lightbulb,
    FolderKanban,
    Target,
    TrendingUp,
    Bell,
    User,
    Settings
} from 'lucide-react';
import { getGoalAnalytics } from '../services/goalService';

const Sidebar = ({ currentPage, onNavigate }) => {
    const [goalData, setGoalData] = useState(null);

    useEffect(() => {
        getGoalAnalytics()
            .then((analytics) => {
                if (Array.isArray(analytics) && analytics.length > 0) {
                    // Pick the goal with the nearest deadline (smallest daysLeft >= 0)
                    const activeGoals = analytics.filter(g => g.daysLeft >= 0);
                    if (activeGoals.length > 0) {
                        const nearest = activeGoals.reduce((best, g) =>
                            g.daysLeft < best.daysLeft ? g : best
                        );
                        setGoalData(nearest);
                    } else {
                        // If all are overdue, show the most recent one
                        setGoalData(analytics[0]);
                    }
                }
            })
            .catch(() => { });
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'skills', label: 'Skills', icon: Lightbulb },
        { id: 'categories', label: 'Categories', icon: FolderKanban },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Determine risk color
    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'high': return { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' };
            case 'medium': return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' };
            default: return { bar: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' };
        }
    };

    const riskColors = goalData ? getRiskColor(goalData.riskLevel) : null;

    return (
        <aside className="w-64 bg-white dark:bg-[#1e1e2e] border-r border-gray-200 dark:border-[#313244] flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-[#313244]">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900 dark:text-[#cdd6f4]">SkillSync</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                transition-all duration-150 text-sm font-medium
                ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#272739] hover:text-gray-900 dark:hover:text-[#cdd6f4]'
                                }
              `}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-[#6c7086]'}`} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer — Dynamic Goal Widget */}
            <div className="p-4 border-t border-gray-200 dark:border-[#313244]">
                {goalData ? (
                    <button
                        onClick={() => onNavigate('goals')}
                        className="w-full text-left bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/15 dark:to-blue-500/10 rounded-xl p-4 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 ${riskColors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Target className={`w-4 h-4 ${riskColors.text}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 dark:text-[#cdd6f4] truncate">
                                    {goalData.skillName}
                                </p>
                                <div className="w-full bg-white dark:bg-[#181825] rounded-full h-1.5 my-2">
                                    <div
                                        className={`${riskColors.bar} h-1.5 rounded-full transition-all duration-500`}
                                        style={{ width: `${Math.min(goalData.progress, 100)}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-600 dark:text-[#9399b2]">
                                        {goalData.progress}% complete
                                    </p>
                                    <p className={`text-xs font-medium ${goalData.daysLeft <= 3 ? 'text-red-500' : 'text-gray-500 dark:text-[#7f849c]'}`}>
                                        {goalData.daysLeft >= 0 ? `${goalData.daysLeft}d left` : 'Overdue'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={() => onNavigate('goals')}
                        className="w-full text-left bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/15 dark:to-blue-500/10 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">
                                    No Active Goals
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#7f849c]">
                                    Set a goal to track progress
                                </p>
                            </div>
                        </div>
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;