import React, { useState, useEffect } from 'react';
import { Shield, FileText, X, ChevronRight, AlertTriangle, Bell, Info } from 'lucide-react';
import notificationPreferenceService from '../services/notificationPreferenceService';
import { deleteMyAccount } from '../services/profileService';

const Settings = () => {
    const [modalOpen, setModalOpen] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notifPrefs, setNotifPrefs] = useState({
        sessionReminders: true,
        goalAlerts: true,
        skillCompletions: true,
        learningStreaks: true,
        categoryMilestones: false,
        burnoutWarnings: true,
        weeklySummary: true,
        achievementNotifications: true,
    });

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                setLoading(true);
                const prefs = await notificationPreferenceService.getPreferences();
                setNotifPrefs({
                    sessionReminders: prefs.sessionReminders ?? true,
                    goalAlerts: prefs.goalAlerts ?? true,
                    skillCompletions: prefs.skillCompletions ?? true,
                    learningStreaks: prefs.learningStreaks ?? true,
                    categoryMilestones: prefs.categoryMilestones ?? false,
                    burnoutWarnings: prefs.burnoutWarnings ?? true,
                    weeklySummary: prefs.weeklySummary ?? true,
                    achievementNotifications: prefs.achievementNotifications ?? true,
                });
            } catch (error) {
                const stored = localStorage.getItem('notifPrefs');
                if (stored) setNotifPrefs(JSON.parse(stored));
            } finally {
                setLoading(false);
            }
        };
        loadPreferences();
    }, []);

    const toggleNotif = async (key) => {
        const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
        setNotifPrefs(updated);
        localStorage.setItem('notifPrefs', JSON.stringify(updated));
        try {
            await notificationPreferenceService.updatePreferences(updated);
        } catch (error) {
            console.error('Failed to update preferences:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteInput !== 'DELETE') return;
        setDeleting(true);
        try {
            await deleteMyAccount();
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert('Failed to delete account. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const notifGroups = [
        {
            title: "Learning & Progress",
            items: [
                { key: 'sessionReminders', label: 'Session Reminders', desc: 'Get reminded to log your learning sessions' },
                { key: 'learningStreaks', label: 'Streak Alerts', desc: 'Alert when your learning streak is at risk of breaking' },
                { key: 'burnoutWarnings', label: 'Burnout Warnings', desc: 'Smart alerts when overworking patterns are detected' },
                { key: 'weeklySummary', label: 'Weekly Summary', desc: 'Receive a personalized learning summary every Monday' },
            ]
        },
        {
            title: "Achievements & Goals",
            items: [
                { key: 'goalAlerts', label: 'Goal Tracking', desc: 'Notifications when goals are due or successfully completed' },
                { key: 'skillCompletions', label: 'Skill Mastery', desc: 'Celebrate when you 100% complete a tracked skill' },
                { key: 'categoryMilestones', label: 'Category Milestones', desc: 'Updates for reaching significant milestones in a category' },
                { key: 'achievementNotifications', label: 'Badges & Trophies', desc: 'Get notified immediately when earning new achievements' },
            ]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Account Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your notification preferences, privacy, and account data.</p>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="px-6 sm:px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Customize what alerts and summaries you receive.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="px-8 py-16 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading preferences...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {notifGroups.map((group, gIdx) => (
                            <div key={gIdx} className="p-6 sm:p-8">
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-6">{group.title}</h3>
                                <div className="space-y-6">
                                    {group.items.map((item) => (
                                        <label key={item.key} className="flex items-start sm:items-center justify-between gap-4 cursor-pointer group">
                                            <div className="flex-1">
                                                <p className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.label}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">{item.desc}</p>
                                            </div>
                                            <div className="relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-500/20 mt-1 sm:mt-0">
                                                <div className={`absolute inset-0 rounded-full transition-colors duration-300 ease-in-out ${notifPrefs[item.key] ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-[#313244]'}`} />
                                                <div className={`absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition-transform duration-300 ease-in-out ${notifPrefs[item.key] ? 'translate-x-7' : 'translate-x-0'}`} />
                                                <input type="checkbox" className="sr-only" checked={notifPrefs[item.key]} onChange={() => toggleNotif(item.key)} />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Legal & About */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Legal & Policies</h2>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            <button onClick={() => setModalOpen('terms')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Terms of Service</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                            </button>
                            <button onClick={() => setModalOpen('privacy')} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:text-amber-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-500/10 transition-colors">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Privacy Policy</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Info className="w-5 h-5 text-gray-400" /> App Info
                            </h2>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-md">2026.1.0</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">License</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">MIT License</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div>
                    <div className="bg-white dark:bg-[#181825] rounded-3xl border border-red-200 dark:border-red-500/20 shadow-sm overflow-hidden group hover:border-red-400 dark:hover:border-red-500/40 transition-colors">
                        <div className="px-6 py-6 border-b border-red-100 dark:border-red-500/10 bg-red-50 dark:bg-red-500/5 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-red-900 dark:text-red-400 mb-1">Danger Zone</h2>
                                <p className="text-sm text-red-700 dark:text-red-300/80 font-medium">Irreversible actions regarding your account data.</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-6">
                                Deleting your account will permanently remove all of your tracked skills, sessions, goals, achievements, and statistics from our servers. This action cannot be undone.
                            </p>
                            <button
                                onClick={() => setDeleteModalOpen(true)}
                                className="w-full sm:w-auto px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white border border-red-200 dark:border-red-500/20 hover:border-transparent font-bold rounded-xl transition-all shadow-sm"
                            >
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setDeleteModalOpen(false); setDeleteInput(''); }} />
                    <div className="relative bg-white dark:bg-[#181825] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-red-100 dark:border-red-500/10 bg-red-50 dark:bg-red-500/5">
                            <h3 className="text-lg font-black text-red-900 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Delete Account?
                            </h3>
                            <button onClick={() => { setDeleteModalOpen(false); setDeleteInput(''); }} className="p-2 rounded-xl text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 sm:p-8 space-y-6">
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                You are about to <strong className="text-red-600 dark:text-red-400">permanently delete</strong> your account. All data including skills, sessions, and achievements will be erased immediately.
                            </p>
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2">
                                    Type <span className="text-red-600 dark:text-red-400 select-all font-mono bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded">DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                    placeholder="DELETE"
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-[#1e1e2e] text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1e1e2e]/50 flex gap-3">
                            <button onClick={() => { setDeleteModalOpen(false); setDeleteInput(''); }} className="flex-1 px-4 py-3 bg-white dark:bg-[#272739] hover:bg-gray-100 border border-gray-200 dark:border-white/5 dark:hover:bg-[#313244] text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl transition-all shadow-sm">
                                Cancel
                            </button>
                            <button onClick={handleDeleteAccount} disabled={deleting || deleteInput !== 'DELETE'} className={`flex-1 px-4 py-3 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 ${deleteInput === 'DELETE' && !deleting ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-red-400 dark:bg-red-500/50 cursor-not-allowed opacity-50'}`}>
                                {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(null)} />
                    <div className="relative bg-white dark:bg-[#181825] rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">
                                {modalOpen === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                            </h3>
                            <button onClick={() => setModalOpen(null)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 sm:px-8 py-6 overflow-y-auto custom-scrollbar text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed space-y-6">
                            <p className="font-bold text-indigo-600 dark:text-indigo-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <div className="space-y-6">
                                {modalOpen === 'terms' ? (
                                    <>
                                        <div><h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">1. Acceptable Use</h4><p>You agree to use SkillSync solely for personal learning. Distributed harmful content is strictly prohibited.</p></div>
                                        <div><h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">2. Data Ownership</h4><p>Your learning data belongs to you. You may export or delete it at any point in time.</p></div>
                                        <div><h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">3. Uptime Guarantees</h4><p>We do our best to maintain 99.9% uptime, but we are not liable for incidental downtime or data loss.</p></div>
                                    </>
                                ) : (
                                    <>
                                        <div><h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">1. Data Collection</h4><p>We store your email, encrypted passwords, and anonymized metrics related to your tracked skills.</p></div>
                                        <div><h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">2. No Third-Party Sales</h4><p>We will never sell or rent your personal user data to third-party data brokers or advertisers.</p></div>
                                        <div><h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">3. Account Deletion</h4><p>When you trigger account deletion via the Danger Zone, your record is purged immediately.</p></div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1e1e2e]/50">
                            <button onClick={() => setModalOpen(null)} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm">
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;