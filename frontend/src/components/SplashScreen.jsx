import React, { useEffect, useState } from 'react';
import { Lightbulb, Zap, TrendingUp, Trophy } from 'lucide-react';

const SplashScreen = ({ onComplete, isAuthenticated }) => {
    const [progress, setProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        setShowContent(true);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 30;
            });
        }, 300);

        const timer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                onComplete();
            }, 300);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0f0f1b] via-[#1a1a2e] to-[#16213e] flex items-center justify-center z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
                <div className="mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                        <Lightbulb className="w-12 h-12 text-white" />
                    </div>
                </div>

                <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
                    SkillSync
                </h1>

                <p className="text-lg sm:text-xl text-indigo-200 mb-12 max-w-md font-light">
                    Master your skills <br/>Track your progress<br/>Achieve your goals
                </p>

                <div className="grid grid-cols-3 gap-4 mb-12">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="text-xs text-indigo-300 font-medium">Track</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-xs text-blue-300 font-medium">Analyze</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-xs text-purple-300 font-medium">Achieve</span>
                    </div>
                </div>

                <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <p className="text-sm text-gray-400 mt-4 font-light">
                    {progress < 30 ? 'Initializing...' : progress < 60 ? 'Loading your journey...' : 'Getting ready...'}
                </p>
            </div>

            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-xs text-gray-500">
                    {isAuthenticated ? 'Welcome back! 🚀' : 'Get ready to transform your learning 📚'}
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;