import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import LineChartCard from '../components/ui/LineChartCard';
import {
    Lightbulb,
    Zap,
    Flame,
    Clock,
    TrendingUp,
    Plus,
    ArrowRight,
    Calendar
} from 'lucide-react';
import { useEffect, useState } from "react";
import {
    fetchDashboardStats,
    fetchBurnout,
    fetchRecentSkills,
} from "../services/dashboardService";


const Dashboard = ({ onNavigate, onSelectSkill }) => {

    const [stats, setStats] = useState(null);
    const [burnout, setBurnout] = useState(null);
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [recentSkills, setRecentSkills] = useState([]);
    const [recentSessions, setRecentSessions] = useState([]);

    useEffect(() => {
        fetchDashboardStats().then(setStats);
        fetchBurnout().then(setBurnout);
        // fetchWeeklyActivity().then(setWeeklyActivity);
        fetchRecentSkills().then(setRecentSkills);
        // fetchRecentSessions().then(setRecentSessions);
    }, []);


    const burnoutColor = {
        low: 'success',
        medium: 'warning',
        high: 'danger'
    };

    if (!stats || !burnout) {
        return <div className="p-8 text-gray-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's your learning overview."
                action={false}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Skills"
                    value={stats.totalSkills}
                    icon={Lightbulb}
                    color="indigo"
                    trend="up"
                    trendValue="+2 this month"
                />
                <StatCard
                    title="Active Skills"
                    value={stats.activeSkills}
                    icon={Zap}
                    color="blue"
                    subtitle="Currently learning"
                />
                <StatCard
                    title="Current Streak"
                    value={`${stats.currentStreak} days`}
                    icon={Flame}
                    color="orange"
                    trend="up"
                    trendValue="Personal best!"
                />
                <StatCard
                    title="Weekly Minutes"
                    value={stats.weeklyMinutes}
                    icon={Clock}
                    color="green"
                    subtitle={`${stats.weeklyMinutes} min this week`}
                />
            </div>

            {/* Burnout Alert */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">You're doing great!</h3>
                            <Badge variant={burnoutColor[burnout.riskLevel.toLowerCase()]} size="sm">
                                {burnout.riskLevel} RISK
                            </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">
                            Your learning pace is healthy and sustainable. Keep up the excellent work!
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-gray-700">
                                <span className="font-medium">Velocity:</span>
                                <span className="ml-2">{stats.velocityPerHour?.toFixed(2) || 0} %/h</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <span className="font-medium">Consistency:</span>
                                <span className="ml-2">Strong</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Activity Chart */}
            <LineChartCard
                title="Weekly Activity"
                description="Your practice hours this week"
                data={weeklyActivity.map(d => ({
                    label: d.sessionDate,
                    value: d.minutes / 60
                }))}
                color="indigo"
                height={200}
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
                    {/*<Card className="p-4">*/}
                    {/*    <div className="space-y-4">*/}
                    {/*        {recentSkills.map((skill) => (*/}
                    {/*            <div*/}
                    {/*                key={skill.id}*/}
                    {/*                onClick={() => {*/}
                    {/*                    onSelectSkill(skill.id);*/}
                    {/*                    onNavigate('skill-detail');*/}
                    {/*                }}*/}
                    {/*                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"*/}
                    {/*            >*/}
                    {/*                <div className="flex items-start justify-between mb-3">*/}
                    {/*                    <div>*/}
                    {/*                        <h3 className="font-semibold text-gray-900 mb-1">{skill.name}</h3>*/}
                    {/*                        <div className="flex items-center space-x-2">*/}
                    {/*                            <Badge variant="primary" size="sm">{skill.level}</Badge>*/}
                    {/*                            <span className="text-xs text-gray-500">{skill.level}</span>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                    <span className="text-sm font-medium text-gray-900">{skill.progress}%</span>*/}
                    {/*                </div>*/}
                    {/*                <ProgressBar progress={skill.progress} size="sm" />*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</Card>*/}
                </Section>

                {/* Recent Sessions */}
                <Section
                    title="Recent Sessions"
                    action={
                        <Button variant="ghost" size="sm">
                            View all
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    }
                >
                    <Card className="p-4">
                        <div className="space-y-3">
                            {recentSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                >
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-semibold text-gray-900">{session.skillName}</h4>
                                            <span className="text-sm font-medium text-gray-900">{session.durationMinutes}m</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-1">{session.notes}</p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {session.sessionDate}
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                            onClick={() => onNavigate('skills')}
                        >
                            Add New Skill
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth
                            icon={Clock}
                        >
                            Log Session
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth
                            icon={TrendingUp}
                            onClick={() => onNavigate('analytics')}
                        >
                            View Analytics
                        </Button>
                    </div>
                </Card>
            </Section>
        </div>
    );
};

export default Dashboard;