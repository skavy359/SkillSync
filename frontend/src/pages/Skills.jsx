import React, { useState, useEffect } from 'react';
import SkillCard from '../components/SkillCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Plus, Search, Check, Tag, Target, Sparkles, Filter } from 'lucide-react';
import { addSkill, getMySkills, assignCategory, removeCategory } from "../services/skillService"
import { getAllCategories } from "../services/categoryService"

const Skills = ({ onNavigate, onSelectSkill }) => {
    const [initialSkills, setInitialSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', categoryId: '', description: '', estimatedHours: '' });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isAssignCategoryModalOpen, setIsAssignCategoryModalOpen] = useState(false);
    const [selectedSkillForCategory, setSelectedSkillForCategory] = useState(null);
    const [assignCategoryForm, setAssignCategoryForm] = useState({ categoryId: '' });
    const [isAssignLoading, setIsAssignLoading] = useState(false);
    const [showAssignSuccessMessage, setShowAssignSuccessMessage] = useState(false);

    useEffect(() => {
        getMySkills({ size: 100 }).then(data => setInitialSkills(data?.content || []));
        getAllCategories().then(data => { if (Array.isArray(data)) setCategories(data); }).catch(() => {});
    }, []);

    const filteredSkills = initialSkills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || (skill.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || skill.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleSkillClick = (skillId) => {
        onSelectSkill(skillId); onNavigate('skill-detail');
    };

    const handleAssignCategory = async () => {
        if (!selectedSkillForCategory) return;
        setIsAssignLoading(true);
        try {
            const categoryId = assignCategoryForm.categoryId;
            if (categoryId) {
                await assignCategory(selectedSkillForCategory.id, categoryId);
                setInitialSkills(prev => prev.map(s => {
                    if (s.id === selectedSkillForCategory.id) {
                        const category = categories.find(c => c.id === parseInt(categoryId));
                        return { ...s, category: category?.name, categoryId: parseInt(categoryId) };
                    }
                    return s;
                }));
            } else {
                await removeCategory(selectedSkillForCategory.id);
                setInitialSkills(prev => prev.map(s => s.id === selectedSkillForCategory.id ? { ...s, category: null, categoryId: null } : s));
            }
            setShowAssignSuccessMessage(true);
            setTimeout(() => setShowAssignSuccessMessage(false), 3000);
            setIsAssignCategoryModalOpen(false);
            setAssignCategoryForm({ categoryId: '' });
            setSelectedSkillForCategory(null);
        } catch (err) {
            alert('Failed to assign category. Please try again.');
        } finally {
            setIsAssignLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!formData.name) return alert('Please enter a skill name');
        setIsSubmitting(true);
        try {
            const newSkill = await addSkill({
                name: formData.name,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
                estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null
            });
            setInitialSkills(prev => [...prev, newSkill]);
            setIsModalOpen(false);
            setFormData({ name: '', categoryId: '', description: '', estimatedHours: '' });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            console.error("Add skill failed", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusCounts = {
        all: initialSkills.length,
        active: initialSkills.filter(s => s.status.toLowerCase() === 'active').length,
        completed: initialSkills.filter(s => s.status.toLowerCase() === 'completed').length,
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-10 shadow-lg text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium">
                            <Target className="w-4 h-4 text-cyan-300" />
                            <span>Your Skill Arsenal</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Skills</h1>
                        <p className="text-blue-100 max-w-xl text-lg opacity-90">
                            Track your mastery, set goals, and log your learning sessions.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Skill
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {showSuccessMessage && (
                    <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="font-medium text-green-800 dark:text-green-400">Skill added successfully!</p>
                    </div>
                )}
                {showAssignSuccessMessage && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <p className="font-medium text-purple-800 dark:text-purple-400">Category assigned successfully!</p>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl p-2 border border-gray-200 dark:border-[#313244] shadow-sm flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 dark:text-[#a6adc8]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by skill name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border-none bg-transparent rounded-xl text-gray-900 dark:text-[#cdd6f4] placeholder-gray-500 dark:placeholder-[#6c7086] focus:ring-0 sm:text-sm"
                    />
                </div>

                <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-[#181825] rounded-xl overflow-x-auto shrink-0 md:max-w-md border border-gray-100 dark:border-[#313244]/50">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`flex items-center whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                filterStatus === status
                                    ? 'bg-white dark:bg-[#313244] text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 dark:text-[#a6adc8] hover:text-gray-700 dark:hover:text-[#cdd6f4] hover:bg-white/50 dark:hover:bg-[#313244]/50'
                            }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                filterStatus === status 
                                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' 
                                    : 'bg-gray-200 dark:bg-[#45475a] text-gray-700 dark:text-[#bac2de]'
                            }`}>
                                {count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {initialSkills.length === 0 ? (
                <div className="text-center py-20 px-4 bg-white dark:bg-[#1e1e2e] rounded-3xl border border-dashed border-gray-300 dark:border-[#45475a]">
                    <div className="mx-auto w-24 h-24 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                        <Target className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-3">Your learning journey begins here</h2>
                    <p className="text-gray-500 dark:text-[#a6adc8] mb-8 max-w-md mx-auto">
                        Add the skills you want to learn or are currently mastering. Track your sessions, set goals, and watch your progress grow.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Your First Skill
                    </button>
                </div>
            ) : filteredSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSkills.map((skill) => (
                        <div key={skill.id} className="relative group">
                            <SkillCard
                                skill={skill}
                                onClick={() => handleSkillClick(skill.id)}
                                onRemoveCategory={async (skillId) => {
                                    setIsAssignLoading(true);
                                    try {
                                        await removeCategory(skillId);
                                        setInitialSkills(prev => prev.map(s => s.id === skillId ? { ...s, category: null, categoryId: null } : s));
                                        setShowAssignSuccessMessage(true);
                                        setTimeout(() => setShowAssignSuccessMessage(false), 3000);
                                    } catch (err) { alert('Failed to remove category'); } finally { setIsAssignLoading(false); }
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSkillForCategory(skill);
                                    setAssignCategoryForm({ categoryId: skill.categoryId || '' });
                                    setIsAssignCategoryModalOpen(true);
                                }}
                                className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-xl hover:scale-110 translate-y-2 group-hover:translate-y-0"
                                title="Assign Category"
                            >
                                <Tag className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-4 bg-gray-50 dark:bg-[#181825] rounded-3xl border border-dashed border-gray-300 dark:border-[#45475a]">
                    <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-[#313244] rounded-full flex items-center justify-center mb-4">
                        <Filter className="w-8 h-8 text-gray-400 dark:text-[#a6adc8]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">No skills match your search</h3>
                    <p className="text-gray-500 dark:text-[#a6adc8] mb-6">Try adjusting your filters or search term to find what you're looking for.</p>
                    <button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                        Clear all filters
                    </button>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Skill" footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button><Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Skill'}</Button></>}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Skill Name" type="text" placeholder="e.g., React.js, Python, Guitar" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Select label="Category (Optional)" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} options={categories.map(cat => ({ value: cat.id, label: cat.name }))} placeholder="Select a category or leave empty" />
                    <Input label="Estimated Hours" type="number" placeholder="e.g., 50" value={formData.estimatedHours} onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })} />
                </form>
            </Modal>

            <Modal isOpen={isAssignCategoryModalOpen} onClose={() => { setIsAssignCategoryModalOpen(false); setSelectedSkillForCategory(null); setAssignCategoryForm({ categoryId: '' }); }} title="Assign Category" footer={<><Button variant="secondary" onClick={() => { setIsAssignCategoryModalOpen(false); setSelectedSkillForCategory(null); setAssignCategoryForm({ categoryId: '' }); }} disabled={isAssignLoading}>Cancel</Button><Button variant="primary" onClick={handleAssignCategory} disabled={isAssignLoading}>{isAssignLoading ? 'Assigning...' : 'Assign'}</Button></>}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Assigning category to: <span className="font-bold text-gray-900 dark:text-[#cdd6f4]">{selectedSkillForCategory?.name}</span></p>
                    <Select label="Select Category" value={assignCategoryForm.categoryId} onChange={(e) => setAssignCategoryForm({ categoryId: e.target.value })} options={categories.map(cat => ({ value: cat.id, label: cat.name }))} placeholder="Choose a category" />
                </div>
            </Modal>
        </div>
    );
};

export default Skills;