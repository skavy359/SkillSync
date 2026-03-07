import { useState, useEffect } from 'react';
import { Megaphone, Pin, Trash2, Loader2 } from 'lucide-react';
import { getAnnouncements, togglePinAnnouncement, deleteAnnouncement } from '../services/groupAnnouncementService';
import Button from '../components/ui/Button';

const GroupAnnouncements = ({ groupId, isAdmin, onCreateClick }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [togglingPin, setTogglingPin] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, [groupId]);

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
            const updated = await togglePinAnnouncement(announcementId);
            setAnnouncements(announcements.map(a => a.id === announcementId ? updated : a));
        } catch (error) {
            console.error('Error toggling pin:', error);
            alert('Failed to toggle announcement pin');
        } finally {
            setTogglingPin(null);
        }
    };

    const handleDelete = async (announcementId) => {
        if (!window.confirm('Delete this announcement?')) return;

        try {
            await deleteAnnouncement(announcementId);
            setAnnouncements(announcements.filter(a => a.id !== announcementId));
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement');
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">
                        Announcements
                    </h3>
                </div>
                {isAdmin && (
                    <Button onClick={onCreateClick} size="sm">
                        New
                    </Button>
                )}
            </div>

            {/* Announcements List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-[#6c7086]">
                    <p>No announcements yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map(announcement => (
                        <div
                            key={announcement.id}
                            className={`p-4 rounded-lg border ${
                                announcement.isPinned
                                    ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                                    : 'bg-white dark:bg-[#1e1e2e] border-gray-200 dark:border-[#313244]'
                            }`}
                        >
                            {/* Title & Meta */}
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                        {announcement.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-1">
                                        by {announcement.createdByName} • {new Date(announcement.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {announcement.isPinned && (
                                    <Pin className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                                )}
                            </div>

                            {/* Content */}
                            <p className="text-sm text-gray-600 dark:text-[#a6adc8] mb-3 line-clamp-2">
                                {announcement.content}
                            </p>

                            {/* Actions */}
                            {isAdmin && (
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => handleTogglePin(announcement.id)}
                                        disabled={togglingPin === announcement.id}
                                        className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded transition-colors disabled:opacity-50"
                                    >
                                        <Pin className={`w-4 h-4 ${announcement.isPinned ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(announcement.id)}
                                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupAnnouncements;
