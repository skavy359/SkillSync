import { useState, useEffect } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { getGroupActivity } from '../services/groupActivityService';

const GroupActivityFeed = ({ groupId, refreshKey }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivity();
    }, [groupId, refreshKey]);

    const fetchActivity = async () => {
        try {
            setLoading(true);
            const result = await getGroupActivity(groupId, 0, 20);
            setActivities(result.content || result || []);
        } catch (error) {
            console.error('Error fetching activity:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (activityType) => {
        switch (activityType) {
            case 'MEMBER_JOINED':
                return '👤';
            case 'INVITATION_SENT':
                return '✉️';
            case 'INVITATION_ACCEPTED':
                return '✅';
            case 'MEMBER_REMOVED':
                return '❌';
            case 'ANNOUNCEMENT_POSTED':
                return '📢';
            case 'GROUP_CREATED':
                return '🎯';
            default:
                return '📝';
        }
    };

    const getActivityLabel = (activityType) => {
        switch (activityType) {
            case 'MEMBER_JOINED':
                return 'Joined Group';
            case 'INVITATION_SENT':
                return 'Sent Invitation';
            case 'INVITATION_ACCEPTED':
                return 'Accepted Invitation';
            case 'MEMBER_REMOVED':
                return 'Member Removed';
            case 'ANNOUNCEMENT_POSTED':
                return 'Announcement Posted';
            case 'GROUP_CREATED':
                return 'Group Created';
            default:
                return 'Activity';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">
                        Activity Feed
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-[#a6adc8] mt-0.5">
                        Track all group events and member activities
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
                </div>
            ) : activities.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1e1e2e] rounded-lg border border-gray-200 dark:border-[#313244]">
                    <Activity className="w-12 h-12 text-gray-300 dark:text-[#313244] mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4] mb-1">No Activity Yet</p>
                    <p className="text-xs text-gray-600 dark:text-[#a6adc8] max-w-xs mx-auto">
                        Activities will appear here when members join, announcements are posted, or members are added to the group.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activities.map((activity, index) => (
                        <div
                            key={activity.id}
                            className="group p-4 bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md dark:hover:shadow-indigo-500/20 transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-base">
                                    {getActivityIcon(activity.activityType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                        {getActivityLabel(activity.activityType)}
                                    </p>
                                    {activity.description && (
                                        <p className="text-xs text-gray-600 dark:text-[#a6adc8] mt-1 leading-relaxed">
                                            {activity.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-400 dark:text-[#6c7086] mt-2 flex items-center gap-1">
                                        🕐 {new Date(activity.createdAt).toLocaleDateString()} · {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupActivityFeed;