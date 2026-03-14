import React, { useEffect, useState } from 'react';
import { Lightbulb, Zap, TrendingUp, Trophy, Sparkles } from 'lucide-react';

const SplashScreen = ({ onComplete, isAuthenticated }) => {
    const [progress, setProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const contentTimer = setTimeout(() => setShowContent(true), 100);

        const interval = setInterval(() => {
            setProgress((prev) => {
                const increment = prev > 80 ? Math.random() * 5 : Math.random() * 15;
                if (prev + increment >= 99) return 99;
                return prev + increment;
            });
        }, 150);

        const timer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                onComplete();
            }, 600);
        }, 3200);

        return () => {
            clearTimeout(contentTimer);
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#0B0F19] flex items-center justify-center z-[100] overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] mix-blend-screen" />
            </div>

            <div className={`relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl w-full transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>

                <div className="relative mb-12 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse" />
                    <div className="relative w-28 h-28 bg-[#151B2B] border border-white/10 shadow-2xl rounded-3xl flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-400/20 opacity-0 animate-pulse-slow" />
                        <Lightbulb className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />

                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />
                    </div>
                </div>

                <h1 className="text-6xl sm:text-7xl font-black mb-6 tracking-tight flex items-center gap-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        SkillSync
                    </span>
                    <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                </h1>

                <p className="text-xl text-gray-400/80 mb-14 font-medium tracking-wide max-w-md mx-auto leading-relaxed">
                    Orchestrate your learning.<br/>
                    <span className="text-indigo-300/70 py-1">Master your future.</span>
                </p>

                <div className="grid grid-cols-3 gap-6 sm:gap-12 mb-16 w-full max-w-sm">
                    {[
                        { icon: Zap, label: 'Track', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                        { icon: TrendingUp, label: 'Analyze', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                        { icon: Trophy, label: 'Achieve', color: 'text-violet-400', bg: 'bg-violet-500/10' },
                    ].map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity duration-500">
                            <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center border border-white/5 shadow-inner`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-bold">{feature.label}</span>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-md space-y-4">
                    <div className="h-1.5 w-full bg-[#1A2235] rounded-full overflow-hidden relative shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-full transition-all duration-[400ms] ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)] bg-[length:200%_100%] animate-[gradient_2s_linear_infinite]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center text-xs font-medium tracking-wider text-gray-500">
                        <span className="uppercase">
                            {progress < 30 ? 'Initializing Framework...' : progress < 70 ? 'Loading User Data...' : progress < 99 ? 'Optimizing Experience...' : 'Ready'}
                        </span>
                        <span className="text-indigo-400 font-mono">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            <div className={`absolute bottom-10 left-0 right-0 text-center transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-600">
                    {isAuthenticated ? 'Welcome back, Architect.' : 'Prepare to transcend limits.'}
                </p>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .animate-pulse-slow {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;