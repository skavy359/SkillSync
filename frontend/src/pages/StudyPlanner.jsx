import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, BookOpen, Check, Trash2, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { getStudyEvents, createStudyEvent, updateStudyEventStatus, deleteStudyEvent } from '../services/studyPlannerService';

const COLORS = [
  '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#f97316',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_STYLES = {
  PLANNED: { label: 'Planned', bg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  COMPLETED: { label: 'Done', bg: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400', dot: 'bg-green-500' },
  MISSED: { label: 'Missed', bg: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-gray-100 dark:bg-gray-500/20 text-gray-500 dark:text-gray-400', dot: 'bg-gray-400' },
};

function formatTime(dt) {
  const d = new Date(dt);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

const SuccessToast = ({ message, onClose }) => (
  <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
    <p className="text-sm font-medium text-green-700 dark:text-green-400">{message}</p>
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

  useEffect(() => {
    fetchEvents();
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

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
          } catch {
            updated.push({ ...ev, status: 'MISSED' });
          }
        } else {
          updated.push(ev);
        }
      }
      setEvents(updated);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const api = (await import('../services/api')).default;
      const res = await api.get('/skills', { params: { size: 100 } });
      const skillList = res.data?.data?.content || res.data?.content || [];
      console.log('Fetched skills:', skillList);
      setSkills(Array.isArray(skillList) ? skillList : []);
    } catch (err) {
      console.error('Failed to load skills:', err);
      setSkills([]);
    }
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };

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

  const selectedDayEvents = selectedDate
    ? events.filter(e => isSameDay(new Date(e.startTime), selectedDate))
    : [];

  const openCreateModal = () => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    setFormDate(dateStr);
    setFormTitle('');
    setFormDesc('');
    setFormStartTime('09:00');
    setFormEndTime('10:00');
    setFormSkillId('');
    setFormColor(COLORS[0]);
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!formTitle.trim() || !formDate) return;
    setCreating(true);
    try {
      const startTime = `${formDate}T${formStartTime}:00`;
      const endTime = `${formDate}T${formEndTime}:00`;
      await createStudyEvent({
        title: formTitle.trim(),
        description: formDesc.trim(),
        startTime, endTime,
        skillId: formSkillId ? Number(formSkillId) : null,
        color: formColor,
      });
      setShowModal(false);
      showSuccess('Study event created successfully!');
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event', err);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateStudyEventStatus(id, status);
      setEvents(prev => prev.map(e => e.id === id ? updated : e));
      showSuccess(status === 'COMPLETED' ? 'Event marked as completed! 🎉' : status === 'MISSED' ? 'Event marked as missed' : 'Event status updated');
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudyEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      showSuccess('Event deleted successfully');
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const totalPlanned = events.filter(e => e.status === 'PLANNED').length;
  const totalCompleted = events.filter(e => e.status === 'COMPLETED').length;
  const totalMissed = events.filter(e => e.status === 'MISSED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">Study Planner</h1>
          <p className="text-sm text-gray-500 dark:text-[#6c7086] mt-1">Plan and track your study sessions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {successMsg && <SuccessToast message={successMsg} />}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Planned', count: totalPlanned, color: 'from-blue-500 to-blue-600', icon: CalendarIcon },
          { label: 'Completed', count: totalCompleted, color: 'from-green-500 to-emerald-600', icon: Check },
          { label: 'Missed', count: totalMissed, color: 'from-red-500 to-rose-600', icon: AlertCircle },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-[#1e1e2e] rounded-xl border border-gray-200 dark:border-[#313244] p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-[#cdd6f4]">{s.count}</p>
              <p className="text-xs text-gray-500 dark:text-[#6c7086]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button onClick={goToPrevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
              </button>
              <h2 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4] min-w-[180px] text-center">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button onClick={goToNextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244] transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-[#a6adc8]" />
              </button>
            </div>
            <button onClick={goToToday} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
              Today
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 dark:text-[#585b70] py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-[#313244] rounded-xl overflow-hidden">
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day && today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
              const isSelected = day && selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;

              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDate(new Date(currentYear, currentMonth, day))}
                  className={`min-h-[80px] p-1.5 bg-white dark:bg-[#1e1e2e] cursor-pointer transition-colors ${
                    !day ? 'bg-gray-50 dark:bg-[#181825]' : 'hover:bg-purple-50/50 dark:hover:bg-purple-500/5'
                  } ${isSelected ? 'ring-2 ring-inset ring-purple-500 dark:ring-purple-400' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-[#a6adc8]'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map(ev => (
                          <div
                            key={ev.id}
                            className={`text-[10px] font-medium px-1 py-0.5 rounded truncate ${
                              ev.status === 'MISSED' ? 'text-white/70 line-through' : ev.status === 'COMPLETED' ? 'text-white' : 'text-white'
                            }`}
                            style={{ backgroundColor: ev.status === 'MISSED' ? '#6b7280' : ev.status === 'COMPLETED' ? '#10b981' : (ev.color || '#8b5cf6') }}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] text-gray-400 dark:text-[#585b70] px-1">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-[#cdd6f4]">
              {selectedDate ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}` : 'Select a day'}
            </h3>
            <button
              onClick={openCreateModal}
              className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : selectedDayEvents.length === 0 ? (
            <div className="text-center py-10">
              <CalendarIcon className="w-8 h-8 text-gray-300 dark:text-[#45475a] mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-[#6c7086]">No events scheduled</p>
              <button onClick={openCreateModal} className="mt-3 text-xs text-purple-600 dark:text-purple-400 hover:underline">
                + Plan a study session
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map(ev => {
                const st = STATUS_STYLES[ev.status] || STATUS_STYLES.PLANNED;
                return (
                  <div key={ev.id} className={`rounded-xl border p-3 relative group transition-all ${
                    ev.status === 'COMPLETED' ? 'border-green-200 dark:border-green-500/30 bg-green-50/50 dark:bg-green-500/5' :
                    ev.status === 'MISSED' ? 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5' :
                    'border-gray-100 dark:border-[#313244]'
                  }`}>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-full min-h-[40px] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: ev.color || '#8b5cf6' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-semibold truncate ${ev.status === 'MISSED' ? 'line-through text-gray-400 dark:text-[#585b70]' : 'text-gray-900 dark:text-[#cdd6f4]'}`}>{ev.title}</h4>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${st.bg}`}>{st.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-[#6c7086] flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(ev.startTime)} – {formatTime(ev.endTime)}
                        </p>
                        {ev.skillName && (
                          <p className="text-xs text-purple-500 dark:text-purple-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {ev.skillName}
                          </p>
                        )}
                        {ev.description && (
                          <p className="text-xs text-gray-400 dark:text-[#585b70] mt-1 line-clamp-2">{ev.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {ev.status === 'PLANNED' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(ev.id, 'COMPLETED')}
                                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                              >
                                <Check className="w-3 h-3" /> Complete
                              </button>
                              <button
                                onClick={() => handleStatusChange(ev.id, 'MISSED')}
                                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-400 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                              >
                                <X className="w-3 h-3" /> Missed
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-red-500 ml-auto transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#1e1e2e] rounded-2xl border border-gray-200 dark:border-[#313244] w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-[#cdd6f4]">New Study Event</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#313244]">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Study React Hooks"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Description</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="What will you study?"
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#6c7086] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Date *</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Start</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">End</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Skill (optional)</label>
                <select
                  value={formSkillId}
                  onChange={e => setFormSkillId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-[#313244] rounded-xl bg-gray-50 dark:bg-[#181825] text-gray-900 dark:text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                >
                  <option value="">Select a skill</option>
                  {Array.isArray(skills) && skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-[#a6adc8] mb-1">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setFormColor(c)}
                      className={`w-7 h-7 rounded-full transition-all ${formColor === c ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1e1e2e]' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c, ringColor: c }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={!formTitle.trim() || !formDate || creating}
                className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;