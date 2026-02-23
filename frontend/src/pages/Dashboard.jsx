import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import ActivityHeatmap from '../components/ui/ActivityHeatmap';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import FormRow from '../components/ui/FormRow';
import {
    Lightbulb,
    Zap,
    Flame,
    Clock,
    TrendingUp,
    Plus,
    ArrowRight,
    Calendar,
    BookOpen,
    Check,
    AlertTriangle,
    Target
} from 'lucide-react';
import { useEffect, useState } from "react";
import {
    fetchDashboardStats,
    fetchBurnout,
    fetchRecentSkills,
} from "../services/dashboardService";
import { getMyStats, getMyStreak, getWeeklyStats } from "../services/profileService";
import { getMySkills, addSkill } from "../services/skillService";
import { getAllCategories } from "../services/categoryService";
import { createGoal } from "../services/goalService";


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

    // Log Session Modal state
    const [showLogModal, setShowLogModal] = useState(false);
    const [allSkills, setAllSkills] = useState([]);
    const [logForm, setLogForm] = useState({
        skillId: '',
        durationMinutes: '',
        notes: '',
        sessionDate: new Date().toISOString().split('T')[0]
    });
    const [logSubmitting, setLogSubmitting] = useState(false);

    // Add Skill Modal state
    const [showAddSkillModal, setShowAddSkillModal] = useState(false);
    const [dashboardCategories, setDashboardCategories] = useState([]);
    const [addSkillForm, setAddSkillForm] = useState({
        name: '',
        level: 'Beginner',
        categoryId: '',
    });

    // Create Goal Modal state
    const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
    const [goalForm, setGoalForm] = useState({
        skillId: '',
        targetDate: ''
    });
    const [goalSubmitting, setGoalSubmitting] = useState(false);
    const [goalSuccessMessage, setGoalSuccessMessage] = useState('');
    const [addSkillSubmitting, setAddSkillSubmitting] = useState(false);
    const [showAddSkillSuccess, setShowAddSkillSuccess] = useState(false);
    const [validationError, setValidationError] = useState(false);

    // Helper: fetch recent sessions from all user skills
    const loadRecentSessions = async (skillList) => {
        try {
            const { fetchSessions } = await import('../services/sessionService');
            const allSessions = await Promise.all(
                skillList.slice(0, 10).map(async (skill) => {
                    try {
                        const sessions = await fetchSessions(skill.id);
                        return (Array.isArray(sessions) ? sessions : []).map(s => ({
                            ...s,
                            skillName: skill.name
                        }));
                    } catch { return []; }
                })
            );
            const flat = allSessions.flat()
                .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))
                .slice(0, 5);
            setRecentSessions(flat);
        } catch { }
    };

    // Helper: Get latest 4 skills by most recent session
    const getLatestSkillsBySession = async () => {
        try {
            const { fetchSessions } = await import('../services/sessionService');
            const skillsData = await getMySkills({ size: 100 });
            const skillList = skillsData?.content || [];

            // Get sessions for each skill and find most recent session date
            const skillsWithLatestSession = await Promise.all(
                skillList.map(async (skill) => {
                    try {
                        const sessions = await fetchSessions(skill.id);
                        const sessionArray = Array.isArray(sessions) ? sessions : [];
                        
                        if (sessionArray.length > 0) {
                            // Find most recent session date
                            const latestSession = sessionArray.reduce((latest, session) => {
                                const sessionDate = new Date(session.sessionDate);
                                return sessionDate > new Date(latest.sessionDate) ? session : latest;
                            });
                            return {
                                ...skill,
                                lastSessionDate: new Date(latestSession.sessionDate)
                            };
                        }
                        return {
                            ...skill,
                            lastSessionDate: new Date(0) // No sessions
                        };
                    } catch (err) {
                        return {
                            ...skill,
                            lastSessionDate: new Date(0)
                        };
                    }
                })
            );

            // Sort by most recent session date (descending) and take top 4
            const sortedSkills = skillsWithLatestSession
                .sort((a, b) => b.lastSessionDate - a.lastSessionDate)
                .slice(0, 4)
                .map(({ lastSessionDate, ...skill }) => skill); // Remove the helper field

            return sortedSkills;
        } catch (err) {
            console.error('Failed to get latest skills', err);
            return [];
        }
    };

    // Helper: build heatmap data from sessions
    const buildWeeklyHeatmap = async (skillList) => {
        try {
            const { fetchSessions } = await import('../services/sessionService');
            
            // Init 7 days
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

            // Fetch and aggregate sessions
            const allSessions = await Promise.all(
                skillList.slice(0, 15).map(async (skill) => {
                    try {
                        const sessions = await fetchSessions(skill.id);
                        return Array.isArray(sessions) ? sessions : [];
                    } catch { return []; }
                })
            );

            // Aggregate by date
            allSessions.flat().forEach(session => {
                if (session.sessionDate && days[session.sessionDate]) {
                    days[session.sessionDate].minutes += session.durationMinutes || 0;
                }
            });

            // Convert to array, sorted by date
            const heatmapData = Object.values(days).sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );
            setWeeklyActivity(heatmapData);
        } catch (err) {
            console.error('Failed to build weekly heatmap', err);
        }
    };

    useEffect(() => {
        Promise.all([
            fetchDashboardStats().catch(() => null),
            getMyStats().catch(() => null),
            getMyStreak().catch(() => ({ currentStreak: 0, longestStreak: 0 })),
            fetchBurnout().catch(() => ({ riskLevel: 'LOW', weeklyMinutes: 0, monthlyMinutes: 0, ratio: 0 })),
            getWeeklyStats().catch(() => ({ totalMinutes: 0, totalSessions: 0, activeDays: 0 })),
            getLatestSkillsBySession().catch(() => []),
        ]).then(([learning, stats, streakData, burnoutData, weekly, latestSkills]) => {
            setLearningStats(learning);
            setUserStats(stats);
            setStreak(streakData);
            setBurnout(burnoutData);
            setWeeklyStats(weekly);

            // Recent skills sorted by most recent session
            setRecentSkills(latestSkills);

            // Fetch recent sessions from all skills
            loadRecentSessions(latestSkills.length > 0 ? latestSkills : []);

            // Build weekly heatmap from sessions
            buildWeeklyHeatmap(latestSkills.length > 0 ? latestSkills : []);
        }).finally(() => setLoading(false));
    }, []);

    // Load skills list when log modal opens
    useEffect(() => {
        if (showLogModal && allSkills.length === 0) {
            getMySkills({ size: 50 }).then(data => {
                setAllSkills(data?.content || []);
            }).catch(() => { });
        }
    }, [showLogModal]);

    // Load categories when add skill modal opens
    useEffect(() => {
        if (showAddSkillModal && dashboardCategories.length === 0) {
            getAllCategories().then(data => {
                setDashboardCategories(Array.isArray(data) ? data : []);
            }).catch(() => { });
        }
    }, [showAddSkillModal]);

    // Load skills when create goal modal opens
    useEffect(() => {
        if (showCreateGoalModal && allSkills.length === 0) {
            getMySkills({ size: 50 }).then(data => {
                setAllSkills(data?.content || []);
            }).catch(() => { });
        }
    }, [showCreateGoalModal]);

    const handleLogSession = async (e) => {
        e.preventDefault();
        if (!logForm.skillId || !logForm.durationMinutes) return;
        
        const duration = Number(logForm.durationMinutes);
        if (duration > 1440) {
            setValidationError(true);
            return;
        }

        setLogSubmitting(true);
        try {
            const { addSession } = await import('../services/sessionService');
            await addSession(logForm.skillId, {
                durationMinutes: Number(logForm.durationMinutes),
                notes: logForm.notes,
                sessionDate: logForm.sessionDate
            });
            setShowLogModal(false);
            setLogForm({ skillId: '', durationMinutes: '', notes: '', sessionDate: new Date().toISOString().split('T')[0] });
            // Refresh data
            fetchDashboardStats().then(setLearningStats).catch(() => { });
            getWeeklyStats().then(setWeeklyStats).catch(() => { });
            // Refresh recent sessions and heatmap
            const skillList = allSkills.length > 0 ? allSkills : recentSkills;
            loadRecentSessions(skillList);
            buildWeeklyHeatmap(skillList);
        } catch (err) {
            console.error("Log session failed", err);
        } finally {
            setLogSubmitting(false);
        }
    };

    const handleAddSkill = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!addSkillForm.name) {
            alert('Please enter a skill name');
            return;
        }

        setAddSkillSubmitting(true);
        try {
            const newSkill = await addSkill({
                name: addSkillForm.name,
                level: addSkillForm.level.toUpperCase(),
                categoryId: addSkillForm.categoryId ? parseInt(addSkillForm.categoryId) : null
            });
            
            setShowAddSkillModal(false);
            setAddSkillForm({ name: '', level: 'Beginner', categoryId: '' });
            setShowAddSkillSuccess(true);
            setTimeout(() => {
                setShowAddSkillSuccess(false);
            }, 3000);
            
            // Refresh data
            fetchDashboardStats().then(setLearningStats).catch(() => { });
            getMyStats().then(setUserStats).catch(() => { });
            
            // Refresh recent skills sorted by latest session
            getLatestSkillsBySession().then(latestSkills => {
                setRecentSkills(latestSkills);
                loadRecentSessions(latestSkills);
                buildWeeklyHeatmap(latestSkills);
            }).catch(() => { });
        } catch (err) {
            console.error("Add skill failed", err);
        } finally {
            setAddSkillSubmitting(false);
        }
    };

    const handleCreateGoal = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        if (!goalForm.skillId || !goalForm.targetDate) {
            alert('Please fill in all required fields');
            return;
        }

        setGoalSubmitting(true);
        try {
            const newGoal = await createGoal({
                skillId: Number(goalForm.skillId),
                targetDate: goalForm.targetDate
            });

            setGoalForm({ skillId: '', targetDate: '' });
            setGoalSuccessMessage('Goal created successfully!');
            setTimeout(() => {
                setGoalSuccessMessage('');
                setShowCreateGoalModal(false);
            }, 2000);
        } catch (err) {
            console.error("Create goal failed", err);
            alert('Failed to create goal: ' + (err.response?.data?.message || err.message));
        } finally {
            setGoalSubmitting(false);
        }
    };

    const burnoutColor = {
        low: 'success',
        medium: 'warning',
        high: 'danger'
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading dashboard...</div>;
    }

    // Computed values with safe fallbacks
    const totalSkills = userStats?.totalSkills ?? learningStats?.totalSkills ?? 0;
    const activeSkills = userStats?.activeSkills ?? 0;
    const completedSkills = userStats?.completedSkills ?? 0;
    const currentStreak = streak?.currentStreak ?? 0;
    const longestStreak = streak?.longestStreak ?? 0;
    const weeklyMinutes = weeklyStats?.totalMinutes ?? burnout?.weeklyMinutes ?? 0;
    const weeklySessions = weeklyStats?.totalSessions ?? 0;
    const activeDays = weeklyStats?.activeDays ?? 0;
    const totalSessions = learningStats?.totalSessions ?? 0;
    const totalMinutes = learningStats?.totalMinutes ?? 0;
    const avgMinutesPerSkill = learningStats?.avgMinutesPerSkill ?? 0;
    const completionRate = userStats?.completionRate ?? 0;
    const riskLevel = burnout?.riskLevel ?? 'LOW';

    // Dynamic streak message
    const getStreakMessage = () => {
        if (currentStreak >= longestStreak && currentStreak > 0) return 'New personal best! 🔥';
        if (currentStreak >= 7) return 'Incredible consistency!';
        if (currentStreak >= 3) return 'Nice momentum!';
        if (currentStreak >= 1) return 'Keep it going!';
        return 'Start a new streak today!';
    };

    // Dynamic streak trend
    const getStreakTrend = () => {
        if (currentStreak >= longestStreak && currentStreak > 0) return 'up';
        if (currentStreak >= 3) return 'up';
        return 'neutral';
    };

    // Dynamic weekly message
    const getWeeklyMessage = () => {
        const hours = Math.round(weeklyMinutes / 60 * 10) / 10;
        if (weeklyMinutes === 0) return 'No sessions yet this week';
        if (activeDays >= 5) return `${activeDays} active days — amazing!`;
        if (weeklySessions > 0) return `${weeklySessions} sessions across ${activeDays} days`;
        return `${hours}h logged this week`;
    };

    // Dynamic burnout card content
    const getBurnoutContent = () => {
        const level = riskLevel.toLowerCase();
        if (level === 'high') return {
            title: 'Take it easy!',
            message: 'Your learning pace is intense. Consider taking a break to avoid burnout.',
            gradient: 'from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10',
            border: 'border-red-200 dark:border-red-500/20'
        };
        if (level === 'medium') return {
            title: 'Good pace, stay balanced',
            message: 'You\'re pushing hard — remember to take breaks between sessions.',
            gradient: 'from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10',
            border: 'border-yellow-200 dark:border-yellow-500/20'
        };
        return {
            title: 'You\'re doing great!',
            message: 'Your learning pace is healthy and sustainable. Keep up the excellent work!',
            gradient: 'from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10',
            border: 'border-green-200 dark:border-green-500/20'
        };
    };

    const burnoutContent = getBurnoutContent();

    // Consistency label
    const getConsistency = () => {
        if (activeDays >= 6) return 'Excellent';
        if (activeDays >= 4) return 'Strong';
        if (activeDays >= 2) return 'Building';
        return 'Getting started';
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's your learning overview."
                action={false}
            />

            {/* Success Notification */}
            {showAddSkillSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Skill added successfully!</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Skills"
                    value={totalSkills}
                    icon={Lightbulb}
                    color="indigo"
                    subtitle={`${activeSkills} active • ${completedSkills} completed`}
                />
                <StatCard
                    title="Active Skills"
                    value={activeSkills}
                    icon={Zap}
                    color="blue"
                    subtitle={recentSkills.length > 0
                        ? recentSkills.slice(0, 2).map(s => s.name).join(', ')
                        : 'No active skills yet'}
                />
                <StatCard
                    title="Current Streak"
                    value={`${currentStreak} days`}
                    icon={Flame}
                    color="orange"
                    trend={getStreakTrend()}
                    trendValue={getStreakMessage()}
                />
                <StatCard
                    title="Weekly Minutes"
                    value={`${weeklyMinutes} min`}
                    icon={Clock}
                    color="green"
                    subtitle={getWeeklyMessage()}
                />
            </div>

            {/* Burnout / Progress Card */}
            <Card className={`p-6 bg-gradient-to-br ${burnoutContent.gradient} ${burnoutContent.border}`}>
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/60 dark:bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">{burnoutContent.title}</h3>
                            <Badge variant={burnoutColor[riskLevel.toLowerCase()]} size="sm">
                                {riskLevel} RISK
                            </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-[#9399b2] mb-3">{burnoutContent.message}</p>
                        <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center text-gray-700 dark:text-[#a6adc8]">
                                <span className="font-medium">Avg per skill:</span>
                                <span className="ml-2">{Math.round(avgMinutesPerSkill)} min</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-[#a6adc8]">
                                <span className="font-medium">Consistency:</span>
                                <span className="ml-2">{getConsistency()}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-[#a6adc8]">
                                <span className="font-medium">Completion:</span>
                                <span className="ml-2">{Math.round(completionRate)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Activity Heatmap */}
            <ActivityHeatmap
                title="Weekly Activity"
                description="Your learning activity this week"
                data={weeklyActivity}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Skills */}
                <Section
                    title="Recent Skills"
                    action={
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onNavigate('skills')}
                        >
                            View all
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    }
                >
                    <Card className="p-4">
                        <div className="space-y-4">
                            {recentSkills.length > 0 ? (
                                recentSkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        onClick={() => {
                                            onSelectSkill(skill.id);
                                            onNavigate('skill-detail');
                                        }}
                                        className="p-4 bg-gray-50 dark:bg-[#181825] rounded-xl hover:bg-gray-100 dark:hover:bg-[#272739] transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">{skill.name}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <Badge variant="primary" size="sm">{skill.level}</Badge>
                                                    <Badge
                                                        variant={skill.status?.toLowerCase() === 'active' ? 'success' : 'default'}
                                                        size="sm"
                                                    >
                                                        {skill.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">{skill.progress}%</span>
                                        </div>
                                        <ProgressBar progress={skill.progress} size="sm" />
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center py-8 text-gray-400 dark:text-[#6c7086]">
                                    <Lightbulb className="w-10 h-10 mb-2" />
                                    <p className="text-sm font-medium">No skills yet</p>
                                    <p className="text-xs mt-1">Add your first skill to get started</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Section>

                {/* Recent Sessions */}
                <Section
                    title="Recent Sessions"
                    action={
                        <Button variant="ghost" size="sm" onClick={() => onNavigate('sessions')}>
                            View all
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    }
                >
                    <Card className="p-4">
                        <div className="space-y-3">
                            {recentSessions.length > 0 ? (
                                recentSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-start space-x-3 p-3 rounded-lg"
                                    >
                                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{session.skillName}</h4>
                                                <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">{session.durationMinutes}m</span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-[#9399b2] mb-1">{session.notes}</p>
                                            <div className="flex items-center text-xs text-gray-500 dark:text-[#7f849c]">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {session.sessionDate}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center py-8 text-gray-400 dark:text-[#6c7086]">
                                    <BookOpen className="w-10 h-10 mb-2" />
                                    <p className="text-sm font-medium">No sessions logged yet</p>
                                    <p className="text-xs mt-1">Log your first session to track progress</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </Section>
            </div>

            {/* Quick Actions */}
            <Section title="Quick Actions">
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            icon={Lightbulb}
                            onClick={() => setShowAddSkillModal(true)}
                        >
                            Add New Skill
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth
                            icon={Clock}
                            onClick={() => setShowLogModal(true)}
                        >
                            Log Session
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth
                            icon={Target}
                            onClick={() => setShowCreateGoalModal(true)}
                        >
                            Create Goal
                        </Button>
                    </div>
                </Card>
            </Section>

            {/* Log Session Modal */}
            <Modal
                isOpen={showLogModal}
                onClose={() => setShowLogModal(false)}
                title="Log a Session"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowLogModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleLogSession} disabled={logSubmitting}>
                            {logSubmitting ? 'Logging...' : 'Log Session'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleLogSession} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a6adc8] mb-1">Skill</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={logForm.skillId}
                            onChange={(e) => setLogForm({ ...logForm, skillId: e.target.value })}
                            required
                        >
                            <option value="">Select a skill</option>
                            {allSkills.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Duration (minutes)"
                        type="number"
                        placeholder="e.g. 45"
                        value={logForm.durationMinutes}
                        onChange={(e) => setLogForm({ ...logForm, durationMinutes: e.target.value })}
                        required
                        min="1"
                        max="1440"
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={logForm.sessionDate}
                        onChange={(e) => setLogForm({ ...logForm, sessionDate: e.target.value })}
                    />
                    <Input
                        label="Notes (optional)"
                        type="text"
                        placeholder="What did you work on?"
                        value={logForm.notes}
                        onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                    />
                </form>
            </Modal>

            {/* Validation Error Modal */}
            <Modal
                isOpen={validationError}
                onClose={() => setValidationError(false)}
                title="Duration Exceeds Limit"
                footer={
                    <Button variant="primary" onClick={() => setValidationError(false)}>
                        Got it
                    </Button>
                }
            >
                <div className="flex items-start space-x-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                        Session duration cannot exceed 24 hours (1440 minutes). Please enter a shorter duration.
                    </p>
                </div>
            </Modal>

            {/* Add Skill Modal */}
            <Modal
                isOpen={showAddSkillModal}
                onClose={() => setShowAddSkillModal(false)}
                title="Add New Skill"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowAddSkillModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddSkill} disabled={addSkillSubmitting}>
                            {addSkillSubmitting ? 'Adding...' : 'Add Skill'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleAddSkill} className="space-y-4">
                    <Input
                        label="Skill Name"
                        type="text"
                        placeholder="e.g., React.js, Python, Guitar"
                        value={addSkillForm.name}
                        onChange={(e) => setAddSkillForm({ ...addSkillForm, name: e.target.value })}
                        required
                    />

                    <FormRow columns={2} gap={4}>
                        <Select
                            label="Level"
                            value={addSkillForm.level}
                            onChange={(e) => setAddSkillForm({ ...addSkillForm, level: e.target.value })}
                            options={['Beginner', 'Intermediate', 'Advanced']}
                        />

                        <Select
                            label="Category"
                            value={addSkillForm.categoryId}
                            onChange={(e) => setAddSkillForm({ ...addSkillForm, categoryId: e.target.value })}
                            options={dashboardCategories.map(cat => ({ value: cat.id, label: cat.name }))}
                            placeholder="Select a category"
                        />
                    </FormRow>
                </form>
            </Modal>

            {/* Create Goal Modal */}
            <Modal
                isOpen={showCreateGoalModal}
                onClose={() => setShowCreateGoalModal(false)}
                title="Create Goal"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowCreateGoalModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleCreateGoal} disabled={goalSubmitting}>
                            {goalSubmitting ? 'Creating...' : 'Create Goal'}
                        </Button>
                    </>
                }
            >
                {goalSuccessMessage && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-300">{goalSuccessMessage}</p>
                    </div>
                )}
                <form onSubmit={handleCreateGoal} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a6adc8] mb-1">Skill</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={goalForm.skillId}
                            onChange={(e) => setGoalForm({ ...goalForm, skillId: e.target.value })}
                            required
                        >
                            <option value="">Select a skill</option>
                            {allSkills.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Target Date"
                        type="date"
                        value={goalForm.targetDate}
                        onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                        required
                    />
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;