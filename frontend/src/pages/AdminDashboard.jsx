import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Section from '../components/ui/Section';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getAdminStats, getUsers } from '../services/adminService';
import {
    Users,
    Layers,
    CalendarCheck,
    Activity,
    Loader2,
    AlertCircle,
    RefreshCw,
    UserCircle,
    Clock,
    ShieldCheck,
    TrendingUp,
} from 'lucide-react';

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonStatCard = () => (
    <div className="bg-white dark:bg-[#181825] rounded-2xl border border-gray-100 dark:border-[#313244] shadow-sm dark:shadow-none p-6 animate-pulse">
        <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
                <div className="h-3 bg-gray-100 dark:bg-[#313244] rounded w-24" />
                <div className="h-8 bg-gray-100 dark:bg-[#313244] rounded w-16" />
                <div className="h-3 bg-gray-100 dark:bg-[#313244] rounded w-32" />
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-[#313244] rounded-xl" />
        </div>
    </div>
);

// ─── Role badge helper ────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => (
    <Badge variant={role === 'ADMIN' ? 'purple' : 'primary'} size="sm">
        {role === 'ADMIN' ? (
            <span className="flex items-center gap-1">
        <ShieldCheck className="w-3 h-3" /> Admin
      </span>
        ) : (
            'User'
        )}
    </Badge>
);

