import React, { useState, useEffect } from 'react';
import { Lightbulb, Eye, EyeOff, ArrowRight, Check, X, Shield, Zap, TrendingUp } from 'lucide-react';
import api from "../services/api.js";

const Register = ({ onNavigate, onLogin }) => {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [errors, setErrors] = useState({});
    const [platformStats, setPlatformStats] = useState(null);
    const [modalOpen, setModalOpen] = useState(null);

    useEffect(() => {
        api.get('/auth/platform-stats')
            .then(({ data }) => setPlatformStats(data.data))
            .catch(err => console.error('Failed to fetch stats:', err));
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
            { label: 'Very Weak', color: 'bg-red-500 shadow-red-500/50' },
            { label: 'Weak', color: 'bg-orange-500 shadow-orange-500/50' },
            { label: 'Fair', color: 'bg-yellow-500 shadow-yellow-500/50' },
            { label: 'Good', color: 'bg-blue-500 shadow-blue-500/50' },
            { label: 'Strong', color: 'bg-green-500 shadow-green-500/50' },
        ];
        return { ...labels[score], score, max: 5 };
    };

    const strength = getPasswordStrength(form.password);

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = 'Full name is required';
        else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) newErrors.name = 'Name must contain only letters';
        else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!form.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else {
            const missing = [];
            if (form.password.length < 8) missing.push('8+ characters');
            if (!/[A-Z]/.test(form.password)) missing.push('an uppercase letter');
            if (!/[0-9]/.test(form.password)) missing.push('a number');
            if (!/[^A-Za-z0-9]/.test(form.password)) missing.push('a special character');
            if (missing.length > 0) newErrors.password = `Missing: ${missing.join(', ')}`;
        }

        if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password';
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (!agreed) newErrors.agreed = 'You must accept the terms';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

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
                } else onNavigate && onNavigate('login');
            } else setErrors({ email: res.message || 'Registration failed' });
        } catch (err) {
            setErrors({ email: err.response?.data?.message || 'Registration failed.' });
        } finally {
            setLoading(false);
        }
    };

    const perks = [
        { title: 'Track Everything', desc: 'Unlimited skills & sessions tracking', icon: TrendingUp, color: 'text-indigo-400' },
        { title: 'Stay Healthy', desc: 'Smart burnout detection & alerts', icon: Shield, color: 'text-emerald-400' },
        { title: 'Grow Faster', desc: 'Advanced analytics & velocity metrics', icon: Zap, color: 'text-amber-400' },
    ];

    return (
        <div className="min-h-screen flex bg-[#0a0a0f] text-white selection:bg-purple-500/30">

            <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-[#050510] flex-col justify-between p-12 lg:p-16 overflow-hidden border-r border-white/5">
                
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[100px] translate-y-1/4 translate-x-1/4 animate-pulse-slow" style={{ animationDelay: '2s' }} />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01OS4yNSAwSDBWMHogTTEuMjEgNjBIMFYwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50" />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/20 border border-white/10 shrink-0">
                        <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                        SkillSync
                    </span>
                </div>

                <div className="relative z-10 shrink-0 my-8">
                    <div>
                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
                            Start your epic<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">learning journey.</span>
                        </h1>
                        <p className="text-gray-400 text-lg xl:text-xl font-medium leading-relaxed max-w-lg mb-12">
                            Everything you need to become a more consistent, focused, and effective learner — in one beautifully crafted platform.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {perks.map((perk, i) => {
                            const Icon = perk.icon;
                            return (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10">
                                        <Icon className={`w-6 h-6 ${perk.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-0.5">{perk.title}</h3>
                                        <p className="text-sm font-medium text-gray-500">{perk.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between">
                        <div className="flex -space-x-3">
                            {['KS', 'KD', 'RT', 'MS'].map((avatar, i) => (
                                <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black ring-4 ring-[#050510] relative z-10 hover:z-20 hover:-translate-y-1 transition-transform cursor-pointer" style={{ background: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'][i] }}>
                                    {avatar}
                                </div>
                            ))}
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-white">{platformStats ? platformStats.totalUsers.toLocaleString() : '1,000'}+</p>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Learners</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-gray-500 text-sm font-medium">
                    © {new Date().getFullYear()} SkillSync. Free forever core tracking.
                </div>
            </div>

            <div className="w-full lg:w-[55%] xl:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 lg:hidden pointer-events-none" />

                <div className="w-full max-w-[420px] relative z-10 my-auto py-8">

                    <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10 shrink-0">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-3xl font-black bg-white bg-clip-text text-transparent tracking-tight">SkillSync</span>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">Create Account.</h2>
                        <p className="text-gray-400 font-medium text-lg">Join us and start tracking today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-300">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: '' }); }}
                                placeholder="e.g. Kavy Sharma"
                                className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all font-medium ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 bg-red-500/5' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'}`}
                            />
                            {errors.name && <p className="text-sm font-semibold text-red-400 pt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-300">Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: '' }); }}
                                placeholder="name@example.com"
                                className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all font-medium ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 bg-red-500/5' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'}`}
                            />
                            {errors.email && <p className="text-sm font-semibold text-red-400 pt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-300">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => { setForm({ ...form, password: e.target.value }); if (errors.password) setErrors({ ...errors, password: '' }); }}
                                    placeholder="Min. 8 characters with symbol"
                                    className={`w-full px-4 py-3.5 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all font-medium ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 bg-red-500/5' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'}`}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {form.password && (
                                <div className="mt-2.5 space-y-2">
                                    <div className="flex gap-1.5 h-1.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className={`flex-1 rounded-full transition-all duration-500 shadow-sm ${strength.score >= i ? strength.color : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-gray-400">Strength: <span className={strength.label === 'Strong' ? 'text-green-400' : 'text-gray-300'}>{strength.label || 'None'}</span></p>
                                    </div>
                                    {errors.password && <p className="text-sm font-semibold text-red-400 pt-1">{errors.password}</p>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-gray-300">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }); }}
                                    placeholder="Repeat your password"
                                    className={`w-full px-4 py-3.5 pr-12 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:bg-white/10 transition-all font-medium ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 bg-red-500/5' : form.confirmPassword && form.confirmPassword === form.password ? 'border-green-500/50 ring-green-500/20 bg-green-500/5 ring-4' : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'}`}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {form.confirmPassword && form.confirmPassword === form.password && (
                                    <div className="absolute right-12 top-1/2 -translate-y-1/2 animate-in fade-in zoom-in duration-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5 text-green-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.confirmPassword && <p className="text-sm font-semibold text-red-400 pt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="pt-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center mt-0.5">
                                    <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); if (errors.agreed) setErrors({ ...errors, agreed: '' }); }} className="peer sr-only" />
                                    <div className="w-5 h-5 bg-white/5 border border-white/20 rounded peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all flex items-center justify-center peer-focus-visible:ring-4 peer-focus-visible:ring-purple-500/30">
                                        <Check className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${agreed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-400 leading-snug group-hover:text-gray-300 transition-colors">
                                    I agree to the <button type="button" onClick={(e) => { e.preventDefault(); setModalOpen('terms'); }} className="text-purple-400 hover:text-purple-300 mx-1 border-b border-transparent hover:border-purple-400 transition-colors">Terms of Service</button> and <button type="button" onClick={(e) => { e.preventDefault(); setModalOpen('privacy'); }} className="text-purple-400 hover:text-purple-300 mx-1 border-b border-transparent hover:border-purple-400 transition-colors">Privacy Policy</button>
                                </span>
                            </label>
                            {errors.agreed && <p className="ml-8 mt-1.5 text-sm font-semibold text-red-400">{errors.agreed}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (form.password && strength.score < 3)}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none focus:outline-none focus:ring-4 focus:ring-fuchsia-500/30 mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Free Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center font-semibold text-gray-500">
                        Already have an account?{' '}
                        <button onClick={() => onNavigate && onNavigate('login')} className="text-purple-400 hover:text-purple-300 transition-colors ml-1">
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(null)} />
                    <div className="relative bg-[#11111b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white">{modalOpen === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h3>
                            <button onClick={() => setModalOpen(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-6 overflow-y-auto text-sm text-gray-400 leading-relaxed space-y-5">
                            <p className="font-bold text-indigo-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <div className="space-y-4">
                                <div><h4 className="font-bold text-gray-200 text-base mb-1">1. Summary</h4><p>You agree to use SkillSync responsibly. We protect your data, and your learning metrics are yours.</p></div>
                                <div><h4 className="font-bold text-gray-200 text-base mb-1">2. Data Usage</h4><p>We use local storage for your sessions. We never sell your tracking statistics to any third party.</p></div>
                                <div><h4 className="font-bold text-gray-200 text-base mb-1">3. Liability</h4><p>SkillSync is provided as-is. We do not guarantee uptime, though we aim for 99.9%.</p></div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-white/10 bg-[#0a0a0f]">
                            <button onClick={() => setModalOpen(null)} className="w-full px-4 py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-xl transition-all">
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default Register;