import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import {
    ArrowLeft, Clock, Calendar, TrendingUp, Plus, Edit, Trash2, 
    Target, AlertTriangle, Check, Sparkles, Activity
} from 'lucide-react';
import { getMySkills, addSession, getSessions, deleteSkill, updateSkill, assignCategory, removeCategory } from "../services/skillService";
import { updateSession, deleteSession } from "../services/sessionService";
import { getAllCategories } from "../services/categoryService";

const AnimatedRing = ({ progress, size = 160, strokeWidth = 12 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-white/20" />
                <circle 
                    cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                    className="text-white transition-all duration-1000 ease-out" 
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-4xl font-extrabold tracking-tight">{progress}%</span>
                <span className="text-xs font-medium uppercase tracking-wider opacity-80 mt-1">Mastery</span>
            </div>
        </div>
    );
};

const SkillDetail = ({ skillId, onNavigate }) => {
    const [skill, setSkill] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');

    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isSessionEditModalOpen, setIsSessionEditModalOpen] = useState(false);
    const [isSessionDeleteConfirmOpen, setIsSessionDeleteConfirmOpen] = useState(false);
    
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', categoryId: '' });
    const [editCategories, setEditCategories] = useState([]);
    const [sessionForm, setSessionForm] = useState({ duration: '', date: new Date().toISOString().split('T')[0], notes: '' });
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionEditForm, setSessionEditForm] = useState({ durationMinutes: 0, sessionDate: '', notes: '' });
    const [sessionEditLoading, setSessionEditLoading] = useState(false);
    
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState(false);

    useEffect(() => {
        if (!skillId) return;
        getMySkills({ size: 100 }).then(data => {
            const found = (data?.content || []).find(s => String(s.id) === String(skillId));
            if (found) { setSkill(found); setEditForm({ name: found.name, categoryId: found.categoryId || '' }); }
        }).catch(() => {});
        getSessions(skillId).then(data => setSessions(Array.isArray(data) ? data : [])).catch(() => setSessions([]));
    }, [skillId]);

    const showNotification = (msg) => { setSuccessMessage(msg); setShowSuccessMessage(true); setTimeout(() => setShowSuccessMessage(false), 3000); };

    const handleAddSession = async (e) => {
        e.preventDefault();
        const duration = Number(sessionForm.duration);
        if (duration > 1440) return setValidationError(true), setIsSessionModalOpen(false);

        try {
            const newSession = await addSession(skillId, { durationMinutes: duration, sessionDate: sessionForm.date, notes: sessionForm.notes });
            setSessions(prev => [newSession, ...prev]);
            getMySkills({ size: 100 }).then(data => {
                const found = (data?.content || []).find(s => String(s.id) === String(skillId));
                if (found) setSkill(found);
            });
            setIsSessionModalOpen(false);
            setSessionForm({ duration: '', date: new Date().toISOString().split('T')[0], notes: '' });
            showNotification('Session logged successfully! Progress updated.');
        } catch (err) {}
    };

    const handleEditSkill = async (e) => {
        e.preventDefault(); setIsEditLoading(true);
        try {
            const updated = await updateSkill(skillId, { name: editForm.name });
            if (editForm.categoryId) { await assignCategory(skillId, editForm.categoryId); updated.categoryId = editForm.categoryId; }
            else if (skill.categoryId) { await removeCategory(skillId); updated.categoryId = null; updated.category = null; }
            setSkill(updated); setIsEditModalOpen(false); showNotification('Skill updated successfully!');
        } catch (err) { alert('Failed to update skill.'); } finally { setIsEditLoading(false); }
    };

    const handleDeleteSkill = async () => {
        setIsDeleteLoading(true);
        try {
            await deleteSkill(skillId);
            showNotification('Skill deleted successfully!');
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
            setTimeout(() => onNavigate('skills'), 1500);
        } catch (err) { alert('Failed to delete skill.'); setIsDeleteLoading(false); }
    };

    const handleSessionEditSubmit = async () => {
        if (!sessionEditForm.durationMinutes || !sessionEditForm.sessionDate) return alert('Fill required fields');
        if (Number(sessionEditForm.durationMinutes) > 1440) return setValidationError(true), setIsSessionEditModalOpen(false);

        try {
            setSessionEditLoading(true);
            await updateSession(skillId, selectedSession.id, sessionEditForm);
            setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, ...sessionEditForm } : s));
            setIsSessionEditModalOpen(false); showNotification('Session updated successfully!');
        } catch (err) { alert('Failed to update session'); } finally { setSessionEditLoading(false); }
    };

    const handleConfirmSessionDelete = async () => {
        if (!selectedSession) return;
        try {
            await deleteSession(skillId, selectedSession.id);
            setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
            setIsSessionDeleteConfirmOpen(false); setSelectedSession(null); showNotification('Session deleted successfully!');
        } catch (err) {}
    };

    const getProgressLevel = (p) => p >= 100 ? 'Master' : p >= 80 ? 'Advanced' : p >= 30 ? 'Intermediate' : 'Beginner';
    
    if (!skill) return <div className="flex items-center justify-center p-12 text-gray-500 animate-pulse">Loading skill details...</div>;

    const totalTimeHours = Math.round(sessions.reduce((a, s) => a + s.durationMinutes, 0) / 60);

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3 shadow-sm">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            <div>
                <button onClick={() => onNavigate('skills')} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-[#a6adc8] dark:hover:text-indigo-400 transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to My Skills
                </button>

                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 md:p-12 shadow-2xl text-white border border-indigo-400/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mb-20"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">
                        <div className="flex-1 text-center md:text-left space-y-5">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 shadow-sm flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                                    {getProgressLevel(skill.progress)}
                                </span>
                                {skill.status && (
                                    <span className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 shadow-sm">
                                        {skill.status}
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-sm">{skill.name}</h1>
                            
                            <div className="flex items-center justify-center md:justify-start gap-6 text-indigo-100 font-medium">
                                <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <Clock className="w-5 h-5 mr-2 opacity-80" />
                                    <span><strong className="text-white text-lg">{totalTimeHours}</strong> hours</span>
                                </div>
                                <div className="flex items-center bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                                    <Activity className="w-5 h-5 mr-2 opacity-80" />
                                    <span><strong className="text-white text-lg">{sessions.length}</strong> sessions</span>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex items-center justify-center md:justify-start gap-3">
                                <button onClick={() => setIsSessionModalOpen(true)} className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2">
                                    <Plus className="w-5 h-5" /> Log Session
                                </button>
                                <button onClick={() => {
                                    setEditForm({ name: skill.name, categoryId: skill.categoryId || '' });
                                    getAllCategories().then(data => { if (Array.isArray(data)) setEditCategories(data); });
                                    setIsEditModalOpen(true);
                                }} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/20" title="Edit Skill">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => setIsDeleteConfirmOpen(true)} className="p-3 bg-red-500/20 text-red-200 rounded-xl hover:bg-red-500/40 hover:text-white transition-all border border-red-500/30" title="Delete Skill">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-shrink-0 drop-shadow-2xl">
                            <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                                <AnimatedRing progress={skill.progress} size={150} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-[#313244]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-indigo-500" /> Session History
                            </h2>
                            <span className="text-sm font-medium text-gray-500 dark:text-[#a6adc8] bg-gray-100 dark:bg-[#313244] px-3 py-1 rounded-full">{sessions.length} entries</span>
                        </div>

                        {sessions.length > 0 ? (
                            <div className="relative border-l-2 border-indigo-100 dark:border-indigo-500/20 ml-3 pl-8 space-y-8">
                                {sessions.map((session, i) => (
                                    <div key={session.id} className="relative group">
                                        <div className="absolute -left-[41px] top-1 w-5 h-5 bg-white dark:bg-[#1e1e2e] border-4 border-indigo-500 rounded-full shadow-sm group-hover:scale-125 transition-transform" />
                                        
                                        <div className="bg-white dark:bg-[#181825] border border-gray-100 dark:border-[#313244] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-200 dark:group-hover:border-indigo-500/30">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold leading-5 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 mb-2">
                                                        <Clock className="w-3.5 h-3.5 mr-1" /> {session.durationMinutes} min
                                                    </span>
                                                    <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-[#7f849c]">
                                                        <Calendar className="w-4 h-4 mr-1.5" />
                                                        {new Date(session.sessionDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                </div>
                                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                                                    <button onClick={() => { setSelectedSession(session); setSessionEditForm({ durationMinutes: session.durationMinutes, sessionDate: session.sessionDate ? session.sessionDate.split('T')[0] : '', notes: session.notes || '' }); setIsSessionEditModalOpen(true); }} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#272739] dark:hover:bg-[#313244] text-gray-600 dark:text-[#cdd6f4] rounded-lg transition-colors" title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => { setSelectedSession(session); setIsSessionDeleteConfirmOpen(true); }} className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            {session.notes && (
                                                <p className="text-gray-700 dark:text-[#a6adc8] leading-relaxed mt-3 bg-gray-50 dark:bg-[#1e1e2e] p-3 rounded-xl border border-gray-100 dark:border-[#313244]/50">
                                                    {session.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-[#313244] rounded-2xl">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-[#272739] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-gray-400 dark:text-[#6c7086]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">No sessions logged</h3>
                                <p className="text-gray-500 dark:text-[#a6adc8] mb-6 max-w-sm mx-auto">Start tracking the time you spend learning and practicing to see your mastery grow.</p>
                                <Button variant="primary" icon={Plus} onClick={() => setIsSessionModalOpen(true)}>Log First Session</Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-[#313244]">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-500" /> Averages
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-[#181825] rounded-2xl border border-gray-100 dark:border-[#313244]">
                                <div className="text-sm font-semibold text-gray-500 dark:text-[#7f849c] mb-1">Avg Session Length</div>
                                <div className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4]">
                                    {sessions.length ? Math.round((sessions.reduce((a, s) => a + s.durationMinutes, 0) / sessions.length)) : 0} <span className="text-sm font-semibold text-gray-500">min</span>
                                </div>
                            </div>
                            <div className="p-4 bg-purple-50/50 dark:bg-purple-500/5 rounded-2xl border border-purple-100/50 dark:border-purple-500/10">
                                <div className="text-sm font-semibold text-purple-600/70 dark:text-purple-400/70 mb-1">Mastery Gain / Hr</div>
                                <div className="text-2xl font-black text-purple-700 dark:text-purple-300">
                                    {totalTimeHours > 0 ? (skill.progress / totalTimeHours).toFixed(1) : 0}% 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} title="Log Practice Session" footer={
                <><Button variant="secondary" onClick={() => setIsSessionModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleAddSession}>Add Session</Button></>
            }>
                <form className="space-y-4">
                    <Input label="Duration (minutes)" type="number" placeholder="60" value={sessionForm.duration} onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })} required min="1" max="1440" />
                    <Input label="Date" type="date" value={sessionForm.date} onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })} required />
                    <Textarea label="Notes" placeholder="What did you learn or practice?" value={sessionForm.notes} onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })} rows={4} />
                </form>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Skill" footer={
                <><Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={isEditLoading}>Cancel</Button>
                {skill?.categoryId && (
                    <Button variant="danger" onClick={async () => {
                        setIsEditLoading(true);
                        try { await removeCategory(skillId); setSkill({ ...skill, categoryId: null, category: null }); setEditForm({ name: skill.name, categoryId: '' }); setIsEditModalOpen(false); showNotification('Category removed successfully!'); } catch (err) { alert('Failed to remove category.'); } finally { setIsEditLoading(false); }
                    }} disabled={isEditLoading} size="sm">Remove Category</Button>
                )}
                <Button variant="primary" onClick={handleEditSkill} disabled={isEditLoading}>{isEditLoading ? 'Saving...' : 'Save Changes'}</Button></>
            }>
                <form className="space-y-4">
                    <Input label="Skill Name" type="text" placeholder="Enter skill name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                    <Select label="Category (Optional)" value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })} options={editCategories.map(cat => ({ value: cat.id, label: cat.name }))} placeholder="Select a category" />
                </form>
            </Modal>

            <Modal isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} title="Delete Skill" footer={<><Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isDeleteLoading}>Cancel</Button><Button variant="danger" onClick={handleDeleteSkill} disabled={isDeleteLoading}>{isDeleteLoading ? 'Deleting...' : 'Delete Skill'}</Button></>}>
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">Delete this skill?</h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-4">This action cannot be undone. All sessions and progress data associated with this skill will be permanently deleted.</p>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isSessionEditModalOpen} onClose={() => setIsSessionEditModalOpen(false)} title="Edit Session" size="lg" footer={<div className="flex gap-3 justify-end"><Button variant="secondary" onClick={() => setIsSessionEditModalOpen(false)} disabled={sessionEditLoading}>Cancel</Button><Button variant="primary" onClick={handleSessionEditSubmit} disabled={sessionEditLoading}>{sessionEditLoading ? 'Saving...' : 'Save Changes'}</Button></div>}>
                <form className="space-y-4">
                    <Input label="Duration (minutes)" type="number" name="durationMinutes" value={sessionEditForm.durationMinutes} onChange={(e) => setSessionEditForm(prev => ({...prev, durationMinutes: parseInt(e.target.value) || 0}))} required min="1" />
                    <Input label="Date" type="date" name="sessionDate" value={sessionEditForm.sessionDate} onChange={(e) => setSessionEditForm(prev => ({...prev, sessionDate: e.target.value}))} required />
                    <Textarea label="Notes" name="notes" value={sessionEditForm.notes} onChange={(e) => setSessionEditForm(prev => ({...prev, notes: e.target.value}))} rows={3} />
                </form>
            </Modal>

            <Modal isOpen={isSessionDeleteConfirmOpen} onClose={() => setIsSessionDeleteConfirmOpen(false)} title="Delete Session" footer={<><Button variant="secondary" onClick={() => setIsSessionDeleteConfirmOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleConfirmSessionDelete}>Delete Session</Button></>}>
                <div className="flex items-start space-x-4"><div className="w-12 h-12 bg-red-100 dark:bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" /></div>
                    <div className="flex-1"><h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">Delete this session?</h3><p className="text-sm text-gray-600 dark:text-[#9399b2]">This action cannot be undone.</p></div>
                </div>
            </Modal>
            
            <Modal isOpen={validationError} onClose={() => setValidationError(false)} title="Duration Exceeds Limit" footer={<Button variant="primary" onClick={() => setValidationError(false)}>Got it</Button>}>
                <div className="flex items-start space-x-4"><AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-gray-700 dark:text-[#a6adc8]">Session duration cannot exceed 24 hours (1440 minutes). Please enter a shorter duration.</p></div>
            </Modal>
        </div>
    );
};

export default SkillDetail;