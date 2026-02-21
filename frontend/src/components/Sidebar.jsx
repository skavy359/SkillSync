import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Lightbulb,
    FolderKanban,
    Target,
    TrendingUp,
    Clock,
    Bell,
    User,
    Settings
} from 'lucide-react';
import { getTodayMinutes } from '../services/profileService';

const Sidebar = ({ currentPage, onNavigate }) => {
    const [todayMinutes, setTodayMinutes] = useState(0);

    useEffect(() => {
        getTodayMinutes()
            .then((minutes) => {
                setTodayMinutes(minutes || 0);
            })
            .catch(() => {
                setTodayMinutes(0);
            });
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'skills', label: 'Skills', icon: Lightbulb },
        { id: 'categories', label: 'Categories', icon: FolderKanban },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'sessions', label: 'Sessions', icon: Clock },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-[#1e1e2e] border-r border-gray-200 dark:border-[#313244] flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-[#313244]">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900 dark:text-[#cdd6f4]">SkillSync</span>
                </div>
            </div>

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

            <div className="p-4 border-t border-gray-200 dark:border-[#313244]">
                <button
                    onClick={() => onNavigate('sessions')}
                    className="w-full text-left bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/15 dark:to-indigo-500/10 rounded-xl p-4 hover:shadow-md transition-all"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 flex-shrink-0">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                Today's Progress
                            </p>
                            <div className="flex items-baseline space-x-1">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 leading-none">
                                    {Math.round(todayMinutes / 60)}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-[#9399b2] font-medium">
                                    hours logged
                                </p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;