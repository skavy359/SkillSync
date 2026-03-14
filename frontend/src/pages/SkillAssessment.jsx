import { useState, useEffect, useRef } from 'react';
import { BrainCircuit, ChevronRight, Clock, Trophy, RotateCcw, CheckCircle2, XCircle, ArrowLeft, Zap, Target, TrendingUp, History, Check, Shield, Award, AlertTriangle, Sparkles, BarChart3, BookOpen } from 'lucide-react';
import { generateQuiz, submitQuizAttempt, getQuizHistory } from '../services/quizService';

const DIFFICULTIES = [
  { value: 'BEGINNER', label: 'Beginner', color: 'from-emerald-400 to-green-600', shadow: 'shadow-emerald-500/20', desc: 'Fundamentals & basics', icon: <Shield className="w-6 h-6" /> },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: 'from-indigo-400 to-purple-600', shadow: 'shadow-indigo-500/20', desc: 'Applied concepts', icon: <Zap className="w-6 h-6" /> },
  { value: 'ADVANCED', label: 'Advanced', color: 'from-rose-400 to-red-600', shadow: 'shadow-rose-500/20', desc: 'Expert-level challenges', icon: <Target className="w-6 h-6" /> },
];

const QUESTION_COUNTS = [5, 10, 15];

function getGrade(pct) {
  if (pct >= 90) return { letter: 'A+', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', msg: 'Outstanding! True Mastery.' };
  if (pct >= 80) return { letter: 'A', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30', msg: 'Excellent work!' };
  if (pct >= 70) return { letter: 'B', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', msg: 'Good job! Solid foundation.' };
  if (pct >= 60) return { letter: 'C', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', msg: 'Not bad, keep practicing!' };
  if (pct >= 50) return { letter: 'D', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', msg: 'Needs improvement.' };
  return { letter: 'F', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30', msg: 'Keep studying and try again!' };
}

const SkillAssessment = () => {
  const [view, setView] = useState('setup'); // setup | quiz | results | history
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [customSkill, setCustomSkill] = useState('');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [quizResult, setQuizResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fetchSkills = async () => {
    try {
      const api = (await import('../services/api')).default;
      const res = await api.get('/skills');
      const data = res.data;
      setSkills(Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : []);
    } catch { }
  };

  const getSkillName = () => {
    if (selectedSkill) return selectedSkill.name;
    return customSkill.trim();
  };

  const startQuiz = async () => {
    const skillName = getSkillName();
    if (!skillName) return;
    setLoading(true);
    setError('');
    try {
      const qs = await generateQuiz(skillName, difficulty, questionCount);
      if (!qs || qs.length === 0) {
        setError('Failed to generate quiz. The AI might be unavailable or the topic is too obscure.');
        return;
      }
      setQuestions(qs);
      setCurrentQ(0);
      setAnswers({});
      setTimer(0);
      setView('quiz');
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } catch (err) {
      console.error('Failed to generate quiz', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to generate quiz. Please try again with a different topic.');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (qIdx, ansIdx) => {
    setAnswers(prev => ({ ...prev, [qIdx]: ansIdx }));
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) setCurrentQ(q => q + 1);
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(q => q - 1);
  };

  const finishQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    const percentage = Math.round((score / questions.length) * 100);
    const result = { score, total: questions.length, percentage, timeTaken: timer };
    setQuizResult(result);
    setView('results');
    showSuccess('Assessment completed! 🎉');

    try {
      await submitQuizAttempt({
        skillId: selectedSkill?.id || null,
        skillName: getSkillName(),
        score,
        totalQuestions: questions.length,
        difficulty,
        timeTakenSeconds: timer,
      });
    } catch (err) {
      console.error('Failed to save attempt', err);
    }
  };

  const viewHistory = async () => {
    setHistoryLoading(true);
    setView('history');
    try {
      const h = await getQuizHistory();
      setHistory(h || []);
    } catch { setHistory([]); }
    finally { setHistoryLoading(false); }
  };

  const resetQuiz = () => {
    setView('setup');
    setQuestions([]);
    setAnswers({});
    setCurrentQ(0);
    setTimer(0);
    setQuizResult(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (view === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in shadow-sm">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <p className="text-sm font-bold text-rose-700 dark:text-rose-400">{error}</p>
          </div>
        )}
        <div className="relative bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-80" />
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20 shrink-0">
                    <BrainCircuit className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">Skill Assessment</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-lg leading-snug">AI-powered technical quizzes to evaluate your proficiency and track growth.</p>
                </div>
            </div>

            <div className="relative z-10 shrink-0">
                <button onClick={viewHistory} className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-50 dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 font-bold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-md transition-all">
                    <History className="w-5 h-5 group-hover:-rotate-45 transition-transform" /> View History
                </button>
            </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{successMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <Target className="w-4 h-4" />
                        </div>
                        1. Choose Assessment Topic
                    </h2>

                    {skills.length > 0 && (
                        <div className="mb-6">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Tracked Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => { setSelectedSkill(s); setCustomSkill(''); }}
                                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all border ${
                                    selectedSkill?.id === s.id
                                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25'
                                        : 'bg-gray-50 dark:bg-[#1e1e2e] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500/30 hover:text-purple-600 dark:hover:text-purple-400'
                                    }`}
                                >
                                    {s.name}
                                </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Or Any Custom Topic</p>
                        <input
                            type="text"
                            value={customSkill}
                            onChange={e => { setCustomSkill(e.target.value); setSelectedSkill(null); }}
                            placeholder="e.g. Next.js Routing, Docker Networking, AWS IAM..."
                            className="w-full px-5 py-4 text-sm font-medium border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#1e1e2e] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                        2. Assessment Length
                    </h2>
                    
                    <div className="grid grid-cols-3 gap-4">
                        {QUESTION_COUNTS.map(c => (
                        <button
                            key={c}
                            onClick={() => setQuestionCount(c)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                            questionCount === c
                                ? 'bg-pink-50 dark:bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400 shadow-md shadow-pink-500/10'
                                : 'bg-gray-50 dark:bg-[#1e1e2e] border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-200 dark:hover:border-white/10 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <span className="text-3xl font-black mb-1">{c}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Questions</span>
                        </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                            <Award className="w-4 h-4" />
                        </div>
                        3. Difficulty
                    </h2>
                    
                    <div className="flex flex-col gap-3">
                        {DIFFICULTIES.map(d => {
                            const isSelected = difficulty === d.value;
                            return (
                            <button
                                key={d.value}
                                onClick={() => setDifficulty(d.value)}
                                className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all overflow-hidden group ${
                                isSelected
                                    ? 'bg-white dark:bg-[#1e1e2e] border-transparent shadow-lg scale-105 z-10'
                                    : 'bg-gray-50 dark:bg-[#1e1e2e]/50 border-transparent hover:border-gray-200 dark:hover:border-white/10 opacity-70 hover:opacity-100'
                                }`}
                                style={isSelected ? { borderColor: 'transparent' } : {}}
                            >
                                {isSelected && (
                                    <div className={`absolute inset-0 bg-gradient-to-r ${d.color} opacity-[0.08] dark:opacity-10`} />
                                )}
                                {isSelected && (
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${d.color}`} />
                                )}

                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${isSelected ? `bg-gradient-to-br ${d.color} ${d.shadow}` : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-none'}`}>
                                    {d.icon}
                                </div>
                                <div className="text-left">
                                    <p className={`text-sm font-black ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{d.label}</p>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{d.desc}</p>
                                </div>
                            </button>
                        )})}
                    </div>
                </div>

                <div className="sticky top-6">
                    <button
                        onClick={startQuiz}
                        disabled={(!selectedSkill && !customSkill.trim()) || loading}
                        className="w-full py-5 px-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white font-black text-lg transition-all shadow-xl shadow-purple-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 w-full animate-pulse blur" />
                        {loading ? (
                            <>
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                                <span className="relative z-10">Preparing AI Engine...</span>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 relative z-10 group-hover:scale-105 transition-transform">
                                    <BrainCircuit className="w-6 h-6" /> Launch Assessment
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-white/70 relative z-10">Powered by Gemini AI</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (view === 'quiz') {
    const q = questions[currentQ];
    const isAnswered = answers[currentQ] !== undefined;
    const allAnswered = Object.keys(answers).length === questions.length;

    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => { if(window.confirm('Abandon current assessment?')) resetQuiz(); }} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#1e1e2e] flex items-center justify-center hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {getSkillName()}
                <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-widest leading-none drop-shadow-sm border border-purple-200/50 dark:border-purple-500/20">
                    {DIFFICULTIES.find(d => d.value === difficulty)?.label}
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-base font-black text-indigo-600 dark:text-indigo-400 shadow-inner">
            <Clock className="w-4 h-4 animate-pulse" /> {formatTime(timer)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progress</span>
                <span className="text-sm font-black text-purple-600 dark:text-purple-400">{Object.keys(answers).length} / {questions.length}</span>
            </div>
            
            <div className="relative w-full h-3 bg-gray-100 dark:bg-[#1e1e2e] rounded-full overflow-hidden shadow-inner mb-6">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
            </div>
            
            <div className="flex gap-2 justify-center flex-wrap">
            {questions.map((_, i) => {
                const isCurrent = i === currentQ;
                const isDone = answers[i] !== undefined;
                return (
                <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-9 h-9 rounded-xl text-sm font-black transition-all flex items-center justify-center border-2 ${
                    isCurrent
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/30 scale-110 z-10'
                    : isDone
                        ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400'
                        : 'bg-white dark:bg-[#1e1e2e] border-gray-200 dark:border-white/5 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-white/20'
                }`}
                >
                {i + 1}
                </button>
            )})}
            </div>
        </div>

        <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-10 shadow-lg relative overflow-hidden animate-in slide-in-from-right-8 duration-300">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
          
          <div className="mb-8">
            <p className="text-sm font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Question {currentQ + 1}
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-relaxed">{q.question}</h2>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {q.options.map((opt, i) => {
              const selected = answers[currentQ] === i;
              return (
              <button
                key={i}
                onClick={() => selectAnswer(currentQ, i)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center gap-4 group ${
                  selected
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 dark:border-[#313244] hover:border-purple-300 dark:hover:border-purple-500/30 hover:bg-gray-50 dark:hover:bg-[#1e1e2e]/50'
                }`}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-colors ${
                  selected
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-gray-100 dark:bg-[#313244] text-gray-500 dark:text-gray-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={`text-base font-semibold leading-snug transition-colors ${selected ? 'text-purple-900 dark:text-purple-100' : 'text-gray-700 dark:text-[#cdd6f4]'}`}>
                    {opt}
                </span>
              </button>
            )})}
          </div>
        </div>

        <div className="flex items-center justify-between bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-4 sm:p-6 shadow-sm">
          <button
            onClick={prevQuestion}
            disabled={currentQ === 0}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1e1e2e] disabled:opacity-30 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          {currentQ === questions.length - 1 ? (
            <button
              onClick={finishQuiz}
              disabled={!allAnswered}
              className="flex items-center gap-2 px-8 py-3 text-base font-black rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all group"
            >
              <CheckCircle2 className="w-5 h-5" /> Submit Assessment
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-8 py-3 text-base font-black rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 hover:-translate-y-0.5 transition-all group"
            >
              Next <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (view === 'results' && quizResult) {
    const grade = getGrade(quizResult.percentage);
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{successMsg}</p>
          </div>
        )}

        <div className={`relative rounded-3xl border overflow-hidden p-8 sm:p-12 text-center shadow-xl ${grade.bg} ${grade.border} animate-in zoom-in-95 duration-500`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-32 -mt-32 backdrop-filter`} style={{ backgroundColor: 'currentColor', color: grade.color.replace('text-', '') }} />
          
          <div className="relative z-10 mb-6">
            <div className={`w-24 h-24 mx-auto font-black text-6xl flex items-center justify-center rounded-full bg-white dark:bg-[#181825] shadow-lg mb-4 ${grade.color} ${grade.border}`}>
                {grade.letter}
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">{grade.msg}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Assessment completed for <strong className="text-gray-900 dark:text-white">{getSkillName()}</strong></p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-4 sm:gap-8 bg-white dark:bg-[#181825] p-6 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm max-w-2xl mx-auto">
            <div className="flex flex-col items-center flex-1">
              <div className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" /> {quizResult.score}/{quizResult.total}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Score</p>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center flex-1">
              <div className={`text-3xl font-black flex items-center gap-1 ${grade.color}`}>
                {quizResult.percentage}%
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Accuracy</p>
            </div>
            <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center flex-1">
              <div className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" /> {formatTime(quizResult.timeTaken)}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Time taken</p>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={resetQuiz} className="flex justify-center items-center gap-2 px-8 py-3.5 text-base font-black rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:-translate-y-1 transition-all group">
              <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" /> Try New Assessment
            </button>
            <button onClick={viewHistory} className="flex justify-center items-center gap-2 px-8 py-3.5 text-base font-bold rounded-xl bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm">
              <History className="w-5 h-5" /> View History
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Detailed Review
          </h3>
          <div className="space-y-6">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={i} className={`p-5 sm:p-6 rounded-2xl border-2 relative overflow-hidden ${
                  isCorrect ? 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/5' : 'border-rose-200 dark:border-rose-500/20 bg-rose-50/30 dark:bg-rose-500/5'
                }`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-10 -mt-10 ${isCorrect ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`} />
                  
                  <div className="relative z-10 flex items-start gap-3 sm:gap-4 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isCorrect ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-rose-500/30'}`}>
                        {isCorrect ? <Check className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Question {i+1}</p>
                        <p className="text-base font-black text-gray-900 dark:text-white leading-relaxed">{q.question}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10 pl-11 sm:pl-12 space-y-3">
                    {!isCorrect && userAns !== undefined && (
                      <div className="p-3 bg-rose-100/50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20">
                          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">You Answered</p>
                          <p className="text-sm font-medium text-rose-900 dark:text-rose-300">{q.options[userAns]}</p>
                      </div>
                    )}
                    <div className="p-3 bg-emerald-100/50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Correct Answer</p>
                        <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">{q.options[q.correctAnswer]}</p>
                    </div>
                    {q.explanation && (
                        <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5">
                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Explanation</p>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{q.explanation}</p>
                        </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'history') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div>
            <button onClick={resetQuiz} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Setup
            </button>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3"><History className="w-8 h-8 text-indigo-500" /> Assessment History</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mt-1">Review your past performances and track improvement.</p>
          </div>
          
          <div className="shrink-0 relative z-10">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-6 py-4 rounded-2xl text-center shadow-inner">
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{history.length}</p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Total Attempts</p>
              </div>
          </div>
        </div>

        <div className="space-y-4">
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5">
              <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
              <p className="font-bold text-gray-500">Loading history records...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-[#181825] rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 dark:bg-[#1e1e2e] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-gray-400 dark:text-[#45475a]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No Attempts on Record</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">Ready to test your knowledge? Take your first assessment now.</p>
              <button onClick={resetQuiz} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all">Launch Assessment</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((h, i) => {
                const pct = Math.round(h.percentage || 0);
                const grade = getGrade(pct);
                return (
                  <div key={h.id || i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#181825] border border-gray-200/50 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-md transition-all group overflow-hidden relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-2 ${grade.bg.replace('/10', '')} opacity-50`} />
                    
                    <div className="flex items-center gap-5 relative z-10 pl-2">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm shrink-0 ${grade.color} ${grade.bg}`}>
                        {grade.letter}
                        </div>
                        <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white truncate mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {h.skillName || 'Custom Assessment'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#1e1e2e] text-gray-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">{h.difficulty}</span>
                                <span className="text-xs font-bold text-gray-500"> • {formatTime(h.timeTakenSeconds || 0)}</span>
                                <span className="text-xs font-bold text-gray-500"> • {h.createdAt ? new Date(h.createdAt).toLocaleDateString() : 'Recent'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="sm:ml-auto flex items-center justify-between sm:justify-end gap-6 sm:w-48 pt-4 sm:pt-0 mt-4 sm:mt-0 border-t border-gray-100 dark:border-white/5 sm:border-t-0 pl-2 sm:pl-0">
                      <div className="text-center">
                          <p className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{h.score}<span className="text-sm text-gray-400">/{h.totalQuestions}</span></p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Correct</p>
                      </div>
                      <div className="w-px h-10 bg-gray-200 dark:bg-white/10 hidden sm:block" />
                      <div className="text-center">
                          <p className={`text-2xl font-black leading-none mb-1 ${grade.color}`}>{pct}%</p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default SkillAssessment;