import { useState, useEffect } from 'react';
import { Search, Users, BookOpen, ChevronRight, Loader2 } from 'lucide-react';
import { listPublicGroups, searchGroups, listGroupsBySkill } from '../services/studyGroupService';
import { getMySkills } from '../services/skillService';

const FindCollaborators = ({ onNavigate }) => {
    const [allGroups, setAllGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [groupsData, skillsData] = await Promise.all([
                listPublicGroups(0, 20),
                getMySkills({ size: 100 })
            ]);
            setAllGroups(groupsData?.content || []);
            setFilteredGroups(groupsData?.content || []);
            setSkills(skillsData?.content || []);
            setHasMore(!groupsData?.last);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setPage(0);

        if (!term.trim()) {
            setFilteredGroups(allGroups);
            return;
        }

        try {
            const results = await searchGroups(term, 0, 20);
            setFilteredGroups(results?.content || []);
            setHasMore(!results?.last);
        } catch (err) {
            console.error('Search failed:', err);
        }
    };

    const handleSkillFilter = async (skillId) => {
        setSelectedSkillFilter(skillId);
        setPage(0);
        setSearchTerm('');

        if (!skillId) {
            setFilteredGroups(allGroups);
            return;
        }

        try {
            const results = await listGroupsBySkill(skillId, 0, 20);
            setFilteredGroups(results?.content || []);
            setHasMore(!results?.last);
        } catch (err) {
            console.error('Filter failed:', err);
        }
    };

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            let results;
            if (searchTerm) {
                results = await searchGroups(searchTerm, nextPage, 20);
            } else if (selectedSkillFilter) {
                results = await listGroupsBySkill(selectedSkillFilter, nextPage, 20);
            } else {
                results = await listPublicGroups(nextPage, 20);
            }
            setFilteredGroups(prev => [...prev, ...(results?.content || [])]);
            setPage(nextPage);
            setHasMore(!results?.last);
        } catch (err) {
            console.error('Load more failed:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Find Collaborators</h1>
                <p className="text-sm text-gray-500 dark:text-[#6c7086] mt-1">Discover study groups and connect with learners</p>
            </div>

            <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-4">
                <div className="flex items-center gap-3 pl-3 pr-4 py-2 border border-gray-200 dark:border-[#313244] rounded-lg bg-gray-50 dark:bg-[#181825] focus-within:ring-2 focus-within:ring-purple-500/30 focus-within:border-purple-500 transition-all">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search groups by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="flex-1 bg-transparent text-sm text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] outline-none"
                    />
                </div>
            </div>

            {skills.length > 0 && (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-4">
                    <p className="text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-3">Filter by Skill</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleSkillFilter('')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                !selectedSkillFilter
                                    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                    : 'bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-gray-200 dark:hover:bg-[#45475a]'
                            }`}
                        >
                            All Skills
                        </button>
                        {skills.map(skill => (
                            <button
                                key={skill.id}
                                onClick={() => handleSkillFilter(skill.id)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                    selectedSkillFilter === skill.id
                                        ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                        : 'bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-gray-200 dark:hover:bg-[#45475a]'
                                }`}
                            >
                                {skill.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 dark:text-[#45475a] mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">No groups found</h3>
                    <p className="text-sm text-gray-500 dark:text-[#6c7086]">Try a different search or create a new group</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredGroups.map(group => (
                        <div
                            key={group.id}
                            onClick={() => onNavigate('group-details', group.id)}
                            className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-5 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] truncate">{group.name}</h3>
                                            {group.skillName && (
                                                <p className="text-xs text-purple-500 dark:text-purple-400 flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" /> {group.skillName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-[#a6adc8] line-clamp-2 mb-3">{group.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-[#6c7086]">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {group.memberCount} members
                                        </span>
                                        {group.isPublic && (
                                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-semibold">
                                                Public
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 dark:text-[#585b70] group-hover:text-purple-500 transition-colors ml-2 shrink-0" />
                            </div>
                        </div>
                    ))}

                    {hasMore && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={loadMore}
                                className="px-6 py-2.5 text-sm font-semibold rounded-xl border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FindCollaborators;