import { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Play, ChevronRight, Clock, Trophy, RotateCcw, CheckCircle2, XCircle, ArrowLeft, Zap, Target, TrendingUp, History, Check } from 'lucide-react';
import { generateQuiz, submitQuizAttempt, getQuizHistory } from '../services/quizService';

const DIFFICULTIES = [
  { value: 'BEGINNER', label: 'Beginner', color: 'from-green-500 to-emerald-600', desc: 'Fundamentals & basics' },
  { value: 'INTERMEDIATE', label: 'Intermediate', color: 'from-blue-500 to-indigo-600', desc: 'Applied concepts' },
  { value: 'ADVANCED', label: 'Advanced', color: 'from-red-500 to-rose-600', desc: 'Expert-level challenges' },
];

const QUESTION_COUNTS = [5, 10, 15];

function getGrade(pct) {
  if (pct >= 90) return { letter: 'A+', color: 'text-green-500', msg: 'Outstanding!' };
  if (pct >= 80) return { letter: 'A', color: 'text-green-500', msg: 'Excellent work!' };
  if (pct >= 70) return { letter: 'B', color: 'text-blue-500', msg: 'Good job!' };
  if (pct >= 60) return { letter: 'C', color: 'text-yellow-500', msg: 'Not bad, keep practicing!' };
  if (pct >= 50) return { letter: 'D', color: 'text-orange-500', msg: 'Needs improvement' };
  return { letter: 'F', color: 'text-red-500', msg: 'Keep studying and try again!' };
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
    } catch { /* ignore */ }
  };

  const getSkillName = () => {
    if (selectedSkill) return selectedSkill.name;
    return customSkill.trim();
  };

  const startQuiz = async () => {
    const skillName = getSkillName();
    if (!skillName) return;
    setLoading(true);
    try {
      const qs = await generateQuiz(skillName, difficulty, questionCount);
      if (!qs || qs.length === 0) {
        alert('Failed to generate quiz. Please check your Gemini API key in application.properties.');
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
      alert('Failed to generate quiz. Please try again.');
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
    showSuccess('Quiz submitted successfully! 🎉');

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

  // ===== SETUP VIEW =====
  if (view === 'setup') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Skills Assessment</h1>
            <p className="text-sm text-gray-500 dark:text-[#6c7086] mt-1">AI-powered quizzes to test your knowledge</p>
          </div>
          <button onClick={viewHistory} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-[#313244] text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244] transition-all">
            <History className="w-4 h-4" /> History
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
          </div>
        )}

        {/* Skill Selection */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-500" /> Choose a Skill
          </h2>

          {/* User's skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-[#6c7086] mb-2">Your skills</p>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSkill(s); setCustomSkill(''); }}
                    className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all ${
                      selectedSkill?.id === s.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gray-100 dark:bg-[#313244] text-gray-700 dark:text-[#a6adc8] hover:bg-purple-50 dark:hover:bg-purple-500/10'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 dark:text-[#6c7086] mb-2">Or enter any topic</p>
            <input
              type="text"
              value={customSkill}
              onChange={e => { setCustomSkill(e.target.value); setSelectedSkill(null); }}
              placeholder="e.g. React Hooks, Python Decorators, SQL Joins..."
              className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" /> Difficulty Level
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map(d => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  difficulty === d.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                    : 'border-gray-200 dark:border-[#313244] hover:border-gray-300 dark:hover:border-[#45475a]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center mb-2`}>
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">{d.label}</p>
                <p className="text-xs text-gray-500 dark:text-[#6c7086]">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
          <h2 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] mb-4">Number of Questions</h2>
          <div className="flex gap-3">
            {QUESTION_COUNTS.map(c => (
              <button
                key={c}
                onClick={() => setQuestionCount(c)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  questionCount === c
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-100 dark:bg-[#313244] text-gray-700 dark:text-[#a6adc8] hover:bg-purple-50 dark:hover:bg-purple-500/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Start */}
        <button
          onClick={startQuiz}
          disabled={(!selectedSkill && !customSkill.trim()) || loading}
          className="w-full py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:shadow-xl hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating AI Quiz...
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5" /> Start Assessment
            </>
          )}
        </button>
      </div>
    );
  }

  // ===== QUIZ VIEW =====
  if (view === 'quiz') {
    const q = questions[currentQ];
    const isAnswered = answers[currentQ] !== undefined;
    const allAnswered = Object.keys(answers).length === questions.length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={resetQuiz} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">{getSkillName()} Quiz</h1>
              <p className="text-xs text-gray-500 dark:text-[#6c7086]">{DIFFICULTIES.find(d => d.value === difficulty)?.label} • {questions.length} questions</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-[#313244] rounded-lg text-sm font-mono text-gray-700 dark:text-[#a6adc8]">
            <Clock className="w-4 h-4" /> {formatTime(timer)}
          </div>
        </div>

        {/* Progress */}
        <div className="w-full bg-gray-200 dark:bg-[#313244] rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Cards Row (dots) */}
        <div className="flex gap-1.5 justify-center">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i === currentQ
                  ? 'bg-purple-600 text-white scale-110'
                  : answers[i] !== undefined
                    ? 'bg-purple-200 dark:bg-purple-500/30 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-200 dark:bg-[#313244] text-gray-500 dark:text-[#6c7086]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
          <p className="text-xs text-purple-500 dark:text-purple-400 font-semibold mb-2">Question {currentQ + 1} of {questions.length}</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(currentQ, i)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  answers[currentQ] === i
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                    : 'border-gray-200 dark:border-[#313244] hover:border-gray-300 dark:hover:border-[#45475a]'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  answers[currentQ] === i
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-[#313244] text-gray-600 dark:text-[#a6adc8]'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-gray-900 dark:text-[#cdd6f4]">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQ === 0}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-[#313244] text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244] disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500 dark:text-[#6c7086]">{Object.keys(answers).length}/{questions.length} answered</span>
          {currentQ === questions.length - 1 ? (
            <button
              onClick={finishQuiz}
              disabled={!allAnswered}
              className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 transition-all"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-1 px-5 py-2.5 text-sm font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ===== RESULTS VIEW =====
  if (view === 'results' && quizResult) {
    const grade = getGrade(quizResult.percentage);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={resetQuiz} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Quiz Results</h1>
        </div>

        {successMsg && (
          <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMsg}</p>
          </div>
        )}

        {/* Score Card */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-8 text-center">
          <div className={`text-7xl font-black mb-2 ${grade.color}`}>{grade.letter}</div>
          <p className="text-lg text-gray-600 dark:text-[#a6adc8] mb-4">{grade.msg}</p>
          <div className="flex items-center justify-center gap-8 mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">{quizResult.score}/{quizResult.total}</p>
              <p className="text-xs text-gray-500 dark:text-[#6c7086]">Correct</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-[#313244]" />
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">{quizResult.percentage}%</p>
              <p className="text-xs text-gray-500 dark:text-[#6c7086]">Score</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-[#313244]" />
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">{formatTime(quizResult.timeTaken)}</p>
              <p className="text-xs text-gray-500 dark:text-[#6c7086]">Time</p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={resetQuiz} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              <RotateCcw className="w-4 h-4" /> New Quiz
            </button>
            <button onClick={viewHistory} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 dark:border-[#313244] text-gray-700 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244] transition-all">
              <TrendingUp className="w-4 h-4" /> View History
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4] mb-4">Question Review</h3>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div key={i} className={`p-4 rounded-xl border ${
                  isCorrect ? 'border-green-200 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/5' : 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{q.question}</p>
                  </div>
                  <div className="ml-7 space-y-1">
                    {!isCorrect && userAns !== undefined && (
                      <p className="text-xs text-red-500">Your answer: <span className="font-medium">{q.options[userAns]}</span></p>
                    )}
                    <p className="text-xs text-green-600 dark:text-green-400">Correct: <span className="font-medium">{q.options[q.correctAnswer]}</span></p>
                    {q.explanation && <p className="text-xs text-gray-500 dark:text-[#6c7086] mt-1 italic">{q.explanation}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ===== HISTORY VIEW =====
  if (view === 'history') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={resetQuiz} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Quiz History</h1>
            <p className="text-sm text-gray-500 dark:text-[#6c7086]">Track your progress over time</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-6">
          {historyLoading ? (
            <div className="text-center py-10">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <Trophy className="w-10 h-10 text-gray-300 dark:text-[#45475a] mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-[#6c7086]">No quiz attempts yet</p>
              <button onClick={resetQuiz} className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline">Take your first quiz →</button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((h, i) => {
                const pct = Math.round(h.percentage || 0);
                const grade = getGrade(pct);
                return (
                  <div key={h.id || i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-[#313244] hover:bg-gray-50 dark:hover:bg-[#181825] transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black ${grade.color} bg-gray-100 dark:bg-[#313244]`}>
                      {grade.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] truncate">{h.skillName || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 dark:text-[#6c7086]">
                        {h.difficulty} • {h.score}/{h.totalQuestions} correct • {formatTime(h.timeTakenSeconds || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${grade.color}`}>{pct}%</p>
                      <p className="text-[10px] text-gray-400">{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : ''}</p>
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
