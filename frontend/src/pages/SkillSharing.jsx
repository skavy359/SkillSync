import React, { useEffect, useRef, useState } from 'react';
import { Download, Clock, Brain, Zap, Flame, Trophy, Star, Sparkles, Copy, Check } from 'lucide-react';
import leaderboardService from '../services/leaderboardService';
import { getMyProfile } from '../services/profileService';

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
    if (powerLevel >= 80) return { label: 'LEGEND', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' };
    if (powerLevel >= 60) return { label: 'EXPERT', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' };
    if (powerLevel >= 40) return { label: 'RISING STAR', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' };
    if (powerLevel >= 20) return { label: 'LEARNER', color: '#10b981', glow: 'rgba(16,185,129,0.3)' };
    return { label: 'STARTER', color: '#6b7280', glow: 'rgba(107,114,128,0.2)' };
  };

  const rank = getRank();

  const downloadAsImage = async () => {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
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
      image: { type: 'png', quality: 0.98 },
      html2canvas: { backgroundColor: '#0f0f1a', scale: 2 },
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
    <div className="space-y-6">
      <div
        ref={cardRef}
        className="w-full max-w-2xl mx-auto relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 30%, #0d0d2b 60%, #141430 100%)',
          border: '1px solid rgba(139,92,246,0.2)',
          boxShadow: `0 0 60px ${rank.glow}, inset 0 0 60px rgba(139,92,246,0.05)`,
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'conic-gradient(from 0deg, transparent, rgba(139,92,246,0.3), transparent, rgba(236,72,153,0.3), transparent)' }}
        />

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em]">SkillSync</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10">
              <Star className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">{rank.label}</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-black text-4xl mx-auto"
                style={{
                  background: `linear-gradient(135deg, ${rank.color}, #ec4899)`,
                  boxShadow: `0 0 30px ${rank.glow}`,
                }}
              >
                {profile.userName[0].toUpperCase()}
              </div>
              <div className="absolute inset-[-3px] rounded-full border-2 border-dashed border-purple-500/40 animate-[spin_10s_linear_infinite]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1 tracking-tight">{profile.userName}</h1>
            <p className="text-sm text-purple-300/60 font-medium">Achievement Card</p>
          </div>

          <div className="mb-8 px-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-[0.15em]">Power Level</span>
              <span className="text-sm font-black" style={{ color: rank.color }}>{powerLevel}/100</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${powerLevel}%`,
                  background: `linear-gradient(90deg, ${rank.color}, #ec4899, #8b5cf6)`,
                  boxShadow: `0 0 10px ${rank.glow}`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Skills', value: profile.totalSkills, icon: Brain, color: '#8b5cf6' },
              { label: 'Sessions', value: profile.totalSessions, icon: Flame, color: '#ec4899' },
              { label: 'Hours', value: profile.totalMinutesStudied ? (profile.totalMinutesStudied / 60).toFixed(0) : 0, icon: Clock, color: '#f59e0b' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="relative rounded-2xl p-4 text-center overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${stat.color}20`, border: `1px solid ${stat.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <p className="text-2xl font-black text-white mb-0.5">{stat.value}</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-0.5">Avg/Session</p>
              <p className="text-lg font-bold text-purple-300">{avgSessionDuration}m</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] text-white/30 font-semibold uppercase tracking-wider mb-0.5">Categories</p>
              <p className="text-lg font-bold text-pink-300">{profile.categoryCount}</p>
            </div>
          </div>

          {profile.mostActiveCategory && (
            <div className="mb-6 p-4 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.1))', border: '1px solid rgba(139,92,246,0.15)' }}>
              <p className="text-[10px] font-bold text-purple-300/50 uppercase tracking-[0.2em] mb-1">⟨ Specialization ⟩</p>
              <p className="text-lg font-black text-white uppercase tracking-wider">{profile.mostActiveCategory}</p>
            </div>
          )}

          {profile.topSkills && profile.topSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold text-white/30 mb-2 uppercase tracking-[0.15em]">Top Achievements</p>
              <div className="space-y-1.5">
                {profile.topSkills.slice(0, 3).map((skill, idx) => (
                  <div key={skill.skillId} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black" style={{ color: rank.color }}>{idx + 1}.</span>
                      <span className="text-xs font-semibold text-white/80">{skill.skillName}</span>
                    </div>
                    <span className="text-[10px] text-white/30">{skill.sessionsCompleted} sessions</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/15 font-mono tracking-[0.3em]">SKILLSYNC • ACHIEVEMENT CARD</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center max-w-2xl mx-auto">
        <button
          onClick={downloadAsImage}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <Download className="w-4 h-4" /> Save as Image
        </button>
        <button
          onClick={downloadAsPDF}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all"
        >
          <Download className="w-4 h-4" /> Save as PDF
        </button>
        <button
          onClick={copyStats}
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border border-gray-200 dark:border-[#313244] text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244] transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Stats'}
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
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Share Your Progress</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-[#6c7086] mt-1">Create and download your achievement card</p>
      </div>
      {profile && <SharingCard profile={profile} />}
    </div>
  );
};

export default SkillSharing;