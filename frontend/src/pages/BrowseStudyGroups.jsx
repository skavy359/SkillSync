import { useState, useEffect } from 'react';
import { Search, Users, BookOpen, ChevronRight, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { listPublicGroups, searchGroups, joinGroup } from '../services/studyGroupService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const BrowseStudyGroups = ({ onNavigate, onSelectGroup }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [joiningGroupId, setJoiningGroupId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const PAGE_SIZE = 10;

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const groupsRes = await listPublicGroups(0, PAGE_SIZE);
            setGroups(groupsRes.content || groupsRes || []);
            setTotalPages(groupsRes.totalPages || 1);
            setCurrentPage(0);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchInitialData();
            return;
        }

        try {
            setSearching(true);
            const result = await searchGroups(searchQuery, 0, PAGE_SIZE);
            setGroups(result.content || result || []);
            setTotalPages(result.totalPages || 1);
            setCurrentPage(0);
        } catch (error) {
            console.error('Error searching groups:', error);
        } finally {
            setSearching(false);
        }
    };


    const handlePagination = async (newPage) => {
        try {
            setLoading(true);
            let result;
            if (searchQuery.trim()) {
                result = await searchGroups(searchQuery, newPage, PAGE_SIZE);
            } else {
                result = await listPublicGroups(newPage, PAGE_SIZE);
            }
            setGroups(result.content || result || []);
            setCurrentPage(newPage);
        } catch (error) {
            console.error('Error loading page:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToGroup = (groupId) => {
        onSelectGroup(groupId);
        onNavigate('group-details');
    };

    const handleJoinGroup = async (groupId, e) => {
        e.stopPropagation();
        try {
            setJoiningGroupId(groupId);
            await joinGroup(groupId);
            // Update the group in the list to mark as joined
            setGroups(groups.map(g => g.id === groupId ? { ...g, isMember: true } : g));
            setSuccessMsg('Successfully joined group!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Error joining group:', err);
            alert(err.response?.data?.message || 'Failed to join group');
        } finally {
            setJoiningGroupId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#11111b]">
            {/* Header */}
            <div className="px-8 py-8">
                <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-[#1e1e2e] dark:to-[#1e1e2e] border-2 border-gray-200 dark:border-[#313244] rounded-3xl px-8 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-white dark:text-indigo-400" />
                        <h1 className="text-4xl font-bold text-white">
                            Discover Study Groups
                        </h1>
                    </div>
                    <p className="text-indigo-100 dark:text-[#a6adc8]">
                        Join thriving communities of learners and accelerate your growth together
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 px-8 py-6 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Success Message */}
                    {successMsg && (
                        <div className="mb-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="mb-8">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by group name or skill..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 py-3 text-base bg-white dark:bg-[#1e1e2e] border border-gray-300 dark:border-[#313244]"
                                />
                            </div>
                            <Button type="submit" loading={searching} className="px-8">
                                Search
                            </Button>
                        </form>
                    </div>

                    {/* Groups Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                        </div>
                    ) : groups.length === 0 ? (
                        <div className="bg-white dark:bg-[#1e1e2e] rounded-lg p-8 text-center">
                            <Users className="w-12 h-12 text-gray-400 dark:text-[#6c7086] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-2">
                                No groups found
                            </h3>
                            <p className="text-gray-600 dark:text-[#a6adc8] mb-4">
                                {searchQuery ? 'Try a different search term' : 'No public groups available yet'}
                            </p>
                            <Button onClick={() => onNavigate('study-groups')}>
                                Create a Group
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {groups.map(group => (
                                    <div
                                        key={group.id}
                                        onClick={() => handleNavigateToGroup(group.id)}
                                        className="group relative bg-white dark:bg-[#1e1e2e] rounded-3xl overflow-hidden border-2 border-gray-200 dark:border-[#313244] hover:border-transparent transition-all duration-300 hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-indigo-500/30 cursor-pointer transform hover:-translate-y-1"
                                    >
                                        {/* Gradient Background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Content */}
                                        <div className="relative p-6 space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-[#cdd6f4] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {group.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-1 flex items-center gap-1">
                                                        <span>👤</span> {group.createdByName}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <BookOpen className="w-5 h-5 text-white" />
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm text-gray-600 dark:text-[#a6adc8] line-clamp-2 leading-relaxed">
                                                {group.description || 'A collaborative learning space'}
                                            </p>

                                            {/* Skill Badge */}
                                            {group.skillName && (
                                                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-500/20 dark:to-blue-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold gap-1">
                                                    <span>🎯</span>
                                                    {group.skillName}
                                                </div>
                                            )}

                                            {/* Stats Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-[#313244]">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{group.memberCount}</span>
                                                    <span className="text-xs text-gray-500 dark:text-[#6c7086]">members</span>
                                                </div>
                                                {group.isMember ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full">
                                                        <span>✓</span> Joined
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleJoinGroup(group.id, e)}
                                                        disabled={joiningGroupId === group.id}
                                                        className="px-4 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                                    >
                                                        {joiningGroupId === group.id ? '...' : 'Join'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        onClick={() => handlePagination(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className="px-4"
                                    >
                                        Previous
                                    </Button>
                                    <span className="text-gray-600 dark:text-[#a6adc8] text-sm">
                                        Page {currentPage + 1} of {totalPages}
                                    </span>
                                    <Button
                                        onClick={() => handlePagination(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className="px-4"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowseStudyGroups;
