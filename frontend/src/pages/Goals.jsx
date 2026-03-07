import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import {
    Target,
    Plus,
    Calendar,
    TrendingUp,
    Flag,
    Edit,
    Trash2,
    AlertTriangle,
    Check
} from 'lucide-react';
import { useEffect } from "react";
import { getMyGoals, createGoal, getGoalAnalytics, updateGoal, deleteGoal } from "../services/goalService";
import { getMySkills } from "../services/skillService";

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
    const [goalForm, setGoalForm] = useState({
        skillId: '',
        targetDate: ''
    });
    const [editForm, setEditForm] = useState({
        targetDate: ''
    });
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);

    useEffect(() => {
        loadData();

        // Refetch data when page becomes visible or window gains focus
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                loadData();
            }
        };

        const handleFocus = () => {
            loadData();
        };

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
            const skillsList = skillsData?.content || [];
            setSkills(skillsList);

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
        return 'info';
    };

    const getAnalytics = (goalId) => {
        return analytics.find(a => a.goalId === goalId);
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!goalForm.skillId || !goalForm.targetDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            console.log('Creating goal with:', { skillId: goalForm.skillId, targetDate: goalForm.targetDate });
            
            const newGoal = await createGoal({
                skillId: Number(goalForm.skillId),
                targetDate: goalForm.targetDate
            });

            console.log('Goal created:', newGoal);
            
            setGoals(prev => [newGoal, ...prev]);

            setIsModalOpen(false);
            setGoalForm({
                skillId: '',
                targetDate: ''
            });

            setShowSuccessMessage(true);
            setSuccessMessage('Goal created successfully!');
            setTimeout(() => {
                const mainElement = document.querySelector('main');
                if (mainElement) mainElement.scrollTo({ top: 0, behavior: 'smooth' });
            }, 0);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

            const analyticsData = await getGoalAnalytics();
            setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);
        } catch (err) {
            console.error("Goal creation failed", err);
            alert('Failed to create goal: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEditClick = (goal) => {
        setEditingGoalId(goal.id);
        setEditForm({
            targetDate: goal.targetDate
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!editForm.targetDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            console.log('Updating goal with:', { targetDate: editForm.targetDate });
            
            const updatedGoal = await updateGoal(editingGoalId, {
                targetDate: editForm.targetDate
            });

            console.log('Goal updated:', updatedGoal);
            
            setGoals(prev => prev.map(g => g.id === editingGoalId ? updatedGoal : g));

            setIsEditModalOpen(false);
            setEditingGoalId(null);
            setEditForm({
                targetDate: ''
            });

            setShowSuccessMessage(true);
            setSuccessMessage('Goal updated successfully!');
            setTimeout(() => {
                const mainElement = document.querySelector('main');
                if (mainElement) mainElement.scrollTo({ top: 0, behavior: 'smooth' });
            }, 0);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

            const analyticsData = await getGoalAnalytics();
            setAnalytics(Array.isArray(analyticsData) ? analyticsData : []);
        } catch (err) {
            console.error("Goal update failed", err);
            alert('Failed to update goal: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteClick = (goal) => {
        setGoalToDelete(goal);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!goalToDelete) return;

        try {
            await deleteGoal(goalToDelete.id);
            setGoals(prev => prev.filter(g => g.id !== goalToDelete.id));
            setAnalytics(prev => prev.filter(a => a.goalId !== goalToDelete.id));
            
            setIsDeleteConfirmOpen(false);
            setGoalToDelete(null);
            
            setShowSuccessMessage(true);
            setSuccessMessage('Goal deleted successfully!');
            setTimeout(() => {
                const mainElement = document.querySelector('main');
                if (mainElement) mainElement.scrollTo({ top: 0, behavior: 'smooth' });
            }, 0);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Error deleting goal:', err);
            alert('Failed to delete goal: ' + (err.response?.data?.message || err.message));
            setIsDeleteConfirmOpen(false);
            setGoalToDelete(null);
        }
    };

    const activeGoals = goals.filter(g => {
        const analytics = getAnalytics(g.id);
        return !analytics || analytics.progress < 100;
    });

    const completedGoals = goals.filter(g => {
        const analytics = getAnalytics(g.id);
        return analytics && analytics.progress >= 100;
    });

    const totalProgress = analytics.length > 0
        ? Math.round(analytics.reduce((sum, a) => sum + a.progress, 0) / analytics.length)
        : 0;

    if (loading) {
        return <div className="p-8 text-gray-500">Loading goals...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Goals"
                description="Set and track your learning goals"
                action={true}
                actionLabel="Add Goal"
                actionIcon={Plus}
                onAction={() => setIsModalOpen(true)}
            />

            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{activeGoals.length}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Active Goals</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/15 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{totalProgress}%</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Overall Progress</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                            <Flag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{completedGoals.length}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Completed Goals</p>
                </Card>
            </div>

            {activeGoals.length > 0 ? (
                <Section title="Active Goals" description="Goals currently in progress">
                    <div className="space-y-4">
                        {activeGoals.map((goal) => {
                            const goalAnalytics = getAnalytics(goal.id);
                            const progress = goalAnalytics ? goalAnalytics.progress : 0;
                            const daysLeft = goalAnalytics ? goalAnalytics.daysLeft : 0;

                            return (
                                <Card key={goal.id} hover className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                                    {goal.skillName}
                                                </h3>
                                                {goalAnalytics && (
                                                    <Badge variant={getRiskColor(goalAnalytics.riskLevel)} size="sm">
                                                        {goalAnalytics.riskLevel || 'UNKNOWN'}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-6 text-sm mb-4">
                                                <div className="flex items-center text-gray-700 dark:text-[#a6adc8]">
                                                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400 dark:text-[#6c7086]" />
                                                    <span className="text-gray-500 dark:text-[#7f849c]">Target: {goal.targetDate}</span>
                                                    {daysLeft > 0 && (
                                                        <span className="ml-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                            ({daysLeft} days left)
                                                        </span>
                                                    )}
                                                    {daysLeft <= 0 && (
                                                        <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400">
                                                            Overdue
                                                        </span>
                                                    )}
                                                </div>
                                                {goalAnalytics && (
                                                    <div className="flex items-center text-gray-700 dark:text-[#a6adc8]">
                                                        <TrendingUp className="w-4 h-4 mr-1.5 text-gray-400 dark:text-[#6c7086]" />
                                                        <span className="text-gray-500 dark:text-[#7f849c]">
                                                            Velocity: {goalAnalytics.currentVelocity.toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEditClick(goal)}
                                                className="p-2 text-gray-400 dark:text-[#6c7086] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 rounded-lg transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(goal)}
                                                className="p-2 text-gray-400 dark:text-[#6c7086] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 dark:text-[#9399b2]">Progress</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">{progress}%</span>
                                        </div>
                                        <ProgressBar
                                            progress={progress}
                                            size="md"
                                            color={progress >= 75 ? 'green' : progress >= 50 ? 'indigo' : 'yellow'}
                                        />

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                                            <div className="bg-indigo-50 dark:bg-indigo-500/15 rounded-lg p-2.5 text-center">
                                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Progress</p>
                                                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{progress}%</p>
                                            </div>

                                            <div className={`rounded-lg p-2.5 text-center ${
                                                daysLeft > 0
                                                    ? 'bg-green-50 dark:bg-green-500/15'
                                                    : 'bg-red-50 dark:bg-red-500/15'
                                            }`}>
                                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Days</p>
                                                <p className={`text-sm font-bold ${
                                                    daysLeft > 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                }`}>
                                                    {daysLeft > 0 ? daysLeft : 'Overdue'}
                                                </p>
                                            </div>

                                            {goalAnalytics && (
                                                <>
                                                    <div className="bg-blue-50 dark:bg-blue-500/15 rounded-lg p-2.5 text-center">
                                                        <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Velocity</p>
                                                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                            {goalAnalytics.currentVelocity.toFixed(1)}%
                                                        </p>
                                                    </div>

                                                    <div className={`rounded-lg p-2.5 text-center ${
                                                        goalAnalytics.riskLevel === 'HIGH'
                                                            ? 'bg-red-50 dark:bg-red-500/15'
                                                            : goalAnalytics.riskLevel === 'MEDIUM'
                                                                ? 'bg-yellow-50 dark:bg-yellow-500/15'
                                                                : 'bg-green-50 dark:bg-green-500/15'
                                                    }`}>
                                                        <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Risk</p>
                                                        <p className={`text-sm font-bold ${
                                                            goalAnalytics.riskLevel === 'HIGH'
                                                                ? 'text-red-600 dark:text-red-400'
                                                                : goalAnalytics.riskLevel === 'MEDIUM'
                                                                    ? 'text-yellow-600 dark:text-yellow-400'
                                                                    : 'text-green-600 dark:text-green-400'
                                                        }`}>
                                                            {goalAnalytics.riskLevel[0]}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {progress >= 50 && progress < 100 && (
                                        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-500/15 rounded-lg flex items-center space-x-2">
                                            <Flag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                                                Halfway there! Keep up the great work!
                                            </span>
                                        </div>
                                    )}

                                    {goalAnalytics && goalAnalytics.riskLevel === 'HIGH' && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/15 rounded-lg flex items-center space-x-2">
                                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            <span className="text-sm font-medium text-red-900 dark:text-red-300">
                                                High risk! Increase your pace to meet the target.
                                            </span>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </Section>
            ) : null}

            {completedGoals.length > 0 && (
                <Section title="Completed Goals" description="Goals you've successfully achieved">
                    <div className="space-y-4">
                        {completedGoals.map((goal) => {
                            const goalAnalytics = getAnalytics(goal.id);
                            const progress = goalAnalytics ? goalAnalytics.progress : 100;

                            return (
                                <Card key={goal.id} className="p-6 opacity-75">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] line-through">
                                                    {goal.skillName}
                                                </h3>
                                                <Badge variant="success" size="sm">
                                                    COMPLETED
                                                </Badge>
                                            </div>

                                            <div className="flex items-center space-x-6 text-sm">
                                                <div className="flex items-center text-gray-700 dark:text-[#a6adc8]">
                                                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400 dark:text-[#6c7086]" />
                                                    <span className="text-gray-500 dark:text-[#7f849c]">Target: {goal.targetDate}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleDeleteClick(goal)}
                                                className="p-2 text-gray-400 dark:text-[#6c7086] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600 dark:text-[#9399b2]">Progress</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">100%</span>
                                        </div>
                                        <ProgressBar progress={100} size="md" color="green" />

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                                            <div className="bg-green-50 dark:bg-green-500/15 rounded-lg p-2.5 text-center">
                                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Progress</p>
                                                <p className="text-sm font-bold text-green-600 dark:text-green-400">100%</p>
                                            </div>

                                            <div className="bg-green-50 dark:bg-green-500/15 rounded-lg p-2.5 text-center">
                                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Status</p>
                                                <p className="text-sm font-bold text-green-600 dark:text-green-400">✓</p>
                                            </div>

                                            <div className="bg-blue-50 dark:bg-blue-500/15 rounded-lg p-2.5 text-center">
                                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Target</p>
                                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 truncate">{goal.targetDate}</p>
                                            </div>

                                            {goalAnalytics && (
                                                <div className={`rounded-lg p-2.5 text-center ${
                                                    goalAnalytics.riskLevel === 'HIGH'
                                                        ? 'bg-red-50 dark:bg-red-500/15'
                                                        : goalAnalytics.riskLevel === 'MEDIUM'
                                                            ? 'bg-yellow-50 dark:bg-yellow-500/15'
                                                            : 'bg-green-50 dark:bg-green-500/15'
                                                }`}>
                                                    <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium">Risk</p>
                                                    <p className={`text-sm font-bold ${
                                                        goalAnalytics.riskLevel === 'HIGH'
                                                            ? 'text-red-600 dark:text-red-400'
                                                            : goalAnalytics.riskLevel === 'MEDIUM'
                                                                ? 'text-yellow-600 dark:text-yellow-400'
                                                                : 'text-green-600 dark:text-green-400'
                                                    }`}>
                                                        {goalAnalytics.riskLevel[0]}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-500/15 rounded-lg flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-green-900 dark:text-green-300">
                                            🎉 Goal completed! Amazing work!
                                        </span>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </Section>
            )}

            {goals.length === 0 && (
                <EmptyState
                    icon={Target}
                    title="No goals yet"
                    description="Set learning goals to track your progress"
                    actionLabel="Create First Goal"
                    actionIcon={Plus}
                    onAction={() => setIsModalOpen(true)}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Goal"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleSubmit}
                        >
                            Create Goal
                        </Button>
                    </>
                }
            >
                <form id="goalForm" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                            Select Skill
                        </label>
                        <select
                            className="w-full px-4 py-2 bg-white dark:bg-[#313244] border border-gray-200 dark:border-[#313244] rounded-lg text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={goalForm.skillId}
                            onChange={(e) => setGoalForm({ ...goalForm, skillId: e.target.value })}
                            required
                        >
                            <option value="">Select a skill to set a goal for</option>
                            {skills.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Target Date"
                        type="date"
                        value={goalForm.targetDate}
                        onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                        required
                    />
                </form>
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Goal"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleEditSubmit}
                        >
                            Save Changes
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <Input
                        label="Target Date"
                        type="date"
                        value={editForm.targetDate}
                        onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value })}
                        required
                    />
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="Delete Goal"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Delete Goal
                        </Button>
                    </>
                }
            >
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-2">
                            Are you sure you want to delete this goal?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                            This action cannot be undone. The goal for <strong>{goalToDelete?.skillName}</strong> will be permanently deleted.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Goals;