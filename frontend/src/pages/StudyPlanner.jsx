import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, BookOpen, Check, Trash2, Calendar as CalendarIcon, AlertCircle, CalendarDays } from 'lucide-react';
import { getStudyEvents, createStudyEvent, updateStudyEventStatus, deleteStudyEvent } from '../services/studyPlannerService';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#f97316',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_STYLES = {
  PLANNED: { label: 'Planned', bg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' },
  COMPLETED: { label: 'Done', bg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' },
  MISSED: { label: 'Missed', bg: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100 dark:bg-gray-500/20 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-500/30' },
};

function formatTime(dt) {
  const d = new Date(dt);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isSameDay(d1, d2) {
  return d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

const SuccessToast = ({ message }) => (
  <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 shadow-sm mb-6">
    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{message}</p>
  </div>
);

const StudyPlanner = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [showModal, setShowModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:00');
  const [formSkillId, setFormSkillId] = useState('');
  const [formColor, setFormColor] = useState(COLORS[0]);
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchEvents(); }, [currentMonth, currentYear]);
  useEffect(() => { fetchSkills(); }, []);

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getStudyEvents(currentMonth + 1, currentYear);
      const eventList = Array.isArray(data) ? data : [];
      const now = new Date();
      const updated = [];
      for (const ev of eventList) {
        if (ev.status === 'PLANNED' && new Date(ev.endTime) < now) {
          try {
            const u = await updateStudyEventStatus(ev.id, 'MISSED');
            updated.push(u);
          } catch { updated.push({ ...ev, status: 'MISSED' }); }
        } else { updated.push(ev); }
      }
      setEvents(updated);
    } catch (err) { console.error('Failed to load events', err); } finally { setLoading(false); }
  };

  const fetchSkills = async () => {
    try {
      const api = (await import('../services/api')).default;
      const res = await api.get('/skills', { params: { size: 100 } });
      const skillList = res.data?.data?.content || res.data?.content || [];
      setSkills(Array.isArray(skillList) ? skillList : []);
    } catch (err) { console.error('Failed to load skills:', err); setSkills([]); }
  };

  const goToPrevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const goToNextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };
  const goToToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); setSelectedDate(today); };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const date = new Date(currentYear, currentMonth, day);
    return events.filter(e => isSameDay(new Date(e.startTime), date));
  };

  const selectedDayEvents = selectedDate ? events.filter(e => isSameDay(new Date(e.startTime), selectedDate)) : [];

  const openCreateModal = () => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    setFormDate(dateStr); setFormTitle(''); setFormDesc(''); setFormStartTime('09:00'); setFormEndTime('10:00'); setFormSkillId(''); setFormColor(COLORS[0]); setShowModal(true);
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formDate) return;
    setCreating(true);
    try {
      const startTime = `${formDate}T${formStartTime}:00`;
      const endTime = `${formDate}T${formEndTime}:00`;
      await createStudyEvent({ title: formTitle.trim(), description: formDesc.trim(), startTime, endTime, skillId: formSkillId ? Number(formSkillId) : null, color: formColor });
      setShowModal(false); showSuccess('Study event created successfully!'); fetchEvents();
    } catch (err) { console.error('Failed to create event', err); } finally { setCreating(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateStudyEventStatus(id, status);
      setEvents(prev => prev.map(e => e.id === id ? updated : e));
      showSuccess(status === 'COMPLETED' ? 'Event marked as completed! 🎉' : status === 'MISSED' ? 'Event marked as missed' : 'Event status updated');
    } catch (err) { console.error('Failed to update status', err); }
  };

  const handleDelete = async (id) => {
    try { await deleteStudyEvent(id); setEvents(prev => prev.filter(e => e.id !== id)); showSuccess('Event deleted successfully'); } 
    catch (err) { console.error('Failed to delete event', err); }
  };

  const totalPlanned = events.filter(e => e.status === 'PLANNED').length;
  const totalCompleted = events.filter(e => e.status === 'COMPLETED').length;
  const totalMissed = events.filter(e => e.status === 'MISSED').length;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* --- Hero Header --- */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-700 p-8 md:p-12 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl -mb-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium">
              <CalendarDays className="w-4 h-4 text-purple-200" />
              <span>Schedule & Habit Tracker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-md">Study Planner</h1>
            <p className="text-purple-50 max-w-xl text-lg opacity-90 leading-relaxed">
               Organize your learning path, schedule dedicated sessions, and track your daily commitments efficiently.
            </p>
          </div>
          <div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-purple-700 bg-white hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" />
              Plan Session
            </button>
          </div>
        </div>
      </div>

      {successMsg && <SuccessToast message={successMsg} />}

      {/* --- Stats Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 dark:border-blue-500/20 p-6 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group">
              <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <CalendarIcon className="w-full h-full text-white" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                  <div>
                      <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Planned Sessions</p>
                      <h3 className="text-4xl font-black text-white">{totalPlanned}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                      <CalendarIcon className="w-7 h-7 text-white" />
                  </div>
              </div>
          </div>
          
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 dark:border-emerald-500/20 p-6 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group">
              <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Check className="w-full h-full text-white" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                  <div>
                      <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-1">Completed</p>
                      <h3 className="text-4xl font-black text-white">{totalCompleted}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                      <Check className="w-7 h-7 text-white" />
                  </div>
              </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 dark:border-rose-500/20 p-6 bg-gradient-to-br from-red-500 to-rose-600 shadow-lg group">
              <div className="absolute -top-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <AlertCircle className="w-full h-full text-white" />
              </div>
              <div className="relative z-10 flex items-center justify-between">
                  <div>
                      <p className="text-rose-100 text-sm font-bold uppercase tracking-wider mb-1">Missed</p>
                      <h3 className="text-4xl font-black text-white">{totalMissed}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                      <AlertCircle className="w-7 h-7 text-white" />
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* --- Calendar Section --- */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-100 dark:border-[#313244] p-5 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-[#cdd6f4] flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-purple-500" /> My Calendar
            </h2>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#181825] p-1.5 rounded-xl border border-gray-100 dark:border-[#313244]/50">
              <button onClick={goToPrevMonth} className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#313244] hover:shadow-sm transition-all text-gray-600 dark:text-[#a6adc8]">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] min-w-[140px] text-center">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={goToNextMonth} className="p-2 rounded-lg hover:bg-white dark:hover:bg-[#313244] hover:shadow-sm transition-all text-gray-600 dark:text-[#a6adc8]">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-200 dark:bg-[#313244] mx-2"></div>
              <button onClick={goToToday} className="text-sm font-bold px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors">
                Today
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-3">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 dark:text-[#585b70] uppercase tracking-wider py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-[#313244] rounded-2xl overflow-hidden border border-gray-100 dark:border-[#313244]">
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day && today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
              const isSelected = day && selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;

              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDate(new Date(currentYear, currentMonth, day))}
                  className={`min-h-[100px] p-2 bg-white dark:bg-[#1e1e2e] transition-colors ${
                    !day ? 'bg-gray-50 dark:bg-[#181825]' : 'cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-500/5'
                  } ${isSelected ? 'ring-2 ring-inset ring-purple-500 dark:ring-purple-400 z-10 relative' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-bold mb-2 w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md' : 'text-gray-700 dark:text-[#a6adc8]'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1.5">
                        {dayEvents.slice(0, 3).map(ev => (
                          <div
                            key={ev.id}
                            className={`text-[10px] font-bold px-1.5 py-1 rounded-md truncate transition-transform hover:scale-105 shadow-sm ${
                              ev.status === 'MISSED' ? 'opacity-60 line-through text-white/90' : 'text-white'
                            }`}
                            style={{ backgroundColor: ev.status === 'MISSED' ? '#6b7280' : ev.status === 'COMPLETED' ? '#10b981' : (ev.color || '#8b5cf6') }}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] font-semibold text-gray-500 dark:text-[#585b70] px-1 hover:text-purple-500 transition-colors">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Day Detail Sidebar --- */}
        <div className="bg-white dark:bg-[#1e1e2e] rounded-3xl border border-gray-100 dark:border-[#313244] p-5 md:p-8 shadow-sm flex flex-col h-[600px] lg:h-auto">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100 dark:border-[#313244]">
            <h3 className="text-xl font-black text-gray-900 dark:text-[#cdd6f4]">
              {selectedDate ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}` : 'Select a day'}
            </h3>
            <button
              onClick={openCreateModal}
              className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors shadow-sm"
              title="Add Session to this day"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-2 custom-scrollbar space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selectedDayEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50/50 dark:bg-[#181825]/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-[#313244]">
                <CalendarIcon className="w-12 h-12 text-gray-300 dark:text-[#45475a] mb-4" />
                <p className="text-gray-500 dark:text-[#6c7086] font-medium mb-4">No events scheduled for this day.</p>
                <button onClick={openCreateModal} className="text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-4 py-2 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
                  Plan a session
                </button>
              </div>
            ) : (
              selectedDayEvents.map(ev => {
                const st = STATUS_STYLES[ev.status] || STATUS_STYLES.PLANNED;
                return (
                  <div key={ev.id} className={`rounded-2xl border p-4 relative group transition-all hover:shadow-md ${st.bg}`}>
                    <div className="flex items-start gap-4">
                      {/* Color Bar / Indicator */}
                      <div className="w-1.5 h-full absolute inset-y-0 left-0 rounded-l-2xl opacity-80" style={{ backgroundColor: ev.color || '#8b5cf6' }} />
                      
                      <div className="flex-1 min-w-0 pl-2">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className={`text-base font-bold truncate ${ev.status === 'MISSED' ? 'line-through opacity-75' : ''}`}>{ev.title}</h4>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 border ${st.bg}`.replace('text-', 'text-opacity-80 text-')}>{st.label}</span>
                        </div>
                        
                        <div className="space-y-1.5 mb-3">
                            <p className="text-sm font-semibold flex items-center gap-2 opacity-80">
                            <Clock className="w-4 h-4" />
                            {formatTime(ev.startTime)} – {formatTime(ev.endTime)}
                            </p>
                            {ev.skillName && (
                            <p className="text-sm font-bold flex items-center gap-2" style={{ color: ev.color || '#6366f1' }}>
                                <BookOpen className="w-4 h-4" /> {ev.skillName}
                            </p>
                            )}
                        </div>

                        {ev.description && (
                          <p className="text-sm font-medium opacity-75 mt-2 line-clamp-3 bg-white/40 dark:bg-black/20 p-3 rounded-xl">{ev.description}</p>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                          {ev.status === 'PLANNED' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(ev.id, 'COMPLETED')}
                                className="flex-1 flex justify-center items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm hover:shadow-emerald-500/25"
                              >
                                <Check className="w-3.5 h-3.5" /> Done
                              </button>
                              <button
                                onClick={() => handleStatusChange(ev.id, 'MISSED')}
                                className="flex justify-center items-center p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-rose-500 hover:text-white transition-colors text-rose-600 dark:text-rose-400 shadow-sm"
                                title="Mark as Missed"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className={`flex justify-center items-center p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-rose-500 hover:text-white transition-colors shadow-sm ${ev.status !== 'PLANNED' ? 'flex-1 text-rose-600 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'}`}
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> {ev.status !== 'PLANNED' && 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Study Session" size="lg" footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={handleCreate} disabled={!formTitle.trim() || !formDate || creating}>{creating ? 'Scheduling...' : 'Confirm Schedule'}</Button></>}>
        <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Title of session <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Master React Hooks"
                  className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-[#313244] font-medium transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Description</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="What specific topics will you cover?"
                  rows={2}
                  className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-[#313244] font-medium resize-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-gray-100 dark:border-[#313244] py-4 my-2">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Date <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-1.5">Relates to Skill</label>
                <select
                  value={formSkillId}
                  onChange={e => setFormSkillId(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-[#313244] font-medium transition-all"
                >
                  <option value="">No specific skill</option>
                  {Array.isArray(skills) && skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-[#cdd6f4] mb-2">Color Label</label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${formColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-[#1e1e2e] scale-110 shadow-sm' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    >
                        {formColor === c && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
                    </button>
                  ))}
                </div>
              </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudyPlanner;