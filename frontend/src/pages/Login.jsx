import React, { useState, useEffect } from 'react';
import { Lightbulb, Eye, EyeOff, ArrowRight, Quote } from 'lucide-react';
import { loginUser } from "../services/authService.js";
import api from "../services/api.js";

const testimonials = [
    {
        text: "SkillSync completely changed how I approach learning. I went from inconsistent to clocking 20+ hours a week without feeling burned out.",
        name: "Sarah M.",
        role: "Full-Stack Developer",
        initials: "SM",
        gradient: "from-yellow-400 to-orange-500"
    },
    {
        text: "The streak tracking feature is incredibly motivating. I've maintained a 45-day learning streak and my coding skills have skyrocketed.",
        name: "Arjun K.",
        role: "Data Scientist",
        initials: "AK",
        gradient: "from-cyan-400 to-blue-500"
    },
    {
        text: "I love how SkillSync breaks down my learning into manageable sessions. The burnout risk feature saved me from overworking multiple times.",
        name: "Emily R.",
        role: "UX Designer",
        initials: "ER",
        gradient: "from-pink-400 to-rose-500"
    },
    {
        text: "As a self-taught developer, SkillSync gave me the structure I was missing. The analytics helped me understand my learning patterns.",
        name: "James L.",
        role: "Frontend Engineer",
        initials: "JL",
        gradient: "from-green-400 to-emerald-500"
    },
    {
        text: "The recommendations engine is spot-on. It always knows exactly which skill I should focus on next to maximize my growth.",
        name: "Priya S.",
        role: "ML Engineer",
        initials: "PS",
        gradient: "from-violet-400 to-purple-500"
    },
    {
        text: "SkillSync's category analytics helped our team track learning across different domains. It's become essential for our growth plans.",
        name: "Michael T.",
        role: "Engineering Manager",
        initials: "MT",
        gradient: "from-amber-400 to-red-500"
    }
];

const Login = ({ onNavigate, onLogin }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [platformStats, setPlatformStats] = useState(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [rememberMe, setRememberMe] = useState(false);

    // Fetch platform stats on mount
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

    // Auto-rotate testimonials every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!form.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
        if (!form.password) newErrors.password = 'Password is required';
        else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
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
            const res = await loginUser(form.email, form.password, rememberMe);

            if (res.success) {
                const { token, id, name, email, role } = res.data;

                // Store token
                localStorage.setItem('token', token);

                // Pass user data (including role from backend) to App
                onLogin && onLogin({
                    id,
                    name,
                    email,
                    role
                });
            } else {
                setErrors({ password: 'Invalid credentials' });
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setErrors({ password: message });
        } finally {
            setLoading(false);
        }
    };

    const formatStat = (num) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
        return `${num}+`;
    };

    const stats = platformStats
        ? [
            { value: formatStat(platformStats.totalUsers), label: 'Active Learners' },
            { value: formatStat(platformStats.totalSessions), label: 'Sessions Logged' },
            { value: formatStat(platformStats.totalSkills), label: 'Skills Tracked' },
        ]
        : [
            { value: '—', label: 'Active Learners' },
            { value: '—', label: 'Sessions Logged' },
            { value: '—', label: 'Skills Tracked' },
        ];

    return (
        <div className="min-h-screen flex bg-gray-50">

            {/* ─── Left Branding Panel ───────────────────────────── */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex-col justify-between p-12 overflow-hidden">

                {/* Decorative blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-5 rounded-full" />
                    <div className="absolute top-1/2 -left-20 w-64 h-64 bg-white opacity-5 rounded-full" />
                    <div className="absolute -bottom-20 right-20 w-72 h-72 bg-purple-400 opacity-10 rounded-full" />
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
                        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                            Track your learning.<br />
                            <span className="text-indigo-200">Master your skills.</span>
                        </h1>
                        <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
                            Join thousands of learners who stay consistent, avoid burnout, and hit their goals faster with SkillSync.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-8">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-indigo-300 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Auto-rotating Testimonials */}
                    <div className="relative">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 min-h-[160px] transition-all duration-500">
                            <Quote className="w-5 h-5 text-indigo-300 opacity-50 mb-2" />
                            <p className="text-white text-sm leading-relaxed mb-4 transition-opacity duration-500" key={activeTestimonial}>
                                "{testimonials[activeTestimonial].text}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-9 h-9 bg-gradient-to-br ${testimonials[activeTestimonial].gradient} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                                        {testimonials[activeTestimonial].initials}
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-semibold">{testimonials[activeTestimonial].name}</div>
                                        <div className="text-indigo-300 text-xs">{testimonials[activeTestimonial].role}</div>
                                    </div>
                                </div>
                                {/* Dot indicators */}
                                <div className="flex items-center space-x-1.5">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveTestimonial(i)}
                                            className={`rounded-full transition-all duration-300 ${i === activeTestimonial
                                                ? 'w-6 h-2 bg-white'
                                                : 'w-2 h-2 bg-white bg-opacity-30 hover:bg-opacity-50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500">Sign in to continue your learning journey</p>
                    </div>

                    {/* Email & Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-3 pr-12 bg-white border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
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
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center space-x-2 pt-1">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                                Keep me signed in for 5 days
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer link */}
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <button
                            onClick={() => onNavigate && onNavigate('register')}
                            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            Create one free
                        </button>
                    </p>

                </div>
            </div>

        </div>
    );
};

export default Login;