import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, LogOut, User, ChevronDown, X, Lightbulb, BookOpen, Target, Sparkles } from 'lucide-react';
import { getMySkills } from '../services/skillService';
import { getAllCategories } from '../services/categoryService';
import { getMyGoals } from '../services/goalService';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../services/profileService';

const Topbar = ({ onLogout, currentUser, onNavigate, onSelectSkill }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        getMyNotifications()
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setNotifications(data.slice(0, 4));
                }
            })
            .catch(() => console.error('Failed to fetch notifications'));
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        const timer = setTimeout(async () => {
            try {
                const query = searchQuery.trim().toLowerCase();

                const skillsResult = await getMySkills({ search: searchQuery.trim(), size: 5 }).catch(() => ({ content: [] }));
                const skills = (skillsResult?.content || []).map(skill => ({
                    ...skill, type: 'skill', icon: 'Lightbulb'
                }));

                const categoriesResult = await getAllCategories().catch(() => []);
                const categories = (Array.isArray(categoriesResult) ? categoriesResult : []).filter(cat => 
                    cat.name.toLowerCase().includes(query)
                ).slice(0, 3).map(cat => ({
                    ...cat, type: 'category', icon: 'BookOpen'
                }));

                const goalsResult = await getMyGoals().catch(() => []);
                const goals = (Array.isArray(goalsResult) ? goalsResult : []).filter(goal => {
                    return (goal.skillName && goal.skillName.toLowerCase().includes(query)) ||
                           (goal.targetDate && goal.targetDate.toLowerCase().includes(query));
                }).slice(0, 3).map(goal => ({
                    ...goal, type: 'goal', icon: 'Target'
                }));

                const combined = [...skills, ...categories, ...goals].slice(0, 8);
                setSearchResults(combined);
            } catch {
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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
        <header className="h-20 bg-white/70 dark:bg-[#1e1e2e]/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between px-8 relative z-50 transition-colors duration-300">

            <div className="flex-1 max-w-2xl" ref={searchRef}>
                <div className="relative group/search">
                    <div className={`absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl blur-xl transition-all duration-500 ${searchFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-95'}`} />
                    
                    <div className="relative flex items-center">
                        <Search className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-indigo-500' : 'text-gray-400 dark:text-[#6c7086]'}`} />
                        <input
                            type="text"
                            placeholder="Search skills, categories, or goals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            className="w-full pl-12 pr-12 py-3 bg-gray-50/80 dark:bg-[#181825]/80 backdrop-blur-sm border border-gray-200/50 dark:border-white/5 rounded-2xl text-[15px] font-medium text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1e1e2e] transition-all shadow-sm group-hover/search:shadow-md"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                                className="absolute right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-[#6c7086] dark:hover:text-[#cdd6f4] dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {showSearchDropdown && (
                        <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                            {searchLoading ? (
                                <div className="px-6 py-8 flex flex-col items-center justify-center text-gray-500 dark:text-[#a6adc8]">
                                    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
                                    <p className="text-sm font-medium">Searching globally...</p>
                                </div>
                            ) : searchResults && searchResults.length > 0 ? (
                                <div className="py-2">
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 dark:text-[#6c7086] uppercase tracking-wider">
                                        Top Results
                                    </div>
                                    {searchResults.map((item) => {
                                        const isSkill = item.type === 'skill';
                                        const isCategory = item.type === 'category';
                                        const isGoal = item.type === 'goal';
                                        
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    if (isSkill) {
                                                        onSelectSkill && onSelectSkill(item.id);
                                                        onNavigate && onNavigate('skill-detail');
                                                    } else if (isCategory) onNavigate && onNavigate('categories');
                                                    else if (isGoal) onNavigate && onNavigate('goals');
                                                    setSearchQuery('');
                                                    setSearchFocused(false);
                                                }}
                                                className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors text-left group/result"
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/result:scale-105 ${
                                                    isSkill ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400' :
                                                    isCategory ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400' :
                                                    'bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 text-fuchsia-600 dark:text-fuchsia-400'
                                                }`}>
                                                    {isSkill ? <Lightbulb className="w-5 h-5" /> : isCategory ? <BookOpen className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] truncate mb-0.5">
                                                        {item.name || item.skillName || 'Goal'}
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-500 dark:text-[#7f849c] truncate">
                                                        {isSkill && `${item.level} · ${item.status}`}
                                                        {isCategory && 'Learning Category'}
                                                        {isGoal && `Target Date: ${item.targetDate}`}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-6 h-6 text-gray-400 dark:text-[#6c7086]" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4] mb-1">No results found</p>
                                    <p className="text-xs text-gray-500 dark:text-[#7f849c]">
                                        We couldn't find anything matching "{searchQuery}"
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-4 pl-6 lg:ml-8">

                <button
                    onClick={() => onNavigate && onNavigate('settings')}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-[#a6adc8] hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-[#181825] hover:bg-white dark:hover:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5 hover:border-indigo-500/30 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                    <Settings className="w-5 h-5" />
                </button>

                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                        className="w-10 h-10 flex items-center justify-center relative text-gray-500 dark:text-[#a6adc8] hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-[#181825] hover:bg-white dark:hover:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5 hover:border-indigo-500/30 rounded-full transition-all shadow-sm hover:shadow-md"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <>
                                <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#1e1e2e]" />
                                <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full animate-ping opacity-75" />
                            </>
                        )}
                    </button>

                    {notifOpen && (
                        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                            <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-[#181825]/50">
                                <h3 className="text-base font-bold text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-indigo-500" /> Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await markAllNotificationsRead();
                                                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                            } catch (error) { console.error(error); }
                                        }}
                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            
                            <div className="max-h-[320px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, idx) => (
                                        <button
                                            key={notif.id || idx}
                                            onClick={() => {
                                                if (!notif.read) {
                                                    setNotifications(prev => prev.map((n, i) =>
                                                        (notif.id ? n.id === notif.id : i === idx) ? { ...n, read: true } : n
                                                    ));
                                                    if (notif.id) markNotificationRead(notif.id).catch(() => { });
                                                }
                                            }}
                                            className={`w-full text-left p-4 border-b border-gray-50 dark:border-white/5 transition-all group ${!notif.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10' : 'hover:bg-gray-50 dark:hover:bg-[#272739]'}`}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className={`text-sm font-semibold truncate ${!notif.read ? 'text-gray-900 dark:text-[#cdd6f4]' : 'text-gray-700 dark:text-[#a6adc8]'}`}>
                                                        {notif.title || 'Update'}
                                                    </h4>
                                                    {!notif.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                                                </div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-[#7f849c] line-clamp-2 leading-snug">
                                                    {notif.message || notif.text}
                                                </p>
                                                <p className="text-[11px] font-bold text-gray-400 dark:text-[#6c7086] uppercase tracking-wider mt-1">
                                                    {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : notif.time || 'Recent'}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                                            <Bell className="w-6 h-6 text-gray-400 dark:text-[#6c7086]" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">You're all caught up!</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#181825]/50">
                                <button
                                    onClick={() => { setNotifOpen(false); onNavigate && onNavigate('notifications'); }}
                                    className="w-full py-2 text-center text-xs font-bold text-gray-700 dark:text-[#a6adc8] hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#1e1e2e] shadow-sm transition-all hover:border-indigo-500/30"
                                >
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-white/10" />

                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                        className="flex items-center space-x-3 p-1.5 pr-4 rounded-full border border-gray-200/50 dark:border-white/5 bg-white dark:bg-[#181825] hover:border-indigo-500/30 hover:shadow-md transition-all group"
                    >
                        <div className="relative w-9 h-9">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner overflow-hidden">
                                {userInitials}
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] leading-none mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{userName}</p>
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-[#7f849c]">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Pro Member
                            </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-[#6c7086] transition-transform duration-300 ml-1 ${dropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                            
                            <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                                <p className="text-base font-black text-gray-900 dark:text-[#cdd6f4] mb-0.5 relative z-10">{userName}</p>
                                <p className="text-xs font-semibold text-gray-500 dark:text-[#7f849c] relative z-10">{userEmail}</p>
                            </div>

                            <div className="p-2">
                                <button
                                    onClick={() => { setDropdownOpen(false); onNavigate && onNavigate('profile'); }}
                                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#181825] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 flex items-center justify-center transition-colors">
                                        <User className="w-4 h-4 text-gray-500 dark:text-[#6c7086] group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                    </div>
                                    <span>My Profile</span>
                                </button>
                                <button
                                    onClick={() => { setDropdownOpen(false); onNavigate && onNavigate('settings'); }}
                                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#181825] group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 flex items-center justify-center transition-colors">
                                        <Settings className="w-4 h-4 text-gray-500 dark:text-[#6c7086] group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                    </div>
                                    <span>Account Settings</span>
                                </button>
                            </div>

                            <div className="p-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#181825]/50">
                                <button
                                    onClick={() => { setDropdownOpen(false); onLogout && onLogout(); }}
                                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;