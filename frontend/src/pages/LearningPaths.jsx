import { useState } from 'react';
import { Map, Search, ChevronRight, ExternalLink, BookOpen } from 'lucide-react';
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

    return (
      <button
        onClick={() => handleSelectRoadmap(roadmap.id)}
        className="group text-left w-full bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{roadmap.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {roadmap.title}
              </h3>
              {isMyRoadmap && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  Linked to "{skillName}"
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </div>

        <p className="text-sm text-gray-600 dark:text-[#a6adc8] mb-4 line-clamp-2">
          {roadmap.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-[#6c7086] mb-2">
          <span>{roadmap.sections.length} sections · {total} topics</span>
          <span className="font-semibold" style={{ color: progress > 0 ? roadmap.color : undefined }}>
            {completed}/{total} done
          </span>
        </div>

        <div className="w-full h-2 bg-gray-100 dark:bg-[#313244] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${roadmap.color}88, ${roadmap.color})`,
            }}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">
              Learning Paths
            </h1>
          </div>
          <p className="text-gray-600 dark:text-[#a6adc8] mt-1">
            Follow structured roadmaps to master new skills — powered by{' '}
            <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer"
               className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
              roadmap.sh <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-white dark:bg-[#1e1e2e] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>
      </div>

      {myRoadmaps.length > 0 && !searchQuery && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4]">
              My Roadmaps
            </h2>
            <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
              Matched to your skills
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRoadmaps.map(r => (
              <RoadmapCard key={r.id} roadmap={r} isMyRoadmap={true} skillName={r.skillName} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-4">
          {searchQuery ? 'Search Results' : 'All Roadmaps'}
        </h2>
        {filteredRoadmaps.length === 0 ? (
          <div className="text-center py-16">
            <Map className="w-12 h-12 text-gray-300 dark:text-[#45475a] mx-auto mb-3" />
            <p className="text-gray-500 dark:text-[#6c7086]">No roadmaps found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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