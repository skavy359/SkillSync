import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import FormRow from '../components/ui/FormRow';
import ProgressBar from '../components/ui/ProgressBar';
import EmptyState from '../components/ui/EmptyState';
import {
    Target,
    Plus,
    Calendar,
    Clock,
    TrendingUp,
    Flag,
    Edit,
    Trash2
} from 'lucide-react';
import { useEffect } from "react";
// import { fetchGoals, createGoal, deleteGoal } from "../services/goalService";

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goalForm, setGoalForm] = useState({
        title: '',
        description: '',
        targetHours: '',
        deadline: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchGoals().then(setGoals);
    }, []);

    const priorityColors = {
        high: 'danger',
        medium: 'warning',
        low: 'info'
    };

    const statusColors = {
        in_progress: 'primary',
        completed: 'success',
        paused: 'default'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newGoal = await createGoal({
                title: goalForm.title,
                description: goalForm.description,
                targetHours: Number(goalForm.targetHours),
                deadline: goalForm.deadline,
                priority: goalForm.priority.toUpperCase()
            });

            setGoals(prev => [newGoal, ...prev]);

            setIsModalOpen(false);
            setGoalForm({
                title: '',
                description: '',
                targetHours: '',
                deadline: '',
                priority: 'medium'
            });
        } catch (err) {
            console.error("Goal creation failed", err);
        }
    };


    const activeGoals = goals.filter(g => g.status === 'in_progress');
    const totalTargetHours = goals.reduce((sum, g) => sum + g.targetHours, 0);
    const totalCurrentHours = goals.reduce((sum, g) => sum + g.currentHours, 0);
    const overallProgress = Math.round((totalCurrentHours / totalTargetHours) * 100);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Goals"
                description="Set and track your learning goals"
                actionLabel="Add Goal"
                actionIcon={Plus}
                onAction={() => setIsModalOpen(true)}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeGoals.length}</h3>
                    <p className="text-sm text-gray-600">Active Goals</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{overallProgress}%</h3>
                    <p className="text-sm text-gray-600">Overall Progress</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalCurrentHours}h</h3>
                    <p className="text-sm text-gray-600">of {totalTargetHours}h target</p>
                </Card>
            </div>

            {/* Goals List */}
            {goals.length > 0 ? (
                <Section>
                    <div className="space-y-4">
                        {goals.map((goal) => {
                            const progress = goal.targetHours
                                ? Math.round((goal.currentHours / goal.targetHours) * 100)
                                : 0;
                            const daysUntilDeadline = Math.ceil(
                                (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
                            );

                            return (
                                <Card key={goal.id} hover className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {goal.title}
                                                </h3>
                                                <Badge variant={priorityColors[goal.priority]} size="sm">
                                                    {goal.priority.toUpperCase()}
                                                </Badge>
                                                <Badge variant={statusColors[goal.status]} size="sm">
                                                    {goal.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">{goal.description}</p>

                                            <div className="flex items-center space-x-6 text-sm">
                                                <div className="flex items-center text-gray-700">
                                                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    <span className="font-medium">{goal.currentHours}</span>
                                                    <span className="text-gray-500 mx-1">/</span>
                                                    <span className="text-gray-500">{goal.targetHours}h</span>
                                                </div>
                                                <div className="flex items-center text-gray-700">
                                                    <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    <span className="text-gray-500">Due: {goal.deadline}</span>
                                                    {daysUntilDeadline > 0 && (
                                                        <span className="ml-2 text-xs font-medium text-indigo-600">
                              ({daysUntilDeadline} days left)
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await deleteGoal(goal.id);
                                                    setGoals(prev => prev.filter(g => g.id !== goal.id));
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">Progress</span>
                                            <span className="text-sm font-bold text-gray-900">{progress}%</span>
                                        </div>
                                        <ProgressBar
                                            progress={progress}
                                            size="md"
                                            color={progress >= 75 ? 'green' : progress >= 50 ? 'indigo' : 'yellow'}
                                        />
                                    </div>

                                    {/* Milestone Indicator */}
                                    {progress >= 50 && progress < 100 && (
                                        <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center space-x-2">
                                            <Flag className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm font-medium text-indigo-900">
                        Halfway there! Keep up the great work!
                      </span>
                                        </div>
                                    )}

                                    {progress >= 100 && (
                                        <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center space-x-2">
                                            <Target className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-900">
                        🎉 Goal completed! Amazing work!
                      </span>
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                </Section>
            ) : (
                <EmptyState
                    icon={Target}
                    title="No goals yet"
                    description="Set learning goals to track your progress"
                    actionLabel="Create First Goal"
                    actionIcon={Plus}
                    onAction={() => setIsModalOpen(true)}
                />
            )}

            {/* Add Goal Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Goal"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Create Goal
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Goal Title"
                        type="text"
                        placeholder="e.g., Master React Ecosystem"
                        value={goalForm.title}
                        onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Description"
                        placeholder="Describe what you want to achieve"
                        value={goalForm.description}
                        onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                        rows={3}
                    />

                    <FormRow columns={2} gap={4}>
                        <Input
                            label="Target Hours"
                            type="number"
                            placeholder="100"
                            value={goalForm.targetHours}
                            onChange={(e) => setGoalForm({ ...goalForm, targetHours: e.target.value })}
                            required
                            min="1"
                        />

                        <Input
                            label="Deadline"
                            type="date"
                            value={goalForm.deadline}
                            onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                            required
                        />
                    </FormRow>

                    <Select
                        label="Priority"
                        value={goalForm.priority}
                        onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value })}
                        options={['high', 'medium', 'low']}
                    />
                </form>
            </Modal>
        </div>
    );
};

export default Goals;