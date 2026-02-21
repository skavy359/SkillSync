import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
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
    TrendingUp,
    Check
} from 'lucide-react';
import { useEffect, useState } from "react";
import { getMyProfile, getMyStats, getMyStreak, getMyAchievements, getMyLearningStats, updateMyProfile, changePassword } from "../services/profileService";


const Profile = () => {

    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [learningStats, setLearningStats] = useState(null);
    const [streak, setStreak] = useState(null);
    const [achievements, setAchievements] = useState({ totalUnlocked: 0, totalAchievements: 0, achievements: [] });
    
    // Edit modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        about: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        getMyProfile().then(setProfile).catch(() => { });
        getMyStats().then(setStats).catch(() => setStats({ totalSkills: 0, completedSkills: 0, totalSessions: 0, totalMinutes: 0 }));
        getMyLearningStats().then(setLearningStats).catch(() => setLearningStats({ totalSkills: 0, totalSessions: 0, totalMinutes: 0, avgMinutesPerSkill: 0, mostStudiedSkill: '' }));
        getMyStreak().then(setStreak).catch(() => setStreak({ currentStreak: 0, longestStreak: 0 }));
        getMyAchievements()
            .then((data) => {
                console.log('Achievements received:', data);
                setAchievements(data || { totalUnlocked: 0, totalAchievements: 0, achievements: [] });
            })
            .catch((err) => {
                console.error('Error fetching achievements:', err);
                setAchievements({ totalUnlocked: 0, totalAchievements: 0, achievements: [] });
            });
    }, []);

    // Handle opening edit modal
    const handleOpenEditModal = () => {
        if (profile) {
            setEditForm({
                name: profile.name,
                about: profile.about || ''
            });
            setPasswordForm({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setEditError('');
            setIsEditModalOpen(true);
        }
    };

    // Handle form changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle submit
    const handleEditSubmit = async () => {
        try {
            setEditLoading(true);
            setEditError('');

            // Validate passwords if changing
            if (passwordForm.newPassword || passwordForm.oldPassword) {
                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    setEditError('Passwords do not match');
                    return;
                }
                if (!passwordForm.oldPassword) {
                    setEditError('Current password is required to change password');
                    return;
                }
                if (passwordForm.newPassword.length < 6) {
                    setEditError('New password must be at least 6 characters');
                    return;
                }
                // Change password
                await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
            }

            // Update profile
            await updateMyProfile({
                name: editForm.name,
                about: editForm.about
            });

            // Refresh profile data
            const updatedProfile = await getMyProfile();
            setProfile(updatedProfile);

            // Close modal instantly
            setIsEditModalOpen(false);
            
            // Show success message after modal closes
            setTimeout(() => {
                setShowSuccessMessage(true);
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            }, 100);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update profile');
            console.error('Error updating profile:', err);
        } finally {
            setEditLoading(false);
        }
    };

    if (!profile || !stats || !streak) {
        return <div className="p-8 text-gray-500 dark:text-[#7f849c]">Loading profile...</div>;
    }

    const getIconComponent = (iconName) => {
        const iconMap = {
            Flame: Flame,
            Lightbulb: Lightbulb,
            Clock: Clock,
            Target: Target,
            Award: Award,
        };
        return iconMap[iconName] || Lightbulb;
    };

    // Calculate achievements dynamically based on real stats
    const calculateDynamicAchievements = () => {
        // Create base achievements with calculated unlock status
        const baseAchievements = [
            {
                id: 'fire-starter',
                title: 'Fire Starter',
                description: 'Maintained a learning streak for 7 consecutive days',
                icon: 'Flame',
                unlocked: streak?.currentStreak >= 7,
                requirement: '7-day streak',
                currentProgress: `${streak?.currentStreak || 0}/7 days`,
                lightBg: 'from-yellow-50 to-orange-50',
                darkBg: 'dark:from-yellow-500/10 dark:to-orange-500/10',
                lightBorder: 'border-yellow-200',
                darkBorder: 'dark:border-yellow-500/20',
                lightIconBg: 'bg-yellow-100',
                darkIconBg: 'dark:bg-yellow-500/15',
                lightIconColor: 'text-yellow-600',
                darkIconColor: 'dark:text-yellow-400'
            },
            {
                id: 'skill-collector',
                title: 'Skill Collector',
                description: 'Added 5 or more skills to your learning path',
                icon: 'Lightbulb',
                unlocked: stats?.totalSkills >= 5,
                requirement: '5 skills tracked',
                currentProgress: `${stats?.totalSkills || 0}/5 skills`,
                lightBg: 'from-indigo-50 to-blue-50',
                darkBg: 'dark:from-indigo-500/10 dark:to-blue-500/10',
                lightBorder: 'border-indigo-200',
                darkBorder: 'dark:border-indigo-500/20',
                lightIconBg: 'bg-indigo-100',
                darkIconBg: 'dark:bg-indigo-500/15',
                lightIconColor: 'text-indigo-600',
                darkIconColor: 'dark:text-indigo-400'
            },
            {
                id: 'century-club',
                title: 'Century Club',
                description: 'Logged over 100 hours of learning time',
                icon: 'Clock',
                unlocked: (learningStats?.totalMinutes || 0) / 60 >= 100,
                requirement: '100+ hours',
                currentProgress: `${Math.round((learningStats?.totalMinutes || 0) / 60)}/100 hours`,
                lightBg: 'from-green-50 to-emerald-50',
                darkBg: 'dark:from-green-500/10 dark:to-emerald-500/10',
                lightBorder: 'border-green-200',
                darkBorder: 'dark:border-green-500/20',
                lightIconBg: 'bg-green-100',
                darkIconBg: 'dark:bg-green-500/15',
                lightIconColor: 'text-green-600',
                darkIconColor: 'dark:text-green-400'
            },
            {
                id: 'goal-getter',
                title: 'Goal Getter',
                description: 'Created your first learning goal',
                icon: 'Target',
                unlocked: false,
                requirement: 'First goal',
                currentProgress: '0/1 goal',
                lightBg: 'from-purple-50 to-pink-50',
                darkBg: 'dark:from-purple-500/10 dark:to-pink-500/10',
                lightBorder: 'border-purple-200',
                darkBorder: 'dark:border-purple-500/20',
                lightIconBg: 'bg-purple-100',
                darkIconBg: 'dark:bg-purple-500/15',
                lightIconColor: 'text-purple-600',
                darkIconColor: 'dark:text-purple-400'
            },
            {
                id: 'completion-master',
                title: 'Completion Master',
                description: 'Successfully completed your first skill',
                icon: 'Award',
                unlocked: stats?.completedSkills >= 1,
                requirement: 'Skill completed',
                currentProgress: `${stats?.completedSkills || 0}/1 completed`,
                lightBg: 'from-blue-50 to-cyan-50',
                darkBg: 'dark:from-blue-500/10 dark:to-cyan-500/10',
                lightBorder: 'border-blue-200',
                darkBorder: 'dark:border-blue-500/20',
                lightIconBg: 'bg-blue-100',
                darkIconBg: 'dark:bg-blue-500/15',
                lightIconColor: 'text-blue-600',
                darkIconColor: 'dark:text-blue-400'
            },
            {
                id: 'unstoppable',
                title: 'Unstoppable',
                description: 'Maintain a 30-day learning streak',
                icon: 'Flame',
                unlocked: streak?.currentStreak >= 30,
                requirement: '30-day streak',
                currentProgress: `${streak?.currentStreak || 0}/30 days`,
                lightBg: 'from-red-50 to-pink-50',
                darkBg: 'dark:from-red-500/10 dark:to-pink-500/10',
                lightBorder: 'border-red-200',
                darkBorder: 'dark:border-red-500/20',
                lightIconBg: 'bg-red-100',
                darkIconBg: 'dark:bg-red-500/15',
                lightIconColor: 'text-red-600',
                darkIconColor: 'dark:text-red-400'
            }
        ];

        // Override with backend data if available
        if (achievements?.achievements && achievements.achievements.length > 0) {
            const backendMap = {};
            achievements.achievements.forEach(a => {
                backendMap[a.id] = a;
            });
            
            baseAchievements.forEach(achievement => {
                if (backendMap[achievement.id]) {
                    achievement.unlocked = backendMap[achievement.id].unlocked;
                    achievement.currentProgress = backendMap[achievement.id].currentProgress;
                }
            });
        }

        return baseAchievements;
    };

    const dynamicAchievements = calculateDynamicAchievements();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profile"
                description="Manage your account and view your achievements"
                action={false}
            />

            {/* Success Notification */}
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Profile saved successfully!</p>
                </div>
            )}

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
                                        Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric"
                                        }) : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button variant="secondary" icon={Edit} onClick={handleOpenEditModal}>
                        Edit Profile
                    </Button>
                </div>

                {/* Bio */}
                <div className="pt-6 border-t border-gray-100 dark:border-[#272739]">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] mb-2">About</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                        {(profile.about && profile.about.trim()) ? profile.about : 'No bio added yet. Click Edit Profile to add one.'}
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
                            {learningStats?.totalSessions || 0}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Sessions</p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-[#7f849c]">
                            {learningStats?.mostStudiedSkill ? `Top: ${learningStats.mostStudiedSkill}` : 'No sessions yet'}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                            {Math.round((learningStats?.totalMinutes || 0) / 60)}h
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Hours</p>
                        <div className="mt-2 text-xs text-gray-500 dark:text-[#7f849c]">
                            {learningStats?.avgMinutesPerSkill ? `Avg ${Math.round(learningStats.avgMinutesPerSkill)} min/skill` : 'No data yet'}
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
                    {dynamicAchievements && dynamicAchievements.some(a => a.unlocked) && (
                        <div className="mb-4 pb-4 border-b border-gray-100 dark:border-[#272739]">
                            <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                                {dynamicAchievements.filter(a => a.unlocked).length} of {dynamicAchievements.length} unlocked
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dynamicAchievements.map((achievement) => {
                            const IconComponent = getIconComponent(achievement.icon);
                            return (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-xl border transition-all ${achievement.unlocked
                                        ? `bg-gradient-to-br ${achievement.lightBg} ${achievement.darkBg} ${achievement.lightBorder} ${achievement.darkBorder}`
                                        : 'bg-gray-50 dark:bg-[#272739] border-gray-200 dark:border-[#313244] opacity-60'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.unlocked
                                            ? `${achievement.lightIconBg} ${achievement.darkIconBg}`
                                            : 'bg-gray-100 dark:bg-[#313244]'
                                        }`}>
                                            <IconComponent className={`w-6 h-6 ${achievement.unlocked
                                                ? `${achievement.lightIconColor} ${achievement.darkIconColor}`
                                                : 'text-gray-400 dark:text-[#6c7086]'
                                            }`} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">{achievement.title}</h4>
                                            <p className="text-xs text-gray-600 dark:text-[#9399b2]">{achievement.currentProgress}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                                        {achievement.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </Section>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Profile"
                size="lg"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={editLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleEditSubmit}
                            loading={editLoading}
                        >
                            Save Changes
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6">
                    {editError && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">{editError}</p>
                        </div>
                    )}

                    {/* Profile Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] mb-4">Profile Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    Full Name
                                </label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditFormChange}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    About
                                </label>
                                <textarea
                                    name="about"
                                    value={editForm.about}
                                    onChange={handleEditFormChange}
                                    placeholder="Tell us about yourself"
                                    rows="4"
                                    className="w-full px-4 py-2 bg-white dark:bg-[#313244] border border-gray-200 dark:border-[#313244] rounded-lg text-gray-900 dark:text-[#cdd6f4] placeholder-gray-500 dark:placeholder-[#7f849c] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="border-t border-gray-200 dark:border-[#313244] pt-6">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] mb-4">Change Password</h3>
                        <p className="text-xs text-gray-600 dark:text-[#9399b2] mb-4">Leave blank if you don't want to change your password</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    Current Password
                                </label>
                                <Input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordForm.oldPassword}
                                    onChange={handlePasswordFormChange}
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    New Password
                                </label>
                                <Input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordFormChange}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    Confirm Password
                                </label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordFormChange}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;