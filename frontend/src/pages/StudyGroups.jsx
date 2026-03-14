import { useState, useEffect } from 'react';
import { Plus, Users, BookOpen, ChevronRight, Loader2, X, MailOpen, CheckCircle, XCircle, Search, Sparkles } from 'lucide-react';
import { getMyGroups, createStudyGroup, getMyInvitations, acceptInvitation, rejectInvitation } from '../services/studyGroupService';
import { getMySkills } from '../services/skillService';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const StudyGroups = ({ onNavigate, onSelectGroup }) => {
    const [myGroups, setMyGroups] = useState([]);
    const [myInvitations, setMyInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [skills, setSkills] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({ name: '', description: '', skillId: '', isPublic: true });

    const handleNavigateToGroup = (groupId) => {
        onSelectGroup(groupId);
        onNavigate('group-details');
    };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [groups, invitations, skillsList] = await Promise.all([
                getMyGroups(), getMyInvitations(), getMySkills({ size: 100 })
            ]);
            setMyGroups(Array.isArray(groups) ? groups : []);
            setMyInvitations(Array.isArray(invitations) ? invitations : []);
            setSkills(skillsList?.content || []);
        } catch (err) { console.error('Failed to fetch data:', err); } finally { setLoading(false); }
    };

    const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

    const handleCreateGroup = async () => {
        if (!formData.name.trim()) return alert('Group name is required');
        setSubmitting(true);
        try {
            const newGroup = await createStudyGroup(formData);
            setMyGroups(prev => [newGroup, ...prev]);
            setShowCreateModal(false);
            setFormData({ name: '', description: '', skillId: '', isPublic: true });
            showSuccess('Study group created successfully! 🎉');
        } catch (err) { console.error('Failed to create group:', err); alert('Failed to create study group. Please try again.'); } finally { setSubmitting(false); }
    };

    const handleAcceptInvitation = async (invitationId) => {
        try {
            await acceptInvitation(invitationId);
            setMyInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            showSuccess('Invitation accepted! You joined the group.');
            fetchData();
        } catch (err) { console.error('Failed to accept:', err); alert('Failed to accept invitation'); }
    };

    const handleRejectInvitation = async (invitationId) => {
        try {
            await rejectInvitation(invitationId);
            setMyInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            showSuccess('Invitation rejected');
        } catch (err) { console.error('Failed to reject:', err); alert('Failed to reject invitation'); }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-12 shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium shadow-sm">
                            <Users className="w-4 h-4 text-indigo-200" />
                            <span>Community & Collaboration</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">Study Groups</h1>
                        <p className="text-indigo-50 max-w-xl text-lg opacity-90 leading-relaxed">
                            Join forces with fellow learners. Share knowledge, conquer complex topics together, and accelerate your mastery.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onNavigate('browse-study-groups')}
                            className="inline-flex items-center justify-center px-6 py-3 border border-white/30 text-base font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 hover:shadow-xl backdrop-blur-sm transition-all whitespace-nowrap"
                        >
                            <Search className="w-5 h-5 mr-2" />
                            Discover
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-indigo-700 bg-white hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            New Group
                        </button>
                    </div>
                </div>
            </div>

            {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{successMsg}</p>
                </div>
            )}

            {myInvitations.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <MailOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4]">Pending Invitations</h3>
                            <p className="text-sm text-gray-500 dark:text-[#6c7086] font-medium">You have {myInvitations.length} new invite{myInvitations.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {myInvitations.map(inv => (
                            <div key={inv.id} className="group relative bg-white dark:bg-[#1e1e2e] rounded-[2rem] border-2 border-amber-100 dark:border-amber-500/20 p-6 hover:border-amber-400 dark:hover:border-amber-500/60 hover:shadow-xl dark:hover:shadow-amber-500/10 transition-all overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-500/10 dark:from-amber-400/5 dark:to-orange-500/5 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
                                
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-inner shadow-black/10">
                                                <Sparkles className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-gray-900 dark:text-[#cdd6f4] leading-tight mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                    {inv.groupName}
                                                </h4>
                                                <p className="text-xs font-bold text-gray-500 dark:text-[#6c7086] flex items-center gap-1.5 uppercase tracking-wider">
                                                    <Users className="w-3.5 h-3.5 text-amber-500" /> {inv.memberCount} Members
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-[#a6adc8]">
                                            <span className="text-amber-600 dark:text-amber-400 font-bold">{inv.invitedByName}</span> invited you to join their study group.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative z-10 flex gap-3 mt-auto">
                                    <button
                                        onClick={() => handleAcceptInvitation(inv.id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleRejectInvitation(inv.id)}
                                        className="flex items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                        title="Decline"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                         My Groups
                    </h2>
                </div>
                
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    </div>
                ) : myGroups.length === 0 ? (
                    <div className="bg-white/50 dark:bg-[#1e1e2e]/50 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-[#313244] p-16 text-center">
                        <div className="w-24 h-24 bg-white dark:bg-[#272739] shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-12 h-12 text-indigo-500" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] mb-2">No active groups</h3>
                        <p className="text-gray-500 dark:text-[#a6adc8] mb-8 max-w-sm mx-auto">
                            Studying with others is proven to increase retention. Create or join a group to get started.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="primary" icon={Plus} onClick={() => setShowCreateModal(true)}>Create Group</Button>
                            <Button variant="secondary" icon={Search} onClick={() => onNavigate('browse-study-groups')}>Browse</Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myGroups.map(group => (
                            <div
                                key={group.id}
                                onClick={() => handleNavigateToGroup(group.id)}
                                className="group bg-white dark:bg-[#1e1e2e] rounded-[2rem] border border-gray-100 dark:border-[#313244] p-6 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
                                
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-inner shadow-black/10">
                                            <Users className="w-7 h-7" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#181825] flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{group.name}</h3>
                                    
                                    {group.skillName && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-100 dark:border-indigo-500/20">
                                            <BookOpen className="w-3.5 h-3.5" /> {group.skillName}
                                        </div>
                                    )}
                                    
                                    <p className="text-sm font-medium text-gray-500 dark:text-[#a6adc8] line-clamp-2 mb-6 leading-relaxed">
                                        {group.description}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#313244] mt-auto">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-[#cdd6f4]">
                                        <div className="flex -space-x-2">
                                           {[...Array(Math.min(group.memberCount, 3))].map((_, i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[#313244] dark:to-[#45475a] border-2 border-white dark:border-[#1e1e2e]" />
                                            ))}
                                            {group.memberCount > 3 && (
                                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#181825] border-2 border-white dark:border-[#1e1e2e] flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                    +{group.memberCount - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span>{group.memberCount} Members</span>
                                    </div>
                                    <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${group.isPublic ? 'bg-emerald-500' : 'bg-amber-500'}`} title={group.isPublic ? 'Public Group' : 'Private Group'} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Study Group" size="md" footer={<><Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button><Button variant="primary" onClick={handleCreateGroup} disabled={!formData.name.trim() || submitting}>{submitting ? 'Creating...' : 'Launch Group'}</Button></>}>
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Group Name <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g., Ultimate React Masters"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-[#313244] font-medium transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Description</label>
                        <textarea
                            placeholder="What are the goals of this group?"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-[#313244] font-medium resize-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Primary Skill (Optional)</label>
                        <select
                            value={formData.skillId}
                            onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                            className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-[#313244] font-medium transition-all"
                        >
                            <option value="">General Study Group</option>
                            {skills.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">Visibility Settings</label>
                        <div className="flex gap-4">
                            {[
                                { value: true, label: 'Public - Anyone can join', icon: '🌍' },
                                { value: false, label: 'Private - Invite only', icon: '🔒' }
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isPublic: opt.value })}
                                    className={`flex-1 p-3 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 transition-all ${
                                        formData.isPublic === opt.value
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400 shadow-sm ring-2 ring-indigo-500/20'
                                            : 'bg-white dark:bg-[#181825] border-gray-200 dark:border-[#313244] text-gray-600 dark:text-[#a6adc8] hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <span className="text-xl">{opt.icon}</span>
                                    <span className="text-xs font-bold">{opt.label.split(' - ')[0]}</span>
                                    <span className="text-[10px] opacity-70">{opt.label.split(' - ')[1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StudyGroups;