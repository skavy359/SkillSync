import React, { useState } from 'react';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
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
    Target,
    AlertTriangle,
    Check
} from 'lucide-react';
import { useEffect } from "react";
import { getMySkills, addSession, getSessions, deleteSkill, updateSkill, assignCategory, removeCategory } from "../services/skillService";
import { updateSession, deleteSession } from "../services/sessionService";
import { getAllCategories } from "../services/categoryService";

const SkillDetail = ({ skillId, onNavigate }) => {
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', categoryId: '' });
    const [editCategories, setEditCategories] = useState([]);
    const [sessionForm, setSessionForm] = useState({
        duration: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const [skill, setSkill] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [isSessionEditModalOpen, setIsSessionEditModalOpen] = useState(false);
    const [isSessionDeleteConfirmOpen, setIsSessionDeleteConfirmOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionEditForm, setSessionEditForm] = useState({
        durationMinutes: 0,
        sessionDate: '',
        notes: ''
    });
    const [sessionEditLoading, setSessionEditLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState(false);

    useEffect(() => {
        if (!skillId) return;

        getMySkills({ size: 100 }).then(data => {
            const skills = data?.content || [];
            const found = skills.find(s => String(s.id) === String(skillId));
            if (found) {
                setSkill(found);
                setEditForm({ name: found.name, categoryId: found.categoryId || '' });
                setProgressForm({ progress: found.progress });
            }
        }).catch(() => { });
        getSessions(skillId).then(data => {
            setSessions(Array.isArray(data) ? data : []);
        }).catch(() => setSessions([]));
    }, [skillId]);

    const handleAddSession = async (e) => {
        e.preventDefault();
        
        const duration = Number(sessionForm.duration);
        if (duration > 1440) {
            setIsSessionModalOpen(false);
            setValidationError(true);
            return;
        }

        try {
            const newSession = await addSession(skillId, {
                durationMinutes: Number(sessionForm.duration),
                sessionDate: sessionForm.date,
                notes: sessionForm.notes,
            });

            setSessions(prev => [newSession, ...prev]);

            // Refetch skill to update progress instantly
            getMySkills({ size: 100 }).then(data => {
                const skills = data?.content || [];
                const found = skills.find(s => String(s.id) === String(skillId));
                if (found) {
                    setSkill(found);
                }
            }).catch(() => { });

            setIsSessionModalOpen(false);
            setSessionForm({
                duration: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });
            
            setSuccessMessage('Session logged successfully! Progress updated.');
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error("Add session failed", err);
        }
    };



    const handleEditSkill = async (e) => {
        e.preventDefault();
        setIsEditLoading(true);

        try {
            const updated = await updateSkill(skillId, {
                name: editForm.name
            });

            if (editForm.categoryId) {
                await assignCategory(skillId, editForm.categoryId);
                updated.categoryId = editForm.categoryId;
                setSuccessMessage('Skill updated and category assigned successfully!');
            } else {
                // Empty categoryId means "Others" - no category assigned
                if (skill.categoryId) {
                    // User is removing the category
                    updated.categoryId = null;
                    updated.category = null;
                    setSuccessMessage('Skill updated and category removed!');
                } else {
                    setSuccessMessage('Skill updated successfully!');
                }
            }

            setSkill(updated);
            setIsEditModalOpen(false);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error("Update skill failed", err);
            alert('Failed to update skill. Please try again.');
        } finally {
            setIsEditLoading(false);
        }
    };

    const handleDeleteSkill = async () => {
        setIsDeleteLoading(true);
        try {
            await deleteSkill(skillId);
            setIsDeleteConfirmOpen(false);
            setSuccessMessage('Skill deleted successfully!');
            setShowSuccessMessage(true);

            setTimeout(() => {
                const mainElement = document.querySelector('main');
                if (mainElement) mainElement.scrollTo({ top: 0, behavior: 'smooth' });
            }, 0);

            setTimeout(() => {
                onNavigate('skills');
            }, 1500);
        } catch (err) {
            console.error("Delete skill failed", err);
            alert('Failed to delete skill. Please try again.');
            setIsDeleteLoading(false);
        }
    };

    const handleOpenSessionEditModal = (session) => {
        setSelectedSession(session);
        setSessionEditForm({
            durationMinutes: session.durationMinutes,
            sessionDate: session.sessionDate ? session.sessionDate.split('T')[0] : '',
            notes: session.notes || ''
        });
        setIsSessionEditModalOpen(true);
    };

    const handleSessionEditFormChange = (e) => {
        const { name, value } = e.target;
        setSessionEditForm(prev => ({
            ...prev,
            [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value
        }));
    };

    const handleSessionEditSubmit = async () => {
        if (!sessionEditForm.durationMinutes || !sessionEditForm.sessionDate) {
            alert('Please fill in all required fields');
            return;
        }

        const duration = Number(sessionEditForm.durationMinutes);
        if (duration > 1440) {
            setIsSessionEditModalOpen(false);
            setValidationError(true);
            return;
        }

        try {
            setSessionEditLoading(true);

            await updateSession(skillId, selectedSession.id, {
                durationMinutes: sessionEditForm.durationMinutes,
                sessionDate: sessionEditForm.sessionDate,
                notes: sessionEditForm.notes
            });

            setSessions(prevSessions =>
                prevSessions.map(s =>
                    s.id === selectedSession.id
                        ? {
                            ...s,
                            durationMinutes: sessionEditForm.durationMinutes,
                            sessionDate: sessionEditForm.sessionDate,
                            notes: sessionEditForm.notes
                        }
                        : s
                )
            );

            setIsSessionEditModalOpen(false);
            setShowSuccessMessage(true);
            setSuccessMessage('Session updated successfully!');
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Error updating session:', err);
            alert('Failed to update session');
        } finally {
            setSessionEditLoading(false);
        }
    };

    const handleOpenSessionDeleteConfirm = (session) => {
        setSelectedSession(session);
        setIsSessionDeleteConfirmOpen(true);
    };

    const handleConfirmSessionDelete = async () => {
        if (!selectedSession) return;

        try {
            await deleteSession(skillId, selectedSession.id);

            setSessions(prevSessions =>
                prevSessions.filter(s => s.id !== selectedSession.id)
            );

            setIsSessionDeleteConfirmOpen(false);
            setSelectedSession(null);
            setShowSuccessMessage(true);
            setSuccessMessage('Session deleted successfully!');
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Error deleting session:', err);
            setIsSessionDeleteConfirmOpen(false);
        }
    };

    const getProgressLevel = (progress) => {
        if (progress >= 100) return 'Completed';
        if (progress >= 80) return 'Advanced';
        if (progress >= 30) return 'Intermediate';
        return 'Beginner';
    };

    const getProgressLevelColor = (progress) => {
        if (progress >= 100) return 'success';
        if (progress >= 80) return 'danger';
        if (progress >= 30) return 'warning';
        return 'primary';
    };

    const getProgressMessage = (progress) => {
        if (progress >= 100) return 'Congratulations! You\'ve completed this skill!';
        if (progress >= 75) return 'Almost there! You\'re doing amazing!';
        if (progress >= 50) return 'Great progress! Keep it up!';
        if (progress >= 25) return 'You\'re making solid progress!';
        return 'Good start! Keep improving!';
    };

    if (!skill) {
        return <div className="p-8 text-gray-500 dark:text-[#7f849c]">Loading skill...</div>;
    }

    return (
        <div className="space-y-6">
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            <Button
                variant="ghost"
                icon={ArrowLeft}
                onClick={() => onNavigate('skills')}
            >
                Back to Skills
            </Button>

            <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">{skill.name}</h1>
                            <Badge variant={getProgressLevelColor(skill.progress)} size="lg">
                                {skill.progress >= 100 ? '✨ COMPLETED' : getProgressLevel(skill.progress).toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-[#9399b2] mb-4">{skill.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-[#9399b2]">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5" />
                                <span>{Math.round(sessions.reduce((a, s) => a + s.durationMinutes, 0) / 60)}h logged</span>
                            </div>
                            <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1.5" />
                                <span>{sessions.length} sessions</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button 
                            variant="secondary" 
                            icon={Edit} 
                            size="sm"
                            onClick={() => {
                                setEditForm({ name: skill.name, categoryId: skill.categoryId || '' });
                                getAllCategories()
                                    .then(data => {
                                        if (Array.isArray(data)) {
                                            setEditCategories(data);
                                        }
                                    })
                                    .catch(() => { });
                                setIsEditModalOpen(true);
                            }}
                        >
                            Edit
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                        >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </Button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/15 dark:to-blue-500/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">Overall Progress</h3>
                            <p className="text-sm text-gray-600 dark:text-[#9399b2]">{getProgressMessage(skill.progress)}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{skill.progress}%</div>
                            <div className="text-sm text-gray-600 dark:text-[#9399b2]">Complete</div>
                        </div>
                    </div>
                    <ProgressBar progress={skill.progress} size="lg" />
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                        {Math.round(sessions.reduce((a, s) => a + s.durationMinutes, 0) / 60)}h
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Time</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/15 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{sessions.length}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Sessions</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/15 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">
                        {sessions.length
                            ? Math.round((sessions.reduce((a, s) => a + s.durationMinutes, 0) / sessions.length) / 60 * 10) / 10
                            : 0}h
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Avg per Session</p>
                </Card>
            </div>

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
                                    className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-[#181825] rounded-xl hover:bg-gray-100 dark:hover:bg-[#272739] transition-colors"
                                >
                                    <div className="w-12 h-12 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244] rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-gray-600 dark:text-[#9399b2]" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                                    {session.durationMinutes} minutes
                                                </span>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-[#7f849c]">
                                                    <Calendar className="w-4 h-4 mr-1.5" />
                                                    {session.sessionDate}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                                    onClick={() => handleOpenSessionEditModal(session)}
                                                    title="Edit session"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                                                    onClick={() => handleOpenSessionDeleteConfirm(session)}
                                                    title="Delete session"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-[#a6adc8]">{session.notes}</p>
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

            <Modal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                title="Log Practice Session"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsSessionModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={(e) => {
                            e.preventDefault();
                            handleAddSession(e);
                        }}>
                            Add Session
                        </Button>
                    </>
                }
            >
                <form id="addSessionForm" onSubmit={handleAddSession} className="space-y-4">
                    <Input
                        label="Duration (minutes)"
                        type="number"
                        placeholder="60"
                        value={sessionForm.duration}
                        onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                        required
                        min="1"
                        max="1440"
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



            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Skill"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isEditLoading}>
                            Cancel
                        </Button>
                        {skill?.categoryId && (
                            <Button 
                                variant="danger" 
                                onClick={async () => {
                                    setIsEditLoading(true);
                                    try {
                                        await removeCategory(skillId);
                                        setSkill({ ...skill, categoryId: null, category: null });
                                        setEditForm({ name: skill.name, categoryId: '' });
                                        setIsEditModalOpen(false);
                                        setSuccessMessage('Category removed successfully!');
                                        setShowSuccessMessage(true);
                                        setTimeout(() => setShowSuccessMessage(false), 3000);
                                    } catch (err) {
                                        console.error('Failed to remove category', err);
                                        alert('Failed to remove category. Please try again.');
                                    } finally {
                                        setIsEditLoading(false);
                                    }
                                }}
                                disabled={isEditLoading}
                                size="sm"
                            >
                                Remove Category
                            </Button>
                        )}
                        <Button variant="primary" onClick={(e) => {
                            e.preventDefault();
                            handleEditSkill(e);
                        }} disabled={isEditLoading}>
                            {isEditLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </>
                }
            >
                <form id="editSkillForm" onSubmit={handleEditSkill} className="space-y-4">
                    <Input
                        label="Skill Name"
                        type="text"
                        placeholder="Enter skill name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                    />
                    <Select
                        label="Category (Optional)"
                        value={editForm.categoryId}
                        onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                        options={editCategories.map(cat => ({ value: cat.id, label: cat.name }))}
                        placeholder="Select a category or leave empty"
                    />
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="Delete Skill"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isDeleteLoading}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteSkill} disabled={isDeleteLoading}>
                            {isDeleteLoading ? 'Deleting...' : 'Delete Skill'}
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
                            Are you sure you want to delete this skill?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-4">
                            This action cannot be undone. All sessions and progress data associated with this skill will be permanently deleted.
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">
                            Skill: <span className="text-red-600 dark:text-red-400">{skill?.name}</span>
                        </p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isSessionEditModalOpen}
                onClose={() => setIsSessionEditModalOpen(false)}
                title="Edit Session"
                size="lg"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => setIsSessionEditModalOpen(false)}
                            disabled={sessionEditLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSessionEditSubmit}
                            disabled={sessionEditLoading}
                        >
                            {sessionEditLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Duration (minutes)"
                        type="number"
                        name="durationMinutes"
                        placeholder="e.g. 60"
                        value={sessionEditForm.durationMinutes}
                        onChange={handleSessionEditFormChange}
                        required
                        min="1"
                    />
                    <Input
                        label="Date"
                        type="date"
                        name="sessionDate"
                        value={sessionEditForm.sessionDate}
                        onChange={handleSessionEditFormChange}
                        required
                    />
                    <Textarea
                        label="Notes"
                        name="notes"
                        placeholder="What did you work on?"
                        value={sessionEditForm.notes}
                        onChange={(e) => handleSessionEditFormChange(e)}
                        rows={3}
                    />
                </form>
            </Modal>

            <Modal
                isOpen={isSessionDeleteConfirmOpen}
                onClose={() => setIsSessionDeleteConfirmOpen(false)}
                title="Delete Session"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsSessionDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmSessionDelete}>
                            Delete Session
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
                            Are you sure you want to delete this session?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={validationError}
                onClose={() => setValidationError(false)}
                title="Duration Exceeds Limit"
                footer={
                    <Button variant="primary" onClick={() => setValidationError(false)}>
                        Got it
                    </Button>
                }
            >
                <div className="flex items-start space-x-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-[#a6adc8]">
                        Session duration cannot exceed 24 hours (1440 minutes). Please enter a shorter duration.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default SkillDetail;