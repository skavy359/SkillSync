import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import BarChartCard from '../components/ui/BarChartCard';
import {
    Flame,
    TrendingUp,
    Target,
    AlertTriangle,
    Clock,
    Award,
    Zap,
    CheckCircle,
    Brain,
    BookOpen,
    CalendarDays,
    Activity,
    Sparkles
} from 'lucide-react';
import { getMyStreak, getBurnoutRisk, getMyLearningStats } from "../services/profileService";
import { getCategoryAnalytics } from "../services/categoryService";
import { getGoalAnalytics } from "../services/goalService";
import { getMySkills } from "../services/skillService";


const GradientStatCard = ({ title, value, subtitle, icon: Icon, gradient, iconColor }) => (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-[#313244] p-5 bg-gradient-to-br ${gradient}`}>
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 -mt-4 -mr-4">
            <Icon className="w-full h-full" />
        </div>
        <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconColor}`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4]">{value}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-[#9399b2] mt-0.5">{title}</p>
            {subtitle && <p className="text-xs text-gray-500 dark:text-[#7f849c] mt-1">{subtitle}</p>}
        </div>
    </div>
);

const RingChart = ({ percentage, color, size = 80, strokeWidth = 6 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
                className="text-gray-200 dark:text-[#313244]" />
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                className="transition-all duration-1000 ease-out" />
        </svg>
    );
};

const Analytics = () => {
    const [streak, setStreak] = useState(null);
    const [burnout, setBurnout] = useState(null);
    const [learningStats, setLearningStats] = useState(null);
    const [goals, setGoals] = useState([]);
    const [topSkills, setTopSkills] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [completionRate, setCompletionRate] = useState(0);
    const [allSkills, setAllSkills] = useState([]);

    useEffect(() => {
        getMyStreak()
            .then(setStreak)
            .catch(() => setStreak({ currentStreak: 0, longestStreak: 0 }));
        
        getBurnoutRisk()
            .then(setBurnout)
            .catch(() => setBurnout({ riskLevel: 'LOW', weeklyMinutes: 0, monthlyMinutes: 0, ratio: 0 }));
        
        getMyLearningStats()
            .then(setLearningStats)
            .catch(() => setLearningStats({ totalMinutes: 0, weeklyMinutes: 0, avgMinutesPerSkill: 0, totalSessions: 0 }));
        
        getGoalAnalytics()
            .then(data => setGoals(Array.isArray(data) ? data : []))
            .catch(() => setGoals([]));
        
        getMySkills({ size: 5 })
            .then(data => {
                if (data?.content) {
                    setTopSkills(data.content.map(s => ({ name: s.name, totalMinutes: s.totalMinutes || 0 })));
                }
            })
            .catch(() => setTopSkills([]));
        
        getCategoryAnalytics()
            .then(data => setCategoryStats(Array.isArray(data) ? data : []))
            .catch(() => setCategoryStats([]));

        getMySkills({ size: 100 })
            .then(data => {
                if (data?.content) {
                    setAllSkills(data.content);
                    const completed = data.content.filter(s => s.status === 'COMPLETED').length;
                    setCompletionRate(data.content.length > 0 ? Math.round((completed / data.content.length) * 100) : 0);
                }
            })
            .catch(() => setCompletionRate(0));
    }, []);

    const calculateMetrics = () => {
        if (!burnout || !goals || goals.length === 0) {
            return { velocity: 0, eta: null, activeGoal: null };
        }
        const weeklyHours = parseFloat(((burnout.weeklyMinutes || 0) / 60).toFixed(1));
        const activeGoal = goals.find(g => g.progress < 100);
        let eta = null;
        if (activeGoal && activeGoal.daysLeft > 0) {
            eta = (activeGoal.daysLeft / 7).toFixed(1);
        }
        return { velocity: weeklyHours, eta, activeGoal };
    };

    const generateInsights = () => {
        const insights = [];

        if (streak.currentStreak >= 14) {
            insights.push({ icon: Flame, title: 'Excellent Consistency', message: `Amazing ${streak.currentStreak}-day streak! You're building powerful learning habits.`, color: 'indigo' });
        } else if (streak.currentStreak >= 7) {
            insights.push({ icon: Flame, title: 'Good Progress', message: `Your ${streak.currentStreak}-day streak shows solid commitment. Push for 2 weeks!`, color: 'blue' });
        } else if (streak.currentStreak > 0) {
            insights.push({ icon: Flame, title: 'Building Momentum', message: `${streak.currentStreak}-day streak started! Keep logging daily to build habits.`, color: 'yellow' });
        } else {
            insights.push({ icon: Flame, title: 'Start Your Journey', message: 'Log your first session today to begin building your streak!', color: 'blue' });
        }

        if (completionRate >= 75) {
            insights.push({ icon: CheckCircle, title: 'Mastery Progress', message: `${completionRate}% skills completed! Impressive trajectory.`, color: 'green' });
        } else if (completionRate >= 50) {
            insights.push({ icon: Target, title: 'Solid Achievement', message: `${completionRate}% skills completed. Keep pushing to expert level.`, color: 'blue' });
        } else if (completionRate > 0) {
            insights.push({ icon: Target, title: 'Skills in Progress', message: `${completionRate}% complete. Focus on finishing current skills.`, color: 'yellow' });
        }

        const weeklyMin = burnout?.weeklyMinutes || 0;
        if (weeklyMin >= 300) {
            insights.push({ icon: Zap, title: 'Exceptional Dedication', message: `${weeklyMin} min/week — outstanding time investment!`, color: 'indigo' });
        } else if (weeklyMin >= 180) {
            insights.push({ icon: Zap, title: 'Optimal Learning Pace', message: `${weeklyMin} min/week — perfect for sustainable growth.`, color: 'green' });
        } else if (weeklyMin >= 60) {
            insights.push({ icon: Zap, title: 'Increase Time Investment', message: `${weeklyMin} min/week. Aim for 180+ min for faster progress.`, color: 'yellow' });
        } else if (weeklyMin > 0) {
            insights.push({ icon: Zap, title: 'Boost Your Learning', message: `Only ${weeklyMin} min this week. Try 30 min/day for better results.`, color: 'yellow' });
        }

        if (burnout?.riskLevel === 'HIGH') {
            insights.push({ icon: AlertTriangle, title: 'Take a Break', message: 'Activity dropped significantly. Rest and recharge!', color: 'red' });
        } else if (burnout?.riskLevel === 'MEDIUM') {
            insights.push({ icon: AlertTriangle, title: 'Balance Your Schedule', message: 'Learning is inconsistent. Schedule regular sessions.', color: 'yellow' });
        } else if (burnout?.riskLevel === 'LOW') {
            insights.push({ icon: Award, title: 'Healthy Balance', message: 'Sustainable and healthy learning habits. Keep it up!', color: 'green' });
        }

        return insights;
    };

    const calculateBurnoutMetrics = () => {
        if (!burnout || !learningStats) {
            return { consistency: 0, intensity: 0, recovery: 0 };
        }
        const consistency = Math.min(100, Math.round(burnout.ratio * 100));
        const safeMin = 180, safeMax = 420;
        let intensity;
        if (burnout.weeklyMinutes < safeMin) intensity = Math.round((burnout.weeklyMinutes / safeMin) * 100);
        else if (burnout.weeklyMinutes > safeMax) intensity = Math.round((safeMax / burnout.weeklyMinutes) * 100);
        else intensity = 100;
        intensity = Math.max(0, Math.min(100, intensity));

        const avgSessionMin = learningStats.avgMinutesPerSkill || 0;
        let recovery = 75;
        if (avgSessionMin < 120 && streak?.currentStreak <= 14) recovery = 85;
        else if (avgSessionMin > 180) recovery = 50;

        return { consistency, intensity, recovery };
    };

    if (!streak || !burnout || !learningStats) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const metrics = calculateMetrics();
    const burnoutMetrics = calculateBurnoutMetrics();
    const insights = generateInsights();

    // Computed stats
    const totalHours = Math.round(learningStats.totalMinutes / 60);
    const avgSessionLen = learningStats.totalSessions > 0 ? Math.round(learningStats.totalMinutes / learningStats.totalSessions) : 0;
    const activeSkills = allSkills.filter(s => s.status === 'ACTIVE').length;
    const completedSkills = allSkills.filter(s => s.status === 'COMPLETED').length;

    // Best skill by time
    const bestSkill = topSkills.length > 0 ? topSkills.reduce((a, b) => a.totalMinutes > b.totalMinutes ? a : b) : null;

    // Category with most time
    const bestCategory = categoryStats.length > 0
        ? categoryStats.reduce((a, b) => (a.totalMinutes || 0) > (b.totalMinutes || 0) ? a : b)
        : null;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analytics"
                description="Deep insights into your learning progress and patterns"
                action={false}
            />

            {/* Key Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GradientStatCard
                    title="Current Streak"
                    value={`${streak.currentStreak} days`}
                    subtitle={`Best: ${streak.longestStreak} days`}
                    icon={Flame}
                    gradient="from-orange-50 to-amber-50 dark:from-orange-500/5 dark:to-amber-500/5"
                    iconColor="bg-gradient-to-br from-orange-500 to-amber-500"
                />
                <GradientStatCard
                    title="Total Study Time"
                    value={`${totalHours}h`}
                    subtitle={`${burnout.weeklyMinutes} min this week`}
                    icon={Clock}
                    gradient="from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5"
                    iconColor="bg-gradient-to-br from-blue-500 to-indigo-500"
                />
                <GradientStatCard
                    title="Sessions Logged"
                    value={learningStats.totalSessions}
                    subtitle={`Avg ${avgSessionLen} min/session`}
                    icon={Activity}
                    gradient="from-green-50 to-emerald-50 dark:from-green-500/5 dark:to-emerald-500/5"
                    iconColor="bg-gradient-to-br from-green-500 to-emerald-500"
                />
                <GradientStatCard
                    title="Skills Progress"
                    value={`${completedSkills}/${allSkills.length}`}
                    subtitle={`${completionRate}% completed`}
                    icon={Brain}
                    gradient="from-purple-50 to-pink-50 dark:from-purple-500/5 dark:to-pink-500/5"
                    iconColor="bg-gradient-to-br from-purple-500 to-pink-500"
                />
            </div>

            {/* Learning Overview + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Learning Velocity / Burnout */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Burnout Analysis */}
                    <Card className="p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-500" />
                                <h3 className="text-base font-bold text-gray-900 dark:text-[#cdd6f4]">Learning Health</h3>
                            </div>
                            <Badge
                                variant={burnout.riskLevel === "HIGH" ? "danger" : burnout.riskLevel === "MEDIUM" ? "warning" : "success"}
                                size="sm"
                            >
                                {burnout.riskLevel} RISK
                            </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: 'Consistency', value: burnoutMetrics.consistency, color: '#10b981', desc: burnoutMetrics.consistency >= 75 ? 'Regular practice' : 'Variable schedule' },
                                { label: 'Intensity', value: burnoutMetrics.intensity, color: '#6366f1', desc: burnoutMetrics.intensity >= 80 ? 'Well balanced' : 'Needs adjustment' },
                                { label: 'Recovery', value: burnoutMetrics.recovery, color: '#3b82f6', desc: burnoutMetrics.recovery >= 75 ? 'Good rest balance' : 'Rest more' },
                            ].map(m => (
                                <div key={m.label} className="text-center">
                                    <div className="relative inline-flex items-center justify-center mb-2">
                                        <RingChart percentage={m.value} color={m.color} />
                                        <span className="absolute text-sm font-black text-gray-900 dark:text-[#cdd6f4]">{m.value}%</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{m.label}</p>
                                    <p className="text-[11px] text-gray-500 dark:text-[#7f849c]">{m.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className={`mt-4 p-3 rounded-xl text-sm ${
                            burnout.riskLevel === 'HIGH' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
                            burnout.riskLevel === 'MEDIUM' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                            'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                        }`}>
                            {burnout.riskLevel === 'HIGH'
                                ? '⚠️ Activity dropped significantly. Take a break and resume when ready.'
                                : burnout.riskLevel === 'MEDIUM'
                                ? '🔄 Learning intensity varies. Try to maintain a more consistent schedule.'
                                : '✅ Your learning habits are sustainable and healthy. Keep it up!'}
                        </div>
                    </Card>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BarChartCard
                            title="Top Skills by Time"
                            description="Hours logged per skill"
                            data={topSkills.length > 0 ? topSkills.map(skill => ({
                                label: skill.name,
                                value: +(skill.totalMinutes / 60).toFixed(1),
                                unit: "h"
                            })) : [{ label: 'No data yet', value: 0, unit: 'h' }]}
                            color="indigo"
                        />
                        <BarChartCard
                            title="Category Distribution"
                            description="Time by category"
                            data={categoryStats.length > 0 && categoryStats.some(cat => cat.totalMinutes > 0)
                                ? categoryStats.filter(cat => cat.totalMinutes > 0).map(cat => ({
                                    label: cat.categoryName || cat.name || 'Uncategorized',
                                    value: +((cat.totalMinutes || 0) / 60).toFixed(1),
                                    unit: "h"
                                }))
                                : [{ label: 'No data yet', value: 0, unit: 'h' }]}
                            color="purple"
                        />
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Quick Highlights */}
                    <Card className="p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" /> Highlights
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-xl">
                                <div>
                                    <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">Learning Velocity</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-[#cdd6f4]">{metrics.velocity}h/week</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
                            </div>

                            {bestSkill && (
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-xl">
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Most Studied</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">{bestSkill.name}</p>
                                        <p className="text-xs text-gray-400">{(bestSkill.totalMinutes / 60).toFixed(1)}h total</p>
                                    </div>
                                    <BookOpen className="w-6 h-6 text-blue-400 opacity-50" />
                                </div>
                            )}

                            {bestCategory && bestCategory.totalMinutes > 0 && (
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl">
                                    <div>
                                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Top Category</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">{bestCategory.categoryName || bestCategory.name}</p>
                                        <p className="text-xs text-gray-400">{((bestCategory.totalMinutes || 0) / 60).toFixed(1)}h total</p>
                                    </div>
                                    <Target className="w-6 h-6 text-green-400 opacity-50" />
                                </div>
                            )}

                            {metrics.activeGoal && (
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-xl">
                                    <div>
                                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Active Goal</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">{metrics.activeGoal.skillName}</p>
                                        <p className="text-xs text-gray-400">{metrics.activeGoal.progress}% • {metrics.activeGoal.daysLeft}d left</p>
                                    </div>
                                    <Target className="w-6 h-6 text-amber-400 opacity-50" />
                                </div>
                            )}

                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 rounded-xl">
                                <div>
                                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Streak Status</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-[#cdd6f4]">🔥 {streak.currentStreak}</p>
                                    <p className="text-xs text-gray-400">Best: {streak.longestStreak} days</p>
                                </div>
                                <Flame className="w-8 h-8 text-orange-400 opacity-50" />
                            </div>
                        </div>
                    </Card>

                    {/* Goals Progress */}
                    {goals.length > 0 && (
                        <Card className="p-5">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-blue-500" /> Goals Progress
                            </h3>
                            <div className="space-y-3">
                                {goals.slice(0, 4).map((g, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-medium text-gray-700 dark:text-[#a6adc8] truncate">{g.skillName}</p>
                                            <span className="text-xs font-bold text-gray-500">{g.progress}%</span>
                                        </div>
                                        <ProgressBar progress={g.progress} color={g.progress >= 75 ? 'green' : g.progress >= 50 ? 'blue' : 'indigo'} size="sm" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Insights */}
            <Section title="Insights & Recommendations">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, index) => {
                        const colorMap = {
                            indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-900 dark:text-indigo-300', sub: 'text-indigo-700 dark:text-indigo-400', icon: 'text-indigo-600 dark:text-indigo-400' },
                            blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-900 dark:text-blue-300', sub: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-600 dark:text-blue-400' },
                            green: { bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-900 dark:text-green-300', sub: 'text-green-700 dark:text-green-400', icon: 'text-green-600 dark:text-green-400' },
                            yellow: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-900 dark:text-yellow-300', sub: 'text-yellow-700 dark:text-yellow-400', icon: 'text-yellow-600 dark:text-yellow-400' },
                            red: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-900 dark:text-red-300', sub: 'text-red-700 dark:text-red-400', icon: 'text-red-600 dark:text-red-400' },
                        };
                        const c = colorMap[insight.color] || colorMap.blue;
                        const Icon = insight.icon;
                        return (
                            <div key={index} className={`flex items-start gap-3 p-4 ${c.bg} rounded-xl`}>
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                                    <Icon className={`w-5 h-5 ${c.icon}`} />
                                </div>
                                <div>
                                    <h4 className={`text-sm font-semibold ${c.text} mb-0.5`}>{insight.title}</h4>
                                    <p className={`text-xs ${c.sub}`}>{insight.message}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
};

export default Analytics;