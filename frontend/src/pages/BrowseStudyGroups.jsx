import { useState, useEffect } from 'react';
import { Search, Users, BookOpen, ChevronRight, Loader2, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { listPublicGroups, searchGroups, joinGroup } from '../services/studyGroupService';
import Button from '../components/ui/Button';

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

    useEffect(() => { fetchInitialData(); }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const groupsRes = await listPublicGroups(0, PAGE_SIZE);
            setGroups(groupsRes.content || groupsRes || []);
            setTotalPages(groupsRes.totalPages || 1);
            setCurrentPage(0);
        } catch (error) { console.error('Error fetching data:', error); } finally { setLoading(false); }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) { fetchInitialData(); return; }
        try {
            setSearching(true);
            const result = await searchGroups(searchQuery, 0, PAGE_SIZE);
            setGroups(result.content || result || []);
            setTotalPages(result.totalPages || 1);
            setCurrentPage(0);
        } catch (error) { console.error('Error searching groups:', error); } finally { setSearching(false); }
    };

    const handlePagination = async (newPage) => {
        try {
            setLoading(true);
            let result;
            if (searchQuery.trim()) { result = await searchGroups(searchQuery, newPage, PAGE_SIZE); } 
            else { result = await listPublicGroups(newPage, PAGE_SIZE); }
            setGroups(result.content || result || []);
            setCurrentPage(newPage);
        } catch (error) { console.error('Error loading page:', error); } finally { setLoading(false); }
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
            setGroups(groups.map(g => g.id === groupId ? { ...g, isMember: true } : g));
            setSuccessMsg('Successfully joined group! 🎉');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) { console.error('Error joining group:', err); alert(err.response?.data?.message || 'Failed to join group'); } finally { setJoiningGroupId(null); }
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 p-8 md:p-12 shadow-2xl text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -mb-10"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium shadow-sm">
                            <Sparkles className="w-4 h-4 text-sky-200" />
                            <span>Discover Communities</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
                            Find Your Tribe
                        </h1>
                        <p className="text-blue-50 text-lg opacity-90 leading-relaxed max-w-xl">
                            Join thriving communities of learners. Find study groups matching your skills and accelerate your growth together.
                        </p>
                    </div>
                    
                    <div className="w-full md:w-96 shrink-0">
                        <form onSubmit={handleSearch} className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or skill..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-24 py-4 bg-white dark:bg-[#1e1e2e] border-none rounded-2xl text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-shadow"
                            />
                            <button
                                type="submit"
                                disabled={searching}
                                className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                            >
                                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{successMsg}</p>
                </div>
            )}

            <div className="mb-4">
                <h2 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
                     Explore Groups
                </h2>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
            ) : groups.length === 0 ? (
                <div className="bg-white/50 dark:bg-[#1e1e2e]/50 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-[#313244] p-16 text-center">
                    <div className="w-24 h-24 bg-white dark:bg-[#272739] shadow-sm rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] mb-2">No groups found</h3>
                    <p className="text-gray-500 dark:text-[#a6adc8] mb-8 max-w-sm mx-auto">
                        {searchQuery ? 'Try adjusting your search terms to find what you are looking for.' : 'There are no public study groups available at the moment.'}
                    </p>
                    <Button variant="primary" onClick={() => onNavigate('study-groups')}>
                        Create the first group
                    </Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map(group => (
                            <div
                                key={group.id}
                                onClick={() => handleNavigateToGroup(group.id)}
                                className="group bg-white dark:bg-[#1e1e2e] rounded-[2rem] border border-gray-100 dark:border-[#313244] p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden flex flex-col h-full"
                            >
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-500/5 dark:to-sky-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-0" />
                                
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white shadow-inner shadow-black/10">
                                            <BookOpen className="w-7 h-7" />
                                        </div>
                                        <div className="text-xs font-semibold text-gray-500 dark:text-[#6c7086] flex items-center gap-1 bg-gray-50 dark:bg-[#181825] px-2.5 py-1 rounded-lg">
                                            <span>👤</span> {group.createdByName}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-[#cdd6f4] mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{group.name}</h3>
                                    
                                    {group.skillName && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold mb-3 border border-sky-100 dark:border-sky-500/20">
                                            <TrendingUp className="w-3.5 h-3.5" /> {group.skillName}
                                        </div>
                                    )}
                                    
                                    <p className="text-sm font-medium text-gray-500 dark:text-[#a6adc8] line-clamp-2 mb-6 leading-relaxed">
                                        {group.description || 'A collaborative learning space for sharing knowledge.'}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#313244] mt-auto">
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-[#cdd6f4]">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span>{group.memberCount} Members</span>
                                    </div>
                                    
                                    {group.isMember ? (
                                        <span className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                            <CheckCircle className="w-4 h-4" /> Joined
                                        </span>
                                    ) : (
                                        <button
                                            onClick={(e) => handleJoinGroup(group.id, e)}
                                            disabled={joiningGroupId === group.id}
                                            className="px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                                        >
                                            {joiningGroupId === group.id ? 'Joining...' : 'Join Group'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10">
                            <div className="flex items-center gap-2 bg-white dark:bg-[#1e1e2e] p-2 rounded-2xl border border-gray-200 dark:border-[#313244] shadow-sm">
                                <Button variant={currentPage === 0 ? 'secondary' : 'primary'} onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 0} className="px-5">
                                    <ChevronRight className="w-5 h-5 rotate-180" /> Prev
                                </Button>
                                <span className="px-4 text-sm font-bold text-gray-600 dark:text-[#a6adc8]">
                                    {currentPage + 1} / {totalPages}
                                </span>
                                <Button variant={currentPage === totalPages - 1 ? 'secondary' : 'primary'} onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages - 1} className="px-5">
                                    Next <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BrowseStudyGroups;