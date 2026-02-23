import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import SkillCard from '../components/SkillCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import {
    ArrowLeft,
    FolderKanban,
    Lightbulb,
    Clock,
    TrendingUp,
    Edit,
    Trash2,
    AlertTriangle,
    Check
} from 'lucide-react';
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
                // Handle "Others" category (virtual category for uncategorized skills)
                if (categoryId === 'others') {
                    setCategory({
                        id: 'others',
                        name: 'Others',
                        description: 'Skills without a category'
                    });
                }

                // Fetch all categories to find the one with matching ID
                const cats = await getAllCategories();
                const found = (Array.isArray(cats) ? cats : []).find(
                    c => c.id === categoryId || c.name === categoryId
                );
                
                if (found) {
                    setCategory(found);
                }

                // Fetch all user skills and filter by category
                const skillsResponse = await getMySkills({ size: 100 });
                const allSkills = skillsResponse?.content || [];
                
                // Filter skills that match this category
                let categorySkills;
                
                if (categoryId === 'others') {
                    // For "Others" category, get skills WITHOUT any category
                    categorySkills = allSkills.filter(skill => {
                        const skillCatId = skill.categoryId;
                        const skillCat = skill.category;
                        return !skillCatId && !skillCat;
                    });
                } else {
                    // For normal categories, filter by ID or name match
                    categorySkills = allSkills.filter(skill => {
                        const skillCatId = skill.categoryId;
                        const skillCatName = typeof skill.category === 'string' ? skill.category : null;
                        
                        return skillCatId === categoryId || 
                               skillCatName === categoryId ||
                               skill.categoryId === found?.id ||
                               (typeof skill.category === 'string' && skill.category === found?.name);
                    });
                }

                // Enhance skills with session data
                const enhancedSkills = await Promise.all(
                    categorySkills.map(async (skill) => {
                        try {
                            const sessions = await fetchSessions(skill.id);
                            const sessionArray = Array.isArray(sessions) ? sessions : [];
                            const totalMinutes = sessionArray.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
                            return {
                                ...skill,
                                totalMinutes
                            };
                        } catch (err) {
                            return { ...skill, totalMinutes: 0 };
                        }
                    })
                );

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
        if (!editForm.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        setEditLoading(true);
        try {
            const updated = await updateCategory(category.id, {
                name: editForm.name.trim()
            });

            setCategory(updated);
            setIsEditModalOpen(false);
            setShowSuccessMessage(true);
            setSuccessMessage('Category updated successfully!');
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Error updating category:', err);
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
            console.error('Error deleting category:', err);
            setIsDeleteConfirmOpen(false);
            alert('Failed to delete category');
        }
    };

    const calculateStats = () => {
        const totalSkills = skills.length;
        const completedSkills = skills.filter(s => s.progress >= 100).length;
        const totalMinutes = skills.reduce((sum, s) => sum + (s.totalMinutes || 0), 0);
        const avgMinutesPerSkill = totalSkills > 0 ? Math.round(totalMinutes / totalSkills) : 0;
        const completionRate = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

        return {
            totalSkills,
            completedSkills,
            totalMinutes,
            avgMinutesPerSkill,
            completionRate
        };
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading category...</div>;
    }

    if (!category) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Category not found</p>
            </div>
        );
    }

    const stats = calculateStats();

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => onNavigate('categories')}
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Categories
            </button>

            {/* Success Notification */}
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            {/* Header Card */}
            <Card className="p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                                <FolderKanban className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">{category.name}</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-[#9399b2]">
                            <div className="flex items-center">
                                <Lightbulb className="w-4 h-4 mr-1.5" />
                                <span>{stats.totalSkills} skills</span>
                            </div>
                            <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1.5" />
                                <span>{stats.completedSkills} completed</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5" />
                                <span>{Math.round(stats.totalMinutes / 60)}h logged</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        {categoryId !== 'others' && (
                            <>
                                <Button
                                    variant="secondary"
                                    icon={Edit}
                                    size="sm"
                                    onClick={() => {
                                        setEditForm({ name: category.name });
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
                            </>
                        )}
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{stats.totalSkills}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Skills</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/15 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{stats.completedSkills}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Completed</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{Math.round(stats.totalMinutes / 60)}h</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Time</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/15 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{stats.completionRate}%</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Completion Rate</p>
                </Card>
            </div>

            {/* Skills in this Category */}
            <Section
                title="Skills in this Category"
                description={`${stats.totalSkills} skill${stats.totalSkills !== 1 ? 's' : ''} in ${category.name}`}
            >
                {skills.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {skills.map((skill) => (
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
                    <Card className="p-12 text-center">
                        <FolderKanban className="w-12 h-12 text-gray-300 dark:text-[#313244] mx-auto mb-3" />
                        <p className="text-gray-600 dark:text-[#9399b2]">No skills in this category yet</p>
                    </Card>
                )}
            </Section>

            {/* Edit Category Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Category"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)} disabled={editLoading}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleEditCategory} disabled={editLoading}>
                            {editLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Category Name"
                        type="text"
                        placeholder="e.g., Web Development"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ name: e.target.value })}
                        required
                    />
                </form>
            </Modal>

            {/* Delete Category Confirmation Modal */}
            <Modal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                title="Delete Category"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDeleteCategory}>
                            Delete Category
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
                            Are you sure you want to delete this category?
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                            This action cannot be undone. The {skills.length} skill{skills.length !== 1 ? 's' : ''} in this category will remain but will be unassigned.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CategoryDetail;
