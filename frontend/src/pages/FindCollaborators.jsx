import { useState, useEffect } from 'react';
import { Search, Users, BookOpen, ChevronRight, Compass } from 'lucide-react';
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
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -mb-10 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-bold shadow-sm">
                    <Compass className="w-4 h-4 text-blue-200" />
                    <span>Discovery</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
                    Find Collaborators
                    </h1>
                    <p className="text-blue-50 text-lg opacity-90 leading-relaxed font-medium">
                    Discover public study groups spanning various topics. Connect, grow, and conquer your learning goals together.
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('study-groups')}
                    className="inline-flex items-center justify-center px-6 py-3 shrink-0 border border-transparent text-base font-bold rounded-xl text-indigo-700 bg-white hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap shadow-md"
                >
                    <Users className="w-5 h-5 mr-2" />
                    My Groups
                </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search groups by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-12 pr-4 py-4 text-sm md:text-base border-none rounded-2xl bg-white dark:bg-[#1e1e2e] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-sm transition-all font-medium"
                    />
                </div>
                
                {skills.length > 0 && (
                    <div className="flex bg-white dark:bg-[#1e1e2e] p-2 rounded-2xl shadow-sm overflow-x-auto no-scrollbar items-center">
                        <button
                            onClick={() => handleSkillFilter('')}
                            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                                !selectedSkillFilter
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244]'
                            }`}
                        >
                            All Skills
                        </button>
                        {skills.map(skill => (
                            <button
                                key={skill.id}
                                onClick={() => handleSkillFilter(skill.id)}
                                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                                    selectedSkillFilter === skill.id
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                                        : 'text-gray-600 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244]'
                                }`}
                            >
                                {skill.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg" />
                </div>
            ) : filteredGroups.length === 0 ? (
                <div className="bg-white/50 dark:bg-[#1e1e2e]/50 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-[#313244] p-16 text-center">
                    <div className="w-24 h-24 bg-white dark:bg-[#272739] shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-12 h-12 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] mb-2">No groups found</h3>
                    <p className="text-gray-500 dark:text-[#a6adc8] mb-8 max-w-sm mx-auto">
                        We couldn't find any groups matching your criteria. Try adjusting your filters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map(group => (
                        <div
                            key={group.id}
                            onClick={() => onNavigate('group-details', group.id)}
                            className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-100 dark:border-[#313244] p-6 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-0" />
                            
                            <div className="relative z-10 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    {group.isPublic ? (
                                        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 rounded-lg text-xs font-bold tracking-wide uppercase">
                                            Public
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] text-gray-600 dark:text-[#a6adc8] rounded-lg text-xs font-bold tracking-wide uppercase">
                                            Private
                                        </span>
                                    )}
                                </div>
                                
                                <h3 className="text-xl font-black text-gray-900 dark:text-[#cdd6f4] truncate mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {group.name}
                                </h3>
                                
                                {group.skillName && (
                                    <p className="inline-flex mt-1 mb-3 px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-500/20 text-xs font-bold items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5" /> {group.skillName}
                                    </p>
                                )}
                                
                                <p className="text-sm md:text-[15px] font-medium text-gray-600 dark:text-[#a6adc8] line-clamp-3 mb-4 leading-relaxed mix-blend-multiply dark:mix-blend-normal">
                                    {group.description}
                                </p>
                            </div>

                            <div className="relative z-10 pt-4 mt-auto border-t border-gray-100 dark:border-[#313244] flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-[#6c7086] bg-gray-50 dark:bg-[#181825] px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-[#313244]">
                                    <Users className="w-4 h-4 text-gray-400" /> {group.memberCount} members
                                </span>
                                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hasMore && !loading && filteredGroups.length > 0 && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={loadMore}
                        className="px-8 py-3 text-sm font-bold rounded-[1rem] bg-gray-100 dark:bg-[#313244] text-gray-700 dark:text-[#cdd6f4] hover:bg-gray-200 dark:hover:bg-[#45475a] transition-colors"
                    >
                        Load More Groups
                    </button>
                </div>
            )}
        </div>
    );
};

export default FindCollaborators;