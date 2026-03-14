import { useState } from 'react';
import { TrendingUp, Activity } from 'lucide-react';

const ActivityHeatmap = ({
  title,
  description,
  data = [],
  className = ''
}) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const getIntensityColor = (minutes) => {
    if (minutes === 0) {
      return {
        light: 'bg-gray-100 dark:bg-white/5 border border-transparent',
        text: 'text-gray-400 dark:text-gray-600',
        glow: ''
      };
    }
    if (minutes < 60) {
      return {
        light: 'bg-green-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30',
        text: 'text-emerald-700 dark:text-emerald-300',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]'
      };
    }
    if (minutes < 120) {
      return {
        light: 'bg-green-300 dark:bg-emerald-500/40 border border-emerald-300 dark:border-emerald-500/50',
        text: 'text-emerald-800 dark:text-emerald-200',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'
      };
    }
    if (minutes < 180) {
      return {
        light: 'bg-green-500 dark:bg-emerald-500/70 border border-emerald-400 dark:border-emerald-400/60',
        text: 'text-white',
        glow: 'shadow-[0_0_25px_rgba(16,185,129,0.5)]'
      };
    }
    return {
      light: 'bg-green-700 dark:bg-emerald-500 border border-emerald-500 dark:border-emerald-400',
      text: 'text-white',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.7)]'
    };
  };

  const formatTime = (minutes) => {
    if (minutes === 0) return 'No activity';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}M`;
    if (mins === 0) return `${hours}H`;
    return `${hours}H ${mins}M`;
  };

  return (
    <div className={`relative group rounded-[2.5rem] bg-white/60 dark:bg-[#181825]/60 backdrop-blur-3xl border border-white/50 dark:border-white/10 overflow-hidden shadow-xl p-8 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h3>
          </div>
          {description && (
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-13 pl-1">{description}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center border border-white/40 dark:border-white/10">
            <TrendingUp className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between ml-1">
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Weekly Activity Distribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 grid grid-cols-7 gap-3 sm:gap-4 md:gap-6">
            {data.map((day, index) => {
              const colors = getIntensityColor(day.minutes || 0);
              const isHovered = hoveredDay === index;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  onMouseEnter={() => setHoveredDay(index)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div
                    className={`
                      w-full aspect-square rounded-2xl transition-all duration-300
                      ${colors.light} ${colors.glow}
                      ${isHovered ? 'scale-110 -translate-y-1 !shadow-[0_0_20px_rgba(16,185,129,0.5)]' : ''}
                      cursor-crosshair flex items-center justify-center relative
                    `}
                  >
                    {isHovered && (
                      <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                        <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold uppercase tracking-wider rounded-xl px-4 py-2 whitespace-nowrap shadow-xl border border-gray-800 dark:border-white/20">
                          {formatTime(day.minutes || 0)}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[5px] border-transparent border-t-gray-900 dark:border-t-white"></div>
                        </div>
                      </div>
                    )}

                    <span className={`text-sm font-bold opacity-0 transition-opacity ${isHovered ? 'opacity-100' : ''} ${colors.text}`}>
                      +
                    </span>
                  </div>

                  <p className={`text-xs font-bold mt-4 transition-colors ${isHovered ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                    {day.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 pt-6 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between">
        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Intensity Map</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-gray-100 dark:bg-white/5 border border-transparent"></div>
            <span className="text-xs font-semibold text-gray-400">None</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500/30"></div>
            <span className="text-xs font-semibold text-gray-400">&lt;1H</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-emerald-500/40 border border-emerald-500/50"></div>
            <span className="text-xs font-semibold text-gray-400">1-2H</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-emerald-500/70 border border-emerald-400/60"></div>
            <span className="text-xs font-semibold text-gray-400">2-3H</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-emerald-500 border border-emerald-400"></div>
            <span className="text-xs font-semibold text-gray-400">&gt;3H</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;