// ─── Format date ─────────────────────────────────────────────────────────────
const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = ({ onNavigate }) => {
    const [stats, setStats]           = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);
    const [usersError, setUsersError] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const loadStats = useCallback(async () => {
        setStatsLoading(true);
        setStatsError(null);
        try {
            const result = await getAdminStats();
            setStats(result);
            setLastRefreshed(new Date());
        } catch (err) {
            setStatsError(
                err?.response?.data?.message ?? 'Failed to load dashboard stats.'
            );
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const loadRecentUsers = useCallback(async () => {
        setUsersLoading(true);
        setUsersError(null);
        try {
            const result = await getUsers({ page: 0, size: 5 });
            setRecentUsers(result?.content ?? []);
        } catch (err) {
            setUsersError(
                err?.response?.data?.message ?? 'Failed to load recent users.'
            );
        } finally {
            setUsersLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
        loadRecentUsers();
    }, [loadStats, loadRecentUsers]);

    const handleRefresh = () => {
        loadStats();
        loadRecentUsers();
    };

    // Active user percentage (guard against zero)
    const activePercent =
        stats && stats.totalUsers > 0
            ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
            : 0;

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              Admin Panel
            </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">Dashboard</h1>
                    <p className="text-gray-500 dark:text-[#7f849c] mt-1">
                        Platform-wide overview and real-time metrics
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {lastRefreshed && (
                        <span className="text-xs text-gray-400 dark:text-[#7f849c] hidden sm:inline">
              Updated {lastRefreshed.toLocaleTimeString()}
            </span>
                    )}
                    <Button
                        variant="secondary"
                        icon={RefreshCw}
                        onClick={handleRefresh}
                        disabled={statsLoading || usersLoading}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* ── Stats Error ────────────────────────────────────────────────── */}
            {statsError && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400 flex-1">{statsError}</p>
                    <Button variant="ghost" size="sm" onClick={loadStats}>
                        Retry
                    </Button>
                </div>
            )}

            {/* ── Stat Cards ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {statsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
                ) : (
                    <>
                        <StatCard
                            title="Total Users"
                            value={stats?.totalUsers?.toLocaleString() ?? '—'}
                            icon={Users}
                            color="indigo"
                            trend="up"
                            trendValue="All registered accounts"
                        />
                        <StatCard
                            title="Total Skills"
                            value={stats?.totalSkills?.toLocaleString() ?? '—'}
                            icon={Layers}
                            color="blue"
                            subtitle="Across all users"
                        />
                        <StatCard
                            title="Total Sessions"
                            value={stats?.totalSessions?.toLocaleString() ?? '—'}
                            icon={CalendarCheck}
                            color="green"
                            trend="up"
                            trendValue="Learning sessions logged"
                        />
                        <StatCard
                            title="Active Users"
                            value={`${activePercent}%`}
                            icon={Activity}
                            color="purple"
                            subtitle={`${stats?.activeUsers?.toLocaleString() ?? 0} of ${stats?.totalUsers?.toLocaleString() ?? 0} users`}
                        />
                    </>
                )}
            </div>

            {/* ── Active Users Progress Visual ───────────────────────────────── */}
            {!statsLoading && stats && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            <h3 className="text-base font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                Platform Activity
                            </h3>
                        </div>
                        <Badge variant="success" size="sm">Live</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Active Users bar */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600 dark:text-[#a6adc8]">Active Users</span>
                                <span className="text-sm font-bold text-indigo-600">{activePercent}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-700"
                                    style={{ width: `${activePercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-[#7f849c] mt-1">
                                {stats.activeUsers} active / {stats.totalUsers} total
                            </p>
                        </div>

                        {/* Avg skills */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600 dark:text-[#a6adc8]">Avg Skills / User</span>
                                <span className="text-sm font-bold text-blue-600">
                  {stats.totalUsers > 0
                      ? (stats.totalSkills / stats.totalUsers).toFixed(1)
                      : '—'}
                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-700"
                                    style={{
                                        width: `${Math.min(
                                            stats.totalUsers > 0
                                                ? (stats.totalSkills / stats.totalUsers) * 10
                                                : 0,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-[#7f849c] mt-1">
                                {stats.totalSkills} skills tracked
                            </p>
                        </div>

                        {/* Avg sessions */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600 dark:text-[#a6adc8]">Avg Sessions / User</span>
                                <span className="text-sm font-bold text-green-600">
                  {stats.totalUsers > 0
                      ? (stats.totalSessions / stats.totalUsers).toFixed(1)
                      : '—'}
                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="bg-green-500 h-2.5 rounded-full transition-all duration-700"
                                    style={{
                                        width: `${Math.min(
                                            stats.totalUsers > 0
                                                ? (stats.totalSessions / stats.totalUsers) * 5
                                                : 0,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-[#7f849c] mt-1">
                                {stats.totalSessions} sessions logged
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* ── Recent Users ───────────────────────────────────────────────── */}
            <Section
                title="Recent Users"
                description="Latest accounts created on the platform"
                action={
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate && onNavigate('admin/users')}
                    >
                        View all users →
                    </Button>
                }
            >
                {/* Error */}
                {usersError && (
                    <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-700 dark:text-red-400 flex-1">{usersError}</p>
                        <Button variant="ghost" size="sm" onClick={loadRecentUsers}>Retry</Button>
                    </div>
                )}

                {/* Loading skeleton */}
                {usersLoading && !usersError && (
                    <Card className="overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 px-6 py-4 animate-pulse">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-100 rounded w-40" />
                                        <div className="h-3 bg-gray-100 rounded w-56" />
                                    </div>
                                    <div className="h-5 bg-gray-100 rounded-full w-14" />
                                    <div className="h-3 bg-gray-100 rounded w-20" />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Empty */}
                {!usersLoading && !usersError && recentUsers.length === 0 && (
                    <Card className="p-12">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Users className="w-7 h-7 text-gray-300" />
                            </div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-[#cdd6f4]">No users yet</p>
                            <p className="text-xs text-gray-400 dark:text-[#7f849c] mt-1">Users will appear here once they register.</p>
                        </div>
                    </Card>
                )}

                {/* Data table */}
                {!usersLoading && !usersError && recentUsers.length > 0 && (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-[#181825] border-b border-gray-200 dark:border-[#313244]">
                                <tr>
                                    {['User', 'Role', 'Skills', 'Sessions', 'Joined'].map((h) => (
                                        <th
                                            key={h}
                                            className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-[#a6adc8] uppercase tracking-wider"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#313244] bg-white dark:bg-[#0f0f1b]">
                                {recentUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* User cell */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                    {user.name?.[0]?.toUpperCase() ?? '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] truncate">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-[#7f849c] truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <RoleBadge role={user.role} />
                                        </td>

                                        {/* Skills */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-1.5 text-sm text-gray-700 dark:text-[#cdd6f4]">
                                                <Layers className="w-3.5 h-3.5 text-gray-400 dark:text-[#7f849c]" />
                                                <span className="font-medium">{user.totalSkills ?? 0}</span>
                                            </div>
                                        </td>

                                        {/* Sessions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-1.5 text-sm text-gray-700 dark:text-[#cdd6f4]">
                                                <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-[#7f849c]" />
                                                <span className="font-medium">{user.totalSessions ?? 0}</span>
                                            </div>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#7f849c]">
                                            {formatDate(user.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </Section>
        </div>
    );
};

export default AdminDashboard;