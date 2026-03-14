import React, { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import { getUserSkills } from '../services/adminService';
import { BookOpen, Loader2, AlertCircle, Layers } from 'lucide-react';

const LEVEL_VARIANT = {
    Beginner:     'success',
    Intermediate: 'warning',
    Advanced:     'danger',
    Expert:       'purple',
};

const STATUS_VARIANT = {
    active:    'primary',
    completed: 'success',
    paused:    'default',
};

const STATUS_LABEL = {
    active:    'Active',
    completed: 'Completed',
    paused:    'Paused',
};

const PROGRESS_COLOR = (p) => {
    if (p >= 75) return 'green';
    if (p >= 40) return 'indigo';
    return 'yellow';
};

const UserSkillsModal = ({ isOpen, onClose, user }) => {
    const [skills, setSkills]   = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    useEffect(() => {
        if (!isOpen || !user?.id) return;
        let cancelled = false;

        const fetchSkills = async () => {
            setLoading(true);
            setError(null);
            setSkills([]);

            try {
                const result = await getUserSkills(user.id);
                if (!cancelled) setSkills(result ?? []);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.response?.data?.message ??
                        'Failed to load skills. Please try again.'
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchSkills();
        return () => { cancelled = true; };
    }, [isOpen, user?.id]);

    const completedCount = skills.filter(s => s.status === 'completed').length;
    const avgProgress    = skills.length
        ? Math.round(skills.reduce((s, sk) => s + (sk.progress ?? 0), 0) / skills.length)
        : 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <span>
            {user?.name ? `${user.name}'s Skills` : 'User Skills'}
          </span>
                </div>
            }
            size="lg"
        >
            {!loading && !error && skills.length > 0 && (
                <div className="flex items-center space-x-6 mb-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-700">{skills.length}</p>
                        <p className="text-xs text-indigo-500 font-medium mt-0.5">Total Skills</p>
                    </div>
                    <div className="w-px h-10 bg-indigo-200" />
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-700">{completedCount}</p>
                        <p className="text-xs text-green-500 font-medium mt-0.5">Completed</p>
                    </div>
                    <div className="w-px h-10 bg-indigo-200" />
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800">{avgProgress}%</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Avg Progress</p>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                    <p className="text-sm text-gray-500">Loading skills…</p>
                </div>
            )}

            {!loading && error && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            {!loading && !error && skills.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <Layers className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">No skills yet</p>
                    <p className="text-xs text-gray-400">This user hasn't added any skills.</p>
                </div>
            )}

            {!loading && !error && skills.length > 0 && (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                                        {skill.name}
                                    </h4>
                                    {skill.categoryName && (
                                        <p className="text-xs text-gray-400 mt-0.5">{skill.categoryName}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                                    <Badge variant={LEVEL_VARIANT[skill.level] ?? 'default'} size="sm">
                                        {skill.level}
                                    </Badge>
                                    <Badge
                                        variant={STATUS_VARIANT[skill.status] ?? 'default'}
                                        size="sm"
                                    >
                                        {STATUS_LABEL[skill.status] ?? skill.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Progress</span>
                                    <span className="text-xs font-semibold text-gray-700">
                    {skill.progress ?? 0}%
                  </span>
                                </div>
                                <ProgressBar
                                    progress={skill.progress ?? 0}
                                    size="sm"
                                    color={PROGRESS_COLOR(skill.progress ?? 0)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default UserSkillsModal;