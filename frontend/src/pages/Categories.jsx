import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import {
    FolderKanban,
    Lightbulb,
    Clock,
    Plus,
    ArrowRight,
    Check
} from 'lucide-react';
import { getAllCategories, createCategory } from "../services/categoryService";
import { getMySkills } from "../services/skillService";
import { fetchSessions } from "../services/sessionService";

const Categories = ({ onNavigate, onSelectCategory, onShowDeleteSuccess, onDismissDeleteSuccess }) => {
    const [categories, setCategories] = useState([]);
    const [categoryStats, setCategoryStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showDeleteSuccessMessage, setShowDeleteSuccessMessage] = useState(onShowDeleteSuccess);

    // When onShowDeleteSuccess changes, show the message and reload data
    useEffect(() => {
        if (onShowDeleteSuccess) {
            setShowDeleteSuccessMessage(true);
            // Reload categories to remove deleted one
            const reloadCategories = async () => {
                try {
                    const cats = await getAllCategories();
                    setCategories(Array.isArray(cats) ? cats : []);
                } catch (err) {
                    console.error('Error reloading categories:', err);
                }
            };
            reloadCategories();
            
            setTimeout(() => {
                setShowDeleteSuccessMessage(false);
                onDismissDeleteSuccess();
            }, 3000);
        }
    }, [onShowDeleteSuccess, onDismissDeleteSuccess]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch all categories
                const cats = await getAllCategories();
                const categoriesList = Array.isArray(cats) ? cats : [];
                setCategories(categoriesList);

                // Fetch all skills
                const skillsResponse = await getMySkills({ size: 100 });
                const skills = skillsResponse?.content || [];

                // Build analytics by fetching sessions for each skill
                const stats = {};
                const uncategorizedSkills = [];
                
                // Initialize stats for all categories
                categoriesList.forEach(cat => {
                    stats[cat.id] = {
                        skillCount: 0,
                        totalMinutes: 0,
                        completedSkills: 0
                    };
                });

                // Initialize stats for "Others" category
                stats['others'] = {
                    skillCount: 0,
                    totalMinutes: 0,
                    completedSkills: 0
                };

                // Calculate stats per category
                for (const skill of skills) {
                    // Get category identifier - could be categoryId (number) or category (string name)
                    let catId = skill.categoryId;
                    let catName = null;
                    
                    if (!catId && skill.category) {
                        // If category is an object with id
                        if (typeof skill.category === 'object' && skill.category.id) {
                            catId = skill.category.id;
                        } 
                        // If category is a string (category name), use it as key
                        else if (typeof skill.category === 'string') {
                            catName = skill.category;
                        }
                    }

                    // Determine the key to use (prefer ID, fallback to name)
                    const key = catId || catName;
                    
                    if (!key) {
                        // Add to uncategorized skills
                        uncategorizedSkills.push(skill);
                        stats['others'].skillCount += 1;
                        if (skill.progress >= 100) {
                            stats['others'].completedSkills += 1;
                        }

                        // Fetch sessions for this skill to get total minutes
                        try {
                            const sessions = await fetchSessions(skill.id);
                            const sessionArray = Array.isArray(sessions) ? sessions : [];
                            const totalMinutes = sessionArray.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
                            stats['others'].totalMinutes += totalMinutes;
                        } catch (err) {
                            console.error(`Error fetching sessions for skill ${skill.id}:`, err);
                        }
                    } else {
                        if (!stats[key]) {
                            stats[key] = {
                                skillCount: 0,
                                totalMinutes: 0,
                                completedSkills: 0
                            };
                        }

                        stats[key].skillCount += 1;
                        if (skill.progress >= 100) {
                            stats[key].completedSkills += 1;
                        }

                        // Fetch sessions for this skill to get total minutes
                        try {
                            const sessions = await fetchSessions(skill.id);
                            const sessionArray = Array.isArray(sessions) ? sessions : [];
                            const totalMinutes = sessionArray.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
                            stats[key].totalMinutes += totalMinutes;
                        } catch (err) {
                            console.error(`Error fetching sessions for skill ${skill.id}:`, err);
                        }
                    }
                }

                // Build final categories list with "Others" if needed
                const finalCategories = categoriesList;
                if (uncategorizedSkills.length > 0) {
                    finalCategories.push({
                        id: 'others',
                        name: 'Others',
                        description: 'Skills without a category'
                    });
                }

                // Set everything at once
                setCategories(finalCategories);
                setCategoryStats(stats);
            } catch (err) {
                console.error('Error loading categories data:', err);
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
        if (!formData.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        setSubmitting(true);
        try {
            const newCategory = await createCategory({
                name: formData.name.trim()
            });

            // Add new category to the list
            setCategories(prev => [...prev, newCategory]);
            
            // Initialize stats for new category
            setCategoryStats(prev => ({
                ...prev,
                [newCategory.id]: {
                    skillCount: 0,
                    totalMinutes: 0,
                    completedSkills: 0
                },
                [newCategory.name]: {
                    skillCount: 0,
                    totalMinutes: 0,
                    completedSkills: 0
                }
            }));

            setIsModalOpen(false);
            setFormData({ name: '' });
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error('Error adding category:', err);
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

    const colorMap = ['indigo', 'blue', 'purple', 'yellow', 'green'];

    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-100',
            darkBg: 'dark:bg-indigo-500/15',
            text: 'text-indigo-600',
            darkText: 'dark:text-indigo-400',
            barColor: 'bg-indigo-500',
            badge: 'primary'
        },
        blue: {
            bg: 'bg-blue-100',
            darkBg: 'dark:bg-blue-500/15',
            text: 'text-blue-600',
            darkText: 'dark:text-blue-400',
            barColor: 'bg-blue-500',
            badge: 'info'
        },
        purple: {
            bg: 'bg-purple-100',
            darkBg: 'dark:bg-purple-500/15',
            text: 'text-purple-600',
            darkText: 'dark:text-purple-400',
            barColor: 'bg-purple-500',
            badge: 'purple'
        },
        yellow: {
            bg: 'bg-yellow-100',
            darkBg: 'dark:bg-yellow-500/15',
            text: 'text-yellow-600',
            darkText: 'dark:text-yellow-400',
            barColor: 'bg-yellow-500',
            badge: 'warning'
        },
        green: {
            bg: 'bg-green-100',
            darkBg: 'dark:bg-green-500/15',
            text: 'text-green-600',
            darkText: 'dark:text-green-400',
            barColor: 'bg-green-500',
            badge: 'success'
        }
    };

    const getActivityLevel = (skillCount, totalMinutes) => {
        if (skillCount >= 5 || totalMinutes >= 3600) return { level: 'High', color: 'success' };
        if (skillCount >= 3 || totalMinutes >= 1800) return { level: 'Medium', color: 'warning' };
        return { level: 'Low', color: 'danger' };
    };

    const totalSkills = categoriesWithStats.reduce((sum, cat) => sum + cat.skillCount, 0);
    const totalMinutes = categoriesWithStats.reduce((sum, cat) => sum + cat.totalMinutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    if (loading) {
        return <div className="p-8 text-gray-500 dark:text-[#7f849c]">Loading categories...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Categories"
                description="Organize your skills into categories"
                action={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Category
                    </Button>
                }
            />

            {/* Success Notification */}
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Category added successfully!</p>
                </div>
            )}

            {/* Delete Success Notification */}
            {showDeleteSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Category deleted successfully!</p>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/15 rounded-xl flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{categoriesWithStats.length}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Categories</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{totalSkills}</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Skills Across Categories</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-500/15 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-1">{totalHours}h</h3>
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">Total Learning Time</p>
                </Card>
            </div>

            {/* Categories Grid */}
            {categoriesWithStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoriesWithStats.map((category, index) => {
                        const colorSet = colorClasses[category.color] || colorClasses[colorMap[index % colorMap.length]];
                        const hours = (category.totalMinutes / 60).toFixed(1);
                        const activity = getActivityLevel(category.skillCount, category.totalMinutes);
                        const activityBadgeVariant = activity.color;

                        return (
                            <Card
                                key={category.id}
                                hover
                                className="p-6 cursor-pointer"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className={`w-14 h-14 ${colorSet.bg} ${colorSet.darkBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <FolderKanban className={`w-7 h-7 ${colorSet.text} ${colorSet.darkText}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-3">
                                                {category.description}
                                            </p>

                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-sm text-gray-700 dark:text-[#a6adc8]">
                                                    <Lightbulb className="w-4 h-4 mr-1.5 text-gray-400 dark:text-[#6c7086]" />
                                                    <span className="font-medium">{category.skillCount}</span>
                                                    <span className="ml-1 text-gray-500 dark:text-[#7f849c]">skills</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-700 dark:text-[#a6adc8]">
                                                    <Clock className="w-4 h-4 mr-1.5 text-gray-400 dark:text-[#6c7086]" />
                                                    <span className="font-medium">{hours}</span>
                                                    <span className="ml-1 text-gray-500 dark:text-[#7f849c]">hours</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#272739] rounded-lg transition-colors">
                                        <ArrowRight className="w-5 h-5 text-gray-400 dark:text-[#6c7086]" />
                                    </button>
                                </div>

                                {/* Activity Badge */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#272739] flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-600 dark:text-[#9399b2]">Activity</span>
                                    <Badge variant={activityBadgeVariant} size="sm">
                                        {activity.level}
                                    </Badge>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={FolderKanban}
                    title="No categories yet"
                    description="Create categories to organize your skills"
                />
            )}

            {/* Add Category Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Category"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleAddCategory} disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Category'}
                        </Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Input
                        label="Category Name"
                        type="text"
                        placeholder="e.g., Web Development, Data Science"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </form>
            </Modal>
        </div>
    );
};

export default Categories;