import { useState } from 'react';
import { Map, Search, ChevronRight, ExternalLink, BookOpen, Compass, Target } from 'lucide-react';
import { getAvailableRoadmaps, getRoadmapForSkill } from '../data/roadmapData';
import { getProgressPercent, getTotalTopics, getCompletedCount } from '../services/roadmapService';

const LearningPaths = ({ onNavigate, onSelectRoadmap, userSkills = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const allRoadmaps = getAvailableRoadmaps();

  const myRoadmaps = userSkills
    .map(skill => {
      const roadmap = getRoadmapForSkill(skill.name);
      return roadmap ? { ...roadmap, skillName: skill.name } : null;
    })
    .filter(Boolean);

  const myRoadmapIds = new Set(myRoadmaps.map(r => r.id));

  const filteredRoadmaps = allRoadmaps.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRoadmap = (roadmapId) => {
    onSelectRoadmap(roadmapId);
    onNavigate('roadmap-detail');
  };

  const RoadmapCard = ({ roadmap, isMyRoadmap = false, skillName }) => {
    const total = getTotalTopics(roadmap);
    const completed = getCompletedCount(roadmap.id);
    const progress = getProgressPercent(roadmap);
    const isActive = progress > 0 && progress < 100;

    return (
      <button
        onClick={() => handleSelectRoadmap(roadmap.id)}
        className={`group text-left relative w-full bg-white dark:bg-[#181825] rounded-3xl border ${isActive ? 'border-indigo-200 dark:border-indigo-500/30' : 'border-gray-200/50 dark:border-white/5'} p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col`}
      >
        {/* Decorative Top Lip & Background Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 opacity-80" style={{ background: `linear-gradient(90deg, ${roadmap.color}88, ${roadmap.color})` }} />
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ background: roadmap.color }} />

        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-gray-100 dark:border-white/5 dark:bg-[#1e1e2e]/50 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                {roadmap.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {roadmap.title}
              </h3>
              {isMyRoadmap && (
                <div className="mt-1">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm flex inline-flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> {skillName}
                    </span>
                </div>
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#1e1e2e] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 shrink-0">
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>

        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed flex-1 relative z-10">
          {roadmap.description}
        </p>

        <div className="relative z-10 mt-auto">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {roadmap.sections.length} parts</span>
            <span style={{ color: progress > 0 ? roadmap.color : undefined }}>
                {completed}/{total} steps
            </span>
            </div>

            <div className="w-full h-2.5 bg-gray-100 dark:bg-[#1e1e2e] rounded-full overflow-hidden shadow-inner">
            <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                width: `${Math.max(progress, 2)}%`,
                background: `linear-gradient(90deg, ${roadmap.color}88, ${roadmap.color})`,
                }}
            />
            </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      
      {/* Hero Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-fuchsia-500/5 to-amber-500/5 dark:from-indigo-500/10 dark:via-fuchsia-500/10 dark:to-amber-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="px-6 sm:px-10 py-10 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 shrink-0">
                    <Compass className="w-10 h-10 text-white" />
                </div>
                <div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">Learning Paths</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-snug max-w-xl">
                    Follow structured, step-by-step roadmaps to master complex skills. Powered by {' '}
                    <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1">
                    roadmap.sh <ExternalLink className="w-3 h-3" />
                    </a>
                </p>
                </div>
            </div>

            <div className="relative w-full lg:w-96 shrink-0 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search roles or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-base font-medium border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
            </div>
        </div>
      </div>

      {myRoadmaps.length > 0 && !searchQuery && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Target className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Active Journeys</h2>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Matched to your skills</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRoadmaps.map(r => (
              <RoadmapCard key={r.id} roadmap={r} isMyRoadmap={true} skillName={r.skillName} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <Map className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {searchQuery ? 'Search Results' : 'Explore All Roadmaps'}
            </h2>
        </div>
        
        {filteredRoadmaps.length === 0 ? (
          <div className="bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 dark:bg-[#1e1e2e] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No roadmaps found</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Try adjusting your search terms for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps
              .filter(r => searchQuery || !myRoadmapIds.has(r.id))
              .map(r => (
                <RoadmapCard key={r.id} roadmap={r} isMyRoadmap={myRoadmapIds.has(r.id)} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPaths;