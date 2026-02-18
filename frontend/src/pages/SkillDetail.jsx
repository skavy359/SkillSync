import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import EmptyState from '../components/ui/EmptyState';
import {
    ArrowLeft,
    Clock,
    Calendar,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Target
} from 'lucide-react';
import { useEffect } from "react";
import {addSession } from "../services/skillService";

const SkillDetail = ({ skillId, onNavigate }) => {
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [sessionForm, setSessionForm] = useState({
        duration: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [skill, setSkill] = useState(null);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        if (!skillId) return;

        getSkillById(skillId).then(setSkill);
        fetchSessions(skillId).then(setSessions);
    }, [skillId]);

    const handleAddSession = async (e) => {
        e.preventDefault();

        try {
            const newSession = await addSession(skillId, {
                durationMinutes: Number(sessionForm.duration),
                sessionDate: sessionForm.date,
                notes: sessionForm.notes,
            });

            setSessions(prev => [newSession, ...prev]);

            setIsSessionModalOpen(false);
            setSessionForm({
                duration: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });
        } catch (err) {
            console.error("Add session failed", err);
        }
    };
k

    const levelColors = {
        Beginner: 'success',
        Intermediate: 'warning',
        Advanced: 'danger',
        Expert: 'purple',
    };

    if (!skill) {
        return <div className="p-8 text-gray-500">Loading skill...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Button
                variant="ghost"
                icon={ArrowLeft}
                onClick={() => onNavigate('skills')}
            >
                Back to Skills
            </Button>

            {/* Header Card */}
            <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <h1 className="text-3xl font-bold text-gray-900">{skill.name}</h1>
                            <Badge variant={levelColors[skill.level]} size="lg">
                                {skill.level}
                            </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{skill.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5" />
                                <span>{sessions.reduce((a, s) => a + s.durationMinutes, 0)} minutes logged</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                <span>{sessions.reduce((a, s) => a + s.durationMinutes, 0)} minutes logged</span>
                            </div>
                            <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1.5" />
                                <span>{sessions.length} sessions</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="secondary" icon={Edit} size="sm">
                            Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Progress</h3>
                            <p className="text-sm text-gray-600">You're making great progress!</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-indigo-600">{skill.progress}%</div>
                            <div className="text-sm text-gray-600">Complete</div>
                        </div>
                    </div>
                    <ProgressBar progress={skill.progress} size="lg" />
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {Math.round(sessions.reduce((a,s)=>a+s.durationMinutes,0)/60)}h
                    </h3>
                    <p className="text-sm text-gray-600">Total Time</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{sessions.length}</h3>
                    <p className="text-sm text-gray-600">Sessions</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {sessions.length
                            ? Math.round((sessions.reduce((a,s)=>a+s.durationMinutes,0)/sessions.length)/60*10)/10
                            : 0}h
                    </h3>
                    <p className="text-sm text-gray-600">Avg per Session</p>
                </Card>
            </div>

            {/* Sessions List */}
            <Section
                title="Learning Sessions"
                description="Track your practice sessions and progress"
                action={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => setIsSessionModalOpen(true)}
                    >
                        Add Session
                    </Button>
                }
            >
                {sessions.length > 0 ? (
                    <Card className="p-4">
                        <div className="space-y-3">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-gray-600" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {session.durationMinutes} minutes
                        </span>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4 mr-1.5" />
                                                    {session.sessionDate}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700">{session.notes}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ) : (
                    <EmptyState
                        icon={Clock}
                        title="No sessions yet"
                        description="Start logging your practice sessions"
                        actionLabel="Add First Session"
                        actionIcon={Plus}
                        onAction={() => setIsSessionModalOpen(true)}
                    />
                )}
            </Section>

            {/* Add Session Modal */}
            <Modal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                title="Log Practice Session"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsSessionModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddSession}>
                            Add Session
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleAddSession} className="space-y-4">
                    <Input
                        label="Duration (minutes)"
                        type="number"
                        placeholder="60"
                        value={sessionForm.duration}
                        onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                        required
                        min="1"
                    />

                    <Input
                        label="Date"
                        type="date"
                        value={sessionForm.date}
                        onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Notes"
                        placeholder="What did you learn or practice?"
                        value={sessionForm.notes}
                        onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                        rows={4}
                    />
                </form>
            </Modal>
        </div>
    );
};

export default SkillDetail;