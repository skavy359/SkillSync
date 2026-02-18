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
    Award
} from 'lucide-react';
import { useEffect, useState } from "react";
// import {
//     fetchStreak,
//     fetchBurnout,
//     fetchVelocity,
//     fetchETA,
//     fetchTopSkills,
//     fetchCategoryAnalytics,
//     fetchLearningStats
// } from "../services/analyticsService";


const Analytics = () => {
    const [streak, setStreak] = useState(null);
    const [burnout, setBurnout] = useState(null);
    const [velocity, setVelocity] = useState(null);
    const [eta, setEta] = useState(null);
    const [topSkills, setTopSkills] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStreak().then(setStreak);
        fetchBurnout().then(setBurnout);
        fetchVelocity().then(setVelocity);
        fetchETA().then(setEta);
        fetchTopSkills().then(setTopSkills);
        fetchCategoryAnalytics().then(setCategoryStats);
        fetchLearningStats().then(setStats);
    }, []);


    // Calculate analytics

    // Bar chart data
    const barChartData = topSkills.map(skill => ({
        label: skill.name,
        value: skill.totalMinutes / 60,
        unit: "h"
    }));

    // Donut chart data
    const donutChartData = categoryStats.map(cat => ({
        label: cat.categoryName,
        value: cat.totalMinutes / 60
    }));

    if (!streak || !burnout || !stats || !velocity) {
        return <div className="p-8 text-gray-500">Loading analytics...</div>;
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
                    trend="up"
                    trendValue="Personal best!"
                />
                <StatCard
                    title="Learning Velocity"
                    value={`${velocity?.velocityPerHour?.toFixed(2) || 0} %/h`}
                    icon={TrendingUp}
                    color="green"
                    subtitle={`${stats.weeklyMinutes} min this week`}
                />
                <StatCard
                    title="Est. Completion"
                    value={eta?.estimatedHours ? `${Math.round(eta.estimatedHours)}h` : "—"}
                    icon={Target}
                    color="indigo"
                    subtitle="At current pace"
                />
                <StatCard
                    title="Burnout Risk"
                    value={burnout.riskLevel}
                    subtitle={`${burnout.weeklyMinutes} min/week`}
                    icon={AlertTriangle}
                    color="green"
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
                            <p className="text-sm text-gray-600">Overall Health Status</p>
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
                                <span className="text-sm font-medium text-gray-600">Consistency</span>
                                <span className="text-sm font-bold text-green-600">Excellent</span>
                            </div>
                            <ProgressBar progress={85} color="green" size="md" />
                            <p className="text-xs text-gray-500 mt-2">Regular daily practice detected</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Intensity</span>
                                <span className="text-sm font-bold text-indigo-600">Balanced</span>
                            </div>
                            <ProgressBar progress={65} color="indigo" size="md" />
                            <p className="text-xs text-gray-500 mt-2">Good balance between rest and practice</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Recovery</span>
                                <span className="text-sm font-bold text-blue-600">Good</span>
                            </div>
                            <ProgressBar progress={75} color="blue" size="md" />
                            <p className="text-xs text-gray-500 mt-2">Taking adequate breaks</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-xl">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-green-900 mb-1">Great Job!</h4>
                                <p className="text-sm text-green-700">
                                    Your learning habits are sustainable and healthy. Keep maintaining this excellent balance between practice and rest.
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
                    data={barChartData}
                    color="indigo"
                />

                <DonutChartCard
                    title="Category Distribution"
                    description="Time spent by category"
                    data={donutChartData}
                />
            </div>

            {/* Learning Stats */}
            <Section title="Learning Statistics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{Math.round(stats.totalMinutes / 60)}h</h3>
                        <p className="text-sm text-gray-600 mb-3">Total Learning Time</p>
                        <div className="flex items-center text-xs text-green-600 font-medium">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>+15% from last month</span>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.avgSessionMinutes}m</h3>
                        <p className="text-sm text-gray-600 mb-3">Avg Session Length</p>
                        <div className="flex items-center text-xs text-gray-600 font-medium">
                            <span>Optimal range: 45-90m</span>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {stats.totalSessions}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">Total Sessions</p>
                        <div className="flex items-center text-xs text-green-600 font-medium">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>Great consistency!</span>
                        </div>
                    </Card>
                </div>
            </Section>

            {/* Insights */}
            <Section title="Insights & Recommendations">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-xl">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-indigo-900 mb-1">Strong Momentum</h4>
                                <p className="text-sm text-indigo-700">
                                    You're on a 12-day streak! This consistent practice is building great habits.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">Goal Progress</h4>
                                <p className="text-sm text-blue-700">
                                    You're 52% towards your "Master React Ecosystem" goal. Keep it up!
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-xl">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-yellow-900 mb-1">Peak Learning Times</h4>
                                <p className="text-sm text-yellow-700">
                                    Your most productive learning happens on weekends. Consider scheduling key topics then.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </Section>
        </div>
    );
};

export default Analytics;