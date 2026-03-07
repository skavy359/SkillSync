import { useState, useEffect } from 'react';
import { ChevronLeft, Users, Mail, Trash2, UserPlus, Loader2, BookOpen, X, MessageSquare, Megaphone, Activity, Calendar, Edit2, Check } from 'lucide-react';
import { getGroup, getGroupMembers, removeMember, inviteUser, inviteUserByEmail, updateGroup } from '../services/studyGroupService';
import { createAnnouncement } from '../services/groupAnnouncementService';
import { getMySkills } from '../services/skillService';
import GroupChat from '../components/GroupChat';
import GroupAnnouncements from '../components/GroupAnnouncements';
import GroupActivityFeed from '../components/GroupActivityFeed';

const GroupDetails = ({ groupId, onNavigate, currentUserId }) => {
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [invitingEmail, setInvitingEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [skills, setSkills] = useState([]);
    const [activeTab, setActiveTab] = useState('members');
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '', isPinned: false });
    const [removeConfirm, setRemoveConfirm] = useState(null);
    const [removing, setRemoving] = useState(false);
    const [creatingAnnouncement, setCreatingAnnouncement] = useState(false);
    const [refreshAnnouncements, setRefreshAnnouncements] = useState(0);
    const [refreshActivities, setRefreshActivities] = useState(0);
    const [editingAbout, setEditingAbout] = useState(false);
    const [editedDescription, setEditedDescription] = useState('');

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

    const handleRemoveMember = (memberId) => {
        setRemoveConfirm(memberId);
    };

    const confirmRemoveMember = async () => {
        if (!removeConfirm) return;

        try {
            setRemoving(true);
            await removeMember(groupId, removeConfirm);
            setMembers(prev => prev.filter(m => m.userId !== removeConfirm));
            setSuccessMsg('Member removed successfully');
            setTimeout(() => setSuccessMsg(''), 3000);
            setRemoveConfirm(null);
            setRefreshActivities(prev => prev + 1);
        } catch (err) {
            console.error('Failed to remove member:', err);
            alert('Failed to remove member');
        } finally {
            setRemoving(false);
        }
    };

    const handleCreateAnnouncement = async () => {
        if (!announcementForm.title.trim() || !announcementForm.content.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setCreatingAnnouncement(true);
            await createAnnouncement(groupId, announcementForm.title, announcementForm.content, announcementForm.isPinned);
            setSuccessMsg('Announcement created successfully! 🎉');
            setTimeout(() => setSuccessMsg(''), 3000);
            setShowAnnouncementModal(false);
            setAnnouncementForm({ title: '', content: '', isPinned: false });
            setRefreshAnnouncements(prev => prev + 1);
            setRefreshActivities(prev => prev + 1);
        } catch (err) {
            console.error('Failed to create announcement:', err);
            alert('Failed to create announcement');
        } finally {
            setCreatingAnnouncement(false);
        }
    };

    const handleEditAbout = () => {
        setEditedDescription(group.description);
        setEditingAbout(true);
    };

    const handleSaveAbout = async () => {
        try {
            await updateGroup(group.id, { description: editedDescription });
            setGroup({...group, description: editedDescription});
            setEditingAbout(false);
            setSuccessMsg('Group description updated!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            setErrorMsg('Failed to update description. Please try again.');
            setTimeout(() => setErrorMsg(''), 3000);
        }
    };

    const handleInviteUser = async () => {
        if (!invitingEmail.trim()) {
            alert('Please enter an email address');
            return;
        }

        setSubmitting(true);
        try {
            await inviteUserByEmail(groupId, invitingEmail);
            setShowInviteModal(false);
            setInvitingEmail('');
            setSuccessMsg('Invitation sent successfully! 🎉');
            setTimeout(() => setSuccessMsg(''), 3000);
            setRefreshActivities(prev => prev + 1);
        } catch (err) {
            console.error('Failed to invite user:', err);
            setErrorMsg(err.response?.data?.message || 'Failed to send invitation');
            setTimeout(() => setErrorMsg(''), 3000);
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

            {successMsg && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
                </div>
            )}

            {errorMsg && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{errorMsg}</p>
                </div>
            )}

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1e1e2e] dark:to-[#181825] rounded-2xl border-2 border-gray-200 dark:border-[#313244] p-6 hover:border-transparent hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-indigo-500/20 transition-all">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">About This Group</h3>
                    </div>
                    {group.isAdmin && !editingAbout && (
                        <button
                            onClick={handleEditAbout}
                            className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {editingAbout ? (
                    <div className="space-y-4">
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Group description"
                            rows="4"
                            className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-[#313244] rounded-xl bg-white dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 resize-none"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingAbout(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-[#313244] text-gray-900 dark:text-[#cdd6f4] hover:bg-gray-200 dark:hover:bg-[#45475a] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAbout}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-700 dark:text-[#a6adc8] leading-relaxed mb-5">
                            {group.description || 'No description provided'}
                        </p>

                        <div className="space-y-2 pt-5 border-t border-gray-200 dark:border-[#313244]">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#a6adc8]">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                <span>Created on {new Date(group.createdAt).toLocaleDateString()} at {new Date(group.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#a6adc8]">
                                <span>👤</span>
                                <span>Created by {group.createdByName}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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

            {activeTab === 'members' && (
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5" /> Members ({group.memberCount})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {members.map(member => (
                            <div key={member.userId} className="group relative bg-white dark:bg-[#1e1e2e] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#313244] hover:border-transparent transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl dark:hover:shadow-indigo-500/20 transform hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative p-5 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-bold text-white">
                                                    {member.userName?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 dark:text-[#cdd6f4] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {member.userName}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-[#6c7086]">
                                                    {member.role === 'ADMIN' ? '👑 Admin' : 'Member'}
                                                </p>
                                            </div>
                                        </div>
                                        {group.isAdmin && member.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleRemoveMember(member.userId)}
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-2 flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-[#a6adc8]">
                                        <Mail className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                        <span className="truncate">{member.userEmail}</span>
                                    </div>

                                    {member.userAbout && (
                                        <p className="text-sm text-gray-600 dark:text-[#a6adc8] line-clamp-2 leading-relaxed">
                                            {member.userAbout}
                                        </p>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        {member.role === 'ADMIN' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-600 dark:text-purple-300">
                                                <span>👑</span> Admin
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                            <span>👤</span> Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'chat' && (
                <div className="h-96">
                    <GroupChat groupId={groupId} currentUserId={currentUserId} />
                </div>
            )}

            {activeTab === 'announcements' && (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5">
                    <GroupAnnouncements 
                        groupId={groupId} 
                        isAdmin={group.isAdmin}
                        onCreateClick={() => setShowAnnouncementModal(true)}
                        refreshKey={refreshAnnouncements}
                    />
                </div>
            )}

            {activeTab === 'activity' && (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5">
                    <GroupActivityFeed groupId={groupId} refreshKey={refreshActivities} />
                </div>
            )}

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
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">User Email *</label>
                                <input
                                    type="email"
                                    placeholder="user@example.com"
                                    value={invitingEmail}
                                    onChange={(e) => setInvitingEmail(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                                />
                                <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-2">ℹ️ Enter the email address of the user you want to invite.</p>
                            </div>
                            <button
                                onClick={handleInviteUser}
                                disabled={submitting || !invitingEmail.trim()}
                                className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Inviting...' : 'Send Invitation'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {removeConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-sm p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">
                                Remove Member?
                            </h3>
                            <button 
                                onClick={() => setRemoveConfirm(null)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-[#a6adc8] mb-6">
                            Are you sure you want to remove this member from the group? They will no longer have access to group chat and resources.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setRemoveConfirm(null)}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-[#313244] text-gray-900 dark:text-[#cdd6f4] hover:bg-gray-200 dark:hover:bg-[#45475a] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemoveMember}
                                disabled={removing}
                                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {removing ? 'Removing...' : 'Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAnnouncementModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-lg p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">Create Announcement</h3>
                            <button 
                                onClick={() => setShowAnnouncementModal(false)}
                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244]"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-2">Title *</label>
                                <input
                                    type="text"
                                    placeholder="Announcement title"
                                    value={announcementForm.title}
                                    onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-2">Content *</label>
                                <textarea
                                    placeholder="Announcement content"
                                    value={announcementForm.content}
                                    onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                                    rows="4"
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
                                />
                            </div>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={announcementForm.isPinned}
                                    onChange={(e) => setAnnouncementForm({...announcementForm, isPinned: e.target.checked})}
                                    className="w-4 h-4 rounded accent-amber-500"
                                />
                                <span className="text-sm text-gray-600 dark:text-[#a6adc8]">Pin this announcement</span>
                            </label>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowAnnouncementModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gray-100 dark:bg-[#313244] text-gray-900 dark:text-[#cdd6f4] hover:bg-gray-200 dark:hover:bg-[#45475a] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateAnnouncement}
                                    disabled={creatingAnnouncement}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creatingAnnouncement ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetails;