import { useState, useEffect } from 'react';
import { ChevronLeft, Users, Mail, Trash2, UserPlus, Loader2, BookOpen, X, MessageSquare, Megaphone, Activity } from 'lucide-react';
import { getGroup, getGroupMembers, removeMember, inviteUser } from '../services/studyGroupService';
import { getMySkills } from '../services/skillService';
import GroupChat from '../components/GroupChat';
import GroupAnnouncements from '../components/GroupAnnouncements';
import GroupActivityFeed from '../components/GroupActivityFeed';
import Button from '../components/ui/Button';

const GroupDetails = ({ groupId, onNavigate, currentUserId }) => {
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [invitingUserId, setInvitingUserId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [skills, setSkills] = useState([]);
    const [activeTab, setActiveTab] = useState('members');
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', isPinned: false });

    useEffect(() => {
        fetchData();
    }, [groupId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [groupData, membersData, skillsData] = await Promise.all([
                getGroup(groupId),
                getGroupMembers(groupId),
                getMySkills({ size: 100 })
            ]);
            setGroup(groupData);
            setMembers(membersData || []);
            setSkills(skillsData?.content || []);
        } catch (err) {
            console.error('Failed to fetch group details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('Remove this member from the group?')) return;

        try {
            await removeMember(groupId, memberId);
            setMembers(prev => prev.filter(m => m.userId !== memberId));
            setSuccessMsg('Member removed');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Failed to remove member:', err);
            alert('Failed to remove member');
        }
    };

    const handleInviteUser = async () => {
        if (!invitingUserId) {
            alert('Please select a user');
            return;
        }

        setSubmitting(true);
        try {
            await inviteUser(groupId, Number(invitingUserId));
            setShowInviteModal(false);
            setInvitingUserId('');
            setSuccessMsg('Invitation sent successfully! 🎉');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Failed to invite user:', err);
            alert('Failed to send invitation');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Group not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onNavigate('study-groups')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">{group.name}</h1>
                    {group.skillName && (
                        <p className="text-sm text-purple-500 dark:text-purple-400 flex items-center gap-1 mt-1">
                            <BookOpen className="w-4 h-4" /> {group.skillName}
                        </p>
                    )}
                </div>
                {group.isAdmin && (
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                        <UserPlus className="w-4 h-4" /> Invite Member
                    </button>
                )}
            </div>

            {/* Success Message */}
            {successMsg && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
                </div>
            )}

            {/* About */}
            {group.description && (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] mb-2">About</h3>
                    <p className="text-sm text-gray-600 dark:text-[#a6adc8]">{group.description}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-[#313244]">
                {[
                    { id: 'members', label: 'Members', icon: Users },
                    { id: 'chat', label: 'Chat', icon: MessageSquare },
                    { id: 'announcements', label: 'Announcements', icon: Megaphone },
                    { id: 'activity', label: 'Activity', icon: Activity }
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-600 dark:text-[#a6adc8] hover:text-gray-900 dark:hover:text-[#cdd6f4]'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'members' && (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" /> Members ({group.memberCount})
                    </h3>
                    <div className="space-y-3">
                    {members.map(member => (
                        <div key={member.userId} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-[#313244] hover:bg-gray-50 dark:hover:bg-[#181825] transition-colors">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{member.userName}</p>
                                <p className="text-xs text-gray-500 dark:text-[#6c7086] flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {member.userEmail}
                                </p>
                                {member.userAbout && (
                                    <p className="text-xs text-gray-600 dark:text-[#a6adc8] mt-1 line-clamp-1">{member.userAbout}</p>
                                )}
                                <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                    member.role === 'ADMIN'
                                        ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                        : 'bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8]'
                                }`}>
                                    {member.role === 'ADMIN' ? '👑 Admin' : member.role}
                                </span>
                            </div>
                            {group.isAdmin && member.role !== 'ADMIN' && (
                                <button
                                    onClick={() => handleRemoveMember(member.userId)}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
                <div className="h-96">
                    <GroupChat groupId={groupId} currentUserId={currentUserId} />
                </div>
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5">
                    <GroupAnnouncements 
                        groupId={groupId} 
                        isAdmin={group.isAdmin}
                        onCreateClick={() => setShowAnnouncementModal(true)}
                    />
                </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5">
                    <GroupActivityFeed groupId={groupId} />
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInviteModal(false)}>
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">Invite Member</h3>
                            <button onClick={() => setShowInviteModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244]">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Select User *</label>
                                <input
                                    type="number"
                                    placeholder="Enter user ID"
                                    value={invitingUserId}
                                    onChange={(e) => setInvitingUserId(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                                />
                                <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-2">ℹ️ User ID format is required. You can find user IDs in the admin panel or from user profiles.</p>
                            </div>
                            <button
                                onClick={handleInviteUser}
                                disabled={submitting || !invitingUserId}
                                className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Inviting...' : 'Send Invitation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetails;
