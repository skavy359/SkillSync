import React, { useEffect, useState } from 'react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ActivityHeatmap from '../components/ui/ActivityHeatmap';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import {
    Lightbulb, Zap, Flame, Clock, TrendingUp, ArrowRight, Calendar,
    BookOpen, Check, AlertTriangle, Target, ArrowUpRight, Sparkles
} from 'lucide-react';
import { fetchDashboardStats, fetchBurnout } from "../services/dashboardService";
import { getMyStats, getMyStreak, getWeeklyStats } from "../services/profileService";
import { getMySkills, addSkill } from "../services/skillService";
import { getAllCategories } from "../services/categoryService";
import { createGoal } from "../services/goalService";

const GradientStatCard = ({ title, value, subtitle, icon: Icon, gradient, delay = 0, trend, trendValue }) => (
    <div 
        className="relative group overflow-hidden rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[#313244] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.85] dark:opacity-90`} />
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -ml-6 -mb-6" />
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                {trend === 'up' && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                        <TrendingUp className="w-3 h-3 text-white" />
                        <span className="text-xs font-semibold text-white">{trendValue}</span>
                    </div>
                )}
                {trend === 'neutral' && trendValue && (
                    <span className="text-xs font-medium text-white/80 bg-black/10 px-2 py-1 rounded-full">{trendValue}</span>
                )}
            </div>
            <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
            <p className="text-sm font-semibold text-white/90 mt-1">{title}</p>
            {subtitle && <p className="text-xs text-white/70 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

const Dashboard = ({ onNavigate, onSelectSkill }) => {
    const [learningStats, setLearningStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [streak, setStreak] = useState(null);
    const [burnout, setBurnout] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState(null);
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [recentSkills, setRecentSkills] = useState([]);
    const [recentSessions, setRecentSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showLogModal, setShowLogModal] = useState(false);
    const [allSkills, setAllSkills] = useState([]);
    const [logForm, setLogForm] = useState({ skillId: '', durationMinutes: '', notes: '', sessionDate: new Date().toISOString().split('T')[0] });
    const [logSubmitting, setLogSubmitting] = useState(false);

    const [showAddSkillModal, setShowAddSkillModal] = useState(false);
    const [dashboardCategories, setDashboardCategories] = useState([]);
    const [addSkillForm, setAddSkillForm] = useState({ name: '', categoryId: '', estimatedHours: '' });

    const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
    const [goalForm, setGoalForm] = useState({ skillId: '', targetDate: '' });
    const [goalSubmitting, setGoalSubmitting] = useState(false);
    const [addSkillSubmitting, setAddSkillSubmitting] = useState(false);
    
    const [showAddSkillSuccess, setShowAddSkillSuccess] = useState(false);
    const [validationError, setValidationError] = useState(false);
    const [showLogSessionSuccess, setShowLogSessionSuccess] = useState(false);
    const [showCreateGoalSuccess, setShowCreateGoalSuccess] = useState(false);

    const [userProfile, setUserProfile] = useState(null);

    const loadRecentSessions = async (skillList) => {
        try {
            const { fetchSessions } = await import('../services/sessionService');
            const allSessions = await Promise.all(
                skillList.slice(0, 10).map(async (skill) => {
                    try {
                        const sessions = await fetchSessions(skill.id);
                        return (Array.isArray(sessions) ? sessions : []).map(s => ({ ...s, skillName: skill.name }));
                    } catch { return []; }
                })
            );
            const flat = allSessions.flat().sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate)).slice(0, 5);
            setRecentSessions(flat);
        } catch { }
    };

    const getLatestSkillsBySession = async () => {
        try {
            const { fetchSessions } = await import('../services/sessionService');
            const skillsData = await getMySkills({ size: 100 });
            const skillList = skillsData?.content || [];

            const skillsWithLatestSession = await Promise.all(
                skillList.map(async (skill) => {
                    try {
                        const sessions = await fetchSessions(skill.id);
                        const sessionArray = Array.isArray(sessions) ? sessions : [];
                        if (sessionArray.length > 0) {
                            const latestSession = sessionArray.reduce((latest, session) => {
                                return new Date(session.sessionDate) > new Date(latest.sessionDate) ? session : latest;
                            });
                            return { ...skill, lastSessionDate: new Date(latestSession.sessionDate) };
                        }
                        return { ...skill, lastSessionDate: new Date(0) };
                    } catch (err) {
                        return { ...skill, lastSessionDate: new Date(0) };
                    }
                })
            );

            return skillsWithLatestSession
                .sort((a, b) => b.lastSessionDate - a.lastSessionDate)
                .slice(0, 4)
                .map(({ lastSessionDate, ...skill }) => skill);
        } catch (err) { return []; }
    };

    const buildWeeklyHeatmap = async (skillList) => {
        try {
            const { fetchSessions } = await import('../services/sessionService');
            const today = new Date();
            const days = {};
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                days[dateStr] = {
                    date: dateStr,
                    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    minutes: 0
                };
            }

            const allSessions = await Promise.all(
                skillList.slice(0, 15).map(async (skill) => {
                    try {
                        const sessions = await fetchSessions(skill.id);
                        return Array.isArray(sessions) ? sessions : [];
                    } catch { return []; }
                })
            );

            allSessions.flat().forEach(session => {
                if (session.sessionDate && days[session.sessionDate]) {
                    days[session.sessionDate].minutes += session.durationMinutes || 0;
                }
            });

            const heatmapData = Object.values(days).sort((a, b) => new Date(a.date) - new Date(b.date));
            setWeeklyActivity(heatmapData);
        } catch (err) { console.error('Failed to build weekly heatmap', err); }
    };

    useEffect(() => {
        import('../services/profileService').then(({ getMyProfile }) => {
            Promise.all([
                fetchDashboardStats().catch(() => null),
                getMyStats().catch(() => null),
                getMyStreak().catch(() => ({ currentStreak: 0, longestStreak: 0 })),
                fetchBurnout().catch(() => ({ riskLevel: 'LOW', weeklyMinutes: 0, monthlyMinutes: 0, ratio: 0 })),
                getWeeklyStats().catch(() => ({ totalMinutes: 0, totalSessions: 0, activeDays: 0 })),
                getLatestSkillsBySession().catch(() => []),
                getMyProfile().catch(() => null)
            ]).then(([learning, stats, streakData, burnoutData, weekly, latestSkills, profile]) => {
                setLearningStats(learning); setUserStats(stats); setStreak(streakData);
                setBurnout(burnoutData); setWeeklyStats(weekly); setRecentSkills(latestSkills);
                setUserProfile(profile);
                loadRecentSessions(latestSkills.length > 0 ? latestSkills : []);
                buildWeeklyHeatmap(latestSkills.length > 0 ? latestSkills : []);
            }).finally(() => setLoading(false));
        });
    }, []);

    useEffect(() => {
        if (showLogModal && allSkills.length === 0) getMySkills({ size: 50 }).then(data => setAllSkills(data?.content || [])).catch(() => {});
    }, [showLogModal]);

    useEffect(() => {
        if (showAddSkillModal && dashboardCategories.length === 0) getAllCategories().then(data => setDashboardCategories(Array.isArray(data) ? data : [])).catch(() => {});
    }, [showAddSkillModal]);

    useEffect(() => {
        if (showCreateGoalModal && allSkills.length === 0) getMySkills({ size: 50 }).then(data => setAllSkills(data?.content || [])).catch(() => {});
    }, [showCreateGoalModal]);

    const handleLogSession = async (e) => {
        e.preventDefault();
        if (!logForm.skillId || !logForm.durationMinutes) return;
        const duration = Number(logForm.durationMinutes);
        if (duration > 1440) return setValidationError(true);

        setLogSubmitting(true);
        try {
            const { addSession } = await import('../services/sessionService');
            await addSession(logForm.skillId, {
                durationMinutes: duration, notes: logForm.notes, sessionDate: logForm.sessionDate
            });
            setShowLogModal(false);
            setLogForm({ skillId: '', durationMinutes: '', notes: '', sessionDate: new Date().toISOString().split('T')[0] });
            setShowLogSessionSuccess(true);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            setTimeout(() => setShowLogSessionSuccess(false), 3000);
            
            fetchDashboardStats().then(setLearningStats).catch(() => {});
            getWeeklyStats().then(setWeeklyStats).catch(() => {});
            const skillList = allSkills.length > 0 ? allSkills : recentSkills;
            loadRecentSessions(skillList); buildWeeklyHeatmap(skillList);
        } catch (err) {} finally { setLogSubmitting(false); }
    };

    const handleAddSkill = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!addSkillForm.name) return alert('Please enter a skill name');

        setAddSkillSubmitting(true);
        try {
            await addSkill({
                name: addSkillForm.name,
                categoryId: addSkillForm.categoryId ? parseInt(addSkillForm.categoryId) : null,
                estimatedHours: addSkillForm.estimatedHours ? parseFloat(addSkillForm.estimatedHours) : null
            });
            setShowAddSkillModal(false);
            setAddSkillForm({ name: '', categoryId: '', estimatedHours: '' });
            setShowAddSkillSuccess(true);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            setTimeout(() => setShowAddSkillSuccess(false), 3000);

            fetchDashboardStats().then(setLearningStats).catch(() => {});
            getMyStats().then(setUserStats).catch(() => {});
            getLatestSkillsBySession().then(latestSkills => {
                setRecentSkills(latestSkills); loadRecentSessions(latestSkills); buildWeeklyHeatmap(latestSkills);
            }).catch(() => {});
        } catch (err) {} finally { setAddSkillSubmitting(false); }
    };

    const handleCreateGoal = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!goalForm.skillId || !goalForm.targetDate) return alert('Please fill in all required fields');

        setGoalSubmitting(true);
        try {
            await createGoal({ skillId: Number(goalForm.skillId), targetDate: goalForm.targetDate });
            setShowCreateGoalModal(false);
            setGoalForm({ skillId: '', targetDate: '' });
            setShowCreateGoalSuccess(true);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            setTimeout(() => setShowCreateGoalSuccess(false), 3000);
        } catch (err) { alert('Failed to create goal'); } finally { setGoalSubmitting(false); }
    };

    if (loading) {
        return (
            <div className="flex animate-pulse flex-col space-y-8 p-4">
                <div className="h-16 bg-gray-200 dark:bg-[#313244] rounded-2xl w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-[#313244] rounded-2xl"></div>)}
                </div>
            </div>
        );
    }

    const totalSkills = userStats?.totalSkills ?? learningStats?.totalSkills ?? 0;
    const activeSkills = userStats?.activeSkills ?? 0;
    const completedSkills = userStats?.completedSkills ?? 0;
    const currentStreak = streak?.currentStreak ?? 0;
    const longestStreak = streak?.longestStreak ?? 0;
    const weeklyMinutes = weeklyStats?.totalMinutes ?? burnout?.weeklyMinutes ?? 0;
    const weeklySessions = weeklyStats?.totalSessions ?? 0;
    const activeDays = weeklyStats?.activeDays ?? 0;
    const completionRate = userStats?.completionRate ?? 0;
    const riskLevel = burnout?.riskLevel ?? 'LOW';
    const avgMinutesPerSkill = learningStats?.avgMinutesPerSkill ?? 0;

    const getStreakMessage = () => {
        if (currentStreak >= longestStreak && currentStreak > 0) return 'Personal best! 🔥';
        if (currentStreak >= 7) return 'Incredible consistency!';
        if (currentStreak >= 3) return 'Nice momentum!';
        if (currentStreak >= 1) return 'Keep it going!';
        return 'Start a streak today!';
    };

    const getStreakTrend = () => {
        if (currentStreak >= longestStreak && currentStreak > 0) return 'up';
        if (currentStreak >= 3) return 'up';
        return 'neutral';
    };

    const getWeeklyMessage = () => {
        const hours = Math.round(weeklyMinutes / 60 * 10) / 10;
        if (weeklyMinutes === 0) return 'No sessions this week';
        if (activeDays >= 5) return `${activeDays} active days — amazing!`;
        if (weeklySessions > 0) return `${weeklySessions} sessions across ${activeDays} days`;
        return `${hours}h logged this week`;
    };

    const burnoutContent = (() => {
        const level = riskLevel.toLowerCase();
        if (level === 'high') return {
            title: 'System Overheat Detected', message: 'Your learning telemetry indicates extreme exhaustion. A cooldown period is highly recommended.',
            iconData: { color: 'text-rose-500', bg: 'bg-rose-500', glow: 'from-rose-500 to-red-600', hue: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]' }
        };
        if (level === 'medium') return {
            title: 'Maintaining Warp Speed', message: `You're pushing the engine hard. Consider minor maintenance breaks to sustain momentum.`,
            iconData: { color: 'text-amber-500', bg: 'bg-amber-500', glow: 'from-amber-400 to-orange-500', hue: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' }
        };
        return {
            title: `Optimal Cruising Altitude`, message: 'Your core learning engines are firing perfectly with highly sustainable efficiency rates.',
            iconData: { color: 'text-emerald-500', bg: 'bg-emerald-500', glow: 'from-emerald-400 to-teal-500', hue: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' }
        };
    })();

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const displayName = userProfile?.name?.split(' ')?.[0] || 'Learner';

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-lg text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl -mb-10"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Ready to learn something new?</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                        {greeting()}, {displayName}! 👋
                    </h1>
                    <p className="text-indigo-50 max-w-xl text-lg opacity-90">
                        {currentStreak > 0 
                            ? `You're on a ${currentStreak}-day streak! Keep up the brilliant momentum.` 
                            : 'Dive back in and start tracking your skill masteries today.'}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {showAddSkillSuccess && (
                    <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="font-medium text-green-800 dark:text-green-400">Skill added successfully!</p>
                    </div>
                )}
                {showLogSessionSuccess && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <p className="font-medium text-indigo-800 dark:text-indigo-400">Session logged successfully!</p>
                    </div>
                )}
                {showCreateGoalSuccess && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <p className="font-medium text-purple-800 dark:text-purple-400">Goal created successfully!</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GradientStatCard
                    title="Total Skills"
                    value={totalSkills}
                    subtitle={`${activeSkills} Active • ${completedSkills} Completed`}
                    icon={Lightbulb}
                    gradient="from-indigo-500 to-indigo-600"
                    delay={0}
                />
                <GradientStatCard
                    title="Active Skills"
                    value={activeSkills}
                    subtitle={recentSkills.length > 0 ? recentSkills.slice(0, 2).map(s => s.name).join(', ') : 'No Action'}
                    icon={Zap}
                    gradient="from-blue-500 to-cyan-600"
                    delay={100}
                />
                <GradientStatCard
                    title="Current Streak"
                    value={`${currentStreak} days`}
                    subtitle="Keep pushing limits!"
                    icon={Flame}
                    gradient="from-orange-400 to-red-500"
                    trend={getStreakTrend()}
                    trendValue={getStreakMessage()}
                    delay={200}
                />
                <GradientStatCard
                    title="Weekly Minutes"
                    value={`${weeklyMinutes}m`}
                    subtitle={getWeeklyMessage()}
                    icon={Clock}
                    gradient="from-emerald-400 to-teal-500"
                    delay={300}
                />
            </div>

            <Section title="Quick Actions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button onClick={() => setShowAddSkillModal(true)} className="group relative overflow-hidden rounded-[2rem] p-[1px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/50 hover:to-purple-500/50 transition-colors duration-500 cursor-pointer text-left">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                        <div className="relative h-full flex items-center p-6 bg-white/60 dark:bg-[#181825]/60 backdrop-blur-2xl rounded-[2rem] border border-white/50 dark:border-white/10 group-hover:bg-white/80 dark:group-hover:bg-[#181825]/80 transition-colors">
                            <div className="relative w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center mr-5 shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                <Lightbulb className="w-7 h-7 text-white relative z-10" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight mb-1">Add New Skill</h4>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Initialize a new learning trajectory</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => setShowLogModal(true)} className="group relative overflow-hidden rounded-[2rem] p-[1px] bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/50 hover:to-pink-500/50 transition-colors duration-500 cursor-pointer text-left">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                        <div className="relative h-full flex items-center p-6 bg-white/60 dark:bg-[#181825]/60 backdrop-blur-2xl rounded-[2rem] border border-white/50 dark:border-white/10 group-hover:bg-white/80 dark:group-hover:bg-[#181825]/80 transition-colors">
                            <div className="relative w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center mr-5 shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                <Clock className="w-7 h-7 text-white relative z-10" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight mb-1">Log Session</h4>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Record your temporal progress</p>
                            </div>
                        </div>
                    </button>

                    <button onClick={() => setShowCreateGoalModal(true)} className="group relative overflow-hidden rounded-[2rem] p-[1px] bg-gradient-to-br from-pink-500/20 to-rose-500/20 hover:from-pink-500/50 hover:to-rose-500/50 transition-colors duration-500 cursor-pointer text-left">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                        <div className="relative h-full flex items-center p-6 bg-white/60 dark:bg-[#181825]/60 backdrop-blur-2xl rounded-[2rem] border border-white/50 dark:border-white/10 group-hover:bg-white/80 dark:group-hover:bg-[#181825]/80 transition-colors">
                            <div className="relative w-14 h-14 rounded-2xl bg-pink-500 flex items-center justify-center mr-5 shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                <Target className="w-7 h-7 text-white relative z-10" />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight mb-1">Create Goal</h4>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Establish new target objectives</p>
                            </div>
                        </div>
                    </button>
                </div>
            </Section>

            <div className="relative group rounded-[2.5rem] bg-white/60 dark:bg-[#181825]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 overflow-hidden shadow-xl mt-8">
                <div className={`absolute -inset-1 blur-2xl opacity-20 ${burnoutContent.iconData.bg} pointer-events-none group-hover:opacity-40 transition-opacity duration-1000`} />
                
                <div className="relative z-10 p-8 sm:p-10 flex items-start flex-col md:flex-row gap-8">
                    <div className={`relative w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${burnoutContent.iconData.glow} p-[1px] shrink-0 ${burnoutContent.iconData.hue}`}>
                        <div className="absolute inset-0 bg-white/20 blur-xl" />
                        <div className="w-full h-full bg-white dark:bg-[#1e1e2e] rounded-[1.5rem] flex items-center justify-center relative z-10">
                            <TrendingUp className={`w-8 h-8 ${burnoutContent.iconData.color}`} />
                            <div className={`absolute top-0 right-0 w-3 h-3 rounded-full translate-x-1 -translate-y-1 ${burnoutContent.iconData.bg}`}>
                                <div className="absolute inset-0 rounded-full animate-ping bg-white opacity-40 mix-blend-overlay" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-3 space-x-3 mb-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{burnoutContent.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${burnoutContent.iconData.bg} shadow-sm`}>
                                    {riskLevel} Risk
                                </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed mb-6 max-w-2xl">{burnoutContent.message}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6 text-sm">
                            <div className="text-left relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-gray-200 dark:bg-white/10" />
                                <span className="block text-3xl font-black text-gray-900 dark:text-white">{Math.round(avgMinutesPerSkill)}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Avg min/skill</span>
                            </div>
                            <div className="text-left relative pl-2">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-gray-200 dark:bg-white/10" />
                                <span className="block text-3xl font-black text-gray-900 dark:text-white">{activeDays >= 6 ? 'Peak' : activeDays >= 4 ? 'Strong' : activeDays >= 2 ? 'Active' : 'Started'}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Consistency</span>
                            </div>
                            <div className="text-left pl-2">
                                <span className="block text-3xl font-black text-gray-900 dark:text-white">{Math.round(completionRate)}%</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Completion</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ActivityHeatmap title="Weekly Activity Trend" description="Your learning consistency over the last 7 days" data={weeklyActivity} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section title="Active Skills" action={<Button variant="ghost" size="sm" onClick={() => onNavigate('skills')}>View all <ArrowRight className="w-4 h-4 ml-1" /></Button>}>
                    <Card className="p-1">
                        <div className="flex flex-col">
                            {recentSkills.length > 0 ? (
                                recentSkills.map((skill, idx) => (
                                    <div key={skill.id} onClick={() => { onSelectSkill(skill.id); onNavigate('skill-detail'); }}
                                         className={`group relative p-5 hover:bg-gray-50 dark:hover:bg-[#272739]/50 transition-colors cursor-pointer ${idx !== recentSkills.length - 1 ? 'border-b border-gray-100 dark:border-[#313244]' : ''}`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-[#cdd6f4] mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{skill.name}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="primary" size="sm">{skill.level}</Badge>
                                                    <Badge variant={skill.status?.toLowerCase() === 'active' ? 'success' : 'default'} size="sm">{skill.status}</Badge>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{skill.progress}%</span>
                                                <span className="text-xs text-gray-400 dark:text-[#6c7086]">Mastery</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-black/20 rounded-full h-2 overflow-hidden">
                                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${skill.progress}%` }}></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-[#6c7086]">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-black/20 flex items-center justify-center mb-3">
                                        <Zap className="w-8 h-8 text-gray-300 dark:text-[#45475a]" />
                                    </div>
                                    <p className="text-base font-medium text-gray-600 dark:text-[#a6adc8]">No active skills</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Section>

                <Section title="Recent Sessions Log" action={<Button variant="ghost" size="sm" onClick={() => onNavigate('sessions')}>View all <ArrowRight className="w-4 h-4 ml-1" /></Button>}>
                    <Card className="p-1">
                        <div className="flex flex-col">
                            {recentSessions.length > 0 ? (
                                recentSessions.map((session, idx) => (
                                    <div key={session.id} className={`flex items-start space-x-4 p-5 hover:bg-gray-50 dark:hover:bg-[#272739]/50 transition-colors ${idx !== recentSessions.length - 1 ? 'border-b border-gray-100 dark:border-[#313244]' : ''}`}>
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 flex-shrink-0">
                                            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-base font-bold text-gray-900 dark:text-[#cdd6f4] truncate pr-2">{session.skillName}</h4>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300">
                                                    {session.durationMinutes} min
                                                </span>
                                            </div>
                                            {session.notes && <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-1.5 truncate">{session.notes}</p>}
                                            <div className="flex items-center text-xs font-semibold text-gray-400 dark:text-[#7f849c]">
                                                <Calendar className="w-3.5 h-3.5 mr-1" />
                                                {new Date(session.sessionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-[#6c7086]">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-black/20 flex items-center justify-center mb-3">
                                        <BookOpen className="w-8 h-8 text-gray-300 dark:text-[#45475a]" />
                                    </div>
                                    <p className="text-base font-medium text-gray-600 dark:text-[#a6adc8]">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Section>
            </div>

            <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="Log a Session" footer={<><Button variant="secondary" onClick={() => setShowLogModal(false)}>Cancel</Button><Button variant="primary" onClick={handleLogSession} disabled={logSubmitting}>{logSubmitting ? 'Logging...' : 'Log Session'}</Button></>}>
                <form onSubmit={handleLogSession} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a6adc8] mb-1">Skill</label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-[#45475a] dark:bg-[#1e1e2e] dark:text-[#cdd6f4] rounded-lg focus:ring-2 focus:ring-indigo-500" value={logForm.skillId} onChange={(e) => setLogForm({ ...logForm, skillId: e.target.value })} required>
                            <option value="">Select a skill</option>
                            {allSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Input label="Duration (minutes)" type="number" placeholder="e.g. 45" value={logForm.durationMinutes} onChange={(e) => setLogForm({ ...logForm, durationMinutes: e.target.value })} required min="1" max="1440" />
                    <Input label="Date" type="date" value={logForm.sessionDate} onChange={(e) => setLogForm({ ...logForm, sessionDate: e.target.value })} />
                    <Input label="Notes (optional)" type="text" placeholder="What did you work on?" value={logForm.notes} onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })} />
                </form>
            </Modal>

            <Modal isOpen={validationError} onClose={() => setValidationError(false)} title="Duration Exceeds Limit" footer={<Button variant="primary" onClick={() => setValidationError(false)}>Got it</Button>}>
                <div className="flex items-start space-x-4"><AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-gray-700 dark:text-[#a6adc8]">Session duration cannot exceed 24 hours (1440 minutes).</p></div>
            </Modal>

            <Modal isOpen={showAddSkillModal} onClose={() => setShowAddSkillModal(false)} title="Add New Skill" footer={<><Button variant="secondary" onClick={() => setShowAddSkillModal(false)}>Cancel</Button><Button variant="primary" onClick={handleAddSkill} disabled={addSkillSubmitting}>{addSkillSubmitting ? 'Adding...' : 'Add Skill'}</Button></>}>
                <form onSubmit={handleAddSkill} className="space-y-4">
                    <Input label="Skill Name" type="text" placeholder="e.g., React.js, Python" value={addSkillForm.name} onChange={(e) => setAddSkillForm({ ...addSkillForm, name: e.target.value })} required />
                    <Select label="Category (Optional)" value={addSkillForm.categoryId} onChange={(e) => setAddSkillForm({ ...addSkillForm, categoryId: e.target.value })} options={dashboardCategories.map(cat => ({ value: cat.id, label: cat.name }))} placeholder="Select a category" />
                    <Input label="Estimated Hours" type="number" placeholder="e.g., 50" value={addSkillForm.estimatedHours} onChange={(e) => setAddSkillForm({ ...addSkillForm, estimatedHours: e.target.value })} />
                </form>
            </Modal>

            <Modal isOpen={showCreateGoalModal} onClose={() => setShowCreateGoalModal(false)} title="Create Goal" footer={<><Button variant="secondary" onClick={() => setShowCreateGoalModal(false)}>Cancel</Button><Button variant="primary" onClick={handleCreateGoal} disabled={goalSubmitting}>{goalSubmitting ? 'Creating...' : 'Create Goal'}</Button></>}>
                <form onSubmit={handleCreateGoal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a6adc8] mb-1">Skill</label>
                        <select className="w-full px-3 py-2 border border-gray-300 dark:border-[#45475a] dark:bg-[#1e1e2e] dark:text-[#cdd6f4] rounded-lg focus:ring-2 focus:ring-indigo-500" value={goalForm.skillId} onChange={(e) => setGoalForm({ ...goalForm, skillId: e.target.value })} required>
                            <option value="">Select a skill</option>
                            {allSkills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Input label="Target Date" type="date" value={goalForm.targetDate} onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })} required />
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;