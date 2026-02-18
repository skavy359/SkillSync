import React, { useState } from 'react';
import { Lightbulb, Eye, EyeOff, ArrowRight, Github, Chrome, Check } from 'lucide-react';

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

    // Password strength
    const getPasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '' };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        const levels = [
            { score: 0, label: '', color: '' },
            { score: 1, label: 'Weak', color: 'bg-red-500' },
            { score: 2, label: 'Fair', color: 'bg-yellow-500' },
            { score: 3, label: 'Good', color: 'bg-blue-500' },
            { score: 4, label: 'Strong', color: 'bg-green-500' },
        ];
        return levels[score];
    };

    const strength = getPasswordStrength(form.password);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Full name is required';
        if (!form.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!agreed) newErrors.agreed = 'You must accept the terms to continue';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onLogin && onLogin();
        }, 1500);
    };

    const perks = [
        'Track unlimited skills and sessions',
        'Smart burnout detection & alerts',
        'Analytics and learning velocity',
        'Free forever — no credit card needed',
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* ─── Left Branding Panel ───────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 overflow-hidden">

                {/* Decorative blobs */}
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

                {/* Logo */}
                <div className="relative flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">SkillSync</span>
                </div>

                {/* Hero Content */}
                <div className="relative space-y-8">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-white bg-opacity-15 rounded-full px-4 py-1.5 mb-4">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-white text-sm font-medium">Free forever plan available</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                            Start your learning<br />
                            <span className="text-indigo-200">journey today.</span>
                        </h1>
                        <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
                            Everything you need to become a more consistent, focused, and effective learner — in one place.
                        </p>
                    </div>

                    {/* Perks List */}
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

                    {/* Social Proof */}
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5">
                        <div className="flex items-center space-x-3 mb-3">
                            {['AK', 'JL', 'MR', 'SP'].map((avatar, i) => (
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
                            <span className="text-indigo-200 text-sm ml-2">+12,000 learners</span>
                        </div>
                        <p className="text-white text-xs leading-relaxed opacity-90">
                            Join a community of developers, designers, and creators leveling up every day.
                        </p>
                    </div>
                </div>

                <div className="relative text-indigo-400 text-sm">
                    © 2025 SkillSync. Built for learners, by learners.
                </div>
            </div>

            {/* ─── Right Form Panel ──────────────────────────────── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center space-x-3 mb-10">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">SkillSync</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
                        <p className="text-gray-500">Free to start. No credit card required.</p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="space-y-3 mb-6">
                        <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
                            <Chrome className="w-5 h-5 text-red-500" />
                            <span>Sign up with Google</span>
                        </button>
                        <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
                            <Github className="w-5 h-5 text-gray-800" />
                            <span>Sign up with GitHub</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => {
                                    setForm({ ...form, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: '' });
                                }}
                                placeholder="John Doe"
                                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                placeholder="john@example.com"
                                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                        errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                            )}

                            {/* Password Strength Meter */}
                            {form.password && (
                                <div className="mt-2">
                                    <div className="flex space-x-1 mb-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                    strength.score >= i ? strength.color : 'bg-gray-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    {strength.label && (
                                        <p className={`text-xs font-medium ${
                                            strength.score === 1 ? 'text-red-600' :
                                                strength.score === 2 ? 'text-yellow-600' :
                                                    strength.score === 3 ? 'text-blue-600' :
                                                        'text-green-600'
                                        }`}>
                                            {strength.label} password
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                    className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                                        errors.confirmPassword ? 'border-red-300 bg-red-50' :
                                            form.confirmPassword && form.confirmPassword === form.password ? 'border-green-300' :
                                                'border-gray-200'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                {/* Checkmark when matching */}
                                {form.confirmPassword && form.confirmPassword === form.password && (
                                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                        <Check className="w-4 h-4 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms */}
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
                                    className="w-4 h-4 mt-0.5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer select-none leading-relaxed">
                                    I agree to the{' '}
                                    <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                        Terms of Service
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>
                            {errors.agreed && (
                                <p className="mt-1.5 ml-7 text-xs text-red-600">{errors.agreed}</p>
                            )}
                        </div>

                        {/* Submit */}
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

                    {/* Footer link */}
                    <p className="mt-8 text-center text-sm text-gray-500">
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
    );
};

export default Register;