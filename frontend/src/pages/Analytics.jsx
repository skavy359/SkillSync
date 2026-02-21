import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import ProgressBar from '../components/ui/ProgressBar';
import BarChartCard from '../components/ui/BarChartCard';
import DonutChartCard from '../components/ui/DonutChartCard';
import {
    Flame,
    TrendingUp,
    Target,
    AlertTriangle,
    Calendar,
    Clock,
    Award,
    Zap,
    CheckCircle
} from 'lucide-react';
import { useEffect, useState } from "react";
import { getMyStreak, getBurnoutRisk, getMyLearningStats } from "../services/profileService";
import { getCategoryAnalytics } from "../services/categoryService";
import { getGoalAnalytics } from "../services/goalService";
import { getMySkills } from "../services/skillService";


const Analytics = () => {
    const [streak, setStreak] = useState(null);
    const [burnout, setBurnout] = useState(null);
    const [learningStats, setLearningStats] = useState(null);
    const [goals, setGoals] = useState([]);
    const [topSkills, setTopSkills] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [completionRate, setCompletionRate] = useState(0);

    useEffect(() => {
        // Fetch all analytics data
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
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setGoals(data);
                } else {
                    setGoals([]);
                }
            })
            .catch(() => setGoals([]));
        
        getMySkills({ size: 5 })
            .then(data => {
                if (data?.content) {
                    setTopSkills(data.content.map(s => ({ name: s.name, totalMinutes: s.totalMinutes || 0 })));
                } else {
                    setTopSkills([]);
                }
            })
            .catch(() => setTopSkills([]));
        
        getCategoryAnalytics()
            .then(data => {
                if (Array.isArray(data)) {
                    setCategoryStats(data);
                } else {
                    setCategoryStats([]);
                }
            })
            .catch(() => setCategoryStats([]));
        
        // Get skills to calculate completion rate
        getMySkills({ size: 100 })
            .then(data => {
                if (data?.content && data.content.length > 0) {
                    const completed = data.content.filter(s => s.status === 'COMPLETED').length;
                    const rate = Math.round((completed / data.content.length) * 100);
                    setCompletionRate(rate);
                }
            })
            .catch(() => setCompletionRate(0));
    }, []);

    // Calculate velocity and completion metrics
    const calculateMetrics = () => {
        if (!learningStats || !goals || goals.length === 0) {
            return { velocity: 0, eta: null, activeGoal: null };
        }

        // Calculate velocity based on weekly minutes and sessions
        const weeklyHours = learningStats.weeklyMinutes / 60;
        const velocity = learningStats.totalSessions > 0 ? weeklyHours : 0;

        // Get first active goal for ETA calculation
        const activeGoal = goals.find(g => !g.completionPercentage || g.completionPercentage < 100);
        let eta = null;

        if (activeGoal && activeGoal.requiredVelocity > 0) {
            const remainingPercentage = 100 - (activeGoal.completionPercentage || 0);
            eta = remainingPercentage / activeGoal.requiredVelocity;
        }

        return { velocity, eta, activeGoal };
    };

    const metrics = calculateMetrics();

    // Calculate burnout consistency score and other metrics
    const calculateBurnoutMetrics = () => {
        if (!burnout || !learningStats) {
            return { consistency: 0, intensity: 0, recovery: 0, health: 'GOOD' };
        }

        // Consistency: based on weekly vs monthly average (higher ratio = more consistent)
        const consistency = Math.min(100, Math.round(burnout.ratio * 100));

        // Intensity: based on weekly minutes (safe range is 180-420 min/week, or 3-7 hours)
        const safeMin = 180, safeMax = 420;
        let intensity;
        if (burnout.weeklyMinutes < safeMin) {
            intensity = Math.round((burnout.weeklyMinutes / safeMin) * 100);
        } else if (burnout.weeklyMinutes > safeMax) {
            intensity = Math.round((safeMax / burnout.weeklyMinutes) * 100);
        } else {
            intensity = 100;
        }
        intensity = Math.max(0, Math.min(100, intensity));

        // Recovery: based on having variety in sessions (if avg session < 90 min and streak is reasonable = good recovery)
        const avgSessionMin = learningStats.avgMinutesPerSkill || 0;
        let recovery = 75;
        if (avgSessionMin < 120 && streak?.currentStreak <= 14) {
            recovery = 85;
        } else if (avgSessionMin > 180) {
            recovery = 50;
        }

        const health = burnout.riskLevel === 'HIGH' ? 'At Risk' : burnout.riskLevel === 'MEDIUM' ? 'Balanced' : 'Excellent';

        return { consistency, intensity, recovery, health };
    };

    const burnoutMetrics = calculateBurnoutMetrics();

    if (!streak || !burnout || !learningStats) {
        return <div className="p-8 text-gray-500 dark:text-[#7f849c]">Loading analytics...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analytics"
                description="Insights into your learning progress and patterns"
                action={false}
            />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Current Streak"
                    value={`${streak.currentStreak} days`}
                    icon={Flame}
                    color="orange"
                    trend={streak.currentStreak >= streak.longestStreak ? "up" : "flat"}
                    trendValue={streak.currentStreak >= streak.longestStreak ? "Personal best!" : `Best: ${streak.longestStreak} days`}
                />
                <StatCard
                    title="Learning Velocity"
                    value={`${metrics.velocity.toFixed(1)}h/week`}
                    icon={TrendingUp}
                    color="green"
                    subtitle={`${learningStats.weeklyMinutes} min this week`}
                />
                <StatCard
                    title="Est. Completion"
                    value={metrics.eta ? `${Math.round(metrics.eta)}h` : "—"}
                    icon={Target}
                    color="indigo"
                    subtitle={metrics.activeGoal ? metrics.activeGoal.goalName : "No active goals"}
                />
                <StatCard
                    title="Burnout Risk"
                    value={burnout.riskLevel}
                    subtitle={`${burnout.weeklyMinutes} min/week`}
                    icon={AlertTriangle}
                    color={burnout.riskLevel === 'HIGH' ? 'red' : burnout.riskLevel === 'MEDIUM' ? 'yellow' : 'green'}
                />
            </div>

            {/* Burnout Analysis */}
            <Section
                title="Burnout Analysis"
                description="Your learning pace and sustainability metrics"
            >
                <Card className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-[#9399b2]">Overall Health Status</p>
                        </div>
                        <Badge
                            variant={
                                burnout.riskLevel === "HIGH"
                                    ? "danger"
                                    : burnout.riskLevel === "MEDIUM"
                                        ? "warning"
                                        : "success"
                            }
                            size="lg"
                        >
                            {burnout.riskLevel} RISK
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-[#9399b2]">Consistency</span>
                                <span className={`text-sm font-bold ${burnoutMetrics.consistency >= 75 ? 'text-green-600' : burnoutMetrics.consistency >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {burnoutMetrics.consistency >= 75 ? 'Excellent' : burnoutMetrics.consistency >= 50 ? 'Fair' : 'Low'}
                                </span>
                            </div>
                            <ProgressBar progress={burnoutMetrics.consistency} color="green" size="md" />
                            <p className="text-xs text-gray-500 dark:text-[#7f849c] mt-2">
                                {burnoutMetrics.consistency >= 75 ? 'Regular daily practice detected' : 'Variable learning schedule'}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-[#9399b2]">Intensity</span>
                                <span className={`text-sm font-bold ${burnoutMetrics.intensity >= 80 ? 'text-green-600' : burnoutMetrics.intensity >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {burnoutMetrics.intensity >= 80 ? 'Balanced' : burnoutMetrics.intensity >= 50 ? 'Moderate' : 'High'}
                                </span>
                            </div>
                            <ProgressBar progress={burnoutMetrics.intensity} color="indigo" size="md" />
                            <p className="text-xs text-gray-500 dark:text-[#7f849c] mt-2">
                                {burnoutMetrics.intensity >= 80 ? 'Good balance between rest and practice' : 'Consider adjusting intensity'}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-[#9399b2]">Recovery</span>
                                <span className={`text-sm font-bold ${burnoutMetrics.recovery >= 75 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {burnoutMetrics.recovery >= 75 ? 'Good' : 'Moderate'}
                                </span>
                            </div>
                            <ProgressBar progress={burnoutMetrics.recovery} color="blue" size="md" />
                            <p className="text-xs text-gray-500 dark:text-[#7f849c] mt-2">
                                {burnoutMetrics.recovery >= 75 ? 'Taking adequate breaks' : 'Consider more recovery time'}
                            </p>
                        </div>
                    </div>

                    <div className={`mt-6 p-4 rounded-xl ${
                        burnout.riskLevel === 'HIGH' 
                            ? 'bg-red-50 dark:bg-red-500/10' 
                            : burnout.riskLevel === 'MEDIUM'
                            ? 'bg-yellow-50 dark:bg-yellow-500/10'
                            : 'bg-green-50 dark:bg-green-500/10'
                    }`}>
                        <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                burnout.riskLevel === 'HIGH' 
                                    ? 'bg-red-100 dark:bg-red-500/15' 
                                    : burnout.riskLevel === 'MEDIUM'
                                    ? 'bg-yellow-100 dark:bg-yellow-500/15'
                                    : 'bg-green-100 dark:bg-green-500/15'
                            }`}>
                                {burnout.riskLevel === 'HIGH' ? (
                                    <AlertTriangle className={`w-5 h-5 ${
                                        burnout.riskLevel === 'HIGH' 
                                            ? 'text-red-600 dark:text-red-400' 
                                            : 'text-green-600 dark:text-green-400'
                                    }`} />
                                ) : (
                                    <Award className={`w-5 h-5 ${
                                        burnout.riskLevel === 'HIGH' 
                                            ? 'text-red-600 dark:text-red-400'
                                            : burnout.riskLevel === 'MEDIUM'
                                            ? 'text-yellow-600 dark:text-yellow-400'
                                            : 'text-green-600 dark:text-green-400'
                                    }`} />
                                )}
                            </div>
                            <div>
                                <h4 className={`text-sm font-semibold mb-1 ${
                                    burnout.riskLevel === 'HIGH' 
                                        ? 'text-red-900 dark:text-red-300' 
                                        : burnout.riskLevel === 'MEDIUM'
                                        ? 'text-yellow-900 dark:text-yellow-300'
                                        : 'text-green-900 dark:text-green-300'
                                }`}>
                                    {burnout.riskLevel === 'HIGH' ? 'Burnout Warning' : burnout.riskLevel === 'MEDIUM' ? 'Monitor Your Pace' : 'Great Job!'}
                                </h4>
                                <p className={`text-sm ${
                                    burnout.riskLevel === 'HIGH' 
                                        ? 'text-red-700 dark:text-red-400' 
                                        : burnout.riskLevel === 'MEDIUM'
                                        ? 'text-yellow-700 dark:text-yellow-400'
                                        : 'text-green-700 dark:text-green-400'
                                }`}>
                                    {burnout.riskLevel === 'HIGH' 
                                        ? 'Your learning activity has dropped significantly. Take a break and resume when ready.'
                                        : burnout.riskLevel === 'MEDIUM'
                                        ? 'Your learning intensity varies. Try to maintain a more consistent schedule.'
                                        : 'Your learning habits are sustainable and healthy. Keep maintaining this excellent balance between practice and rest.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </Section>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChartCard
                    title="Top Skills by Time"
                    description="Total hours logged per skill"
                    data={topSkills.length > 0 ? topSkills.map(skill => ({
                        label: skill.name,
                        value: skill.totalMinutes / 60,
                        unit: "h"
                    })) : [
                        { label: 'No data yet', value: 0, unit: 'h' }
                    ]}
                    color="indigo"
                />

                <DonutChartCard
                    title="Category Distribution"
                    description="Time spent by category"
                    data={categoryStats.length > 0 ? categoryStats.map(cat => ({
                        label: cat.categoryName,
                        value: cat.totalMinutes / 60
                    })) : [
                        { label: 'No categories', value: 0 }
                    ]}
                />
            </div>

            {/* Learning Stats */}
            <Section title="Learning Statistics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{Math.round(learningStats.totalMinutes / 60)}h</h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-3">Total Learning Time</p>
                        <div className="flex items-center text-xs text-green-600 font-medium">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>{learningStats.weeklyMinutes} min this week</span>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{Math.round(learningStats.avgMinutesPerSkill || 0)}m</h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-3">Avg Time per Skill</p>
                        <div className="flex items-center text-xs text-gray-600 dark:text-[#9399b2] font-medium">
                            <span>{learningStats.totalSessions} total sessions</span>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/15 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                            {completionRate}%
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-3">Skills Completed</p>
                        <div className="flex items-center text-xs text-green-600 font-medium">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>Skills mastered!</span>
                        </div>
                    </Card>
                </div>
            </Section>

            {/* Insights & Recommendations */}
            <Section title="Insights & Recommendations">
                <Card className="p-6">
                    <div className="space-y-4">
                        {/* Streak Insight */}
                        <div className="flex items-start space-x-4 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Flame className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
                                    {streak.currentStreak > 0 ? 'Strong Momentum' : 'Start Your Journey'}
                                </h4>
                                <p className="text-sm text-indigo-700 dark:text-indigo-400">
                                    {streak.currentStreak > 0 
                                        ? `You're on a ${streak.currentStreak}-day streak! This consistent practice is building great habits.`
                                        : 'Start logging learning sessions to build momentum and establish great learning habits.'}
                                </p>
                            </div>
                        </div>

                        {/* Completion & Goals Insight */}
                        <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                    {completionRate >= 50 ? 'Great Progress' : 'Keep Learning'}
                                </h4>
                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                    {completionRate >= 50 
                                        ? `You've completed ${completionRate}% of your skills. You're making excellent progress!`
                                        : 'You have several skills in progress. Focus on completing one skill at a time for better results.'}
                                </p>
                            </div>
                        </div>

                        {/* Velocity & Pace Insight */}
                        <div className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1">Learning Velocity</h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    {learningStats.weeklyMinutes >= 180
                                        ? `You're investing ${learningStats.weeklyMinutes} minutes per week - excellent commitment!`
                                        : learningStats.weeklyMinutes > 0
                                        ? `Current pace: ${learningStats.weeklyMinutes} min/week. Consider increasing to 180+ min/week for optimal progress.`
                                        : 'Start logging sessions to establish a learning routine.'}
                                </p>
                            </div>
                        </div>

                        {/* Burnout Risk Recommendation */}
                        {burnout.riskLevel === 'HIGH' && (
                            <div className="flex items-start space-x-4 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">Take a Break</h4>
                                    <p className="text-sm text-red-700 dark:text-red-400">
                                        Your learning activity has dropped significantly. Take some time to rest and recharge before resuming.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </Section>
        </div>
    );
};

export default Analytics;