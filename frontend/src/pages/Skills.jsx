import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import SkillCard from '../components/SkillCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import FormRow from '../components/ui/FormRow';
import { Plus, Search, Lightbulb, Check, Tag } from 'lucide-react';
import { useEffect } from "react"
import { addSkill, getMySkills, assignCategory } from "../services/skillService"
import { getAllCategories } from "../services/categoryService"

const Skills = ({ onNavigate, onSelectSkill }) => {
    const [initialSkills, setInitialSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        level: 'Beginner',
        categoryId: '',
        description: ''
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAssignCategoryModalOpen, setIsAssignCategoryModalOpen] = useState(false);
    const [selectedSkillForCategory, setSelectedSkillForCategory] = useState(null);
    const [assignCategoryForm, setAssignCategoryForm] = useState({ categoryId: '' });
    const [isAssignLoading, setIsAssignLoading] = useState(false);
    const [showAssignSuccessMessage, setShowAssignSuccessMessage] = useState(false);

    useEffect(() => {
        getMySkills({ size: 100 }).then(data => setInitialSkills(data?.content || []))
    }, [])

    useEffect(() => {
        getAllCategories()
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            })
            .catch(() => { });
    }, []);

    const filteredSkills = initialSkills.filter(skill => {
        const matchesSearch =
            skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (skill.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || skill.status.toLowerCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleSkillClick = (skillId) => {
        onSelectSkill(skillId);
        onNavigate('skill-detail');
    };

    const handleAssignCategory = async () => {
        if (!assignCategoryForm.categoryId || !selectedSkillForCategory) return;
        
        setIsAssignLoading(true);
        try {
            await assignCategory(selectedSkillForCategory.id, assignCategoryForm.categoryId);
            // Update the skill in the list
            setInitialSkills(prev => prev.map(s => {
                if (s.id === selectedSkillForCategory.id) {
                    const category = categories.find(c => c.id === parseInt(assignCategoryForm.categoryId));
                    return { ...s, category: category?.name, categoryId: parseInt(assignCategoryForm.categoryId) };
                }
                return s;
            }));
            setIsAssignCategoryModalOpen(false);
            setAssignCategoryForm({ categoryId: '' });
            setSelectedSkillForCategory(null);
            setShowAssignSuccessMessage(true);
            setTimeout(() => {
                setShowAssignSuccessMessage(false);
            }, 3000);
        } catch (err) {
            console.error("Assign category failed", err);
            alert('Failed to assign category. Please try again.');
        } finally {
            setIsAssignLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!formData.name) {
            alert('Please enter a skill name');
            return;
        }

        setIsSubmitting(true);
        try {
            const newSkill = await addSkill({
                name: formData.name,
                level: formData.level.toUpperCase(),
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
            });

            setInitialSkills(prev => [...prev, newSkill]);

            setIsModalOpen(false);
            setFormData({
                name: '',
                level: 'Beginner',
                categoryId: '',
                description: ''
            });
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
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
        <div className="space-y-6">
            <PageHeader
                title="Skills"
                description="Manage and track your learning skills"
                action={
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Skill
                    </Button>
                }
            />

            {/* Success Notifications */}
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Skill added successfully!</p>
                </div>
            )}
            {showAssignSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Category assigned successfully!</p>
                </div>
            )}

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={Search}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${filterStatus === status
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-[#1e1e2e] text-gray-700 dark:text-[#a6adc8] border border-gray-200 dark:border-[#313244] hover:bg-gray-50 dark:hover:bg-[#272739]'
                                }
              `}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className={`ml-2 ${filterStatus === status ? 'text-indigo-200' : 'text-gray-500'}`}>
                                ({count})
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills Grid */}
            {filteredSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.map((skill) => (
                        <div key={skill.id} className="relative group">
                            <SkillCard
                                skill={skill}
                                onClick={() => handleSkillClick(skill.id)}
                            />
                            <button
                                onClick={() => {
                                    setSelectedSkillForCategory(skill);
                                    setAssignCategoryForm({ categoryId: skill.categoryId || '' });
                                    setIsAssignCategoryModalOpen(true);
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg"
                                title="Assign Category"
                            >
                                <Tag className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Search}
                    title="No skills found"
                    description="Try adjusting your search or filters"
                    actionLabel="Clear filters"
                    onAction={() => { setSearchTerm(''); setFilterStatus('all'); }}
                />
            )}

            {/* Add Skill Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Skill"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add Skill'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Skill Name"
                        type="text"
                        placeholder="e.g., React.js, Python, Guitar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <FormRow columns={2} gap={4}>
                        <Select
                            label="Level"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            options={['Beginner', 'Intermediate', 'Advanced']}
                        />

                        <Select
                            label="Category"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                            placeholder="Select a category"
                        />
                    </FormRow>
                </form>
            </Modal>

            {/* Assign Category Modal */}
            <Modal
                isOpen={isAssignCategoryModalOpen}
                onClose={() => {
                    setIsAssignCategoryModalOpen(false);
                    setSelectedSkillForCategory(null);
                    setAssignCategoryForm({ categoryId: '' });
                }}
                title="Assign Category"
                footer={
                    <>
                        <Button 
                            variant="secondary" 
                            onClick={() => {
                                setIsAssignCategoryModalOpen(false);
                                setSelectedSkillForCategory(null);
                                setAssignCategoryForm({ categoryId: '' });
                            }}
                            disabled={isAssignLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleAssignCategory}
                            disabled={isAssignLoading || !assignCategoryForm.categoryId}
                        >
                            {isAssignLoading ? 'Assigning...' : 'Assign'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                        Assigning category to: <span className="font-semibold text-gray-900 dark:text-[#cdd6f4]">{selectedSkillForCategory?.name}</span>
                    </p>
                    <Select
                        label="Select Category"
                        value={assignCategoryForm.categoryId}
                        onChange={(e) => setAssignCategoryForm({ categoryId: e.target.value })}
                        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                        placeholder="Choose a category"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Skills;