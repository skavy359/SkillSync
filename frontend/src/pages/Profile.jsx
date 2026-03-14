import React, { useEffect, useState } from 'react';
import { Mail, Calendar, Briefcase, Edit, Lightbulb, Clock, Target, Flame, Award, Check, X, Shield, Camera } from 'lucide-react';
import { getMyProfile, getMyStats, getMyStreak, getMyAchievements, getMyLearningStats, updateMyProfile, changePassword } from "../services/profileService";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [learningStats, setLearningStats] = useState(null);
    const [streak, setStreak] = useState(null);
    const [achievements, setAchievements] = useState({ totalUnlocked: 0, totalAchievements: 0, achievements: [] });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', about: '' });
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        getMyProfile().then(setProfile).catch(() => {});
        getMyStats().then(setStats).catch(() => setStats({ totalSkills: 0, completedSkills: 0, totalSessions: 0, totalMinutes: 0 }));
        getMyLearningStats().then(setLearningStats).catch(() => setLearningStats({ totalSkills: 0, totalSessions: 0, totalMinutes: 0, avgMinutesPerSkill: 0, mostStudiedSkill: '' }));
        getMyStreak().then(setStreak).catch(() => setStreak({ currentStreak: 0, longestStreak: 0 }));
        getMyAchievements().then(data => setAchievements(data || { totalUnlocked: 0, achievements: [] })).catch(() => {});
    }, []);

    const handleOpenEditModal = () => {
        if (profile) {
            setEditForm({ name: profile.name, about: profile.about || '' });
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setEditError('');
            setIsEditModalOpen(true);
        }
    };

    const handleEditFormChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handlePasswordFormChange = (e) => setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleEditSubmit = async () => {
        try {
            setEditLoading(true);
            setEditError('');

            if (passwordForm.newPassword || passwordForm.oldPassword) {
                if (passwordForm.newPassword !== passwordForm.confirmPassword) return setEditError('Passwords do not match');
                if (!passwordForm.oldPassword) return setEditError('Current password is required');
                if (passwordForm.newPassword.length < 6) return setEditError('New password must be at least 6 characters');
                await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
            }

            await updateMyProfile({ name: editForm.name, about: editForm.about });
            const updatedProfile = await getMyProfile();
            setProfile(updatedProfile);
            setIsEditModalOpen(false);

            setTimeout(() => {
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            }, 100);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setEditLoading(false);
        }
    };

    if (!profile || !stats || !streak) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Loading profile data...</p>
            </div>
        );
    }

    const getIconComponent = (iconName) => ({ Flame, Lightbulb, Clock, Target, Award }[iconName] || Lightbulb);

    const calculateDynamicAchievements = () => {
        const baseAchievements = [
            { id: 'fire-starter', title: 'Fire Starter', desc: '7-day streak', shortDesc: '7 days', icon: 'Flame', unlocked: streak?.currentStreak >= 7, prog: `${streak?.currentStreak || 0}/7d`, theme: 'orange' },
            { id: 'skill-collector', title: 'Skill Collector', desc: 'Track 5 skills', shortDesc: '5 skills', icon: 'Lightbulb', unlocked: stats?.totalSkills >= 5, prog: `${stats?.totalSkills || 0}/5s`, theme: 'indigo' },
            { id: 'century-club', title: 'Century Club', desc: 'Log 100 hours', shortDesc: '100 hrs', icon: 'Clock', unlocked: (learningStats?.totalMinutes || 0) / 60 >= 100, prog: `${Math.round((learningStats?.totalMinutes || 0) / 60)}/100h`, theme: 'emerald' },
            { id: 'goal-getter', title: 'Goal Getter', desc: 'Create first goal', shortDesc: '1 goal', icon: 'Target', unlocked: false, prog: '0/1g', theme: 'fuchsia' },
            { id: 'completion-master', title: 'Completion Master', desc: 'Complete a skill', shortDesc: '1 skill', icon: 'Award', unlocked: stats?.completedSkills >= 1, prog: `${stats?.completedSkills || 0}/1s`, theme: 'blue' },
            { id: 'unstoppable', title: 'Unstoppable', desc: '30-day streak', shortDesc: '30 days', icon: 'Flame', unlocked: streak?.currentStreak >= 30, prog: `${streak?.currentStreak || 0}/30d`, theme: 'rose' }
        ];

        if (achievements?.achievements && achievements.achievements.length > 0) {
            const backendMap = Object.fromEntries(achievements.achievements.map(a => [a.id, a]));
            baseAchievements.forEach(a => {
                if (backendMap[a.id]) {
                    a.unlocked = backendMap[a.id].unlocked;
                    a.prog = backendMap[a.id].currentProgress;
                }
            });
        }
        return baseAchievements;
    };

    const dynamicAchievements = calculateDynamicAchievements();
    const joinedDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : 'Recent';
    const totalHours = Math.round((learningStats?.totalMinutes || 0) / 60);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            
            {showSuccessMessage && (
                <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold">
                        <Check className="w-5 h-5" /> Profile successfully updated
                    </div>
                </div>
            )}

            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 shadow-sm">
                
                <div className="h-48 md:h-64 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KPC9zdmc+')] opacity-40 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="px-6 sm:px-10 pb-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 relative z-10">
                            
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-b from-white to-gray-200 dark:from-white/20 dark:to-white/5 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                                <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
                                    <span className="text-4xl md:text-5xl font-black text-white z-10">{profile.name?.charAt(0)}</span>
                                    <button onClick={handleOpenEditModal} className="absolute bottom-2 right-2 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all z-30 translate-y-2 group-hover:translate-y-0">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-[#181825] rounded-xl shadow-lg border border-gray-100 dark:border-white/5 z-40 translate-x-2 translate-y-2">
                                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-1.5 rounded-lg text-white">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center sm:text-left pb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{profile.name}</h1>
                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 md:gap-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200/50 dark:border-white/5">
                                        <Briefcase className="w-4 h-4 text-indigo-500" /> {profile.role || "Dedicated Learner"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="w-4 h-4" /> {profile.email}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" /> Joined {joinedDate}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center sm:justify-end pb-2">
                            <button
                                onClick={handleOpenEditModal}
                                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1e1e2e] hover:bg-gray-50 dark:hover:bg-[#272739] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 rounded-xl font-bold shadow-sm transition-all hover:shadow-md hover:border-indigo-500/30"
                            >
                                <Edit className="w-4 h-4" /> Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 sm:px-10 border-t border-gray-200/50 dark:border-white/5 overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-8 min-w-max">
                        {['overview', 'achievements'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 text-sm font-bold capitalize transition-all relative ${
                                    activeTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    <div className="lg:col-span-1 space-y-6">
                        
                        <div className="bg-white dark:bg-[#181825] rounded-3xl p-6 border border-gray-200/50 dark:border-white/5 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">About Me</h3>
                            <p className="text-sm font-medium leading-relaxed text-gray-600 dark:text-gray-400">
                                {profile.about && profile.about.trim() ? profile.about : 'No bio added yet. Write a few words about your learning goals and professional background.'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl p-6 border border-orange-400/30 shadow-lg shadow-orange-500/10 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-500" />
                           <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                        <Flame className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">
                                        Longest: {streak.longestStreak}
                                    </span>
                                </div>
                                <h3 className="text-5xl font-black mb-1">{streak.currentStreak}</h3>
                                <p className="text-orange-100 font-bold uppercase tracking-widest text-xs">Current Day Streak</p>
                           </div>
                        </div>

                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Tracked Skills', val: stats.totalSkills, sub: `${stats.completedSkills} completed`, icon: Lightbulb, theme: 'indigo' },
                                { label: 'Focus Sessions', val: learningStats?.totalSessions || 0, sub: learningStats?.mostStudiedSkill ? `Top: ${learningStats.mostStudiedSkill}` : 'No sessions', icon: Target, theme: 'emerald' },
                                { label: 'Total Hours', val: totalHours, sub: learningStats?.avgMinutesPerSkill ? `Avg ${Math.round(learningStats.avgMinutesPerSkill)}m/skill` : 'No data', icon: Clock, theme: 'blue' }
                            ].map((s, i) => (
                                <div key={i} className="bg-white dark:bg-[#181825] rounded-3xl p-6 border border-gray-200/50 dark:border-white/5 shadow-sm group hover:border-indigo-500/30 transition-colors">
                                    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-${s.theme}-100 dark:bg-${s.theme}-500/10 text-${s.theme}-600 dark:text-${s.theme}-400 group-hover:scale-110 transition-transform`}>
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{s.val}</h3>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{s.label}</p>
                                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-2 truncate">{s.sub}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-[#181825] rounded-3xl p-6 border border-gray-200/50 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">Recent Trophies</h3>
                                <button onClick={() => setActiveTab('achievements')} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">View All</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {dynamicAchievements.slice(0, 4).map(a => {
                                    const IconComponent = getIconComponent(a.icon);
                                    return (
                                        <div key={a.id} className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center border transition-all ${a.unlocked ? `bg-${a.theme}-50/50 dark:bg-${a.theme}-500/10 border-${a.theme}-200 dark:border-${a.theme}-500/20` : 'bg-gray-50 dark:bg-[#1e1e2e] border-gray-200/50 dark:border-white/5 opacity-60 grayscale'}`}>
                                            <div className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center ${a.unlocked ? `bg-${a.theme}-100 dark:bg-${a.theme}-500/20 text-${a.theme}-600 dark:text-${a.theme}-400 shadow-sm shadow-${a.theme}-500/20` : 'bg-gray-200 dark:bg-[#272739] text-gray-400 dark:text-gray-600'}`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <h4 className={`text-xs font-bold leading-tight ${a.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-600'}`}>{a.title}</h4>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {activeTab === 'achievements' && (
                <div className="bg-white dark:bg-[#181825] rounded-3xl p-8 border border-gray-200/50 dark:border-white/5 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Trophy Cabinet</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Unlock badges by hitting milestones in your learning journey.</p>
                        </div>
                        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl font-bold text-indigo-700 dark:text-indigo-400">
                            {dynamicAchievements.filter(a => a.unlocked).length} / {dynamicAchievements.length} Unlocked
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dynamicAchievements.map((achievement) => {
                            const IconComponent = getIconComponent(achievement.icon);
                            return (
                                <div key={achievement.id} className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
                                    achievement.unlocked ? `bg-gradient-to-br from-white to-${achievement.theme}-50/30 dark:from-[#1e1e2e] dark:to-${achievement.theme}-900/10 border-${achievement.theme}-200 dark:border-${achievement.theme}-500/30 shadow-sm hover:shadow-md hover:-translate-y-1` : 'bg-gray-50 dark:bg-[#1e1e2e]/50 border-gray-200/50 dark:border-white/5 opacity-70'
                                }`}>
                                    
                                    {achievement.unlocked && (
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${achievement.theme}-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-${achievement.theme}-400/20 transition-colors`} />
                                    )}

                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                            achievement.unlocked ? `bg-gradient-to-br from-${achievement.theme}-100 to-${achievement.theme}-50 dark:from-${achievement.theme}-500/20 dark:to-${achievement.theme}-500/5 text-${achievement.theme}-600 dark:text-${achievement.theme}-400 shadow-inner border border-${achievement.theme}-200/50 dark:border-${achievement.theme}-500/20` : 'bg-gray-200 dark:bg-[#272739] text-gray-400 dark:text-gray-500'
                                        }`}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`text-lg font-black mb-1 ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500'}`}>
                                                {achievement.title}
                                            </h4>
                                            <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${achievement.unlocked ? `text-${achievement.theme}-600 dark:text-${achievement.theme}-400` : 'text-gray-400 dark:text-gray-600'}`}>
                                                {achievement.prog}
                                            </p>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-snug">
                                                {achievement.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#1e1e2e] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-white/5">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Edit Profile</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-8 py-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                
                                {editError && (
                                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-start gap-3">
                                        <X className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-sm font-bold text-red-800 dark:text-red-300">{editError}</p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-5">
                                        <Lightbulb className="w-4 h-4 text-indigo-500" /> Public Information
                                    </h4>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditFormChange}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">About Me</label>
                                            <textarea
                                                name="about"
                                                value={editForm.about}
                                                onChange={handleEditFormChange}
                                                rows="4"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none"
                                                placeholder="Tell the community about your learning goals..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                                        <Shield className="w-4 h-4 text-emerald-500" /> Security
                                    </h4>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-5">Leave blank if you do not want to alter your password.</p>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={passwordForm.oldPassword}
                                                onChange={handlePasswordFormChange}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                                placeholder="Current password"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordFormChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                                    placeholder="New password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm New</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordFormChange}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1e1e2e]/50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                disabled={editLoading}
                                className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                disabled={editLoading}
                                className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                            >
                                {editLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;