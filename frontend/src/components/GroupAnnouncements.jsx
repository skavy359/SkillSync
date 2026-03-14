import { useState, useEffect } from 'react';
import { Megaphone, Pin, Trash2, Loader2, X } from 'lucide-react';
import { getAnnouncements, togglePinAnnouncement, deleteAnnouncement } from '../services/groupAnnouncementService';

const GroupAnnouncements = ({ groupId, isAdmin, onCreateClick, refreshKey }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [togglingPin, setTogglingPin] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, [groupId, refreshKey]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const result = await getAnnouncements(groupId, 0, 20);
            setAnnouncements(result.content || result || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePin = async (announcementId) => {
        try {
            setTogglingPin(announcementId);

            const updatedAnnouncements = announcements.map(a => 
                a.id === announcementId ? { ...a, isPinned: !a.isPinned } : a
            );
            
            const sortedAnnouncements = updatedAnnouncements.sort((a, b) => {
                if (a.isPinned === b.isPinned) return 0;
                return a.isPinned ? -1 : 1;
            });
            
            setAnnouncements(sortedAnnouncements);
            
            await togglePinAnnouncement(announcementId);
        } catch (error) {
            console.error('Error toggling pin:', error);
            alert('Failed to toggle announcement pin');
            const result = await getAnnouncements(groupId, 0, 20);
            setAnnouncements(result.content || result || []);
        } finally {
            setTogglingPin(null);
        }
    };

    const handleDelete = (announcementId) => {
        setDeleteConfirm(announcementId);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            setDeleting(true);
            await deleteAnnouncement(deleteConfirm);
            setAnnouncements(announcements.filter(a => a.id !== deleteConfirm));
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {isAdmin && (
                <button
                    type="button"
                    onClick={onCreateClick}
                    className="w-full px-6 py-3.5 text-sm font-semibold rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                    + New Announcement
                </button>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                </div>
            ) : announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-[#6c7086] gap-3">
                    <Megaphone className="w-12 h-12 text-gray-400 dark:text-[#6c7086]" />
                    <p className="font-semibold">No announcements yet</p>
                    {isAdmin && <p className="text-sm">Create one to get started!</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(announcement => (
                        <div
                            key={announcement.id}
                            className={`group relative rounded-2xl p-5 border-2 transition-all duration-300 ${
                                announcement.isPinned
                                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-300 dark:border-amber-500/50 shadow-md'
                                    : 'bg-white dark:bg-[#1e1e2e] border-gray-200 dark:border-[#313244] hover:border-transparent hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-indigo-500/20'
                            }`}
                        >
                            {announcement.isPinned && (
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                    <Pin className="w-3 h-3 fill-current" />
                                    Pinned
                                </div>
                            )}

                            <div className="mb-4">
                                <h4 className="font-bold text-lg text-gray-900 dark:text-[#cdd6f4] mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    {announcement.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-[#a6adc8] leading-relaxed">
                                    {announcement.content}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-3 flex items-center gap-1">
                                    <span>📢</span> by {announcement.createdByName} • {new Date(announcement.createdAt).toLocaleDateString()} {new Date(announcement.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                </p>
                            </div>

                            {isAdmin && (
                                <div className="flex gap-2 justify-end pt-3 border-t border-gray-200 dark:border-[#313244]">
                                    <button
                                        onClick={() => handleTogglePin(announcement.id)}
                                        disabled={togglingPin === announcement.id}
                                        className="p-2 rounded-lg text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors disabled:opacity-50 flex items-center gap-1 text-xs font-semibold"
                                    >
                                        <Pin className={`w-4 h-4 ${announcement.isPinned ? 'fill-current' : ''}`} />
                                        {announcement.isPinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(announcement.id)}
                                        className="p-2 rounded-lg text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors flex items-center gap-1 text-xs font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-sm p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">
                                Delete Announcement?
                            </h3>
                            <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-[#a6adc8] mb-6">
                            Are you sure you want to delete this announcement? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-[#313244] text-gray-900 dark:text-[#cdd6f4] hover:bg-gray-200 dark:hover:bg-[#45475a] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupAnnouncements;