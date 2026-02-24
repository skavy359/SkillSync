import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck } from 'lucide-react';
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

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentNotifications = notifications.filter(n => {
        if (!n.createdAt) return false;
        const notifDate = new Date(n.createdAt);
        return notifDate >= oneDayAgo;
    });

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

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-[#313244] rounded w-48 animate-pulse" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 dark:bg-[#1e1e2e] rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Notifications</h1>
                    <p className="text-gray-500 dark:text-[#7f849c] mt-1">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''} from the last 24 hours` : 'All caught up! No notifications in the last 24 hours'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 rounded-xl text-sm font-semibold transition-colors"
                    >
                        <CheckCheck className="w-4 h-4" />
                        <span>Mark all as read</span>
                    </button>
                )}
            </div>

            {recentNotifications.length > 0 ? (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] overflow-hidden divide-y divide-gray-100 dark:divide-[#272739]">
                    {recentNotifications.map((notif, idx) => (
                        <div
                            key={notif.id || idx}
                            className={`flex items-start space-x-4 px-5 py-4 transition-colors ${!notif.read ? 'bg-indigo-50/40 dark:bg-indigo-500/10' : 'hover:bg-gray-50 dark:hover:bg-[#272739]'}`}
                        >
                            <div className="pt-1">
                                {!notif.read ? (
                                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                                ) : (
                                    <div className="w-2.5 h-2.5 bg-gray-200 dark:bg-[#313244] rounded-full" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-[#cdd6f4]' : 'text-gray-700 dark:text-[#a6adc8]'}`}>
                                    {notif.message || 'Notification'}
                                </p>
                                <div className="flex items-center space-x-3 mt-1.5">
                                    {notif.type && (
                                        <span className="text-xs bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#9399b2] px-2 py-0.5 rounded-full font-medium">
                                            {notif.type}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-400 dark:text-[#6c7086]">
                                        {formatDate(notif.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {!notif.read && (
                                <button
                                    onClick={() => handleMarkRead(notif)}
                                    className="p-1.5 text-gray-400 dark:text-[#6c7086] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 rounded-lg transition-colors"
                                    title="Mark as read"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-[#313244] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-8 h-8 text-gray-400 dark:text-[#6c7086]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">No notifications yet</h3>
                    <p className="text-sm text-gray-500 dark:text-[#7f849c]">When something happens, you'll see it here.</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;