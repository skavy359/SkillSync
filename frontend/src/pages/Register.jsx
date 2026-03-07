import React, { useState, useEffect } from 'react';
import { Lightbulb, Eye, EyeOff, ArrowRight, Check, X } from 'lucide-react';
import api from "../services/api.js";

const Register = ({ onNavigate, onLogin }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    const [platformStats, setPlatformStats] = useState(null);
    const [modalOpen, setModalOpen] = useState(null); // 'terms' | 'privacy' | null

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/auth/platform-stats');
                setPlatformStats(data.data);
            } catch (err) {
                console.error('Failed to fetch platform stats:', err);
            }
        };
        fetchStats();
    }, []);

    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '', max: 5 };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        const labels = [
            { label: '', color: '' },
            { label: 'Very Weak', color: 'bg-red-500' },
            { label: 'Weak', color: 'bg-red-400' },
            { label: 'Fair', color: 'bg-yellow-500' },
            { label: 'Good', color: 'bg-blue-500' },
            { label: 'Strong', color: 'bg-green-500' },
        ];
        return { ...labels[score], score, max: 5 };
    };

    const strength = getPasswordStrength(form.password);

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) newErrors.name = 'Full name is required';
        else if (!/^[A-Za-z\s]+$/.test(form.name.trim()))
            newErrors.name = 'Name must contain only letters and spaces';
        else if (form.name.trim().length < 2)
            newErrors.name = 'Name must be at least 2 characters';

        if (!form.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else {
            const missing = [];
            if (form.password.length < 8) missing.push('at least 8 characters');
            if (!/[A-Z]/.test(form.password)) missing.push('an uppercase letter');
            if (!/[a-z]/.test(form.password)) missing.push('a lowercase letter');
            if (!/[0-9]/.test(form.password)) missing.push('a number');
            if (!/[^A-Za-z0-9]/.test(form.password)) missing.push('a special character');
            if (missing.length > 0)
                newErrors.password = `Password must contain ${missing.join(', ')}`;
        }

        if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (!agreed) newErrors.agreed = 'You must accept the terms to continue';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            const { registerUser, loginUser } = await import('../services/authService.js');
            const res = await registerUser(form.name, form.email, form.password);

            if (res.success) {
                const loginRes = await loginUser(form.email, form.password);
                if (loginRes.success) {
                    const { token, id, name, email, role } = loginRes.data;
                    localStorage.setItem('token', token);
                    onLogin && onLogin({ id, name, email, role });
                } else {
                    onNavigate && onNavigate('login');
                }
            } else {
                setErrors({ email: res.message || 'Registration failed' });
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setErrors({ email: message });
        } finally {
            setLoading(false);
        }
    };

    const perks = [
        'Track unlimited skills and sessions',
        'Smart burnout detection & alerts',
        'Analytics and learning velocity',
    ];

    return (
        <>
            <div className="min-h-screen flex bg-[#0f0f1a] dark:bg-[#0f0f1a]">

                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 overflow-hidden">

                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-5 rounded-full" />
                        <div className="absolute top-1/3 -left-16 w-56 h-56 bg-white opacity-5 rounded-full" />
                        <div className="absolute -bottom-24 right-16 w-80 h-80 bg-purple-400 opacity-10 rounded-full" />
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)`,
                                backgroundSize: '32px 32px',
                            }}
                        />
                    </div>

                    <div className="relative flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">SkillSync</span>
                    </div>

                    <div className="relative space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                                Start your learning<br />
                                <span className="text-indigo-200">journey today.</span>
                            </h1>
                            <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
                                Everything you need to become a more consistent, focused, and effective learner — in one place.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {perks.map((perk, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-green-400 bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-green-300" />
                                    </div>
                                    <span className="text-indigo-100 text-sm">{perk}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5">
                            <div className="flex items-center space-x-3 mb-3">
                                {['KS', 'KD', 'RT', 'MS'].map((avatar, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold -ml-2 first:ml-0 border-2 border-indigo-700"
                                        style={{
                                            background: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'][i],
                                        }}
                                    >
                                        {avatar}
                                    </div>
                                ))}
                                <span className="text-indigo-200 text-sm ml-2">
                                    +{platformStats ? platformStats.totalUsers.toLocaleString() : '...'} learners
                                </span>
                            </div>
                            <p className="text-white text-xs leading-relaxed opacity-90">
                                Join a community of developers, designers, and creators leveling up every day.
                            </p>
                        </div>
                    </div>

                    <div className="relative text-indigo-400 text-sm">
                        © 2026 SkillSync. Built for learners, by learners.
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">

                        <div className="flex lg:hidden items-center space-x-3 mb-10">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[#cdd6f4]">SkillSync</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-[#cdd6f4] mb-2">Create your account</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-[#a6adc8] mb-2">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => {
                                        setForm({ ...form, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                    placeholder="Kavy Sharma"
                                    className={`w-full px-4 py-3 bg-[#1e1e2e] border rounded-xl text-sm text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.name ? 'border-red-500 bg-red-500/10' : 'border-[#313244]'
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#a6adc8] mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => {
                                        setForm({ ...form, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: '' });
                                    }}
                                    placeholder="kavy123@example.com"
                                    className={`w-full px-4 py-3 bg-[#1e1e2e] border rounded-xl text-sm text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500 bg-red-500/10' : 'border-[#313244]'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#a6adc8] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={(e) => {
                                            setForm({ ...form, password: e.target.value });
                                            if (errors.password) setErrors({ ...errors, password: '' });
                                        }}
                                        placeholder="Min. 8 characters"
                                        className={`w-full px-4 py-3 pr-12 bg-[#1e1e2e] border rounded-xl text-sm text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.password ? 'border-red-400 bg-[#2d1f1f]' : 'border-[#313244]'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7086] hover:text-[#a6adc8] transition-colors p-1 rounded"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                                )}

                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex space-x-1 mb-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength.score >= i ? strength.color : 'bg-[#313244]'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {strength.label && (
                                            <p className={`text-xs font-medium ${strength.score <= 2 ? 'text-red-400' :
                                                strength.score === 3 ? 'text-yellow-400' :
                                                    strength.score === 4 ? 'text-blue-400' :
                                                        'text-green-400'
                                                }`}>
                                                {strength.label} password
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#a6adc8] mb-2">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={form.confirmPassword}
                                        onChange={(e) => {
                                            setForm({ ...form, confirmPassword: e.target.value });
                                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                        }}
                                        placeholder="Repeat your password"
                                        className={`w-full px-4 py-3 pr-12 bg-[#1e1e2e] border rounded-xl text-sm text-[#cdd6f4] placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-400 bg-[#2d1f1f]' :
                                            form.confirmPassword && form.confirmPassword === form.password ? 'border-green-400' :
                                                'border-[#313244]'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7086] hover:text-[#a6adc8] transition-colors p-1 rounded"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    {form.confirmPassword && form.confirmPassword === form.password && (
                                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                            <Check className="w-4 h-4 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="pt-1">
                                <div className="flex items-start space-x-3">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => {
                                            setAgreed(e.target.checked);
                                            if (errors.agreed) setErrors({ ...errors, agreed: '' });
                                        }}
                                        className="w-4 h-4 mt-0.5 text-indigo-600 border-[#313244] rounded focus:ring-indigo-500 cursor-pointer flex-shrink-0 bg-[#1e1e2e]"
                                    />
                                    <label htmlFor="terms" className="text-sm text-[#a6adc8] cursor-pointer select-none leading-relaxed">
                                        I agree to the{' '}
                                        <button type="button" onClick={(e) => { e.preventDefault(); setModalOpen('terms'); }} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                            Terms of Service
                                        </button>{' '}
                                        and{' '}
                                        <button type="button" onClick={(e) => { e.preventDefault(); setModalOpen('privacy'); }} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                            Privacy Policy
                                        </button>
                                    </label>
                                </div>
                                {errors.agreed && (
                                    <p className="mt-1.5 ml-7 text-xs text-red-400">{errors.agreed}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-1"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create free account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-[#9399b2]">
                            Already have an account?{' '}
                            <button
                                onClick={() => onNavigate && onNavigate('login')}
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Sign in instead
                            </button>
                        </p>

                    </div>
                </div>

            </div>

            {
                modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setModalOpen(null)}
                        />
                        <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[#313244]">
                                <h3 className="text-lg font-bold text-[#cdd6f4]">
                                    {modalOpen === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                                </h3>
                                <button
                                    onClick={() => setModalOpen(null)}
                                    className="p-1.5 rounded-lg text-[#6c7086] hover:text-[#a6adc8] hover:bg-[#313244] transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="px-6 py-5 overflow-y-auto text-sm text-[#a6adc8] leading-relaxed space-y-4">
                                {modalOpen === 'terms' ? (
                                    <>
                                        <p className="font-semibold text-[#cdd6f4]">Last updated: February 2026</p>
                                        <p>Welcome to SkillSync. By creating an account and using our platform, you agree to the following terms:</p>
                                        <h4 className="font-semibold text-[#cdd6f4] mt-3">1. Account Responsibility</h4>
                                        <p>You are responsible for maintaining the security of your account credentials. You agree to provide accurate information during registration and to keep it up to date.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">2. Acceptable Use</h4>
                                        <p>You agree to use SkillSync solely for personal learning and skill tracking purposes. You may not use the platform to distribute harmful content, violate any laws, or interfere with other users' experience.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">3. Intellectual Property</h4>
                                        <p>All content, features, and functionality of SkillSync are owned by SkillSync and protected by copyright and trademark laws. Your learning data belongs to you.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">4. Service Availability</h4>
                                        <p>We strive for 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance or updates that temporarily affect availability.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">5. Termination</h4>
                                        <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from your profile settings.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">6. Limitation of Liability</h4>
                                        <p>SkillSync is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-[#cdd6f4]">Last updated: February 2026</p>
                                        <p>At SkillSync, your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
                                        <h4 className="font-semibold text-[#cdd6f4] mt-3">1. Information We Collect</h4>
                                        <p>We collect your name, email address, and password when you create an account. We also store your learning sessions, skills, and usage analytics to provide our services.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">2. How We Use Your Data</h4>
                                        <p>Your data is used to personalize your learning experience, generate analytics and insights, detect burnout patterns, and improve the platform.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">3. Data Storage & Security</h4>
                                        <p>All data is stored securely with industry-standard encryption. Passwords are hashed using bcrypt and are never stored in plain text. We use JWT tokens for authentication.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">4. Data Sharing</h4>
                                        <p>We do not sell, trade, or share your personal data with third parties. Your learning data is yours and will never be used for advertising purposes.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">5. Your Rights</h4>
                                        <p>You have the right to access, update, or delete your personal information at any time. You may export your data or request complete account deletion.</p>
                                        <h4 className="font-semibold text-[#cdd6f4]">6. Cookies</h4>
                                        <p>We use local storage to maintain your authentication session. We do not use third-party tracking cookies or analytics services.</p>
                                    </>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-[#313244] bg-[#0f0f1a]">
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
        </>
    );
};

export default Register;