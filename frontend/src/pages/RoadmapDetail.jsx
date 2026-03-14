import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Check, ChevronDown, ChevronRight, BookOpen, Trophy, Link2, Target, CircleDashed } from 'lucide-react';
import { ROADMAPS } from '../data/roadmapData';
import { getCompletedTopics, toggleTopicComplete, getTotalTopics, getProgressPercent } from '../services/roadmapService';

const RoadmapDetail = ({ roadmapId, onNavigate }) => {
  const roadmap = ROADMAPS[roadmapId];
  const [completedTopics, setCompletedTopics] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (roadmap) {
      setCompletedTopics(getCompletedTopics(roadmap.id));
      const expanded = {};
      roadmap.sections.forEach(s => { expanded[s.id] = true; });
      setExpandedSections(expanded);
    }
  }, [roadmapId]);

  if (!roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-gray-50 dark:bg-[#1e1e2e] rounded-full flex items-center justify-center mb-6">
            <Target className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Roadmap not found.</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">This learning path might have been removed or doesn't exist.</p>
        <button onClick={() => onNavigate('learning-paths')} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-500/20">
          Back to Explorations
        </button>
      </div>
    );
  }

  const total = getTotalTopics(roadmap);
  const progress = getProgressPercent(roadmap);
  const completed = completedTopics.length;

  const handleToggle = (topicId) => {
    const updated = toggleTopicComplete(roadmap.id, topicId);
    setCompletedTopics([...updated]);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const isComplete = (topicId) => completedTopics.includes(topicId);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <button
        onClick={() => onNavigate('learning-paths')}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
      >
        <div className="p-1.5 rounded-lg bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 shadow-sm group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Learning Paths
      </button>

      {/* Dynamic Roadmap Hero Banner */}
      <div className="relative bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden p-8 sm:p-10 flex flex-col items-center text-center">
        <div className="absolute top-0 inset-x-0 h-2 opacity-80" style={{ background: `linear-gradient(90deg, ${roadmap.color}88, ${roadmap.color})` }} />
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: roadmap.color }} />
        <div className="absolute top-full -right-32 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none -translate-y-1/2" style={{ background: roadmap.color }} />

        <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-6xl shadow-inner border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#1e1e2e]/50 backdrop-blur-sm mb-6">
            {roadmap.icon}
        </div>
        
        <div className="relative z-10 space-y-3 mb-8">
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">{roadmap.title} Journey</h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto">{roadmap.description}</p>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center items-center gap-3 mb-8">
            <div className="px-4 py-2 bg-gray-50 dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5 rounded-2xl flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                <BookOpen className="w-4 h-4 text-indigo-500" /> {roadmap.sections.length} Chapters
            </div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5 rounded-2xl flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                <Link2 className="w-4 h-4 text-blue-500" /> {total} Topics
            </div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-[#1e1e2e] border border-gray-200/50 dark:border-white/5 rounded-2xl flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                <Check className="w-4 h-4 text-emerald-500" /> {completed} Completed
            </div>
            <a href={roadmap.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-2xl flex items-center gap-1.5 text-sm font-bold transition-colors">
                roadmap.sh <ExternalLink className="w-3.5 h-3.5" />
            </a>
        </div>

        <div className="relative z-10 w-full max-w-3xl flex items-center gap-4">
            <span className="text-sm font-black w-14 text-right" style={{ color: roadmap.color }}>{progress}%</span>
            <div className="flex-1 h-3.5 bg-gray-100 dark:bg-[#1e1e2e] rounded-full overflow-hidden shadow-inner">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${Math.max(progress, 2)}%`, background: `linear-gradient(90deg, ${roadmap.color}88, ${roadmap.color})` }}
                >
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse blur" />
                </div>
            </div>
            <Trophy className="w-5 h-5" style={{ color: progress === 100 ? roadmap.color : '#9ca3af' }} />
        </div>
      </div>

      {progress === 100 && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 text-center text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <Trophy className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
          <h3 className="text-2xl font-black mb-2">Monumental Achievement! 🎉</h3>
          <p className="text-emerald-50 font-medium">You have mastered the entire {roadmap.title} curriculum. Time to build something extraordinary or tackle your next challenge!</p>
        </div>
      )}

      {/* Timeline Journey Map */}
      <div className="relative px-2 sm:px-6">
        {/* Main Timeline Line */}
        <div className="absolute left-[2.25rem] sm:left-[3.25rem] top-8 bottom-8 w-1 lg:w-1.5 bg-gray-100 dark:bg-[#1e1e2e] rounded-full" />
        <div 
            className="absolute left-[2.25rem] sm:left-[3.25rem] top-8 w-1 lg:w-1.5 rounded-full transition-all duration-1000"
            style={{ 
                height: `${Math.max(0, progress - 2)}%`, 
                maxHeight: 'calc(100% - 4rem)',
                background: roadmap.color,
                boxShadow: `0 0 10px ${roadmap.color}88` 
            }} 
        />

        <div className="space-y-6 sm:space-y-8 pb-8">
          {roadmap.sections.map((section, sIdx) => {
            const isExpanded = expandedSections[section.id];
            const sectionTopics = section.topics;
            const sectionCompleted = sectionTopics.filter(t => isComplete(t.id)).length;
            const sectionDone = sectionCompleted === sectionTopics.length;
            const isActive = !sectionDone && sectionCompleted > 0;

            return (
              <div key={section.id} className="relative z-10 flex flex-col">
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Timeline Node */}
                    <div className="relative z-20">
                        <button onClick={() => toggleSection(section.id)} className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center shrink-0 border-4 transition-all duration-300 shadow-sm ${
                            sectionDone ? 'bg-emerald-500 border-emerald-500 text-white' : 
                            isActive ? 'bg-white dark:bg-[#181825] bg-opacity-90 backdrop-blur-md text-gray-900 dark:text-white' : 
                            'bg-gray-50 dark:bg-[#181825] border-gray-200 dark:border-[#313244] text-gray-400'
                        }`}
                        style={isActive ? { borderColor: roadmap.color } : {}}>
                            {sectionDone ? <Check className="w-7 h-7" /> : <span className="text-xl sm:text-2xl font-black">{sIdx + 1}</span>}
                        </button>
                    </div>

                    {/* Section Header Card */}
                    <button onClick={() => toggleSection(section.id)} className={`flex-1 group bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-4 sm:p-5 flex items-center justify-between hover:shadow-lg transition-all ${isActive ? 'shadow-md border-indigo-200 dark:border-indigo-500/20' : ''}`}>
                        <div className="flex-1 text-left">
                            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {section.title}
                            </h2>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                {sectionCompleted} / {sectionTopics.length} Steps
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#1e1e2e] flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors shrink-0">
                            {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" /> : <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" />}
                        </div>
                    </button>
                </div>

                {/* Topics Container */}
                <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'active' : 'hidden'}`}>
                  <div className="ml-[4.5rem] sm:ml-[6rem] mt-4 space-y-3 relative">
                    
                    {sectionTopics.map((topic, tIdx) => {
                      const done = isComplete(topic.id);
                      return (
                        <div key={topic.id} className="relative flex items-center group">
                            {/* Branch Line */}
                            <div className={`absolute -left-6 sm:-left-8 top-1/2 w-4 sm:w-6 h-0.5 rounded-full ${done ? 'bg-green-500' : 'bg-gray-200 dark:bg-[#313244]'}`} />
                            
                            <div className={`flex-1 bg-white dark:bg-[#181825] rounded-2xl border p-4 sm:p-5 transition-all duration-300 flex items-start sm:items-center gap-4 ${
                                done
                                ? 'border-green-200 dark:border-green-500/30 bg-green-50/30 dark:bg-green-500/5 shadow-sm'
                                : 'border-gray-200/50 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-md'
                            }`}>
                                <button
                                    onClick={() => handleToggle(topic.id)}
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                        done ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-500/20' : 'bg-gray-50 dark:bg-[#1e1e2e] border-gray-300 dark:border-[#45475a] hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                                    }`}
                                >
                                    {done && <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </button>

                                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                                    <div className="flex-1">
                                        <h3 className={`text-base font-black mb-1 transition-colors ${done ? 'text-green-800 dark:text-green-400 line-through opacity-70' : 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                                            {topic.title}
                                        </h3>
                                        <p className={`text-sm font-medium leading-relaxed ${done ? 'text-green-700/60 dark:text-green-400/50' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {topic.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap sm:flex-col lg:flex-row lg:items-center gap-2 shrink-0">
                                        <a href={topic.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors">
                                            Learn <ExternalLink className="w-3 h-3" />
                                        </a>
                                        {topic.resources && topic.resources.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-[#272739] hover:bg-gray-200 dark:hover:bg-[#313244] text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                                                <ExternalLink className="w-3 h-3" /> {res.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;