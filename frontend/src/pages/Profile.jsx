import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
    User,
    Mail,
    Calendar,
    Briefcase,
    Edit,
    Lightbulb,
    Clock,
    Target,
    Flame,
    Award,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from "react";
import { getMyProfile, getMyStats, getMyStreak } from "../services/profileService";


const Profile = () => {

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [streak, setStreak] = useState(null);

    useEffect(() => {
        getMyProfile().then(setProfile).catch(() => { });
        getMyStats().then(setStats).catch(() => setStats({ totalSkills: 0, completedSkills: 0, totalSessions: 0, totalMinutes: 0 }));
        getMyStreak().then(setStreak).catch(() => setStreak({ currentStreak: 0, longestStreak: 0 }));
    }, []);

    if (!profile || !stats || !streak) {
        return <div className="p-8 text-gray-500 dark:text-[#7f849c]">Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profile"
                description="Manage your account and view your achievements"
                action={false}
            />

            {/* Profile Card */}
            <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-lg">
                            {profile.name?.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">{profile.name}</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600 dark:text-[#9399b2]">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{profile.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-[#9399b2]">
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{profile.role || "Learner"}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-[#9399b2]">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="text-sm">
                                        Member since {new Date(profile.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                            </div>
                            <Badge variant="primary" size="lg">Pro Member</Badge>
                        </div>
                    </div>

                    <Button variant="secondary" icon={Edit}>
                        Edit Profile
                    </Button>
                </div>

                {/* Bio */}
                <div className="pt-6 border-t border-gray-100 dark:border-[#272739]">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] mb-2">About</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                        Passionate learner focused on mastering full-stack development and modern web technologies.
                        Always looking to expand my skill set and take on new challenges.
                    </p>
                </div>
            </Card>

            {/* Stats Grid */}
            <Section title="Your Statistics">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                                <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                            {stats.totalSkills}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Skills</p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-[#7f849c]">
                            {stats.completedSkills} completed
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/15 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                            {stats.totalSessions}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Sessions</p>
                        <div className="mt-2 text-xs text-green-600 font-medium flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12 this week
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                            {Math.round(stats.totalMinutes / 60)}h
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Hours</p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-[#7f849c]">
                            Avg 13h/week
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/15 rounded-xl flex items-center justify-center">
                                <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                            {streak.currentStreak}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">Day Streak</p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-[#7f849c]">
                            Longest: {streak.longestStreak} days
                        </div>
                    </Card>
                </div>
            </Section>

            {/* Achievements */}
            <Section title="Achievements">
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/20">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/15 rounded-xl flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">Fire Starter</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#9399b2]">7-day streak</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                                Maintained a learning streak for 7 consecutive days
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                                    <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">Skill Collector</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#9399b2]">5 skills tracked</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                                Added 5 or more skills to your learning path
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-500/15 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">Century Club</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#9399b2]">100+ hours</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                                Logged over 100 hours of learning time
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/15 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">Goal Getter</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#9399b2]">First goal</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                                Created your first learning goal
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">Completion Master</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#9399b2]">Skill completed</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                                Successfully completed your first skill
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-[#272739] rounded-xl border border-gray-200 dark:border-[#313244] opacity-60">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-[#313244] rounded-xl flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-gray-400 dark:text-[#6c7086]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">Unstoppable</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#9399b2]">30-day streak</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                                Maintain a 30-day learning streak
                            </p>
                        </div>
                    </div>
                </Card>
            </Section>

            {/* Settings */}
            <Section title="Settings">
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#272739]">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">Email Notifications</h4>
                                <p className="text-xs text-gray-500 dark:text-[#7f849c]">Receive updates about your progress</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-[#272739]">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">Streak Reminders</h4>
                                <p className="text-xs text-gray-500 dark:text-[#7f849c]">Daily reminders to maintain your streak</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">Weekly Reports</h4>
                                <p className="text-xs text-gray-500 dark:text-[#7f849c]">Get weekly progress summaries</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#272739]">
                        <Button variant="danger" size="sm">
                            Delete Account
                        </Button>
                    </div>
                </Card>
            </Section>
        </div>
    );
};

export default Profile;