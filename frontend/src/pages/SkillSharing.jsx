import React, { useEffect, useRef, useState } from 'react';
import { Download, Clock, Brain, Flame, Star, Sparkles, Copy, Check, Users } from 'lucide-react';
import leaderboardService from '../services/leaderboardService';
import { getMyProfile } from '../services/profileService';
import html2canvas from 'html2canvas';

const SharingCard = ({ profile }) => {
  const cardRef = useRef();
  const [copied, setCopied] = useState(false);

  const formatMinutes = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const avgSessionDuration = profile.totalSessions > 0
    ? Math.round(profile.totalMinutesStudied / profile.totalSessions) : 0;

  const powerLevel = Math.min(100, Math.round(
    (profile.totalSkills * 10 + profile.totalSessions * 5 + profile.totalMinutesStudied / 10) /
    ((profile.totalSkills + 1) * 10 + (profile.totalSessions + 1) * 5) * 100
  ));

  const getRank = () => {
    if (powerLevel >= 80) return { label: 'LEGEND', color: '#f59e0b', bg: 'from-amber-400 to-orange-600', glow: 'rgba(245,158,11,0.4)', neon: 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' };
    if (powerLevel >= 60) return { label: 'EXPERT', color: '#8b5cf6', bg: 'from-purple-400 to-indigo-600', glow: 'rgba(139,92,246,0.4)', neon: 'drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]' };
    if (powerLevel >= 40) return { label: 'RISING STAR', color: '#3b82f6', bg: 'from-blue-400 to-cyan-600', glow: 'rgba(59,130,246,0.4)', neon: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' };
    if (powerLevel >= 20) return { label: 'LEARNER', color: '#10b981', bg: 'from-emerald-400 to-teal-600', glow: 'rgba(16,185,129,0.4)', neon: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' };
    return { label: 'STARTER', color: '#6b7280', bg: 'from-gray-400 to-slate-600', glow: 'rgba(107,114,128,0.3)', neon: 'drop-shadow-[0_0_10px_rgba(107,114,128,0.4)]' };
  };

  const rank = getRank();

  const downloadAsImage = async () => {
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 3, useCORS: true });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${profile.userName}-skillsync.png`;
    link.click();
  };

  const downloadAsPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({
      margin: 10,
      filename: `${profile.userName}-skillsync.pdf`,
      image: { type: 'png', quality: 1.0 },
      html2canvas: { backgroundColor: '#0f0f1a', scale: 3, useCORS: true },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    }).from(cardRef.current).save();
  };

  const copyStats = () => {
    const text = `🚀 ${profile.userName}'s SkillSync Stats\n━━━━━━━━━━━━━━━━━━\n📚 ${profile.totalSkills} Skills | 🔥 ${profile.totalSessions} Sessions | ⏱️ ${formatMinutes(profile.totalMinutesStudied)}\n🏆 Rank: ${rank.label} | ⚡ Power: ${powerLevel}/100\n━━━━━━━━━━━━━━━━━━`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="group relative w-full max-w-2xl mx-auto transform transition-all hover:-translate-y-2 duration-500 perspective-1000">
          
        <div
            className="absolute -inset-1 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 rounded-3xl"
            style={{ backgroundImage: `linear-gradient(135deg, ${rank.color}, #ec4899)` }}
        />

        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-[2rem] bg-[#0a0f1c] text-white border border-white/10"
          style={{
            boxShadow: `inset 0 0 80px rgba(0,0,0,0.8), 0 25px 50px -12px ${rank.glow}`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#12182b] via-[#0a0f1c] to-[#05080f] pointer-events-none" />
          
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 70%)',
            }}
          />

          <div className="absolute -top-40 -right-40 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-[80px] pointer-events-none" 
            style={{ backgroundColor: `${rank.color}30` }}
          />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-black text-white tracking-widest uppercase">SkillSync</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-inner">
                <Star className="w-3.5 h-3.5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                <span className={`text-xs font-black tracking-widest ${rank.neon}`} style={{ color: rank.color }}>{rank.label}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 text-center md:text-left">
              <div className="relative group/avatar">
                <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-white/20 to-white/5 animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-[-2px] rounded-full bg-[#0a0f1c] z-0" />
                <div className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center text-white font-black text-5xl shadow-2xl bg-gradient-to-br ${rank.bg}`}>
                  {profile.userName[0].toUpperCase()}
                </div>
              </div>
              <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{profile.userName}</h1>
                  <p className="text-gray-400 font-semibold tracking-wide flex items-center gap-2 justify-center md:justify-start">
                    MEMBER SINCE {(new Date(profile.createdAt)).getFullYear() || new Date().getFullYear()}
                  </p>
              </div>
            </div>

            <div className="mb-10 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="font-bold text-gray-300 tracking-wider uppercase">Power Level</span>
                <span className="font-black text-xl" style={{ color: rank.color }}>{powerLevel}<span className="text-gray-500 text-sm">/100</span></span>
              </div>
              <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${powerLevel}%`, backgroundImage: `linear-gradient(90deg, ${rank.color}, #ec4899)` }}
                >
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/40 to-transparent" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Skills', value: profile.totalSkills, icon: Brain, color: '#a855f7', bg: 'from-purple-500/20 to-indigo-500/20' },
                { label: 'Sessions', value: profile.totalSessions, icon: Flame, color: '#ec4899', bg: 'from-pink-500/20 to-rose-500/20' },
                { label: 'Hours', value: profile.totalMinutesStudied ? (profile.totalMinutesStudied / 60).toFixed(0) : 0, icon: Clock, color: '#f59e0b', bg: 'from-amber-500/20 to-orange-500/20' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="relative rounded-[1.25rem] p-5 text-center overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md group/stat hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br ${stat.bg} shadow-inner`}>
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <p className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-[1.25rem] p-4 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5">Avg Session</p>
                <p className="text-xl font-black text-indigo-300">{avgSessionDuration} <span className="text-sm font-medium opacity-50">min</span></p>
              </div>
              <div className="rounded-[1.25rem] p-4 text-center border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1.5">Categories</p>
                <p className="text-xl font-black text-pink-300">{profile.categoryCount}</p>
              </div>
            </div>

            {profile.topSkills && profile.topSkills.length > 0 && (
              <div className="mb-6 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/20">
                <p className="text-xs font-black text-white/50 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Star className="w-3.5 h-3.5" /> Top Achievements
                </p>
                <div className="space-y-3">
                  {profile.topSkills.slice(0, 3).map((skill, idx) => (
                    <div key={skill.skillId} className="flex items-center justify-between group/skill">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-black text-gray-300">
                            {idx + 1}
                        </span>
                        <span className="text-sm md:text-base font-bold text-gray-200 group-hover/skill:text-white transition-colors">{skill.skillName}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-md">
                          {skill.sessionsCompleted} <span className="opacity-50 ml-1 block sm:inline">sessions</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em]">SKILLSYNC VERIFIED</p>
              <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-white opacity-20" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mt-10">
        <button
          onClick={downloadAsImage}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold rounded-[1rem] bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-500/25 transition-all hover:-translate-y-1"
        >
          <Download className="w-5 h-5 opacity-80" /> Save as Image
        </button>
        <button
          onClick={downloadAsPDF}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold rounded-[1rem] bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-xl hover:shadow-pink-500/25 transition-all hover:-translate-y-1"
        >
          <Download className="w-5 h-5 opacity-80" /> Save as PDF
        </button>
        <button
          onClick={copyStats}
          className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold rounded-[1rem] border-2 border-gray-200 dark:border-[#313244] text-gray-700 dark:text-[#a6adc8] bg-white dark:bg-[#1e1e2e] hover:bg-gray-50 dark:hover:bg-[#313244] shadow-sm transition-all hover:-translate-y-1"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 opacity-80" />}
          {copied ? 'Copied to Clipboard' : 'Copy Text Stats'}
        </button>
      </div>
    </div>
  );
};

const SkillSharing = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then((myProfile) => leaderboardService.getUserProfile(myProfile.id))
      .then((data) => { setProfile(data); setLoading(false); })
      .catch((err) => { setError(err.message || 'Failed to load profile'); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl flex items-center gap-3">
          <div className="w-1.5 h-8 bg-rose-500 rounded-full" />
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-8 md:p-12 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-bold shadow-sm">
                <Users className="w-4 h-4 text-indigo-100" />
                <span>Community Hub</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">
                Share Progress
              </h1>
              <p className="text-indigo-50 text-lg opacity-90 leading-relaxed font-medium">
                Generate your dynamic achievement card. Share it on social media to inspire others in your network!
              </p>
          </div>
          <div className="hidden md:flex shrink-0 w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl items-center justify-center border border-white/20 shadow-xl transform rotate-3">
              <Sparkles className="w-12 h-12 text-white/90" />
          </div>
        </div>
      </div>

      {profile && <SharingCard profile={profile} />}
      
    </div>
  );
};

export default SkillSharing;