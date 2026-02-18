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
import { Plus, Search, Lightbulb } from 'lucide-react';
import { useEffect } from "react"
import { addSkill, getMySkills } from "../services/skillService"

const Skills = ({ onNavigate, onSelectSkill }) => {
    const [initialSkills, setInitialSkills] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        level: 'Beginner',
        category: '',
        description: ''
    });

    useEffect(() => {
        getMySkills().then(data => setInitialSkills(data?.content || []))
    }, [])

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newSkill = await addSkill({
                name: formData.name,
                level: formData.level.toUpperCase(),
            });

            setInitialSkills(prev => [...prev, newSkill]);

            setIsModalOpen(false);
            setFormData({
                name: '',
                level: 'Beginner',
                category: '',
                description: ''
            });
        } catch (err) {
            console.error("Add skill failed", err);
        }
    };

    const statusCounts = {
        all: initialSkills.length,
        active: initialSkills.filter(s => s.status.toLowerCase() === 'active').length,
        completed: initialSkills.filter(s => s.status.toLowerCase() === 'completed').length,
        paused: initialSkills.filter(s => s.status.toLowerCase() === 'paused').length,
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Skills"
                description="Manage and track your learning skills"
                actionLabel="Add Skill"
                actionIcon={Plus}
                onAction={() => setIsModalOpen(true)}
            />

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
                        <SkillCard
                            key={skill.id}
                            skill={skill}
                            onClick={() => handleSkillClick(skill.id)}
                        />
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
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Add Skill
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
                            options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
                        />

                        <Select
                            label="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            options={[]}
                            placeholder="Select a category"
                        />
                    </FormRow>

                    <Textarea
                        label="Description"
                        placeholder="What do you want to learn about this skill?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                    />
                </form>
            </Modal>
        </div>
    );
};

export default Skills;