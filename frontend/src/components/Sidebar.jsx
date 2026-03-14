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
    Settings,
    Trophy,
    Share2,
    Map,
    MessageSquare,
    Calendar,
    BrainCircuit,
    Code2,
    Users,
} from 'lucide-react';
import { getTodayMinutes } from '../services/profileService';

const Sidebar = ({ currentPage, onNavigate }) => {
    const [todayMinutes, setTodayMinutes] = useState(0);

    useEffect(() => {
        getTodayMinutes()
            .then((minutes) => setTodayMinutes(minutes || 0))
            .catch(() => setTodayMinutes(0));
    }, []);

    const menuGroups = [
        {
            title: "Overview",
            items: [
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ]
        },
        {
            title: "Learning Hub",
            items: [
                { id: 'skills', label: 'Skills', icon: Lightbulb },
                { id: 'categories', label: 'Categories', icon: FolderKanban },
                { id: 'learning-paths', label: 'Learning Paths', icon: Map },
                { id: 'assessments', label: 'Assessments', icon: BrainCircuit },
            ]
        },
        {
            title: "Tracking",
            items: [
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'sessions', label: 'Sessions', icon: Clock },
                { id: 'study-planner', label: 'Study Planner', icon: Calendar },
            ]
        },
        {
            title: "Community",
            items: [
                { id: 'discussions', label: 'Discussions', icon: MessageSquare },
                { id: 'study-groups', label: 'Study Groups', icon: Users },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { id: 'skill-sharing', label: 'Share Progress', icon: Share2 },
            ]
        },
        {
            title: "Account",
            items: [
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'settings', label: 'Settings', icon: Settings },
            ]
        }
    ];

    return (
        <aside className="w-[280px] bg-[#f8fafc]/80 dark:bg-[#11111b]/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/5 flex flex-col h-screen transition-colors duration-300">
            <div className="h-20 flex items-center px-6 border-b border-gray-200/50 dark:border-white/5 flex-shrink-0 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                <div className="flex items-center space-x-3.5 relative z-10 w-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('dashboard')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
                        SkillSync
                    </span>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
                {menuGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                        <h3 className="px-3 text-[10px] font-bold text-gray-400 dark:text-[#6c7086] uppercase tracking-widest mb-2">
                            {group.title}
                        </h3>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPage === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onNavigate(item.id)}
                                        className={`
                                            w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl
                                            transition-all duration-200 text-sm font-semibold group relative overflow-hidden
                                            ${isActive
                                                ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm'
                                                : 'text-gray-600 dark:text-[#a6adc8] hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-[#cdd6f4]'
                                            }
                                        `}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-indigo-500 rounded-r-full" />
                                        )}
                                        <Icon 
                                            className={`w-5 h-5 transition-transform duration-200 ${
                                                isActive 
                                                    ? 'text-indigo-600 dark:text-indigo-400 scale-110' 
                                                    : 'text-gray-400 dark:text-[#6c7086] group-hover:scale-110 group-hover:text-gray-600 dark:group-hover:text-[#bac2de]'
                                            }`} 
                                        />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200/50 dark:border-white/5 flex-shrink-0 bg-white/30 dark:bg-black/10">
                <button
                    onClick={() => onNavigate('sessions')}
                    className="w-full text-left relative overflow-hidden rounded-2xl p-4 transition-all duration-300 group hover:shadow-lg border border-gray-100 dark:border-white/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-80" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-400/20 transition-colors" />
                    
                    <div className="relative z-10 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white dark:bg-[#181825] border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-500 dark:text-[#6c7086] uppercase tracking-wider mb-0.5">
                                Today's Progress
                            </p>
                            <div className="flex items-baseline space-x-1.5 line-clamp-1">
                                <p className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] leading-none">
                                    {(todayMinutes / 60).toFixed(1)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#a6adc8] font-bold">
                                    hrs logged
                                </p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
            
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;