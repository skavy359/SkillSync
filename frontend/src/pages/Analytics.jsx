import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
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

    const calculateMetrics = () => {
        if (!burnout || !goals || goals.length === 0) {
            return { velocity: 0, eta: null, activeGoal: null };
        }

        const weeklyMinutes = burnout.weeklyMinutes || 0;
        const weeklyHours = (weeklyMinutes / 60).toFixed(1);
        const velocity = parseFloat(weeklyHours);

        const activeGoal = goals.find(g => g.progress < 100);
        let eta = null;

        if (activeGoal && activeGoal.daysLeft > 0) {
            eta = (activeGoal.daysLeft / 7).toFixed(1);
        }

        return { velocity, eta, activeGoal };
    };

    const generateInsights = () => {
        const insights = [];

        if (streak.currentStreak >= 14) {
            insights.push({
                type: 'success',
                icon: Flame,
                title: 'Excellent Consistency',
                message: `Amazing ${streak.currentStreak}-day streak! You're building powerful learning habits. Keep this momentum going!`,
                color: 'indigo'
            });
        } else if (streak.currentStreak >= 7) {
            insights.push({
                type: 'info',
                icon: Flame,
                title: 'Good Progress',
                message: `Your ${streak.currentStreak}-day streak shows solid commitment. Aim for 2 more days to reach 2 weeks!`,
                color: 'blue'
            });
        } else if (streak.currentStreak > 0) {
            insights.push({
                type: 'warning',
                icon: Flame,
                title: 'Building Momentum',
                message: `${streak.currentStreak}-day streak started! Continue logging sessions daily to establish a strong habit.`,
                color: 'yellow'
            });
        } else {
            insights.push({
                type: 'info',
                icon: Flame,
                title: 'Start Your Journey',
                message: 'Log your first learning session today to begin building momentum and tracking progress!',
                color: 'blue'
            });
        }

        if (completionRate >= 75) {
            insights.push({
                type: 'success',
                icon: CheckCircle,
                title: 'Mastery Progress',
                message: `${completionRate}% skills completed! You're on an impressive learning trajectory.`,
                color: 'green'
            });
        } else if (completionRate >= 50) {
            insights.push({
                type: 'info',
                icon: Target,
                title: 'Solid Achievement',
                message: `${completionRate}% skills completed. Keep pushing to reach expert level in your chosen fields.`,
                color: 'blue'
            });
        } else if (completionRate > 0) {
            insights.push({
                type: 'info',
                icon: Target,
                title: 'Skills in Progress',
                message: `${completionRate}% complete. Focus on reaching 50% to gain momentum and see faster progress.`,
                color: 'yellow'
            });
        } else {
            insights.push({
                type: 'info',
                icon: Target,
                title: 'Start Learning',
                message: 'Add your first skill and begin logging sessions to track your learning journey.',
                color: 'blue'
            });
        }

        const weeklyMin = burnout?.weeklyMinutes || 0;
        if (weeklyMin >= 300) {
            insights.push({
                type: 'success',
                icon: Zap,
                title: 'Exceptional Dedication',
                message: `${weeklyMin} min/week is outstanding! You're investing serious time in your growth.`,
                color: 'indigo'
            });
        } else if (weeklyMin >= 180) {
            insights.push({
                type: 'success',
                icon: Zap,
                title: 'Optimal Learning Pace',
                message: `${weeklyMin} min/week is perfect for sustainable growth and skill development.`,
                color: 'green'
            });
        } else if (weeklyMin >= 60) {
            insights.push({
                type: 'warning',
                icon: Zap,
                title: 'Increase Time Investment',
                message: `Current pace: ${weeklyMin} min/week. Aiming for 180+ min/week would accelerate your progress.`,
                color: 'yellow'
            });
        } else if (weeklyMin > 0) {
            insights.push({
                type: 'warning',
                icon: Zap,
                title: 'Boost Your Learning',
                message: `Only ${weeklyMin} min logged this week. Try to dedicate 30 min daily for better results.`,
                color: 'yellow'
            });
        } else {
            insights.push({
                type: 'info',
                icon: Zap,
                title: 'Start Logging Sessions',
                message: 'Log learning sessions to establish your learning velocity and track progress over time.',
                color: 'blue'
            });
        }

        if (burnout?.riskLevel === 'HIGH') {
            insights.push({
                type: 'danger',
                icon: AlertTriangle,
                title: 'Take a Break',
                message: 'Your activity has dropped significantly. Rest and recharge - quality over quantity!',
                color: 'red'
            });
        } else if (burnout?.riskLevel === 'MEDIUM') {
            insights.push({
                type: 'warning',
                icon: AlertTriangle,
                title: 'Balance Your Schedule',
                message: 'Your learning pattern is inconsistent. Try scheduling regular learning sessions for sustainability.',
                color: 'yellow'
            });
        } else if (burnout?.riskLevel === 'LOW') {
            insights.push({
                type: 'success',
                icon: Award,
                title: 'Healthy Balance',
                message: 'Your learning habits are sustainable and healthy. Keep this excellent balance!',
                color: 'green'
            });
        }

        if (goals && goals.length > 0) {
            const activeGoals = goals.filter(g => g.progress < 100);
            if (activeGoals.length > 0) {
                const avgCompletion = Math.round(activeGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / activeGoals.length);
                insights.push({
                    type: 'info',
                    icon: Target,
                    title: `Active Goals: ${activeGoals.length}`,
                    message: `Average progress: ${avgCompletion}%. ${avgCompletion > 50 ? 'You\'re over halfway there!' : 'Keep pushing toward your targets!'}`,
                    color: 'blue'
                });
            }
        }

        return insights;
    };

    const calculateBurnoutMetrics = () => {
        if (!burnout || !learningStats) {
            return { consistency: 0, intensity: 0, recovery: 0, health: 'GOOD' };
        }

        const consistency = Math.min(100, Math.round(burnout.ratio * 100));

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

    if (!streak || !burnout || !learningStats) {
        return <div className="p-8 text-gray-500 dark:text-[#7f849c]">Loading analytics...</div>;
    }

    const metrics = calculateMetrics();
    const burnoutMetrics = calculateBurnoutMetrics();
    const insights = generateInsights();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analytics"
                description="Insights into your learning progress and patterns"
                action={false}
            />

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
                    value={`${metrics.velocity}h/week`}
                    icon={TrendingUp}
                    color="green"
                    subtitle={`${burnout.weeklyMinutes || 0} min this week`}
                />
                <StatCard
                    title="Est. Completion"
                    value={metrics.eta ? `${Math.round(metrics.eta * 7)} days` : "—"}
                    icon={Target}
                    color="indigo"
                    subtitle={metrics.activeGoal ? `${metrics.activeGoal.skillName} - ${metrics.activeGoal.progress}% done` : "No active goals"}
                />
                <StatCard
                    title="Burnout Risk"
                    value={burnout.riskLevel}
                    subtitle={`${burnout.weeklyMinutes} min/week`}
                    icon={AlertTriangle}
                    color={burnout.riskLevel === 'HIGH' ? 'red' : burnout.riskLevel === 'MEDIUM' ? 'yellow' : 'green'}
                />
            </div>

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

                <BarChartCard
                    title="Category Distribution"
                    description="Time spent by category"
                    data={categoryStats && categoryStats.length > 0 && categoryStats.some(cat => cat.totalMinutes > 0) ? categoryStats
                        .filter(cat => cat.totalMinutes > 0)
                        .map(cat => ({
                            label: cat.categoryName || cat.name || 'Uncategorized',
                            value: Number(((cat.totalMinutes || 0) / 60).toFixed(2)),
                            unit: "h"
                        })) : [
                        { label: 'No data yet', value: 0, unit: 'h' }
                    ]}
                    color="purple"
                />
            </div>

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

            <Section title="Insights & Recommendations">
                <Card className="p-6">
                    <div className="space-y-4">
                        {insights.map((insight, index) => {
                            const colorMap = {
                                indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', icon: 'bg-indigo-100 dark:bg-indigo-500/15', text: 'text-indigo-900 dark:text-indigo-300', subtext: 'text-indigo-700 dark:text-indigo-400' },
                                blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', icon: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-900 dark:text-blue-300', subtext: 'text-blue-700 dark:text-blue-400' },
                                green: { bg: 'bg-green-50 dark:bg-green-500/10', icon: 'bg-green-100 dark:bg-green-500/15', text: 'text-green-900 dark:text-green-300', subtext: 'text-green-700 dark:text-green-400' },
                                yellow: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', icon: 'bg-yellow-100 dark:bg-yellow-500/15', text: 'text-yellow-900 dark:text-yellow-300', subtext: 'text-yellow-700 dark:text-yellow-400' },
                                red: { bg: 'bg-red-50 dark:bg-red-500/10', icon: 'bg-red-100 dark:bg-red-500/15', text: 'text-red-900 dark:text-red-300', subtext: 'text-red-700 dark:text-red-400' }
                            };
                            const colors = colorMap[insight.color] || colorMap.blue;
                            const IconComponent = insight.icon;

                            return (
                                <div key={index} className={`flex items-start space-x-4 p-4 ${colors.bg} rounded-xl`}>
                                    <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <IconComponent className={`w-5 h-5 ${insight.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : insight.color === 'green' ? 'text-green-600 dark:text-green-400' : insight.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : insight.color === 'red' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-semibold ${colors.text} mb-1`}>
                                            {insight.title}
                                        </h4>
                                        <p className={`text-sm ${colors.subtext}`}>
                                            {insight.message}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </Section>
        </div>
    );
};

export default Analytics;