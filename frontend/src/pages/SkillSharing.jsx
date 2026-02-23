import React, { useEffect, useRef, useState } from 'react';
import { Download, Share2, Clock, Brain, Target, Zap, TrendingUp, Award, Flame, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import leaderboardService from '../services/leaderboardService';
import { getMyProfile } from '../services/profileService';
import html2pdf from 'html2pdf.js';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return count;
};

const SharingCard = ({ profile }) => {
  const cardRef = useRef();
  const [hoveredStat, setHoveredStat] = useState(null);

  const formatMinutes = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate additional stats
  const avgSessionDuration = profile.totalSessions > 0 
    ? Math.round(profile.totalMinutesStudied / profile.totalSessions) 
    : 0;
  
  const estimatedBooks = Math.round(profile.totalMinutesStudied / 600); // Assume 10h per book
  const powerLevel = Math.min(100, Math.round((profile.totalSkills * 10 + profile.totalSessions * 5 + profile.totalMinutesStudied / 10) / ((profile.totalSkills + 1) * 10 + (profile.totalSessions + 1) * 5)));

  const downloadAsImage = async () => {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#1e1e2e',
      scale: 2,
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${profile.userName}-skillsync-profile.png`;
    link.click();
  };

  const downloadAsPDF = () => {
    const element = cardRef.current;
    const opt = {
      margin: 10,
      filename: `${profile.userName}-skillsync-profile.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { backgroundColor: '#1e1e2e', scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      {/* Main Sharing Card */}
      <div
        ref={cardRef}
        className="w-full max-w-2xl mx-auto relative overflow-hidden rounded-3xl p-8 border-2 border-[#89b4fa]/30"
        style={{
          aspectRatio: '4/5',
          background: 'linear-gradient(135deg, #1e1e2e 0%, #313244 50%, #1f1f2e 100%)',
          boxShadow: '0 0 30px rgba(137, 180, 250, 0.1), inset 0 0 30px rgba(137, 180, 250, 0.05)',
        }}
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="grid grid-cols-4 grid-rows-8 h-full w-full border border-[#89b4fa]">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="border border-[#89b4fa]/20" />
            ))}
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#89b4fa]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#89b4fa] via-[#a6adc8] to-[#f38ba8] flex items-center justify-center text-white font-bold text-4xl mx-auto mb-3 shadow-lg shadow-[#89b4fa]/50">
              {profile.userName[0].toUpperCase()}
            </div>
            <h1 className="text-3xl font-black text-[#cdd6f4] mb-1 tracking-tight">{profile.userName}</h1>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-[#f1e04d]" />
              <p className="text-[#a6adc8] text-xs font-semibold">LEARNING WARRIOR</p>
            </div>
          </div>

          {/* Power Level Bar */}
          <div className="mb-4 px-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-[#89b4fa] uppercase tracking-widest">Power Level</p>
              <p className="text-sm font-black text-[#f38ba8]">{powerLevel}/100</p>
            </div>
            <div className="w-full h-2 bg-[#1f1f2e] rounded-full border border-[#45475a] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#89b4fa] via-[#f38ba8] to-[#a6adc8] transition-all duration-1000"
                style={{ width: `${powerLevel}%` }}
              />
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Skills', value: profile.totalSkills, icon: Brain, bgColor: 'bg-[#89b4fa]', borderColor: 'border-[#89b4fa]' },
              { label: 'Sessions', value: profile.totalSessions, icon: Flame, bgColor: 'bg-[#f38ba8]', borderColor: 'border-[#f38ba8]' },
              { label: 'Hours', value: profile.totalMinutesStudied ? (profile.totalMinutesStudied / 60).toFixed(1) : 0, icon: Clock, bgColor: 'bg-[#f1e04d]', borderColor: 'border-[#f1e04d]' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  onMouseEnter={() => setHoveredStat(stat.label)}
                  onMouseLeave={() => setHoveredStat(null)}
                  className={`relative overflow-hidden rounded-xl p-3 border-2 transition-all duration-300 cursor-pointer ${
                    hoveredStat === stat.label ? `${stat.borderColor} shadow-lg` : 'border-[#45475a]'
                  }`}
                  style={{
                    background: hoveredStat === stat.label
                      ? `linear-gradient(135deg, rgba(137,180,250,0.1) 0%, rgba(137,180,250,0.05) 100%)`
                      : 'rgba(31, 31, 46, 0.8)',
                    boxShadow: hoveredStat === stat.label ? `0 0 20px ${stat.bgColor === 'bg-[#89b4fa]' ? 'rgba(137, 180, 250, 0.3)' : stat.bgColor === 'bg-[#f38ba8]' ? 'rgba(243, 139, 168, 0.3)' : 'rgba(241, 224, 45, 0.3)'}` : 'none'
                  }}
                >
                  <div className="relative z-10 text-center">
                    <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-lg transform transition-transform duration-300 ${hoveredStat === stat.label ? 'scale-110' : ''}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-black text-[#cdd6f4] mb-0.5">{stat.value}</p>
                    <p className="text-xs font-semibold text-[#7f849c] uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="rounded-lg p-2.5 bg-[#1f1f2e]/80 border border-[#45475a] text-center">
              <p className="text-xs text-[#7f849c] mb-0.5">AVG/SESSION</p>
              <p className="text-lg font-bold text-[#89b4fa]">{avgSessionDuration}m</p>
            </div>
            <div className="rounded-lg p-2.5 bg-[#1f1f2e]/80 border border-[#45475a] text-center">
              <p className="text-xs text-[#7f849c] mb-0.5">CATEGORIES</p>
              <p className="text-lg font-bold text-[#f38ba8]">{profile.categoryCount}</p>
            </div>
          </div>

          {/* Specialization */}
          <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-[#89b4fa]/5 to-[#f38ba8]/5 border border-[#45475a]">
            <p className="text-xs font-semibold text-[#a6adc8] uppercase tracking-widest mb-1">★ PRIMARY SPECIALIZATION</p>
            <p className="text-lg font-black text-[#89b4fa] uppercase tracking-wider">{profile.mostActiveCategory}</p>
          </div>

          {/* Top Skills */}
          <div className="flex-1 flex flex-col min-h-0">
            <p className="text-xs font-black text-[#a6adc8] mb-2 uppercase tracking-widest">⚡ TOP ACHIEVEMENTS</p>
            <div className="space-y-1.5 overflow-y-auto">
              {profile.topSkills.slice(0, 3).map((skill, idx) => (
                <div key={skill.skillId} className="flex items-center justify-between p-1.5 rounded-lg bg-[#1f1f2e]/60 border border-[#45475a]">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-[#f38ba8] font-black text-sm">{idx + 1}.</span>
                    <span className="text-[#cdd6f4] text-xs font-semibold truncate">{skill.skillName}</span>
                  </div>
                  <span className="text-[#7f849c] text-xs whitespace-nowrap ml-1">{skill.sessionsCompleted} 🎯</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-[#45475a]/50 text-center">
            <p className="text-xs text-[#6c7086] font-mono tracking-wider">⟨ SKILLSYNC ACHIEVEMENT CARD ⟩</p>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3 justify-center max-w-2xl mx-auto">
        <Button 
          onClick={downloadAsImage}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#89b4fa] to-[#a6adc8] hover:from-[#89b4fa] hover:to-[#89b4fa] transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          Download as Image
        </Button>
        <Button 
          onClick={downloadAsPDF}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#f38ba8] to-[#f1e04d] hover:from-[#f38ba8] hover:to-[#f38ba8] transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          Download as PDF
        </Button>
      </div>
    </div>
  );
};

const SkillSharing = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get current user's profile first
    getMyProfile()
      .then((myProfile) => {
        setUserId(myProfile.id);
        return leaderboardService.getUserProfile(myProfile.id);
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load profile');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-auto bg-[#1e1e2e]">
        <div className="p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#89b4fa] mx-auto mt-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto bg-[#1e1e2e]">
        <div className="p-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e2e]">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-7 h-7 text-[#f1e04d]" />
            <h1 className="text-4xl font-black text-[#cdd6f4]">Share Your Progress</h1>
          </div>
          <p className="text-[#7f849c] font-medium">Create and download your epic achievement card to flex with friends!</p>
        </div>

        {profile && <SharingCard profile={profile} />}
      </div>
    </div>
  );
};

export default SkillSharing;
