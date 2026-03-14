import React, { useState, useEffect } from 'react';
import Section from '../components/ui/Section';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import {
    Target, Plus, Calendar, TrendingUp, Flag, Edit, Trash2, 
    AlertTriangle, CheckCircle2, Award, Zap
} from 'lucide-react';
import { getMyGoals, createGoal, getGoalAnalytics, updateGoal, deleteGoal } from "../services/goalService";
import { getMySkills } from "../services/skillService";

const RingChart = ({ percentage, color, size = 120, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <div className="relative inline-flex items-center justify-center filter drop-shadow-sm transition-transform hover:scale-105 duration-300">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
                    className="text-gray-100 dark:text-[#313244]" />
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900 dark:text-white">{percentage}%</span>
            </div>
        </div>
    );
};

const GradientStatCard = ({ title, value, subtitle, icon: Icon, gradient, iconColor }) => (
    <div className={`relative overflow-hidden rounded-[2rem] border border-white/20 dark:border-[#313244] p-6 bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mt-8 -mr-8 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-full h-full text-white" />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColor} shadow-inner`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-4xl font-black text-white drop-shadow-sm mb-1">{value}</h3>
                <p className="text-sm font-bold text-white/90 uppercase tracking-wider">{title}</p>
                {subtitle && <p className="text-xs font-semibold text-white/70 mt-1">{subtitle}</p>}
            </div>
        </div>
    </div>
);

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [skills, setSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [goalForm, setGoalForm] = useState({ skillId: '', targetDate: '' });
    const [editForm, setEditForm] = useState({ targetDate: '' });
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    useEffect(() => {
        loadData();
        const handleVisibilityChange = () => { if (document.visibilityState === 'visible') loadData(); };
        const handleFocus = () => { loadData(); };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const skillsData = await getMySkills({ size: 100 });
            setSkills(skillsData?.content || []);
            const goalsData = await getMyGoals();
            setGoals(Array.isArray(goalsData) ? goalsData : []);
            const analyticsData = await getGoalAnalytics();
            setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);
        } catch (err) {
            console.error('Error loading goals:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (riskLevel) => {
        if (!riskLevel) return 'default';
        const level = riskLevel.toUpperCase();
        if (level === 'HIGH') return 'danger';
        if (level === 'MEDIUM') return 'warning';
        return 'success';
    };

    const getAnalytics = (goalId) => analytics.find(a => a.goalId === goalId);

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!goalForm.skillId || !goalForm.targetDate) return alert('Please fill in all required fields');

        try {
            const newGoal = await createGoal({ skillId: Number(goalForm.skillId), targetDate: goalForm.targetDate });
            setGoals(prev => [newGoal, ...prev]);
            setIsModalOpen(false); setGoalForm({ skillId: '', targetDate: '' });

            setShowSuccessMessage(true); setSuccessMessage('Goal created successfully!');
            setTimeout(() => { document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }, 0);
            setTimeout(() => { setShowSuccessMessage(false); }, 3000);

            const analyticsData = await getGoalAnalytics();
            setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);
        } catch (err) { alert('Failed to create goal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleEditClick = (goal) => {
        setEditingGoalId(goal.id); setEditForm({ targetDate: goal.targetDate }); setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!editForm.targetDate) return alert('Please fill in all required fields');

        try {
            const updatedGoal = await updateGoal(editingGoalId, { targetDate: editForm.targetDate });
            setGoals(prev => prev.map(g => g.id === editingGoalId ? updatedGoal : g));
            setIsEditModalOpen(false); setEditingGoalId(null); setEditForm({ targetDate: '' });

            setShowSuccessMessage(true); setSuccessMessage('Goal updated successfully!');
            setTimeout(() => { document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }, 0);
            setTimeout(() => { setShowSuccessMessage(false); }, 3000);

            const analyticsData = await getGoalAnalytics();
            setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);
        } catch (err) { alert('Failed to update goal: ' + (err.response?.data?.message || err.message)); }
    };

    const handleDeleteClick = (goal) => {
        setGoalToDelete(goal); setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!goalToDelete) return;
        try {
            await deleteGoal(goalToDelete.id);
            setGoals(prev => prev.filter(g => g.id !== goalToDelete.id));
            setAnalytics(prev => prev.filter(a => a.goalId !== goalToDelete.id));
            setIsDeleteConfirmOpen(false); setGoalToDelete(null);
            
            setShowSuccessMessage(true); setSuccessMessage('Goal deleted successfully!');
            setTimeout(() => { document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' }); }, 0);
            setTimeout(() => { setShowSuccessMessage(false); }, 3000);
        } catch (err) { alert('Failed to delete goal: ' + (err.response?.data?.message || err.message)); setIsDeleteConfirmOpen(false); setGoalToDelete(null); }
    };

    const activeGoals = goals.filter(g => {
        const a = getAnalytics(g.id);
        return !a || a.progress < 100;
    });

    const completedGoals = goals.filter(g => {
        const a = getAnalytics(g.id);
        return a && a.progress >= 100;
    });

    const totalProgress = analytics.length > 0 ? Math.round(analytics.reduce((sum, a) => sum + a.progress, 0) / analytics.length) : 0;

    if (loading) return <div className="flex items-center justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 md:p-12 shadow-xl text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium">
                            <Target className="w-4 h-4 text-cyan-200" />
                            <span>Learning Milestones</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">My Goals</h1>
                        <p className="text-blue-50 max-w-xl text-lg opacity-90 leading-relaxed">
                            Set ambitious targets, track your learning velocity, and celebrate your achievements along the way.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-blue-700 bg-white hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            New Goal
                        </button>
                    </div>
                </div>
            </div>

            {showSuccessMessage && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="font-semibold text-emerald-800 dark:text-emerald-400">{successMessage}</p>
                </div>
            )}

            {(goals.length > 0 || completedGoals.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GradientStatCard
                        title="Active Goals"
                        value={activeGoals.length}
                        subtitle="Currently in progress"
                        icon={Target}
                        gradient="from-blue-500 to-indigo-600"
                        iconColor="bg-white/20"
                    />
                    <GradientStatCard
                        title="Avg Progress"
                        value={`${totalProgress}%`}
                        subtitle="Across all goals"
                        icon={TrendingUp}
                        gradient="from-emerald-500 to-teal-600"
                        iconColor="bg-white/20"
                    />
                    <GradientStatCard
                        title="Completed"
                        value={completedGoals.length}
                        subtitle="Milestones achieved"
                        icon={Award}
                        gradient="from-amber-500 to-orange-600"
                        iconColor="bg-white/20"
                    />
                </div>
            )}

            {activeGoals.length > 0 && (
                <Section title="Active Goals" description="Stay focused on your current targets">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {activeGoals.map((goal) => {
                            const goalAnalytics = getAnalytics(goal.id);
                            const progress = goalAnalytics ? goalAnalytics.progress : 0;
                            const daysLeft = goalAnalytics ? goalAnalytics.daysLeft : 0;

                            return (
                                <div key={goal.id} className="bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#313244] rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                    <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white/80 dark:bg-[#1e1e2e]/80 backdrop-blur-sm p-1 rounded-xl">
                                        <button onClick={() => handleEditClick(goal)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-[#a6adc8] dark:hover:bg-indigo-500/20 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteClick(goal)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-[#a6adc8] dark:hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
                                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                                            <RingChart 
                                                percentage={progress} 
                                                color={progress >= 75 ? '#10b981' : progress >= 40 ? '#6366f1' : '#f59e0b'} 
                                            />
                                        </div>

                                        <div className="flex-1 w-full text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] tracking-tight">{goal.skillName}</h3>
                                                {goalAnalytics && (
                                                    <Badge variant={getRiskColor(goalAnalytics.riskLevel)} size="sm" className="shadow-sm">
                                                        {goalAnalytics.riskLevel} RISK
                                                    </Badge>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-2 mt-3 text-sm">
                                                <div className="flex items-center justify-center sm:justify-start text-gray-600 dark:text-[#9399b2] font-medium">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" /> Target: {goal.targetDate}
                                                </div>
                                                <div className="flex items-center justify-center sm:justify-start text-gray-600 dark:text-[#9399b2] font-medium">
                                                    <Zap className="w-4 h-4 mr-2 text-gray-400" /> Velocity: {goalAnalytics ? goalAnalytics.currentVelocity.toFixed(1) : '0.0'}% / week
                                                </div>
                                                <div className="flex items-center justify-center sm:justify-start font-bold">
                                                    <Clock className="w-4 h-4 mr-2" /> 
                                                    {daysLeft > 0 
                                                        ? <span className="text-indigo-600 dark:text-indigo-400">{daysLeft} days left</span>
                                                        : <span className="text-red-600 dark:text-red-400">Past Due</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {progress >= 50 && progress < 100 && (
                                        <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 p-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-500/20">
                                            <Flag className="w-4 h-4" /> Halfway there! Keep pushing.
                                        </div>
                                    )}
                                    {goalAnalytics?.riskLevel === 'HIGH' && (
                                        <div className="bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-300 p-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-red-100 dark:border-red-500/20">
                                            <AlertTriangle className="w-4 h-4" /> Pace is slow. Try to log more sessions.
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Section>
            )}

            {completedGoals.length > 0 && (
                <Section title="Completed Milestones" description="Celebrate your past achievements">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedGoals.map((goal) => (
                            <div key={goal.id} className="bg-white dark:bg-[#1e1e2e] border border-gray-100 dark:border-[#313244] rounded-2xl p-6 shadow-sm relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-bl-full -z-0"></div>
                                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeleteClick(goal)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-inner">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{goal.skillName}</h3>
                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">100% Completed</p>
                                        <div className="text-xs text-gray-500 dark:text-[#9399b2] flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Target was: {goal.targetDate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {goals.length === 0 && (
                <div className="text-center py-16 px-4 bg-gray-50 dark:bg-[#181825] border-2 border-dashed border-gray-200 dark:border-[#313244] rounded-[2rem]">
                    <div className="w-24 h-24 bg-white dark:bg-[#272739] shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] mb-2">No goals set yet</h3>
                    <p className="text-gray-500 dark:text-[#a6adc8] mb-8 max-w-sm mx-auto">
                        Setting goals helps you stay focused and measures your progress toward mastery.
                    </p>
                    <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>Create Your First Goal</Button>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set a New Goal" footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit}>Create Goal</Button></>}>
                <form id="goalForm" className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">Target Skill</label>
                        <select className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-colors font-medium" value={goalForm.skillId} onChange={(e) => setGoalForm({ ...goalForm, skillId: e.target.value })} required>
                            <option value="">Select a skill to master</option>
                            {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4]">Target Date</label>
                        <input type="date" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-colors font-medium" value={goalForm.targetDate} onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })} required />
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Goal Timeline" footer={<><Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button></>}>
                <form className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4]">New Target Date</label>
                        <input type="date" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-colors font-medium" value={editForm.targetDate} onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value })} required />
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Remove Goal" footer={<><Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Keep It</Button><Button variant="danger" onClick={handleConfirmDelete}>Remove</Button></>}>
                <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-500/15 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 mt-1">
                        <h3 className="text-lg font-black text-gray-900 dark:text-[#cdd6f4] mb-2">Give up on this goal?</h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2] leading-relaxed">
                            This action cannot be undone. Your target for <strong className="text-gray-900 dark:text-white">{goalToDelete?.skillName}</strong> will be permanently removed from your dashboard.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const Clock = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default Goals;