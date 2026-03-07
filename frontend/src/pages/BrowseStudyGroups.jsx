import { useState, useEffect } from 'react';
import { Search, Users, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { listPublicGroups, searchGroups, listGroupsBySkill, joinGroup } from '../services/studyGroupService';
import { getMySkills } from '../services/skillService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const BrowseStudyGroups = ({ onNavigate, onSelectGroup }) => {
    const [groups, setGroups] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkillId, setSelectedSkillId] = useState('');
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
            const [skillsRes, groupsRes] = await Promise.all([
                getMySkills(),
                listPublicGroups(0, PAGE_SIZE)
            ]);
            setSkills(skillsRes.content || skillsRes || []);
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

    const handleSkillFilter = async (skillId) => {
        setSelectedSkillId(skillId);
        if (!skillId) {
            fetchInitialData();
            return;
        }

        try {
            setLoading(true);
            const result = await listGroupsBySkill(skillId, 0, PAGE_SIZE);
            setGroups(result.content || result || []);
            setTotalPages(result.totalPages || 1);
            setCurrentPage(0);
        } catch (error) {
            console.error('Error filtering groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePagination = async (newPage) => {
        try {
            setLoading(true);
            let result;
            if (selectedSkillId) {
                result = await listGroupsBySkill(selectedSkillId, newPage, PAGE_SIZE);
            } else if (searchQuery.trim()) {
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
            <div className="bg-white dark:bg-[#1e1e2e] border-b border-gray-200 dark:border-[#313244] px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2">
                        Browse Study Groups
                    </h1>
                    <p className="text-gray-600 dark:text-[#a6adc8]">
                        Discover public study groups and find collaborators
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
                    <div className="mb-6 space-y-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search group name, skill..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" loading={searching}>
                                Search
                            </Button>
                        </form>

                        {/* Skill Filter */}
                        <Select
                            value={selectedSkillId}
                            onChange={(e) => handleSkillFilter(e.target.value)}
                            label="Filter by Skill"
                        >
                            <option value="">All Skills</option>
                            {skills.map(skill => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                        </Select>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {groups.map(group => (
                                    <div
                                        key={group.id}
                                        onClick={() => handleNavigateToGroup(group.id)}
                                        className="bg-white dark:bg-[#1e1e2e] rounded-lg p-5 border border-gray-200 dark:border-[#313244] hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer"
                                    >
                                        {/* Group Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-[#cdd6f4] truncate">
                                                    {group.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-1">
                                                    by {group.createdByName}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[#6c7086] flex-shrink-0" />
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 dark:text-[#a6adc8] mb-3 line-clamp-2">
                                            {group.description || 'No description'}
                                        </p>

                                        {/* Skill Badge */}
                                        {group.skillName && (
                                            <div className="mb-3 inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 text-xs font-medium">
                                                <BookOpen className="w-3 h-3 mr-1" />
                                                {group.skillName}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-[#313244]">
                                            <div className="flex items-center space-x-1 text-gray-600 dark:text-[#a6adc8]">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm font-medium">{group.memberCount}</span>
                                                <span className="text-xs">members</span>
                                            </div>
                                            {group.isMember ? (
                                                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                                    Joined
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={(e) => handleJoinGroup(group.id, e)}
                                                    disabled={joiningGroupId === group.id}
                                                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {joiningGroupId === group.id ? 'Joining...' : 'Join'}
                                                </button>
                                            )}
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
