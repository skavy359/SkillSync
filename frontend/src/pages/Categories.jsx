import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import {
    FolderKanban,
    Lightbulb,
    Clock,
    Plus,
    ArrowRight
} from 'lucide-react';
import { useEffect, useState } from "react";
// import { fetchCategories, fetchCategoryAnalytics } from "../services/categoryService";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [analytics, setAnalytics] = useState([]);

    const categoriesWithStats = categories.map(cat => {
        const stat = analytics.find(a => a.categoryId === cat.id);

        return {
            ...cat,
            skillCount: stat?.skillCount || 0,
            totalMinutes: stat?.totalMinutes || 0
        };
    });

    useEffect(() => {
        fetchCategories().then(setCategories);
        fetchCategoryAnalytics().then(setAnalytics);
    }, []);


    const colorClasses = {
        indigo: {
            bg: 'bg-indigo-100',
            text: 'text-indigo-600',
            badge: 'primary'
        },
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            badge: 'info'
        },
        purple: {
            bg: 'bg-purple-100',
            text: 'text-purple-600',
            badge: 'purple'
        },
        yellow: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-600',
            badge: 'warning'
        },
        green: {
            bg: 'bg-green-100',
            text: 'text-green-600',
            badge: 'success'
        }
    };

    const totalSkills = categoriesWithStats.reduce((sum, cat) => sum + cat.skillCount, 0);
    const totalHours = categoriesWithStats.reduce((sum, cat) => sum + cat.totalMinutes, 0) / 60;

    if (!categories.length) {
        return <div className="p-8 text-gray-500">Loading categories...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Categories"
                description="Organize your skills into categories"
                actionLabel="Add Category"
                actionIcon={Plus}
                onAction={() => alert('Add category clicked!')}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{categoriesWithStats.length}</h3>
                    <p className="text-sm text-gray-600">Total Categories</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{totalSkills}</h3>
                    <p className="text-sm text-gray-600">Skills Across Categories</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{Math.round(totalHours)}h</h3>
                    <p className="text-sm text-gray-600">Total Learning Time</p>
                </Card>
            </div>

            {/* Categories Grid */}
            {categoriesWithStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categoriesWithStats.map((category) => {
                        const colors = colorClasses[category.color];
                        const hours = Math.round(category.totalMinutes / 60);

                        return (
                            <Card
                                key={category.id}
                                hover
                                className="p-6 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <FolderKanban className={`w-7 h-7 ${colors.text}`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {category.description}
                                            </p>

                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Lightbulb className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    <span className="font-medium">{category.skillCount}</span>
                                                    <span className="ml-1 text-gray-500">skills</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                                    <span className="font-medium">{hours}</span>
                                                    <span className="ml-1 text-gray-500">hours</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-600">Activity</span>
                                        <Badge variant={colors.badge} size="sm">
                                            {category.skillCount > 3 ? 'High' : category.skillCount > 1 ? 'Medium' : 'Low'}
                                        </Badge>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${colors.bg.replace('100', '500')}`}
                                            style={{ width: `${Math.min((category.skillCount / 5) * 100, 100)}%` }}
                                        />
                                    </div>
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
                    actionLabel="Create First Category"
                    actionIcon={Plus}
                    onAction={() => alert('Create category clicked!')}
                />
            )}
        </div>
    );
};

export default Categories;