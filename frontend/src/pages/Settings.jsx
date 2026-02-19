import React, { useState } from 'react';
import { Shield, FileText, X, ChevronRight } from 'lucide-react';

const Settings = () => {
    const [modalOpen, setModalOpen] = useState(null);
    const [notifPrefs, setNotifPrefs] = useState(() => {
        const stored = localStorage.getItem('notifPrefs');
        return stored ? JSON.parse(stored) : {
            sessionReminders: true,
            goalAlerts: true,
            weeklySummary: false,
        };
    });

    const toggleNotif = (key) => {
        setNotifPrefs(prev => {
            const updated = { ...prev, [key]: !prev[key] };
            localStorage.setItem('notifPrefs', JSON.stringify(updated));
            return updated;
        });
    };

    const notifItems = [
        { key: 'sessionReminders', label: 'Session reminders', desc: 'Get reminded to log your learning sessions' },
        { key: 'goalAlerts', label: 'Goal alerts', desc: 'Notifications when goals are due or completed' },
        { key: 'weeklySummary', label: 'Weekly summary', desc: 'Receive a weekly learning summary' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Settings</h1>
                <p className="text-gray-500 dark:text-[#7f849c] mt-1">Manage your preferences and account settings.</p>
            </div>

            {/* Notifications Preferences */}
            <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-[#272739]">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-[#cdd6f4]">Notifications</h2>
                    <p className="text-sm text-gray-500 dark:text-[#7f849c] mt-0.5">Manage how you receive notifications</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-[#272739]">
                    {notifItems.map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-6 py-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">{item.label}</p>
                                <p className="text-xs text-gray-500 dark:text-[#7f849c] mt-0.5">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotif(item.key)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifPrefs[item.key] ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-[#45475a]'
                                    }`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${notifPrefs[item.key] ? 'translate-x-5' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legal */}
            <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-[#272739]">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-[#cdd6f4]">Legal</h2>
                    <p className="text-sm text-gray-500 dark:text-[#7f849c] mt-0.5">Review our policies</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-[#272739]">
                    <button
                        onClick={() => setModalOpen('terms')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
                            <span className="text-sm font-medium text-gray-700 dark:text-[#a6adc8]">Terms of Service</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#6c7086]" />
                    </button>
                    <button
                        onClick={() => setModalOpen('privacy')}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#272739] transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
                            <span className="text-sm font-medium text-gray-700 dark:text-[#a6adc8]">Privacy Policy</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-[#6c7086]" />
                    </button>
                </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-[#272739]">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-[#cdd6f4]">About</h2>
                </div>
                <div className="px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-[#9399b2]">Version</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-[#9399b2]">License</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">MIT License</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-[#9399b2]">Built with</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">React + Spring Boot</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-[#272739]">
                        <p className="text-xs text-gray-400 dark:text-[#6c7086] text-center">
                            © 2026 SkillSync. Built for learners, by learners.
                        </p>
                    </div>
                </div>
            </div>

            {/* Terms / Privacy Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setModalOpen(null)}
                    />
                    <div className="relative bg-white dark:bg-[#1e1e2e] rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#272739]">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">
                                {modalOpen === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(null)}
                                className="p-1.5 rounded-lg text-gray-400 dark:text-[#6c7086] hover:text-gray-600 dark:hover:text-[#cdd6f4] hover:bg-gray-100 dark:hover:bg-[#313244] transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 overflow-y-auto text-sm text-gray-600 dark:text-[#9399b2] leading-relaxed space-y-4">
                            {modalOpen === 'terms' ? (
                                <>
                                    <p className="font-semibold text-gray-800 dark:text-[#bac2de]">Last updated: February 2026</p>
                                    <p>Welcome to SkillSync. By creating an account and using our platform, you agree to the following terms:</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de] mt-3">1. Account Responsibility</h4>
                                    <p>You are responsible for maintaining the security of your account credentials. You agree to provide accurate information during registration and to keep it up to date.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">2. Acceptable Use</h4>
                                    <p>You agree to use SkillSync solely for personal learning and skill tracking purposes. You may not use the platform to distribute harmful content, violate any laws, or interfere with other users' experience.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">3. Intellectual Property</h4>
                                    <p>All content, features, and functionality of SkillSync are owned by SkillSync and protected by copyright and trademark laws. Your learning data belongs to you.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">4. Service Availability</h4>
                                    <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance or updates that temporarily affect availability.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">5. Termination</h4>
                                    <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from your profile settings.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">6. Limitation of Liability</h4>
                                    <p>SkillSync is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold text-gray-800 dark:text-[#bac2de]">Last updated: February 2026</p>
                                    <p>At SkillSync, your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de] mt-3">1. Information We Collect</h4>
                                    <p>We collect your name, email address, and password when you create an account. We also store your learning sessions, skills, and usage analytics to provide our services.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">2. How We Use Your Data</h4>
                                    <p>Your data is used to personalize your learning experience, generate analytics and insights, detect burnout patterns, and improve the platform.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">3. Data Storage & Security</h4>
                                    <p>All data is stored securely with industry-standard encryption. Passwords are hashed using bcrypt and are never stored in plain text. We use JWT tokens for authentication.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">4. Data Sharing</h4>
                                    <p>We do not sell, trade, or share your personal data with third parties. Your learning data is yours and will never be used for advertising purposes.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">5. Your Rights</h4>
                                    <p>You have the right to access, update, or delete your personal information at any time. You may export your data or request complete account deletion.</p>
                                    <h4 className="font-semibold text-gray-800 dark:text-[#bac2de]">6. Cookies</h4>
                                    <p>We use local storage to maintain your authentication session. We do not use third-party tracking cookies or analytics services.</p>
                                </>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#272739] bg-gray-50 dark:bg-[#181825]">
                            <button
                                onClick={() => setModalOpen(null)}
                                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all"
                            >
                                I understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
