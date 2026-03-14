import React, { useState, useEffect } from 'react';
import { FolderKanban, Lightbulb, Clock, Plus, ArrowRight, Check, Target, TrendingUp, Search } from 'lucide-react';
import { getAllCategories, createCategory } from "../services/categoryService";
import { getMySkills } from "../services/skillService";
import { fetchSessions } from "../services/sessionService";

const Categories = ({ onNavigate, onSelectCategory, onShowDeleteSuccess, onDismissDeleteSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [categoryStats, setCategoryStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showDeleteSuccessMessage, setShowDeleteSuccessMessage] = useState(onShowDeleteSuccess);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (onShowDeleteSuccess) {
            setShowDeleteSuccessMessage(true);
            getAllCategories().then(cats => setCategories(Array.isArray(cats) ? cats : [])).catch(console.error);
            setTimeout(() => {
                setShowDeleteSuccessMessage(false);
                onDismissDeleteSuccess();
            }, 3000);
        }
    }, [onShowDeleteSuccess, onDismissDeleteSuccess]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const cats = await getAllCategories();
                const categoriesList = Array.isArray(cats) ? cats : [];
                setCategories(categoriesList);

                const skillsResponse = await getMySkills({ size: 100 });
                const skills = skillsResponse?.content || [];

                const stats = { 'others': { skillCount: 0, totalMinutes: 0, completedSkills: 0 } };
                categoriesList.forEach(c => stats[c.id] = { skillCount: 0, totalMinutes: 0, completedSkills: 0 });

                const uncategorizedSkills = [];

                for (const skill of skills) {
                    let catId = skill.categoryId;
                    let catName = null;
                    if (!catId && skill.category) {
                        if (typeof skill.category === 'object' && skill.category.id) catId = skill.category.id;
                        else if (typeof skill.category === 'string') catName = skill.category;
                    }

                    const key = catId || catName;
                    
                    if (!key) {
                        uncategorizedSkills.push(skill);
                        stats['others'].skillCount += 1;
                        if (skill.progress >= 100) stats['others'].completedSkills += 1;
                        try {
                            const sessions = await fetchSessions(skill.id);
                            stats['others'].totalMinutes += (Array.isArray(sessions) ? sessions : []).reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
                        } catch(e) {}
                    } else {
                        if (!stats[key]) stats[key] = { skillCount: 0, totalMinutes: 0, completedSkills: 0 };
                        stats[key].skillCount += 1;
                        if (skill.progress >= 100) stats[key].completedSkills += 1;
                        try {
                            const sessions = await fetchSessions(skill.id);
                            stats[key].totalMinutes += (Array.isArray(sessions) ? sessions : []).reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
                        } catch(e) {}
                    }
                }

                if (uncategorizedSkills.length > 0) {
                    categoriesList.push({ id: 'others', name: 'Others', description: 'Skills without a category' });
                }

                setCategories([...categoriesList]);
                setCategoryStats(stats);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleCategoryClick = (categoryId) => {
        onSelectCategory(categoryId);
        onNavigate('category-detail');
    };

    const handleAddCategory = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!formData.name.trim()) return alert('Please enter a category name');
        setSubmitting(true);
        try {
            const newCategory = await createCategory({ name: formData.name.trim() });
            setCategories(prev => [...prev, newCategory]);
            setCategoryStats(prev => ({ ...prev, [newCategory.id]: { skillCount: 0, totalMinutes: 0, completedSkills: 0 } }));
            setIsModalOpen(false);
            setFormData({ name: '' });
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (err) {
            alert('Failed to add category');
        } finally {
            setSubmitting(false);
        }
    };

    const categoriesWithStats = categories.map(cat => ({
        ...cat,
        skillCount: categoryStats[cat.id]?.skillCount || categoryStats[cat.name]?.skillCount || 0,
        totalMinutes: categoryStats[cat.id]?.totalMinutes || categoryStats[cat.name]?.totalMinutes || 0,
        completedSkills: categoryStats[cat.id]?.completedSkills || categoryStats[cat.name]?.completedSkills || 0
    }));

    const filteredCategories = categoriesWithStats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const colorClasses = [
        { theme: 'indigo', text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/20', from: 'from-indigo-50 dark:from-indigo-500/10', to: 'to-white dark:to-[#181825]', border: 'border-indigo-200 dark:border-indigo-500/20' },
        { theme: 'emerald', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20', from: 'from-emerald-50 dark:from-emerald-500/10', to: 'to-white dark:to-[#181825]', border: 'border-emerald-200 dark:border-emerald-500/20' },
        { theme: 'amber', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/20', from: 'from-amber-50 dark:from-amber-500/10', to: 'to-white dark:to-[#181825]', border: 'border-amber-200 dark:border-amber-500/20' },
        { theme: 'rose', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/20', from: 'from-rose-50 dark:from-rose-500/10', to: 'to-white dark:to-[#181825]', border: 'border-rose-200 dark:border-rose-500/20' },
        { theme: 'fuchsia', text: 'text-fuchsia-600 dark:text-fuchsia-400', bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20', from: 'from-fuchsia-50 dark:from-fuchsia-500/10', to: 'to-white dark:to-[#181825]', border: 'border-fuchsia-200 dark:border-fuchsia-500/20' }
    ];

    const totalSkills = categoriesWithStats.reduce((sum, cat) => sum + cat.skillCount, 0);
    const totalMinutes = categoriesWithStats.reduce((sum, cat) => sum + cat.totalMinutes, 0);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading workspace...</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">My Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Organize your learning paths and group related skills together.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find a category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all shrink-0"
                    >
                        <Plus className="w-5 h-5" /> Add Category
                    </button>
                </div>
            </div>

            {/* Success Messages */}
            {(showSuccessMessage || showDeleteSuccessMessage) && (
                <div className="fixed top-24 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-bold">
                        <Check className="w-5 h-5" /> 
                        {showSuccessMessage ? 'Category added successfully!' : 'Category deleted successfully!'}
                    </div>
                </div>
            )}

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Categories', icon: FolderKanban, val: categoriesWithStats.length, color: 'indigo' },
                    { label: 'Tracked Skills', icon: Lightbulb, val: totalSkills, color: 'blue' },
                    { label: 'Hours Dedicated', icon: Clock, val: (totalMinutes / 60).toFixed(1), color: 'emerald' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:border-indigo-500/30 transition-colors">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-${stat.color}-100 dark:bg-${stat.color}-500/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-0.5">{stat.val}</h3>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Grids */}
            {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category, index) => {
                        const style = colorClasses[index % colorClasses.length];
                        const hours = (category.totalMinutes / 60).toFixed(1);
                        const isHighlyActive = category.totalMinutes >= 1800; // 30+ hours

                        return (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`group relative bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-b ${style.from} ${style.to} opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-500`} />
                                
                                <div className="relative p-6 z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${style.bg} ${style.text} group-hover:scale-110 transition-transform duration-300`}>
                                            <FolderKanban className="w-6 h-6" />
                                        </div>
                                        {isHighlyActive && (
                                            <div className="px-3 py-1 bg-gradient-to-r from-orange-400 to-rose-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                                                <TrendingUp className="w-3 h-3" /> Active
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{category.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-2 h-10 mb-6">
                                        {category.description || "Collection of inter-related skills and learning paths."}
                                    </p>

                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-center">
                                            <p className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{category.skillCount}</p>
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills</p>
                                        </div>
                                        <div className="flex-1 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-center">
                                            <p className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{hours}<span className="text-sm">h</span></p>
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spent</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 rounded-3xl p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-[#1e1e2e] rounded-full flex items-center justify-center mx-auto mb-6">
                        <FolderKanban className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No categories found</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">Create a new category to start grouping identical skills.</p>
                    <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-bold rounded-xl transition-colors">
                        Add Category Now
                    </button>
                </div>
            )}

            {/* Add Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-[#1e1e2e] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200 dark:border-white/10">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">New Category</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <form onSubmit={handleAddCategory}>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Web Development, AI, Math"
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    autoFocus
                                />
                            </form>
                        </div>
                        <div className="px-6 py-5 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#181825] flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} disabled={submitting} className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleAddCategory} disabled={submitting} className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50">
                                {submitting ? 'Creating...' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;