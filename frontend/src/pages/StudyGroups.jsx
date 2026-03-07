import { useState, useEffect } from 'react';
import { Plus, Users, BookOpen, ChevronRight, Loader2, X } from 'lucide-react';
import { getMyGroups, createStudyGroup, getMyInvitations, acceptInvitation, rejectInvitation } from '../services/studyGroupService';
import { getMySkills } from '../services/skillService';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

const StudyGroups = ({ onNavigate, onSelectGroup }) => {
    const [myGroups, setMyGroups] = useState([]);
    const [myInvitations, setMyInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [skills, setSkills] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        skillId: '',
        isPublic: true
    });

    const handleNavigateToGroup = (groupId) => {
        onSelectGroup(groupId);
        onNavigate('group-details');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [groups, invitations, skillsList] = await Promise.all([
                getMyGroups(),
                getMyInvitations(),
                getMySkills({ size: 100 })
            ]);
            setMyGroups(Array.isArray(groups) ? groups : []);
            setMyInvitations(Array.isArray(invitations) ? invitations : []);
            setSkills(skillsList?.content || []);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!formData.name.trim()) {
            alert('Group name is required');
            return;
        }

        setSubmitting(true);
        try {
            const newGroup = await createStudyGroup(formData);
            setMyGroups(prev => [newGroup, ...prev]);
            setShowCreateModal(false);
            setFormData({ name: '', description: '', skillId: '', isPublic: true });
            setSuccessMsg('Study group created successfully! 🎉');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Failed to create group:', err);
            alert('Failed to create study group. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAcceptInvitation = async (invitationId) => {
        try {
            await acceptInvitation(invitationId);
            setMyInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            setSuccessMsg('Invitation accepted! You joined the group.');
            setTimeout(() => setSuccessMsg(''), 3000);
            fetchData();
        } catch (err) {
            console.error('Failed to accept invitation:', err);
            alert('Failed to accept invitation');
        }
    };

    const handleRejectInvitation = async (invitationId) => {
        try {
            await rejectInvitation(invitationId);
            setMyInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            setSuccessMsg('Invitation rejected');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Failed to reject invitation:', err);
            alert('Failed to reject invitation');
        }
    };


    const handleNavigate = (page) => {
        if (page === 'group-details') {
            handleNavigateToGroup(selectedGroupId);
        } else {
            onNavigate(page);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Study Groups</h1>
                    <p className="text-sm text-gray-500 dark:text-[#6c7086] mt-1">Collaborate with other learners</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                    <Plus className="w-4 h-4" /> Create Group
                </button>
            </div>

            {/* Success Message */}
            {successMsg && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
                </div>
            )}

            {/* Invitations */}
            {myInvitations.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-3">
                        Pending Invitations ({myInvitations.length})
                    </h3>
                    <div className="space-y-2">
                        {myInvitations.map(inv => (
                            <div key={inv.id} className="flex items-center justify-between bg-white dark:bg-[#1e1e2e] p-3 rounded-lg border border-blue-200 dark:border-blue-500/20">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">{inv.groupName}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#6c7086]">Invited by {inv.invitedByName}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAcceptInvitation(inv.id)}
                                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRejectInvitation(inv.id)}
                                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* My Groups */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
            ) : myGroups.length === 0 ? (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 dark:text-[#45475a] mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">No groups yet</h3>
                    <p className="text-sm text-gray-500 dark:text-[#6c7086] mb-4">Create your first study group or find one to join</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create Group
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myGroups.map(group => (
                        <div
                            key={group.id}
                            onClick={() => handleNavigateToGroup(group.id)}
                            className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                                    <Users className="w-5 h-5" />
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-[#585b70] group-hover:text-purple-500 transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-1 line-clamp-2">{group.name}</h3>
                            {group.skillName && (
                                <p className="text-xs text-purple-500 dark:text-purple-400 flex items-center gap-1 mb-3">
                                    <BookOpen className="w-3 h-3" /> {group.skillName}
                                </p>
                            )}
                            <p className="text-sm text-gray-600 dark:text-[#a6adc8] line-clamp-2 mb-4">{group.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[#6c7086]">
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {group.memberCount} members
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">Create Study Group</h3>
                            <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244]">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Group Name *</label>
                                <Input
                                    placeholder="e.g., React Learners"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Description</label>
                                <textarea
                                    placeholder="What's this group about?"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Skill (optional)</label>
                                <select
                                    value={formData.skillId}
                                    onChange={(e) => setFormData({ ...formData, skillId: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                                >
                                    <option value="">Select a skill</option>
                                    {skills.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-2">Visibility</label>
                                <div className="flex gap-3">
                                    {[
                                        { value: true, label: '🌍 Public' },
                                        { value: false, label: '🔒 Private' }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setFormData({ ...formData, isPublic: opt.value })}
                                            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                                                formData.isPublic === opt.value
                                                    ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400'
                                                    : 'bg-gray-50 dark:bg-[#181825] border-gray-200 dark:border-[#313244] text-gray-600 dark:text-[#a6adc8]'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleCreateGroup}
                                disabled={submitting}
                                className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Creating...' : 'Create Group'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyGroups;
