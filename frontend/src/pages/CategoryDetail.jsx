import React, { useState, useEffect } from 'react';
import Section from '../components/ui/Section';
import SkillCard from '../components/SkillCard';
import { ArrowLeft, FolderKanban, Lightbulb, Clock, TrendingUp, Edit, Trash2, AlertTriangle, Check, X } from 'lucide-react';
import { getAllCategories, updateCategory, deleteCategory } from "../services/categoryService";
import { getMySkills } from "../services/skillService";
import { fetchSessions } from "../services/sessionService";

const CategoryDetail = ({ categoryId, onNavigate, onSelectSkill, onCategoryDeleted }) => {
    const [category, setCategory] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                if (categoryId === 'others') {
                    setCategory({ id: 'others', name: 'Others', description: 'Skills without a category' });
                }

                const cats = await getAllCategories();
                const found = (Array.isArray(cats) ? cats : []).find(c => c.id === categoryId || c.name === categoryId);
                if (found) setCategory(found);

                const skillsResponse = await getMySkills({ size: 100 });
                const allSkills = skillsResponse?.content || [];

                let categorySkills;
                if (categoryId === 'others') {
                    categorySkills = allSkills.filter(skill => !skill.categoryId && !skill.category);
                } else {
                    categorySkills = allSkills.filter(skill => 
                        skill.categoryId === categoryId ||
                        (typeof skill.category === 'string' && skill.category === categoryId) ||
                        skill.categoryId === found?.id ||
                        (typeof skill.category === 'string' && skill.category === found?.name)
                    );
                }

                const enhancedSkills = await Promise.all(categorySkills.map(async (skill) => {
                    try {
                        const sessions = await fetchSessions(skill.id);
                        const totalMinutes = (Array.isArray(sessions) ? sessions : []).reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
                        return { ...skill, totalMinutes };
                    } catch (err) {
                        return { ...skill, totalMinutes: 0 };
                    }
                }));

                setSkills(enhancedSkills);
            } catch (err) {
                console.error('Error loading category data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [categoryId]);

    const handleEditCategory = async () => {
        if (!editForm.name.trim()) return alert('Please enter a category name');
        setEditLoading(true);
        try {
            const updated = await updateCategory(category.id, { name: editForm.name.trim() });
            setCategory(updated);
            setIsEditModalOpen(false);
            setSuccessMessage('Category updated successfully!');
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            alert('Failed to update category');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await deleteCategory(category.id);
            setIsDeleteConfirmOpen(false);
            onCategoryDeleted();
        } catch (err) {
            alert('Failed to delete category');
            setIsDeleteConfirmOpen(false);
        }
    };

    const calculateStats = () => {
        const totalSkills = skills.length;
        const completedSkills = skills.filter(s => s.progress >= 100).length;
        const totalMinutes = skills.reduce((sum, s) => sum + (s.totalMinutes || 0), 0);
        const completionRate = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
        return { totalSkills, completedSkills, totalMinutes, completionRate };
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading category details...</p>
        </div>
    );

    if (!category) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <FolderKanban className="w-16 h-16 text-gray-300 dark:text-[#313244] mb-4" />
            <p className="text-xl font-bold text-gray-500 dark:text-gray-400">Category not found</p>
            <button onClick={() => onNavigate('categories')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">Go Back</button>
        </div>
    );

    const stats = calculateStats();

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            
            <button
                onClick={() => onNavigate('categories')}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
            >
                <div className="p-1.5 rounded-lg bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 shadow-sm group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/20 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                Back to Categories
            </button>

            {showSuccessMessage && (
                <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold">
                        <Check className="w-5 h-5" /> {successMessage}
                    </div>
                </div>
            )}

            {/* Category Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 shadow-sm">
                
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="px-6 md:px-10 py-10 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0">
                            <FolderKanban className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">{category.name}</h1>
                            <div className="flex items-center gap-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-amber-500" /> {stats.totalSkills} Skills</span>
                                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-500" /> {stats.completedSkills} Mastered</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {Math.round(stats.totalMinutes / 60)}h Spent</span>
                            </div>
                        </div>
                    </div>

                    {categoryId !== 'others' && (
                        <div className="flex items-center gap-3 shrink-0 bg-white/50 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/5 p-1.5 rounded-2xl">
                            <button
                                onClick={() => { setEditForm({ name: category.name }); setIsEditModalOpen(true); }}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#272739] hover:bg-gray-50 dark:hover:bg-[#313244] text-gray-700 dark:text-gray-300 rounded-xl font-bold shadow-sm transition-all border border-gray-200/50 dark:border-white/5"
                            >
                                <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => setIsDeleteConfirmOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-bold shadow-sm transition-all border border-red-200/50 dark:border-red-500/20"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Tracked', val: stats.totalSkills, icon: Lightbulb, color: 'amber' },
                    { label: 'Mastered Skills', val: stats.completedSkills, icon: TrendingUp, color: 'emerald' },
                    { label: 'Hours Invested', val: `${Math.round(stats.totalMinutes / 60)}h`, icon: Clock, color: 'blue' },
                    { label: 'Completion Rate', val: `${stats.completionRate}%`, icon: Check, color: 'purple' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#181825] rounded-3xl p-6 border border-gray-200/50 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-colors group">
                        <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-500/20 text-${stat.color}-600 dark:text-${stat.color}-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.val}</h3>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Skills Grid */}
            <Section title="Tracked Skills" description={`Managing ${stats.totalSkills} skill${stats.totalSkills !== 1 ? 's' : ''} inside this category`}>
                {skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skills.map(skill => (
                            <SkillCard
                                key={skill.id}
                                skill={skill}
                                onClick={() => {
                                    onSelectSkill(skill.id);
                                    onNavigate('skill-detail');
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 rounded-3xl p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-[#1e1e2e] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lightbulb className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No skills assigned</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">You haven't added any skills to this category yet.</p>
                        <button onClick={() => onNavigate('dashboard')} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold rounded-xl transition-colors">
                            Go Add Skills
                        </button>
                    </div>
                )}
            </Section>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#1e1e2e] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Rename Category</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <form>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    autoFocus
                                />
                            </form>
                        </div>
                        <div className="px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#181825] flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} disabled={editLoading} className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleEditCategory} disabled={editLoading} className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50">
                                {editLoading ? 'Saving...' : 'Save Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
                    <div className="relative bg-white dark:bg-[#181825] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-red-200/50 dark:border-red-500/20">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-red-100 dark:border-red-500/10 bg-red-50 dark:bg-red-500/5">
                            <h3 className="text-lg font-black text-red-900 dark:text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Delete Category?
                            </h3>
                            <button onClick={() => setIsDeleteConfirmOpen(false)} className="p-2 rounded-xl text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 sm:p-8 space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                You are about to delete <strong className="text-gray-900 dark:text-white">{category.name}</strong>. The <strong className="text-indigo-600 dark:text-indigo-400">{skills.length} skills</strong> in this category will remain, but they will be unassigned.
                            </p>
                            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">This action cannot be undone.</p>
                        </div>
                        <div className="px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1e1e2e]/50 flex gap-3">
                            <button onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 px-4 py-3 bg-white dark:bg-[#272739] hover:bg-gray-100 border border-gray-200 dark:border-white/5 dark:hover:bg-[#313244] text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl transition-all shadow-sm">
                                Cancel
                            </button>
                            <button onClick={handleDeleteCategory} className="flex-1 px-4 py-3 text-white bg-red-600 hover:bg-red-700 text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-500/20">
                                Delete It
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDetail;