import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Search, Clock, Calendar, Trash2, Edit, Check, Plus, AlertTriangle } from 'lucide-react';
import { getMySkills } from '../services/skillService';
import { fetchSessions, updateSession, deleteSession, addSession } from '../services/sessionService';

const Sessions = ({ onNavigate }) => {
    const [skills, setSkills] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [editForm, setEditForm] = useState({
        durationMinutes: 0,
        sessionDate: '',
        notes: ''
    });
    const [logForm, setLogForm] = useState({
        skillId: '',
        durationMinutes: '',
        notes: '',
        sessionDate: new Date().toISOString().split('T')[0]
    });
    const [editLoading, setEditLoading] = useState(false);
    const [logLoading, setLogLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState(false);

    useEffect(() => {
        // Fetch all skills
        getMySkills({ size: 100 })
            .then(data => {
                const skillList = data?.content || [];
                setSkills(skillList);
                return skillList;
            })
            .then(skillList => {
                // Fetch all sessions from all skills
                return Promise.all(
                    skillList.map(skill =>
                        fetchSessions(skill.id).then(sessions =>
                            (Array.isArray(sessions) ? sessions : []).map(s => ({
                                ...s,
                                skillId: skill.id,
                                skillName: skill.name
                            }))
                        ).catch(() => [])
                    )
                );
            })
            .then(sessionArrays => {
                const all = sessionArrays
                    .flat()
                    .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
                setAllSessions(all);
                setFilteredSessions(all);
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle search
    useEffect(() => {
        const filtered = allSessions.filter(session =>
            session.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (session.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSessions(filtered);
    }, [searchTerm, allSessions]);

    // Format duration display
    const formatDuration = (minutes) => {
        if (!minutes) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    // Format date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle edit modal open
    const handleOpenEditModal = (session) => {
        setSelectedSession(session);
        setEditForm({
            durationMinutes: session.durationMinutes,
            sessionDate: session.sessionDate ? session.sessionDate.split('T')[0] : '',
            notes: session.notes || ''
        });
        setEditError('');
        setIsEditModalOpen(true);
    };

    // Handle edit form change
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value
        }));
    };

    // Handle edit submit
    const handleEditSubmit = async () => {
        try {
            setEditLoading(true);
            setEditError('');
            
            const duration = Number(editForm.durationMinutes);
            if (duration > 1440) {
                setIsEditModalOpen(false);
                setValidationError(true);
                setEditLoading(false);
                return;
            }

            await updateSession(selectedSession.skillId, selectedSession.id, {
                durationMinutes: editForm.durationMinutes,
                sessionDate: editForm.sessionDate,
                notes: editForm.notes
            });

            // Update local state
            setAllSessions(prevSessions =>
                prevSessions.map(s =>
                    s.id === selectedSession.id
                        ? {
                            ...s,
                            durationMinutes: editForm.durationMinutes,
                            sessionDate: editForm.sessionDate,
                            notes: editForm.notes
                        }
                        : s
                )
            );

            setIsEditModalOpen(false);
            setShowSuccessMessage(true);
            setSuccessMessage('Session updated successfully!');
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update session');
            console.error('Error updating session:', err);
        } finally {
            setEditLoading(false);
        }
    };

    // Handle delete confirmation open
    const handleOpenDeleteConfirm = (session) => {
        setSessionToDelete(session);
        setIsDeleteConfirmOpen(true);
    };

    // Handle delete confirmation
    const handleConfirmDelete = async () => {
        if (!sessionToDelete) return;

        try {
            await deleteSession(sessionToDelete.skillId, sessionToDelete.id);

            // Update local state
            setAllSessions(prevSessions =>
                prevSessions.filter(s => s.id !== sessionToDelete.id)
            );

            setIsDeleteConfirmOpen(false);
            setSessionToDelete(null);
            setShowSuccessMessage(true);
            setSuccessMessage('Session deleted successfully!');
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Error deleting session:', err);
            setIsDeleteConfirmOpen(false);
        }
    };

    // Handle log session
    const handleLogSession = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!logForm.skillId || !logForm.durationMinutes) {
            alert('Please fill in all required fields');
            return;
        }
        
        const duration = Number(logForm.durationMinutes);
        if (duration > 1440) {
            setShowLogModal(false);
            setValidationError(true);
            return;
        }

        setLogLoading(true);
        try {
            await addSession(logForm.skillId, {
                durationMinutes: Number(logForm.durationMinutes),
                notes: logForm.notes,
                sessionDate: logForm.sessionDate
            });

            // Reset and reload
            setShowLogModal(false);
            setLogForm({
                skillId: '',
                durationMinutes: '',
                notes: '',
                sessionDate: new Date().toISOString().split('T')[0]
            });

            // Reload sessions from all skills
            const refreshedSessions = await Promise.all(
                skills.map(skill =>
                    fetchSessions(skill.id).then(sessions =>
                        (Array.isArray(sessions) ? sessions : []).map(s => ({
                            ...s,
                            skillId: skill.id,
                            skillName: skill.name
                        }))
                    ).catch(() => [])
                )
            );
            const all = refreshedSessions
                .flat()
                .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
            setAllSessions(all);
            setFilteredSessions(all);

            setShowSuccessMessage(true);
            setSuccessMessage('Session logged successfully!');
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Error logging session:', err);
        } finally {
            setLogLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading sessions...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Learning Sessions"
                description="View all your logged learning sessions and track your progress"
                action={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => setShowLogModal(true)}
                    >
                        Log Session
                    </Button>
                }
            />

            {/* Success Notification */}
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            {/* Search */}
            <div>
                <Input
                    type="text"
                    placeholder="Search sessions by skill or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                />
            </div>

            {/* Sessions List */}
            <Section
                title={`All Sessions (${filteredSessions.length})`}
                description="Complete history of your learning sessions"
            >
                {filteredSessions.length > 0 ? (
                    <div className="space-y-3">
                        {filteredSessions.map((session) => (
                            <Card
                                key={session.id}
                                className="p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Session Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                                {session.skillName}
                                            </h3>
                                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                {formatDuration(session.durationMinutes)}
                                            </span>
                                        </div>

                                        {/* Notes */}
                                        {session.notes && (
                                            <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-2">
                                                {session.notes}
                                            </p>
                                        )}

                                        {/* Date and Time */}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[#7f849c]">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(session.sessionDate)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Edit}
                                            className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            title="Edit session"
                                            onClick={() => handleOpenEditModal(session)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            title="Delete session"
                                            onClick={() => handleOpenDeleteConfirm(session)}
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-[#313244] rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-gray-400 dark:text-[#6c7086]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">
                                {searchTerm ? 'No sessions found' : 'No sessions yet'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Log your first learning session to get started'}
                            </p>
                        </div>
                    </Card>
                )}
            </Section>

            {/* Sessions Stats */}
            {allSessions.length > 0 && (
                <Section title="Session Statistics">
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-1">Total Sessions</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">
                                    {allSessions.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-1">Total Time</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">
                                    {formatDuration(allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-1">Average Session</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">
                                    {formatDuration(Math.round(allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / allSessions.length))}
                                </p>
                            </div>
                        </div>
                    </Card>
                </Section>
            )}

            {/* Delete Confirm Modal */}
            <Modal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="Delete Session"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
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

            {/* Validation Error Modal */}
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

            {/* Log Session Modal */}
            <Modal
                isOpen={showLogModal}
                onClose={() => setShowLogModal(false)}
                title="Log a Session"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowLogModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleLogSession} disabled={logLoading}>
                            {logLoading ? 'Logging...' : 'Log Session'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleLogSession} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                            Skill
                        </label>
                        <select
                            className="w-full px-4 py-2 bg-white dark:bg-[#313244] border border-gray-200 dark:border-[#313244] rounded-lg text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={logForm.skillId}
                            onChange={(e) => setLogForm({ ...logForm, skillId: e.target.value })}
                            required
                        >
                            <option value="">Select a skill</option>
                            {skills.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Duration (minutes)"
                        type="number"
                        name="durationMinutes"
                        placeholder="e.g. 45"
                        value={logForm.durationMinutes}
                        onChange={(e) => setLogForm({ ...logForm, durationMinutes: e.target.value })}
                        required
                        min="1"                        max="1440"                        max="1440"
                    />
                    <Input
                        label="Date"
                        type="date"
                        name="sessionDate"
                        value={logForm.sessionDate}
                        onChange={(e) => setLogForm({ ...logForm, sessionDate: e.target.value })}
                    />
                    <Input
                        label="Notes (optional)"
                        type="text"
                        name="notes"
                        placeholder="What did you work on?"
                        value={logForm.notes}
                        onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                    />
                </form>
            </Modal>

            {/* Edit Session Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Session"
                size="lg"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={editLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleEditSubmit}
                            loading={editLoading}
                        >
                            Save Changes
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    {editError && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">{editError}</p>
                        </div>
                    )}

                    {selectedSession && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    Skill
                                </label>
                                <div className="px-4 py-2 bg-gray-50 dark:bg-[#313244] border border-gray-200 dark:border-[#313244] rounded-lg text-gray-700 dark:text-[#cdd6f4]">
                                    {selectedSession.skillName}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    Duration (minutes)
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="1440"
                                    name="durationMinutes"
                                    value={editForm.durationMinutes}
                                    onChange={handleEditFormChange}
                                    placeholder="e.g., 60"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    Date
                                </label>
                                <Input
                                    type="date"
                                    name="sessionDate"
                                    value={editForm.sessionDate}
                                    onChange={handleEditFormChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#cdd6f4] mb-2">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={editForm.notes}
                                    onChange={handleEditFormChange}
                                    placeholder="Add any notes about this session..."
                                    rows="3"
                                    className="w-full px-4 py-2 bg-white dark:bg-[#313244] border border-gray-200 dark:border-[#313244] rounded-lg text-gray-900 dark:text-[#cdd6f4] placeholder-gray-500 dark:placeholder-[#7f849c] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Sessions;
