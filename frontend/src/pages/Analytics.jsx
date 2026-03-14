import React, { useEffect, useState } from 'react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import BarChartCard from '../components/ui/BarChartCard';
import {
    Flame, TrendingUp, Target, AlertTriangle, Clock, Award,
    Zap, CheckCircle, Brain, BookOpen, Activity, Sparkles, LayoutDashboard
} from 'lucide-react';
import { getMyStreak, getBurnoutRisk, getMyLearningStats } from "../services/profileService";
import { getCategoryAnalytics } from "../services/categoryService";
import { getGoalAnalytics } from "../services/goalService";
import { getMySkills } from "../services/skillService";

const GradientStatCard = ({ title, value, subtitle, icon: Icon, gradient, iconColor }) => (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/20 dark:border-[#313244] p-6 bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-full h-full text-white" />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColor} shadow-inner`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-4xl font-black text-white drop-shadow-sm mb-1">{value}</h3>
                <p className="text-sm font-bold text-white/90 uppercase tracking-wider">{title}</p>
                {subtitle && <p className="text-xs font-semibold text-white/70 mt-1">{subtitle}</p>}
            </div>
        </div>
    </div>
);

const RingChart = ({ percentage, color, size = 100, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-sm">
            <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
                className="text-gray-100 dark:text-[#313244]" />
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
        getMyStreak().then(setStreak).catch(() => setStreak({ currentStreak: 0, longestStreak: 0 }));
        getBurnoutRisk().then(setBurnout).catch(() => setBurnout({ riskLevel: 'LOW', weeklyMinutes: 0, monthlyMinutes: 0, ratio: 0 }));
        getMyLearningStats().then(setLearningStats).catch(() => setLearningStats({ totalMinutes: 0, weeklyMinutes: 0, avgMinutesPerSkill: 0, totalSessions: 0 }));
        getGoalAnalytics().then(data => setGoals(Array.isArray(data) ? data : [])).catch(() => setGoals([]));
        getMySkills({ size: 5 }).then(data => { if (data?.content) setTopSkills(data.content.map(s => ({ name: s.name, totalMinutes: s.totalMinutes || 0 }))); }).catch(() => setTopSkills([]));
        getCategoryAnalytics().then(data => setCategoryStats(Array.isArray(data) ? data : [])).catch(() => setCategoryStats([]));
        getMySkills({ size: 100 }).then(data => {
            if (data?.content) {
                setAllSkills(data.content);
                const completed = data.content.filter(s => s.status === 'COMPLETED').length;
                setCompletionRate(data.content.length > 0 ? Math.round((completed / data.content.length) * 100) : 0);
            }
        }).catch(() => setCompletionRate(0));
    }, []);

    const calculateMetrics = () => {
        if (!burnout || !goals || goals.length === 0) return { velocity: 0, eta: null, activeGoal: null };
        const weeklyHours = parseFloat(((burnout.weeklyMinutes || 0) / 60).toFixed(1));
        const activeGoal = goals.find(g => g.progress < 100);
        let eta = null;
        if (activeGoal && activeGoal.daysLeft > 0) eta = (activeGoal.daysLeft / 7).toFixed(1);
        return { velocity: weeklyHours, eta, activeGoal };
    };

    const generateInsights = () => {
        const insights = [];
        if (streak.currentStreak >= 14) insights.push({ icon: Flame, title: 'Excellent Consistency', message: `Amazing ${streak.currentStreak}-day streak! You're building powerful learning habits.`, color: 'indigo' });
        else if (streak.currentStreak >= 7) insights.push({ icon: Flame, title: 'Good Progress', message: `Your ${streak.currentStreak}-day streak shows solid commitment. Push for 2 weeks!`, color: 'blue' });
        else if (streak.currentStreak > 0) insights.push({ icon: Flame, title: 'Building Momentum', message: `${streak.currentStreak}-day streak started! Keep logging daily.`, color: 'amber' });
        else insights.push({ icon: Flame, title: 'Start Your Journey', message: 'Log your first session today to begin building your streak!', color: 'blue' });

        if (completionRate >= 75) insights.push({ icon: CheckCircle, title: 'Mastery Progress', message: `${completionRate}% skills completed! Impressive trajectory.`, color: 'emerald' });
        else if (completionRate >= 50) insights.push({ icon: Target, title: 'Solid Achievement', message: `${completionRate}% skills completed. Keep pushing to expert level.`, color: 'blue' });
        else if (completionRate > 0) insights.push({ icon: Target, title: 'Skills in Progress', message: `${completionRate}% complete. Focus on finishing current skills.`, color: 'amber' });

        const weeklyMin = burnout?.weeklyMinutes || 0;
        if (weeklyMin >= 300) insights.push({ icon: Zap, title: 'Exceptional Dedication', message: `${weeklyMin} min/week — outstanding time investment!`, color: 'purple' });
        else if (weeklyMin >= 180) insights.push({ icon: Zap, title: 'Optimal Learning Pace', message: `${weeklyMin} min/week — perfect for sustainable growth.`, color: 'emerald' });
        else if (weeklyMin >= 60) insights.push({ icon: Zap, title: 'Increase Time', message: `${weeklyMin} min/week. Aim for 180+ min for faster progress.`, color: 'amber' });
        else if (weeklyMin > 0) insights.push({ icon: Zap, title: 'Boost Learning', message: `Only ${weeklyMin} min this week. Try 30 min/day.`, color: 'amber' });

        if (burnout?.riskLevel === 'HIGH') insights.push({ icon: AlertTriangle, title: 'Take a Break', message: 'Activity dropped significantly. Rest and recharge!', color: 'rose' });
        else if (burnout?.riskLevel === 'MEDIUM') insights.push({ icon: AlertTriangle, title: 'Balance Your Schedule', message: 'Learning is inconsistent. Schedule regular sessions.', color: 'amber' });
        else if (burnout?.riskLevel === 'LOW') insights.push({ icon: Award, title: 'Healthy Balance', message: 'Sustainable and healthy learning habits.', color: 'emerald' });

        return insights;
    };

    const calculateBurnoutMetrics = () => {
        if (!burnout || !learningStats) return { consistency: 0, intensity: 0, recovery: 0 };
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
        return <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
    }

    const metrics = calculateMetrics();
    const burnoutMetrics = calculateBurnoutMetrics();
    const insights = generateInsights();

    const totalHours = Math.round(learningStats.totalMinutes / 60);
    const avgSessionLen = learningStats.totalSessions > 0 ? Math.round(learningStats.totalMinutes / learningStats.totalSessions) : 0;
    const activeSkills = allSkills.filter(s => s.status === 'ACTIVE').length;
    const completedSkills = allSkills.filter(s => s.status === 'COMPLETED').length;

    const sortedSkills = [...allSkills].sort((a, b) => (b.totalMinutes || 0) - (a.totalMinutes || 0));
    const computedTopSkills = sortedSkills.slice(0, 5);

    const bestSkill = sortedSkills.length > 0 && sortedSkills[0].totalMinutes > 0 ? sortedSkills[0] : null;
    const bestCategory = categoryStats.length > 0 ? categoryStats.reduce((a, b) => (a.totalMinutes || 0) > (b.totalMinutes || 0) ? a : b) : null;

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* --- Hero Header --- */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 p-8 md:p-12 shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-sm font-medium">
                        <LayoutDashboard className="w-4 h-4 text-cyan-300" />
                        <span>Performance Analytics</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
                        Your Learning Intelligence
                    </h1>
                    <p className="text-indigo-100 max-w-2xl text-lg md:text-xl opacity-90 leading-relaxed">
                        Deep dive into your study patterns, identify growth areas, and track your journey toward mastery.
                    </p>
                </div>
            </div>

            {/* --- Top Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GradientStatCard
                    title="Current Streak"
                    value={`${streak.currentStreak} days`}
                    subtitle={`Best: ${streak.longestStreak} days`}
                    icon={Flame}
                    gradient="from-orange-500 to-amber-500"
                    iconColor="bg-white/20"
                />
                <GradientStatCard
                    title="Total Study Time"
                    value={`${totalHours}h`}
                    subtitle={`${burnout.weeklyMinutes} min this week`}
                    icon={Clock}
                    gradient="from-blue-500 to-indigo-600"
                    iconColor="bg-white/20"
                />
                <GradientStatCard
                    title="Sessions Logged"
                    value={learningStats.totalSessions}
                    subtitle={`Avg ${avgSessionLen} min/session`}
                    icon={Activity}
                    gradient="from-emerald-500 to-teal-600"
                    iconColor="bg-white/20"
                />
                <GradientStatCard
                    title="Skills Progress"
                    value={`${completedSkills}/${allSkills.length}`}
                    subtitle={`${completionRate}% completed`}
                    icon={Brain}
                    gradient="from-purple-500 to-pink-600"
                    iconColor="bg-white/20"
                />
            </div>

            {/* --- Main Dashboard Content --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                    {/* Health Card */}
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-[#313244] overflow-hidden relative">
                        {/* Background Decor */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                                <Activity className="w-6 h-6 text-indigo-500" /> Learning Health
                            </h2>
                            <Badge variant={burnout.riskLevel === "HIGH" ? "danger" : burnout.riskLevel === "MEDIUM" ? "warning" : "success"} size="lg" className="shadow-sm">
                                {burnout.riskLevel} RISK
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 relative z-10">
                            {[
                                { label: 'Consistency', value: burnoutMetrics.consistency, color: '#10b981', desc: burnoutMetrics.consistency >= 75 ? 'Regular practice' : 'Variable schedule' },
                                { label: 'Intensity', value: burnoutMetrics.intensity, color: '#6366f1', desc: burnoutMetrics.intensity >= 80 ? 'Well balanced' : 'Needs adjustment' },
                                { label: 'Recovery', value: burnoutMetrics.recovery, color: '#3b82f6', desc: burnoutMetrics.recovery >= 75 ? 'Good rest balance' : 'Rest more' },
                            ].map((m, i) => (
                                <div key={m.label} className="flex flex-col items-center bg-gray-50/50 dark:bg-[#181825]/50 rounded-3xl p-6 border border-gray-100 dark:border-[#313244]/50 group hover:bg-white dark:hover:bg-[#272739] transition-colors shadow-sm">
                                    <div className="relative inline-flex items-center justify-center mb-4 transform group-hover:scale-105 transition-transform">
                                        <RingChart percentage={m.value} color={m.color} size={110} strokeWidth={10} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4]">{m.value}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{m.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#7f849c] font-medium text-center">{m.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className={`p-4 rounded-2xl text-sm font-semibold border relative z-10 flex items-center gap-3 ${
                            burnout.riskLevel === 'HIGH' ? 'bg-red-50 border-red-100 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400' :
                            burnout.riskLevel === 'MEDIUM' ? 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                            'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                        }`}>
                            {burnout.riskLevel === 'HIGH' ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : burnout.riskLevel === 'MEDIUM' ? <TrendingUp className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                            <p>
                                {burnout.riskLevel === 'HIGH'
                                    ? 'Activity dropped significantly. Take a break and resume when ready.'
                                    : burnout.riskLevel === 'MEDIUM'
                                    ? 'Learning intensity varies. Try to maintain a more consistent schedule.'
                                    : 'Your learning habits are sustainable and healthy. Keep it up!'}
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BarChartCard
                            title="Top Skills by Time"
                            description="Total hours logged per skill"
                            data={computedTopSkills.length > 0 && computedTopSkills.some(s => s.totalMinutes > 0) ? computedTopSkills.filter(s => s.totalMinutes > 0).map(skill => ({
                                label: skill.name,
                                value: +(skill.totalMinutes / 60).toFixed(1),
                                unit: "h"
                            })) : [{ label: 'No data yet', value: 0, unit: 'h' }]}
                            color="indigo"
                        />
                        <BarChartCard
                            title="Category Focus"
                            description="Total hours by category"
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

                {/* Right Column */}
                <div className="space-y-6 lg:space-y-8">
                    {/* Highlights Card */}
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-[#313244]">
                        <h3 className="text-xl font-black text-gray-900 dark:text-[#cdd6f4] mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-500" /> Key Highlights
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-2xl border border-purple-100/50 dark:border-purple-500/20 group hover:shadow-md transition-all">
                                <div>
                                    <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Learning Velocity</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4]">{metrics.velocity}h <span className="text-base text-gray-500 font-bold">/ week</span></p>
                                </div>
                                <div className="w-12 h-12 bg-white dark:bg-[#313244] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <TrendingUp className="w-6 h-6 text-purple-500" />
                                </div>
                            </div>

                            {bestSkill && (
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-100/50 dark:border-blue-500/20 group hover:shadow-md transition-all">
                                    <div>
                                        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Most Studied</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] truncate max-w-[140px]">{bestSkill.name}</p>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-[#a6adc8]">{(bestSkill.totalMinutes / 60).toFixed(1)}h total</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white dark:bg-[#313244] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <BookOpen className="w-6 h-6 text-blue-500" />
                                    </div>
                                </div>
                            )}

                            {bestCategory && bestCategory.totalMinutes > 0 && (
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/20 group hover:shadow-md transition-all">
                                    <div>
                                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Top Category</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] truncate max-w-[140px]">{bestCategory.categoryName || bestCategory.name}</p>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-[#a6adc8]">{((bestCategory.totalMinutes || 0) / 60).toFixed(1)}h total</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white dark:bg-[#313244] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Target className="w-6 h-6 text-emerald-500" />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/10 rounded-2xl border border-orange-100/50 dark:border-orange-500/20 group hover:shadow-md transition-all">
                                <div>
                                    <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Streak Status</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4]">{streak.currentStreak} <span className="text-base text-gray-500 font-bold">days</span></p>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-[#a6adc8]">Best: {streak.longestStreak}</p>
                                </div>
                                <div className="w-12 h-12 bg-white dark:bg-[#313244] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Flame className="w-6 h-6 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Goals Progress */}
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-[#313244]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                                <Target className="w-6 h-6 text-blue-500" /> Active Goals
                            </h3>
                        </div>
                        <div className="space-y-5">
                            {goals.filter(g => g.progress < 100).length > 0 ? (
                                goals.filter(g => g.progress < 100).slice(0, 4).map((g, i) => (
                                    <div key={i} className="group">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-bold text-gray-800 dark:text-[#cdd6f4] truncate pr-4">{g.skillName}</p>
                                            <span className="text-sm font-black text-gray-900 dark:text-white px-2 py-0.5 bg-gray-100 dark:bg-[#313244] rounded-md">{g.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-[#181825] rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${g.progress}%` }}
                                            />
                                        </div>
                                        {g.daysLeft !== null && (
                                            <p className="text-xs font-semibold text-gray-500 dark:text-[#a6adc8] mt-2 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" /> {g.daysLeft} days remaining
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-gray-50/50 dark:bg-[#181825]/50 rounded-2xl border border-dashed border-gray-200 dark:border-[#313244]">
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No active goals</p>
                                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">Set a goal for your skills to track your target dates.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Insights Block --- */}
            <Section title="AI Learning Insights" description="Personalized recommendations based on your activity data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, index) => {
                        const colorMap = {
                            indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20', text: 'text-indigo-900 dark:text-indigo-300', sub: 'text-indigo-700 dark:text-indigo-400', icon: 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-indigo-500/20' },
                            blue: { bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20', text: 'text-blue-900 dark:text-blue-300', sub: 'text-blue-700 dark:text-blue-400', icon: 'text-blue-600 dark:text-blue-400 bg-white dark:bg-blue-500/20' },
                            emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20', text: 'text-emerald-900 dark:text-emerald-300', sub: 'text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-600 dark:text-emerald-400 bg-white dark:bg-emerald-500/20' },
                            amber: { bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20', text: 'text-amber-900 dark:text-amber-300', sub: 'text-amber-700 dark:text-amber-400', icon: 'text-amber-600 dark:text-amber-400 bg-white dark:bg-amber-500/20' },
                            rose: { bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20', text: 'text-rose-900 dark:text-rose-300', sub: 'text-rose-700 dark:text-rose-400', icon: 'text-rose-600 dark:text-rose-400 bg-white dark:bg-rose-500/20' },
                            purple: { bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20', text: 'text-purple-900 dark:text-purple-300', sub: 'text-purple-700 dark:text-purple-400', icon: 'text-purple-600 dark:text-purple-400 bg-white dark:bg-purple-500/20' },
                        };
                        const c = colorMap[insight.color] || colorMap.blue;
                        const Icon = insight.icon;
                        return (
                            <div key={index} className={`flex items-start gap-4 p-5 ${c.bg} border rounded-2xl transition-all hover:shadow-md`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon} shadow-sm`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${c.text} mb-1`}>{insight.title}</h4>
                                    <p className={`text-sm font-medium ${c.sub} leading-relaxed`}>{insight.message}</p>
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