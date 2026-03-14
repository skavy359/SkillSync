import { useState, useEffect } from 'react';
import { ChevronLeft, Users, Mail, Trash2, UserPlus, Loader2, BookOpen, X, MessageSquare, Megaphone, Activity, Calendar, Edit2, Check, Sparkles, UserX, Crown, AlertTriangle } from 'lucide-react';
import { getGroup, getGroupMembers, removeMember, inviteUser, inviteUserByEmail, updateGroup, deleteGroup } from '../services/studyGroupService';
import { createAnnouncement } from '../services/groupAnnouncementService';
import { getMySkills } from '../services/skillService';
import GroupChat from '../components/GroupChat';
import GroupAnnouncements from '../components/GroupAnnouncements';
import GroupActivityFeed from '../components/GroupActivityFeed';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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
    const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
    const [deletingGroup, setDeletingGroup] = useState(false);

    useEffect(() => { fetchData(); }, [groupId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [groupData, membersData, skillsData] = await Promise.all([
                getGroup(groupId), getGroupMembers(groupId), getMySkills({ size: 100 })
            ]);
            setGroup(groupData); setMembers(membersData || []); setSkills(skillsData?.content || []);
        } catch (err) { console.error('Failed to fetch group details:', err); } finally { setLoading(false); }
    };

    const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };
    const showError = (msg) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 3000); };

    const confirmRemoveMember = async () => {
        if (!removeConfirm) return;
        try {
            setRemoving(true);
            await removeMember(groupId, removeConfirm);
            setMembers(prev => prev.filter(m => m.userId !== removeConfirm));
            showSuccess('Member removed successfully');
            setRemoveConfirm(null); setRefreshActivities(prev => prev + 1);
        } catch (err) { console.error('Failed to remove member:', err); alert('Failed to remove member'); } finally { setRemoving(false); }
    };

    const handleCreateAnnouncement = async () => {
        if (!announcementForm.title.trim() || !announcementForm.content.trim()) return alert('Please fill in all fields');
        try {
            setCreatingAnnouncement(true);
            await createAnnouncement(groupId, announcementForm.title, announcementForm.content, announcementForm.isPinned);
            showSuccess('Announcement created successfully! 🎉');
            setShowAnnouncementModal(false); setAnnouncementForm({ title: '', content: '', isPinned: false });
            setRefreshAnnouncements(prev => prev + 1); setRefreshActivities(prev => prev + 1);
        } catch (err) { console.error('Failed to create announcement:', err); alert('Failed to create announcement'); } finally { setCreatingAnnouncement(false); }
    };

    const handleSaveAbout = async () => {
        try {
            await updateGroup(group.id, { description: editedDescription });
            setGroup({...group, description: editedDescription}); setEditingAbout(false); showSuccess('Group description updated!');
        } catch (err) { showError('Failed to update description. Please try again.'); }
    };

    const handleInviteUser = async () => {
        if (!invitingEmail.trim()) return alert('Please enter an email address');
        setSubmitting(true);
        try {
            await inviteUserByEmail(groupId, invitingEmail);
            setShowInviteModal(false); setInvitingEmail(''); showSuccess('Invitation sent successfully! 🎉');
            setRefreshActivities(prev => prev + 1);
        } catch (err) { console.error('Failed to invite user:', err); showError(err.response?.data?.message || 'Failed to send invitation'); } finally { setSubmitting(false); }
    };

    const confirmDeleteGroup = async () => {
        try {
            setDeletingGroup(true);
            await deleteGroup(groupId);
            showSuccess('Group deleted successfully');
            setTimeout(() => onNavigate('study-groups'), 1000);
        } catch (err) {
            console.error('Failed to delete group:', err);
            showError('Failed to delete the study group');
        } finally {
            setDeletingGroup(false);
            setDeleteGroupModalOpen(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /></div>;
    if (!group) return <div className="text-center py-20 bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-100 dark:border-[#313244]"><p className="text-gray-500 text-lg font-semibold">Group not found</p></div>;

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* --- Hero Header --- */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => onNavigate('study-groups')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/20 hover:bg-black/30 text-white rounded-lg text-sm font-bold transition-all backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Groups
                            </button>
                            {group?.isAdmin && (
                                <button
                                    onClick={() => setDeleteGroupModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/80 hover:bg-rose-600 border border-rose-400/50 text-white rounded-lg text-sm font-bold transition-all backdrop-blur-sm shadow-sm hover:shadow-md group-hover:bg-rose-500"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Group
                                </button>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">{group.name}</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    {group.skillName && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-sm text-xs font-bold shadow-sm">
                                            <BookOpen className="w-3.5 h-3.5" /> {group.skillName}
                                        </span>
                                    )}
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/20 backdrop-blur-sm text-xs font-bold shadow-sm`}>
                                        {group.isPublic ? '🌍 Public Group' : '🔒 Private Group'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{successMsg}</p>
                </div>
            )}
            
            {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
                    <X className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                    <p className="text-sm font-semibold text-rose-800 dark:text-rose-400">{errorMsg}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* --- Main Content Area --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-[#181825] rounded-xl overflow-x-auto custom-scrollbar">
                        {[
                            { id: 'members', label: 'Members', icon: Users },
                            { id: 'chat', label: 'Discussions', icon: MessageSquare },
                            { id: 'announcements', label: 'Notice Board', icon: Megaphone },
                            { id: 'activity', label: 'Timeline', icon: Activity }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-lg transition-all whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-white dark:bg-[#313244] text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'text-gray-500 dark:text-[#a6adc8] hover:text-gray-900 dark:hover:text-[#cdd6f4] hover:bg-gray-200/50 dark:hover:bg-[#1e1e2e]'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 border-none" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-100 dark:border-[#313244] overflow-hidden shadow-sm min-h-[500px]">
                        {activeTab === 'members' && (
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                                         Users ({group.memberCount})
                                    </h3>
                                    {group.isAdmin && (
                                        <Button variant="primary" icon={UserPlus} onClick={() => setShowInviteModal(true)}>
                                            Invite Members
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {members.map(member => (
                                        <div key={member.userId} className="group relative bg-gray-50 dark:bg-[#181825] rounded-2xl border border-gray-200 dark:border-[#313244] p-5 hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                                        <span className="text-lg font-bold text-white shadow-sm">
                                                            {member.userName?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 dark:text-[#cdd6f4] truncate mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                            {member.userName}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-gray-500 dark:text-[#6c7086] truncate flex items-center gap-1">
                                                                <Mail className="w-3 h-3" /> {member.userEmail}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 ml-3">
                                                    {member.role === 'ADMIN' ? (
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" title="Admin">
                                                            <Crown className="w-4 h-4" />
                                                        </span>
                                                    ) : group.isAdmin && (
                                                        <button 
                                                            onClick={() => setRemoveConfirm(member.userId)}
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100" 
                                                            title="Remove Member"
                                                        >
                                                            <UserX className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {member.userAbout && (
                                                <p className="text-sm text-gray-600 dark:text-[#a6adc8] mt-4 line-clamp-2 leading-relaxed bg-white/50 dark:bg-black/10 p-2.5 rounded-xl border border-gray-100 dark:border-[#313244]">
                                                    {member.userAbout}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'chat' && (
                            <div className="h-[600px] flex flex-col bg-gray-50/50 dark:bg-transparent">
                                <GroupChat groupId={groupId} currentUserId={currentUserId} />
                            </div>
                        )}

                        {activeTab === 'announcements' && (
                            <div className="p-6 md:p-8 bg-amber-50/30 dark:bg-transparent">
                                <GroupAnnouncements groupId={groupId} isAdmin={group.isAdmin} onCreateClick={() => setShowAnnouncementModal(true)} refreshKey={refreshAnnouncements} />
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="p-6 md:p-8">
                                <GroupActivityFeed groupId={groupId} refreshKey={refreshActivities} />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Sidebar --- */}
                <div className="space-y-6">
                    {/* About Card */}
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-100 dark:border-[#313244] p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/5 dark:to-blue-500/5 rounded-bl-full -z-0" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                                     About Group
                                </h3>
                                {group.isAdmin && !editingAbout && (
                                    <button onClick={() => {setEditedDescription(group.description); setEditingAbout(true);}} className="p-2 rounded-xl text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {editingAbout ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <textarea
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        placeholder="What is this group about?"
                                        rows="4"
                                        className="w-full px-4 py-3 text-sm border-2 border-indigo-200 dark:border-indigo-500/30 rounded-xl bg-white dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 resize-none transition-all shadow-inner"
                                    />
                                    <div className="flex gap-2">
                                        <Button variant="secondary" onClick={() => setEditingAbout(false)} className="flex-1">Cancel</Button>
                                        <Button variant="primary" onClick={handleSaveAbout} icon={Check} className="flex-1">Save</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in">
                                    <p className="text-sm font-medium text-gray-600 dark:text-[#a6adc8] leading-relaxed">
                                        {group.description || 'Welcome to our study group! No description provided. 📚'}
                                    </p>

                                    <div className="space-y-3 pt-5 border-t border-gray-100 dark:border-[#313244]">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-[#181825] flex items-center justify-center text-gray-400 dark:text-[#6c7086]">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-[#cdd6f4]">{new Date(group.createdAt).toLocaleDateString()}</p>
                                                <p className="text-xs text-gray-500">Founded</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-[#cdd6f4]">{group.createdByName}</p>
                                                <p className="text-xs text-gray-500">Creator</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modals --- */}
            <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Member" size="sm" footer={<><Button variant="secondary" onClick={() => setShowInviteModal(false)}>Cancel</Button><Button variant="primary" onClick={handleInviteUser} disabled={submitting || !invitingEmail.trim()}>{submitting ? 'Sending...' : 'Send Invite'}</Button></>}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">User Email Address <span className="text-rose-500">*</span></label>
                        <Input
                            type="email"
                            placeholder="colleague@example.com"
                            value={invitingEmail}
                            onChange={(e) => setInvitingEmail(e.target.value)}
                            icon={Mail}
                        />
                        <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-2 font-medium">An invitation will be sent to the user's dashboard pending their acceptance.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!removeConfirm} onClose={() => setRemoveConfirm(null)} title="Remove Member" size="sm" footer={<><Button variant="secondary" onClick={() => setRemoveConfirm(null)}>Cancel</Button><Button variant="danger" icon={UserX} onClick={confirmRemoveMember} disabled={removing}>{removing ? 'Removing...' : 'Remove User'}</Button></>}>
                <div className="text-center p-4">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-[#cdd6f4] mb-2">Are you sure?</h3>
                    <p className="text-sm text-gray-600 dark:text-[#a6adc8] leading-relaxed">
                        This user will be permanently removed from the group and will lose access to all chats and resources. They will need to be re-invited to join again.
                    </p>
                </div>
            </Modal>

            <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title="Broadcast Announcement" size="md" footer={<><Button variant="secondary" onClick={() => setShowAnnouncementModal(false)}>Cancel</Button><Button variant="primary" icon={Megaphone} onClick={handleCreateAnnouncement} disabled={creatingAnnouncement || !announcementForm.title.trim()}>Publish</Button></>}>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">Headline <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            placeholder="What's the news?"
                            value={announcementForm.title}
                            onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                            className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">Message Body <span className="text-rose-500">*</span></label>
                        <textarea
                            placeholder="Provide details for the group..."
                            value={announcementForm.content}
                            onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                            rows="4"
                            className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none transition-all font-medium"
                        />
                    </div>
                    <label className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
                        <input
                            type="checkbox"
                            checked={announcementForm.isPinned}
                            onChange={(e) => setAnnouncementForm({...announcementForm, isPinned: e.target.checked})}
                            className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                        />
                        <div>
                            <span className="block text-sm font-bold text-amber-800 dark:text-amber-400">Pin to top</span>
                            <span className="block text-xs font-semibold text-amber-600/80 dark:text-amber-500/80">Keeps this announcement visible at the top of the board</span>
                        </div>
                    </label>
                </div>
            </Modal>

            <Modal isOpen={deleteGroupModalOpen} onClose={() => setDeleteGroupModalOpen(false)}>
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">Delete Study Group?</h3>
                    <p className="text-gray-500 dark:text-[#6c7086] mb-8">
                        Are you entirely sure you want to delete <span className="font-bold text-gray-800 dark:text-gray-300">{group.name}</span>? This action is <span className="font-bold text-rose-500">permanent</span> and will immediately erase all members, announcements, discussions, and associated data.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Button variant="secondary" onClick={() => setDeleteGroupModalOpen(false)} className="px-6 font-bold" disabled={deletingGroup}>Keep Group</Button>
                        <Button 
                            variant="primary" 
                            onClick={confirmDeleteGroup}
                            disabled={deletingGroup}
                            className="px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold border-transparent shadow-[0_4px_12px_rgba(225,29,72,0.3)]"
                        >
                            {deletingGroup ? 'Deleting...' : 'Yes, Delete Group'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GroupDetails;