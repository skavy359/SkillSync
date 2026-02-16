import React from 'react';
import {
    LayoutDashboard,
    Lightbulb,
    FolderKanban,
    Target,
    TrendingUp,
    Bell,
    User
} from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'skills', label: 'Skills', icon: Lightbulb },
        { id: 'categories', label: 'Categories', icon: FolderKanban },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-gray-900">SkillSync</span>
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
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }
              `}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Target className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 mb-1">
                                Weekly Goal
                            </p>
                            <div className="w-full bg-white rounded-full h-1.5 mb-2">
                                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600">
                                13 of 20 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;