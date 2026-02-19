import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Search, Clock, Calendar, Trash2 } from 'lucide-react';
import { getMySkills } from '../services/skillService';
import { fetchSessions } from '../services/sessionService';

const Sessions = ({ onNavigate }) => {
    const [skills, setSkills] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all skills
        getMySkills({ size: 100 })
            .then(data => {
                const skillList = data?.content || [];
                setSkills(skillList);
                return skillList;
            })
            .then(skillList => {
                // Fetch all sessions from all skills
                return Promise.all(
                    skillList.map(skill =>
                        fetchSessions(skill.id).then(sessions =>
                            (Array.isArray(sessions) ? sessions : []).map(s => ({
                                ...s,
                                skillId: skill.id,
                                skillName: skill.name
                            }))
                        ).catch(() => [])
                    )
                );
            })
            .then(sessionArrays => {
                const all = sessionArrays
                    .flat()
                    .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
                setAllSessions(all);
                setFilteredSessions(all);
            })
            .finally(() => setLoading(false));
    }, []);

    // Handle search
    useEffect(() => {
        const filtered = allSessions.filter(session =>
            session.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (session.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSessions(filtered);
    }, [searchTerm, allSessions]);

    // Format duration display
    const formatDuration = (minutes) => {
        if (!minutes) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    // Format date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading sessions...</div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Learning Sessions"
                description="View all your logged learning sessions and track your progress"
                action={false}
            />

            {/* Search */}
            <div>
                <Input
                    type="text"
                    placeholder="Search sessions by skill or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                />
            </div>

            {/* Sessions List */}
            <Section
                title={`All Sessions (${filteredSessions.length})`}
                description="Complete history of your learning sessions"
            >
                {filteredSessions.length > 0 ? (
                    <div className="space-y-3">
                        {filteredSessions.map((session) => (
                            <Card
                                key={session.id}
                                className="p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Session Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                                {session.skillName}
                                            </h3>
                                            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                                {formatDuration(session.durationMinutes)}
                                            </span>
                                        </div>

                                        {/* Notes */}
                                        {session.notes && (
                                            <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-2">
                                                {session.notes}
                                            </p>
                                        )}

                                        {/* Date and Time */}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[#7f849c]">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(session.sessionDate)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Trash2}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                            title="Delete session"
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-[#313244] rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-gray-400 dark:text-[#6c7086]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-[#cdd6f4] mb-1">
                                {searchTerm ? 'No sessions found' : 'No sessions yet'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-[#9399b2]">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Log your first learning session to get started'}
                            </p>
                        </div>
                    </Card>
                )}
            </Section>

            {/* Sessions Stats */}
            {allSessions.length > 0 && (
                <Section title="Session Statistics">
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-1">Total Sessions</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">
                                    {allSessions.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-1">Total Time</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">
                                    {formatDuration(allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-[#9399b2] mb-1">Average Session</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">
                                    {formatDuration(Math.round(allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / allSessions.length))}
                                </p>
                            </div>
                        </div>
                    </Card>
                </Section>
            )}
        </div>
    );
};

export default Sessions;
