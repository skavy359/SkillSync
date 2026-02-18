import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, LogOut, User, ChevronDown, X, Lightbulb } from 'lucide-react';
import { getMySkills } from '../services/skillService';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../services/profileService';

const Topbar = ({ onLogout, currentUser, onNavigate, onSelectSkill }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);

    // Fetch real notifications
    useEffect(() => {
        getMyNotifications()
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setNotifications(data.slice(0, 4));
                }
            })
            .catch(() => { });
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        const timer = setTimeout(async () => {
            try {
                const result = await getMySkills({ search: searchQuery.trim(), size: 5 });
                setSearchResults(result?.content || []);
            } catch {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close search on outside click
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // User initials
    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const userName = currentUser?.name || 'User';
    const userEmail = currentUser?.email || '';
    const userInitials = getInitials(userName);

    const unreadCount = notifications.filter(n => !n.read).length;

    const showSearchDropdown = searchFocused && searchQuery.trim().length > 0;

    return (
        <header className="h-16 bg-white dark:bg-[#1e1e2e] border-b border-gray-200 dark:border-[#313244] flex items-center justify-between px-6 relative z-20">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl" ref={searchRef}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
                    <input
                        type="text"
                        placeholder="Search skills, categories, goals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-lg text-sm text-gray-900 dark:text-[#cdd6f4] placeholder-gray-500 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-[#6c7086] dark:hover:text-[#cdd6f4]"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showSearchDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244] rounded-xl shadow-lg overflow-hidden z-50">
                            {searchLoading ? (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-[#7f849c] text-center">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                <div className="py-1">
                                    {searchResults.map((skill) => (
                                        <button
                                            key={skill.id}
                                            onClick={() => {
                                                onSelectSkill && onSelectSkill(skill.id);
                                                onNavigate && onNavigate('skill-detail');
                                                setSearchQuery('');
                                                setSearchFocused(false);
                                            }}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors text-left"
                                        >
                                            <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Lightbulb className="w-4 h-4 text-indigo-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4] truncate">{skill.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-[#7f849c]">{skill.level} · {skill.status}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-[#7f849c] text-center">
                                    No skills found for "<span className="font-medium text-gray-700 dark:text-[#a6adc8]">{searchQuery}</span>"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 ml-6">
                {/* Settings */}
                <button
                    onClick={() => onNavigate && onNavigate('settings')}
                    className="p-2 text-gray-400 dark:text-[#6c7086] hover:text-gray-600 dark:hover:text-[#cdd6f4] hover:bg-gray-50 dark:hover:bg-[#272739] rounded-lg transition-all"
                >
                    <Settings className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                        className="relative p-2 text-gray-400 dark:text-[#6c7086] hover:text-gray-600 dark:hover:text-[#cdd6f4] hover:bg-gray-50 dark:hover:bg-[#272739] rounded-lg transition-all"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-[#1e1e2e]" />
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244] rounded-xl shadow-lg z-20 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-[#272739] flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">Notifications</h3>
                                    <div className="flex items-center space-x-2">
                                        {unreadCount > 0 && (
                                            <>
                                                <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                                                    {unreadCount} new
                                                </span>
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await markAllNotificationsRead();
                                                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                        } catch { }
                                                    }}
                                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium transition-colors"
                                                >
                                                    Mark all read
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif, idx) => (
                                            <button
                                                key={notif.id || idx}
                                                onClick={() => {
                                                    if (!notif.read) {
                                                        setNotifications(prev => prev.map((n, i) =>
                                                            (notif.id ? n.id === notif.id : i === idx) ? { ...n, read: true } : n
                                                        ));
                                                        if (notif.id) {
                                                            markNotificationRead(notif.id).catch(() => { });
                                                        }
                                                    }
                                                }}
                                                className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-[#222236] last:border-0 transition-colors ${!notif.read ? 'bg-indigo-50/30 dark:bg-indigo-500/10 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/15 cursor-pointer' : 'hover:bg-gray-50 dark:hover:bg-[#272739]'}`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    {!notif.read && (
                                                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                                                    )}
                                                    <div className={`flex-1 ${notif.read ? 'ml-5' : ''}`}>
                                                        <p className="text-sm text-gray-700 dark:text-[#a6adc8]">{notif.message || notif.text || 'Notification'}</p>
                                                        <p className="text-xs text-gray-400 dark:text-[#6c7086] mt-1">{notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : notif.time || ''}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-[#7f849c]">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                                <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[#272739]">
                                    <button
                                        onClick={() => { setNotifOpen(false); onNavigate && onNavigate('notifications'); }}
                                        className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 dark:bg-[#313244]" />

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                        className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-[#272739] rounded-lg pl-2 pr-3 py-1.5 transition-all"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {userInitials}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">{userName}</p>
                            <p className="text-xs text-gray-500 dark:text-[#7f849c]">{userEmail}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-[#6c7086] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244] rounded-xl shadow-lg z-20 overflow-hidden">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-[#272739]">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{userName}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#7f849c] mt-0.5">{userEmail}</p>
                                </div>

                                {/* Menu Items */}
                                <div className="p-1.5">
                                    <button
                                        onClick={() => { setDropdownOpen(false); onNavigate && onNavigate('profile'); }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors"
                                    >
                                        <User className="w-4 h-4 text-gray-400 dark:text-[#6c7086]" />
                                        <span>View Profile</span>
                                    </button>
                                    <button
                                        onClick={() => { setDropdownOpen(false); onNavigate && onNavigate('settings'); }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-gray-400 dark:text-[#6c7086]" />
                                        <span>Settings</span>
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="p-1.5 border-t border-gray-100 dark:border-[#272739]">
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            onLogout && onLogout();
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;