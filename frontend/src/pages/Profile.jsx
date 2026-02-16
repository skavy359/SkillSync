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
import { userProfile, skills } from '../data/dummyData';

const Profile = () => {
    const completedSkills = skills.filter(s => s.status === 'completed').length;
    const totalSessions = skills.reduce((sum, skill) => sum + skill.sessions.length, 0);

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
                            {userProfile.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{userProfile.name}</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{userProfile.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{userProfile.role}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span className="text-sm">
                    Member since {new Date(userProfile.joinedDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric'
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
                <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-sm text-gray-600">
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
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Lightbulb className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {userProfile.stats.totalSkills}
                        </h3>
                        <p className="text-sm text-gray-600">Total Skills</p>
                        <div className="mt-2 text-xs text-gray-500">
                            {completedSkills} completed
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {totalSessions}
                        </h3>
                        <p className="text-sm text-gray-600">Total Sessions</p>
                        <div className="mt-2 text-xs text-green-600 font-medium flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12 this week
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {userProfile.stats.totalHours}h
                        </h3>
                        <p className="text-sm text-gray-600">Total Hours</p>
                        <div className="mt-2 text-xs text-gray-500">
                            Avg 13h/week
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Flame className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">
                            {userProfile.stats.currentStreak}
                        </h3>
                        <p className="text-sm text-gray-600">Day Streak</p>
                        <div className="mt-2 text-xs text-gray-500">
                            Longest: {userProfile.stats.longestStreak} days
                        </div>
                    </Card>
                </div>
            </Section>

            {/* Achievements */}
            <Section title="Achievements">
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Fire Starter</h4>
                                    <p className="text-xs text-gray-600">7-day streak</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Maintained a learning streak for 7 consecutive days
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                    <Lightbulb className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Skill Collector</h4>
                                    <p className="text-xs text-gray-600">5 skills tracked</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Added 5 or more skills to your learning path
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Century Club</h4>
                                    <p className="text-xs text-gray-600">100+ hours</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Logged over 100 hours of learning time
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Target className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Goal Getter</h4>
                                    <p className="text-xs text-gray-600">First goal</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Created your first learning goal
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Award className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Completion Master</h4>
                                    <p className="text-xs text-gray-600">Skill completed</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
                                Successfully completed your first skill
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-60">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Unstoppable</h4>
                                    <p className="text-xs text-gray-600">30-day streak</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">
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
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                <p className="text-xs text-gray-500">Receive updates about your progress</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Streak Reminders</h4>
                                <p className="text-xs text-gray-500">Daily reminders to maintain your streak</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                                <p className="text-xs text-gray-500">Get weekly progress summaries</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
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