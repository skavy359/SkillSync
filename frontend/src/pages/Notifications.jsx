import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Info, AlertCircle, TrendingUp, Trophy, Star } from 'lucide-react';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../services/profileService';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyNotifications()
            .then((data) => {
                setNotifications(Array.isArray(data) ? data : []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const recentNotifications = notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const unreadCount = recentNotifications.filter(n => !n.read).length;

    const handleMarkRead = (notif) => {
        if (notif.read) return;
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        if (notif.id) markNotificationRead(notif.id).catch(() => { });
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        markAllNotificationsRead().catch(() => { });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const getIconForType = (type) => {
        switch (type?.toLowerCase()) {
            case 'achievement': return <Trophy className="w-5 h-5 text-amber-500" />;
            case 'progress': return <TrendingUp className="w-5 h-5 text-emerald-500" />;
            case 'alert': return <AlertCircle className="w-5 h-5 text-rose-500" />;
            case 'system': return <Info className="w-5 h-5 text-blue-500" />;
            case 'social': return <Star className="w-5 h-5 text-fuchsia-500" />;
            default: return <Bell className="w-5 h-5 text-indigo-500" />;
        }
    };

    const getColorClassForType = (type) => {
        switch (type?.toLowerCase()) {
            case 'achievement': return 'bg-amber-100 dark:bg-amber-500/20';
            case 'progress': return 'bg-emerald-100 dark:bg-emerald-500/20';
            case 'alert': return 'bg-rose-100 dark:bg-rose-500/20';
            case 'system': return 'bg-blue-100 dark:bg-blue-500/20';
            case 'social': return 'bg-fuchsia-100 dark:bg-fuchsia-500/20';
            default: return 'bg-indigo-100 dark:bg-indigo-500/20';
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-8 bg-gray-200 dark:bg-[#313244] rounded w-64 animate-pulse mb-2" />
                    <div className="h-10 bg-gray-200 dark:bg-[#313244] rounded-xl w-32 animate-pulse" />
                </div>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-28 bg-white dark:bg-[#181825] border border-gray-100 dark:border-white/5 rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Bell className="w-8 h-8 text-indigo-500" /> Notifications
                        {unreadCount > 0 && (
                            <span className="flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-500/30 ml-2">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                        {unreadCount > 0 
                            ? "Stay updated on your learning journey." 
                            : "You're all caught up! No active alerts."}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="group flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500/30 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <CheckCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                        Mark all as read
                    </button>
                )}
            </div>

            {recentNotifications.length > 0 ? (
                <div className="space-y-4">
                    {recentNotifications.map((notif, idx) => {
                        const isUnread = !notif.read;
                        return (
                            <div
                                key={notif.id || idx}
                                className={`relative group flex sm:items-center flex-col sm:flex-row gap-5 p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
                                    isUnread 
                                    ? 'bg-white dark:bg-[#181825] border-indigo-200 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5 hover:shadow-lg hover:-translate-y-1' 
                                    : 'bg-gray-50 dark:bg-[#181825]/50 border-gray-100 dark:border-white/5 shadow-sm opacity-70 hover:opacity-100'
                                }`}
                            >
                                {isUnread && (
                                    <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                )}

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getColorClassForType(notif.type)} ${!isUnread && 'opacity-60'}`}>
                                    {getIconForType(notif.type)}
                                </div>

                                <div className="flex-1 min-w-0 pr-4 sm:pr-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                                        <h3 className={`text-lg transition-colors leading-snug line-clamp-2 ${isUnread ? 'font-black text-gray-900 dark:text-white' : 'font-bold text-gray-700 dark:text-gray-400'}`}>
                                            {notif.message || 'New notification'}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isUnread ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-500'}`}>
                                            {formatDate(notif.createdAt)}
                                        </span>
                                        {notif.type && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-200 dark:border-white/5">
                                                    {notif.type}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isUnread && (
                                    <button
                                        onClick={() => handleMarkRead(notif)}
                                        className="sm:self-center self-end w-10 h-10 rounded-full bg-gray-50 dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/5 text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500/20 flex items-center justify-center transition-all shadow-sm shrink-0 group/btn"
                                        title="Mark as read"
                                    >
                                        <Check className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-16 text-center shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-[#1e1e2e] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <Bell className="w-10 h-10 text-gray-400" />
                        <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-gray-50 dark:border-[#1e1e2e]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You're all caught up!</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No new notifications. We'll let you know when something important happens.</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;