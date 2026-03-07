import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Check, ChevronDown, ChevronRight, BookOpen, Trophy, Link2 } from 'lucide-react';
import { ROADMAPS } from '../data/roadmapData';
import { getCompletedTopics, toggleTopicComplete, getTotalTopics, getProgressPercent } from '../services/roadmapService';

const RoadmapDetail = ({ roadmapId, onNavigate }) => {
  const roadmap = ROADMAPS[roadmapId];
  const [completedTopics, setCompletedTopics] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (roadmap) {
      setCompletedTopics(getCompletedTopics(roadmap.id));
      // Expand all sections by default
      const expanded = {};
      roadmap.sections.forEach(s => { expanded[s.id] = true; });
      setExpandedSections(expanded);
    }
  }, [roadmapId]);

  if (!roadmap) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-[#6c7086]">Roadmap not found.</p>
        <button onClick={() => onNavigate('learning-paths')}
          className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline">
          ← Back to Learning Paths
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => onNavigate('learning-paths')}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#a6adc8] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Paths
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{roadmap.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">
                {roadmap.title} Roadmap
              </h1>
              <p className="text-gray-600 dark:text-[#a6adc8] mt-1">{roadmap.description}</p>
            </div>
          </div>
          <a
            href={roadmap.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-[#313244] text-gray-700 dark:text-[#cdd6f4] hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            roadmap.sh
          </a>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span className="text-gray-600 dark:text-[#a6adc8]">
              <strong className="text-gray-900 dark:text-[#cdd6f4]">{roadmap.sections.length}</strong> sections
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 dark:text-[#a6adc8]">
              <strong className="text-gray-900 dark:text-[#cdd6f4]">{total}</strong> topics
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-gray-600 dark:text-[#a6adc8]">
              <strong className="text-gray-900 dark:text-[#cdd6f4]">{completed}</strong> completed
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-gray-100 dark:bg-[#313244] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${roadmap.color}88, ${roadmap.color})`,
              }}
            />
          </div>
          <span className="text-sm font-bold min-w-[3rem] text-right" style={{ color: roadmap.color }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Timeline sections */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-transparent dark:from-[#313244] dark:via-[#313244]" />

        <div className="space-y-4">
          {roadmap.sections.map((section, sIdx) => {
            const isExpanded = expandedSections[section.id];
            const sectionTopics = section.topics;
            const sectionCompleted = sectionTopics.filter(t => isComplete(t.id)).length;
            const sectionDone = sectionCompleted === sectionTopics.length;

            return (
              <div key={section.id} className="relative">
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="relative z-10 w-full flex items-center gap-3 group"
                >
                  {/* Circle marker */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                    sectionDone
                      ? 'bg-green-500 border-green-500 text-white'
                      : sectionCompleted > 0
                        ? `border-current text-[${roadmap.color}]`
                        : 'bg-white dark:bg-[#1e1e2e] border-gray-200 dark:border-[#313244] text-gray-400 dark:text-[#6c7086]'
                  }`}
                    style={!sectionDone && sectionCompleted > 0 ? { borderColor: roadmap.color, color: roadmap.color } : {}}
                  >
                    {sectionDone ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">{sIdx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] px-5 py-3 flex items-center justify-between group-hover:border-indigo-300 dark:group-hover:border-indigo-500/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-[#cdd6f4]">
                        {section.title}
                      </h2>
                      <span className="text-xs text-gray-400 dark:text-[#6c7086] font-medium">
                        {sectionCompleted}/{sectionTopics.length}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Topics */}
                {isExpanded && (
                  <div className="ml-[60px] mt-2 space-y-2">
                    {sectionTopics.map((topic) => {
                      const done = isComplete(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className={`bg-white dark:bg-[#1e1e2e] rounded-xl border px-5 py-4 transition-all duration-200 ${
                            done
                              ? 'border-green-200 dark:border-green-500/20 bg-green-50/50 dark:bg-green-500/5'
                              : 'border-gray-200 dark:border-[#313244] hover:border-indigo-200 dark:hover:border-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <button
                              onClick={() => handleToggle(topic.id)}
                              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                done
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 dark:border-[#45475a] hover:border-indigo-400'
                              }`}
                            >
                              {done && <Check className="w-3 h-3" />}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className={`text-sm font-semibold transition-colors ${
                                  done
                                    ? 'text-green-700 dark:text-green-400 line-through opacity-70'
                                    : 'text-gray-900 dark:text-[#cdd6f4]'
                                }`}>
                                  {topic.title}
                                </h3>
                                <a
                                  href={topic.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                                >
                                  Learn <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                              <p className={`text-xs mt-1 ${
                                done ? 'text-green-600/60 dark:text-green-400/40' : 'text-gray-500 dark:text-[#6c7086]'
                              }`}>
                                {topic.description}
                              </p>

                              {/* Resources */}
                              {topic.resources && topic.resources.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {topic.resources.map((res, i) => (
                                    <a
                                      key={i}
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8] hover:bg-indigo-100 dark:hover:bg-indigo-500/15 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                      <ExternalLink className="w-2.5 h-2.5" />
                                      {res.label}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion message */}
      {progress === 100 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 rounded-2xl border border-green-200 dark:border-green-500/20 p-6 text-center">
          <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-green-800 dark:text-green-400">
            🎉 Congratulations!
          </h3>
          <p className="text-sm text-green-700 dark:text-green-400/80 mt-1">
            You've completed the {roadmap.title} roadmap! Keep building amazing things.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoadmapDetail;
