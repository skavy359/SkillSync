import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { Search, Clock, Calendar, Trash2, Edit, Check, Plus, AlertTriangle, TrendingUp, Target, Activity } from 'lucide-react';
import { getMySkills } from '../services/skillService';
import { fetchSessions, updateSession, deleteSession, addSession } from '../services/sessionService';

const Sessions = ({ onNavigate }) => {
    const [skills, setSkills] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    
    // Forms
    const [editForm, setEditForm] = useState({ durationMinutes: 0, sessionDate: '', notes: '' });
    const [logForm, setLogForm] = useState({ skillId: '', durationMinutes: '', notes: '', sessionDate: new Date().toISOString().split('T')[0] });
    
    // State
    const [editLoading, setEditLoading] = useState(false);
    const [logLoading, setLogLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState(false);

    useEffect(() => {
        getMySkills({ size: 100 })
            .then(data => {
                const skillList = data?.content || [];
                setSkills(skillList);
                return skillList;
            })
            .then(skillList => Promise.all(skillList.map(skill =>
                fetchSessions(skill.id).then(sessions =>
                    (Array.isArray(sessions) ? sessions : []).map(s => ({ ...s, skillId: skill.id, skillName: skill.name }))
                ).catch(() => [])
            )))
            .then(sessionArrays => {
                const all = sessionArrays.flat().sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
                setAllSessions(all); setFilteredSessions(all);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const filtered = allSessions.filter(session =>
            session.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (session.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSessions(filtered);
    }, [searchTerm, allSessions]);

    const formatDuration = (minutes) => {
        if (!minutes) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours === 0 ? `${mins}m` : mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleOpenEditModal = (session) => {
        setSelectedSession(session);
        setEditForm({ durationMinutes: session.durationMinutes, sessionDate: session.sessionDate ? session.sessionDate.split('T')[0] : '', notes: session.notes || '' });
        setEditError(''); setIsEditModalOpen(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: name === 'durationMinutes' ? parseInt(value) || 0 : value }));
    };

    const handleEditSubmit = async () => {
        try {
            setEditLoading(true); setEditError('');
            const duration = Number(editForm.durationMinutes);
            if (duration > 1440) return setIsEditModalOpen(false), setValidationError(true), setEditLoading(false);

            await updateSession(selectedSession.skillId, selectedSession.id, editForm);
            setAllSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, ...editForm } : s));

            setIsEditModalOpen(false); setSuccessMessage('Session updated successfully!'); setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) { setEditError(err.response?.data?.message || 'Failed to update'); } finally { setEditLoading(false); }
    };

    const handleConfirmDelete = async () => {
        if (!sessionToDelete) return;
        try {
            await deleteSession(sessionToDelete.skillId, sessionToDelete.id);
            setAllSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
            setIsDeleteConfirmOpen(false); setSessionToDelete(null); setSuccessMessage('Session deleted successfully!'); setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) { setIsDeleteConfirmOpen(false); }
    };

    const handleLogSession = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!logForm.skillId || !logForm.durationMinutes) return alert('Fill required fields');
        if (Number(logForm.durationMinutes) > 1440) return setShowLogModal(false), setValidationError(true);

        setLogLoading(true);
        try {
            await addSession(logForm.skillId, { durationMinutes: Number(logForm.durationMinutes), notes: logForm.notes, sessionDate: logForm.sessionDate });
            setShowLogModal(false); setLogForm({ skillId: '', durationMinutes: '', notes: '', sessionDate: new Date().toISOString().split('T')[0] });
            
            // Refresh
            const refreshedSessions = await Promise.all(skills.map(skill =>
                fetchSessions(skill.id).then(sessions => (Array.isArray(sessions) ? sessions : []).map(s => ({ ...s, skillId: skill.id, skillName: skill.name }))).catch(() => [])
            ));
            const all = refreshedSessions.flat().sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
            setAllSessions(all); setFilteredSessions(all);

            setSuccessMessage('Session logged successfully!'); setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {} finally { setLogLoading(false); }
    };

    if (loading) return <div className="p-8 text-gray-500 text-center animate-pulse">Loading sessions...</div>;

    const totalTimeHours = Math.round(allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60);
    const avgSessionMinutes = allSessions.length ? Math.round(allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / allSessions.length) : 0;

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* --- Hero Header --- */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 md:p-10 shadow-lg text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium">
                            <Activity className="w-4 h-4 text-emerald-200" />
                            <span>Learning Timeline</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Sessions</h1>
                        <p className="text-emerald-50 max-w-xl text-lg opacity-90">
                            A complete history of your learning journey and dedicated practice time.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setShowLogModal(true)}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-emerald-700 bg-white hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Log Session
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="font-medium text-green-800 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            {/* --- Stats Grid --- */}
            {allSessions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 border border-gray-100 dark:border-[#313244] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 dark:bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
                                <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-[#a6adc8] mb-1">Total Sessions</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-[#cdd6f4]">{allSessions.length}</h3>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 border border-gray-100 dark:border-[#313244] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 dark:bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-[#a6adc8] mb-1">Total Time Logged</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-[#cdd6f4]">{totalTimeHours} <span className="text-xl font-bold text-gray-400 dark:text-[#6c7086]">hours</span></h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 border border-gray-100 dark:border-[#313244] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 dark:bg-purple-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-[#a6adc8] mb-1">Average Session</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-[#cdd6f4]">{avgSessionMinutes} <span className="text-xl font-bold text-gray-400 dark:text-[#6c7086]">min</span></h3>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Main Content Area --- */}
            <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-[#313244]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4]">Session Timeline</h2>
                    <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Filter sessions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#181825] border-transparent rounded-xl text-gray-900 dark:text-[#cdd6f4] placeholder-gray-500 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all sm:text-sm"
                        />
                    </div>
                </div>

                {filteredSessions.length > 0 ? (
                    <div className="relative border-l-2 border-emerald-100 dark:border-emerald-500/20 ml-3 pl-8 space-y-8 pb-4">
                        {filteredSessions.map((session) => (
                            <div key={session.id} className="relative group animate-in fade-in slide-in-from-bottom-2">
                                <div className="absolute -left-[41px] top-1 w-5 h-5 bg-white dark:bg-[#1e1e2e] border-4 border-emerald-500 rounded-full shadow-sm group-hover:scale-125 transition-transform" />
                                
                                <div className="bg-white dark:bg-[#181825] border border-gray-100 dark:border-[#313244] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                                    <Clock className="w-3.5 h-3.5 mr-1" /> {formatDuration(session.durationMinutes)}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] px-2 py-1 bg-gray-100 dark:bg-[#313244] rounded-md">
                                                    {session.skillName}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-[#7f849c]">
                                                <Calendar className="w-4 h-4 mr-1.5" />
                                                {formatDate(session.sessionDate)}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenEditModal(session)} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#272739] dark:hover:bg-[#313244] text-gray-600 dark:text-[#cdd6f4] rounded-lg transition-colors" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => { setSessionToDelete(session); setIsDeleteConfirmOpen(true); }} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {session.notes && (
                                        <p className="text-gray-700 dark:text-[#a6adc8] leading-relaxed mt-2 bg-gray-50 dark:bg-[#1e1e2e] p-4 rounded-xl border border-gray-100 dark:border-[#313244]/50">
                                            {session.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4 bg-gray-50 dark:bg-[#181825] border-2 border-dashed border-gray-200 dark:border-[#313244] rounded-3xl">
                        <div className="w-20 h-20 bg-white dark:bg-[#272739] shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock className="w-10 h-10 text-gray-400 dark:text-[#6c7086]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">{searchTerm ? 'No sessions found' : 'No sessions logged yet'}</h3>
                        <p className="text-gray-500 dark:text-[#a6adc8] mb-8 max-w-sm mx-auto">
                            {searchTerm ? 'Try adjusting your search terms' : 'Start tracking the time you spend learning and practicing to see your mastery grow.'}
                        </p>
                        {!searchTerm && (
                            <Button variant="primary" icon={Plus} onClick={() => setShowLogModal(true)}>Log First Session</Button>
                        )}
                    </div>
                )}
            </div>

            {/* --- Modals (Re-styled inputs and buttons) --- */}
            <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title="Log a Session" footer={<><Button variant="secondary" onClick={() => setShowLogModal(false)}>Cancel</Button><Button variant="primary" onClick={handleLogSession} disabled={logLoading}>{logLoading ? 'Logging...' : 'Log Session'}</Button></>}>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Skill</label>
                        <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-colors" value={logForm.skillId} onChange={(e) => setLogForm({ ...logForm, skillId: e.target.value })} required>
                            <option value="">Select a skill</option>
                            {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Input label="Duration (minutes)" type="number" placeholder="45" value={logForm.durationMinutes} onChange={(e) => setLogForm({ ...logForm, durationMinutes: e.target.value })} required min="1" max="1440" />
                    <Input label="Date" type="date" value={logForm.sessionDate} onChange={(e) => setLogForm({ ...logForm, sessionDate: e.target.value })} required />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-[#cdd6f4]">Notes (optional)</label>
                        <textarea className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" rows="3" placeholder="What did you work on?" value={logForm.notes} onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })} />
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Session" size="lg" footer={<div className="flex gap-3 justify-end"><Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={editLoading}>Cancel</Button><Button variant="primary" onClick={handleEditSubmit} disabled={editLoading}>Save Changes</Button></div>}>
                <div className="space-y-4">
                    {editError && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{editError}</div>}
                    {selectedSession && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Skill</label>
                                <div className="px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-gray-700 dark:text-[#cdd6f4] font-medium">{selectedSession.skillName}</div>
                            </div>
                            <Input label="Duration (minutes)" type="number" min="1" max="1440" name="durationMinutes" value={editForm.durationMinutes} onChange={handleEditFormChange} />
                            <Input label="Date" type="date" name="sessionDate" value={editForm.sessionDate} onChange={handleEditFormChange} />
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-[#cdd6f4]">Notes</label>
                                <textarea name="notes" value={editForm.notes} onChange={handleEditFormChange} placeholder="Add any notes..." rows="3" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors" />
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Delete Session" footer={<><Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleConfirmDelete}>Delete Session</Button></>}>
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">Delete this session?</h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">This action cannot be undone.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={validationError} onClose={() => setValidationError(false)} title="Duration Exceeds Limit" footer={<Button variant="primary" onClick={() => setValidationError(false)}>Got it</Button>}>
                <div className="flex items-start space-x-4"><AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-gray-700 dark:text-[#a6adc8]">Session duration cannot exceed 24 hours (1440 minutes). Please enter a shorter duration.</p></div>
            </Modal>
        </div>
    );
};

export default Sessions;