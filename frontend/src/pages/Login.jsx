import React, { useState, useEffect } from 'react';
import { Lightbulb, Eye, EyeOff, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { loginUser } from "../services/authService.js";
import api from "../services/api.js";

const testimonials = [
    { text: "SkillSync completely changed how I approach learning. I went from inconsistent to clocking 20+ hours a week without feeling burned out.", name: "Malay Shikhar Soni", role: "Full-Stack Developer", initials: "MS", gradient: "from-amber-400 to-orange-500" },
    { text: "The streak tracking feature is incredibly motivating. I've maintained a 45-day learning streak and my coding skills have skyrocketed.", name: "Ronit Thakur", role: "Software Engineer", initials: "RT", gradient: "from-cyan-400 to-blue-500" },
    { text: "I love how SkillSync breaks down my learning into manageable sessions. The burnout risk feature saved me from overworking multiple times.", name: "Saransh Sharma", role: "UX Designer", initials: "SS", gradient: "from-pink-400 to-rose-500" },
    { text: "As a self-taught developer, SkillSync gave me the structure I was missing. The analytics helped me understand my learning patterns.", name: "Kartavya Shrivastava", role: "Frontend Engineer", initials: "KS", gradient: "from-emerald-400 to-teal-500" },
    { text: "The recommendations engine is spot-on. It always knows exactly which task I should focus on next to maximize my growth.", name: "Aditya Shukla", role: "Data Scientist", initials: "AS", gradient: "from-violet-400 to-purple-500" }
];

const Login = ({ onNavigate, onLogin }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [platformStats, setPlatformStats] = useState(null);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        api.get('/auth/platform-stats')
            .then(({ data }) => setPlatformStats(data.data))
            .catch(err => console.error('Failed to fetch stats:', err));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
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
        if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

        setErrors({});
        setLoading(true);

        try {
            const res = await loginUser(form.email, form.password, rememberMe);
            if (res.success) {
                const { token, id, name, email, role } = res.data;
                localStorage.setItem('token', token);
                onLogin && onLogin({ id, name, email, role });
            } else {
                setErrors({ password: 'Invalid credentials' });
            }
        } catch (err) {
            setErrors({ password: err.response?.data?.message || 'Login failed' });
        } finally {
            setLoading(false);
        }
    };

    const formatStat = (num) => num >= 1000 ? `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K+` : `${num}+`;
    const stats = platformStats
        ? [ { value: formatStat(platformStats.totalUsers), label: 'Active Learners' }, { value: formatStat(platformStats.totalSessions), label: 'Sessions Logged' }, { value: formatStat(platformStats.totalSkills), label: 'Skills Tracked' } ]
        : [ { value: '—', label: 'Active Learners' }, { value: '—', label: 'Sessions Logged' }, { value: '—', label: 'Skills Tracked' } ];

    return (
        <div className="min-h-screen flex bg-[#0a0a0f] text-white selection:bg-indigo-500/30">

            {/* --- Left Hero Panel --- */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-[#050510] flex-col justify-between p-12 lg:p-16 overflow-hidden border-r border-white/5">
                
                {/* Advanced Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 animate-pulse-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01OS4yNSAwSDBWMHogTTEuMjEgNjBIMFYwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50" />
                </div>

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10 shrink-0">
                        <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                        SkillSync
                    </span>
                </div>

                {/* Main Copy */}
                <div className="relative z-10 space-y-12 shrink-0 my-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-sm font-bold shadow-sm backdrop-blur-md text-indigo-300 uppercase tracking-widest">
                            <Sparkles className="w-4 h-4" /> Welcome Back
                        </div>
                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
                            Master your potential.<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">Own your growth.</span>
                        </h1>
                        <p className="text-gray-400 text-lg xl:text-xl font-medium leading-relaxed max-w-lg">
                            Join elite learners tracking their journey, avoiding burnout, and hitting their career milestones faster with SkillSync.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
                        {stats.map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="text-3xl font-black text-white tracking-tight">{stat.value}</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial Widget */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300">
                            <Quote className="w-6 h-6 text-indigo-400/40 mb-3" />
                            <p className="text-gray-300 text-[15px] font-medium leading-relaxed min-h-[70px] mb-6">
                                "{testimonials[activeTestimonial].text}"
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg bg-gradient-to-br ${testimonials[activeTestimonial].gradient}`}>
                                        {testimonials[activeTestimonial].initials}
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-bold">{testimonials[activeTestimonial].name}</div>
                                        <div className="text-indigo-400 text-xs font-semibold">{testimonials[activeTestimonial].role}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveTestimonial(i)}
                                            className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-6 h-1.5 bg-indigo-500' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-gray-500 text-sm font-medium">
                    © {new Date().getFullYear()} SkillSync. Built for learners.
                </div>
            </div>

            {/* --- Right Auth Panel --- */}
            <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative">
                
                {/* Mobile Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 lg:hidden pointer-events-none" />

                <div className="w-full max-w-[420px] relative z-10">
                    
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-3 mb-10 lg:hidden justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10 shrink-0">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                            SkillSync
                        </span>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">Welcome back.</h2>
                        <p className="text-gray-400 font-medium text-lg">Sign in to continue your journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-300">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                                placeholder="name@example.com"
                                className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all font-medium ${
                                    errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 bg-red-500/5' : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
                                }`}
                            />
                            {errors.email && <p className="text-sm font-semibold text-red-400 pt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-bold text-gray-300">Password</label>
                                </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => {
                                        setForm({ ...form, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-3.5 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all font-medium ${
                                        errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 bg-red-500/5' : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm font-semibold text-red-400 pt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-indigo-500 bg-white/5 border-white/20 rounded focus:ring-indigo-500/50 focus:ring-offset-[#0a0a0f] focus:ring-2 transition-all cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm font-semibold text-gray-400 cursor-pointer select-none hover:text-gray-300 transition-colors">
                                Keep me signed in
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none focus:outline-none focus:ring-4 focus:ring-purple-500/30 mt-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to SkillSync</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center font-semibold text-gray-500">
                        Don't have an account?{' '}
                        <button
                            onClick={() => onNavigate && onNavigate('register')}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
                        >
                            Create one for free
                        </button>
                    </p>
                </div>
            </div>
            
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;