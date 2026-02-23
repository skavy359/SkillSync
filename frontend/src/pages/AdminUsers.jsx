import React, { useEffect, useState, useCallback, useRef } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Section from '../components/ui/Section';
import {
    getUsers,
    updateUserRole,
    deleteUser,
    getUserSkills,
} from '../services/adminService';
import {
    Search,
    Trash2,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Loader2,
    RefreshCw,
    Users,
    ShieldCheck,
    Filter,
    Clock,
    Layers,
    MoreHorizontal,
    X,
    Mail,
    CalendarDays,
    Check,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

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

// Debounce helper
function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminUsers = () => {
    // ── List state ──────────────────────────────────────────────────────────
    const [users, setUsers]             = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages]   = useState(0);
    const [page, setPage]               = useState(0);
    const PAGE_SIZE = 10;

    // ── Filter state ────────────────────────────────────────────────────────
    const [search, setSearch]     = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const debouncedSearch = useDebounce(search, 400);

    // ── Loading / error ─────────────────────────────────────────────────────
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState(null);

    // ── User detail modal ───────────────────────────────────────────────────
    const [detailModal, setDetailModal] = useState({ open: false, user: null });
    const [userSkills, setUserSkills] = useState([]);
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [skillsError, setSkillsError] = useState(null);

    // ── Delete modal ────────────────────────────────────────────────────────
    const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError]     = useState(null);

    // ── Role change state ───────────────────────────────────────────────────
    const [roleChanging, setRoleChanging] = useState({});
    const [roleError, setRoleError]       = useState(null);

    // ── Success message ─────────────────────────────────────────────────────
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Show success message helper
    const showSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 4000);
    };

    // Load user skills for detail modal
    const openUserDetail = useCallback(async (user) => {
        setDetailModal({ open: true, user });
        setSkillsLoading(true);
        setSkillsError(null);
        setUserSkills([]);
        try {
            const skills = await getUserSkills(user.id);
            setUserSkills(skills ?? []);
        } catch (err) {
            setSkillsError(
                err?.response?.data?.message ?? 'Failed to load user skills.'
            );
        } finally {
            setSkillsLoading(false);
        }
    }, []);

    // ── Fetch ────────────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async (opts = {}) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getUsers({
                page: opts.page ?? page,
                size: PAGE_SIZE,
                role: opts.roleFilter ?? roleFilter,
                search: opts.search ?? debouncedSearch,
            });
            // Sort users: admins first, then users
            const sortedUsers = (result?.content ?? []).sort((a, b) => {
                if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
                if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
                return 0;
            });
            setUsers(sortedUsers);
            setTotalElements(result?.totalElements ?? 0);
            setTotalPages(result?.totalPages ?? 0);
        } catch (err) {
            setError(err?.response?.data?.message ?? 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    }, [page, roleFilter, debouncedSearch]);

    // Refetch when page, role filter, or debounced search changes
    useEffect(() => {
        fetchUsers({ page, roleFilter, search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, roleFilter, debouncedSearch]);

    // Reset to page 0 when filters change
    useEffect(() => {
        setPage(0);
    }, [debouncedSearch, roleFilter]);

    // ── Role change handler ──────────────────────────────────────────────────
    const handleRoleChange = async (user, newRole) => {
        if (newRole === user.role) return;
        setRoleChanging((prev) => ({ ...prev, [user.id]: true }));
        setRoleError(null);
        try {
            await updateUserRole(user.id, newRole);
            // Optimistic update in list
            const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u));
            // Re-sort after update
            const sortedUsers = updatedUsers.sort((a, b) => {
                if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
                if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
                return 0;
            });
            setUsers(sortedUsers);
            // Update detail modal if open and refetch skills
            if (detailModal.user?.id === user.id) {
                const updatedUser = { ...detailModal.user, role: newRole };
                setDetailModal((prev) => ({
                    ...prev,
                    user: updatedUser
                }));
                // Refetch skills to show fresh data
                setSkillsLoading(true);
                try {
                    const skills = await getUserSkills(user.id);
                    setUserSkills(skills ?? []);
                } catch {
                    // Skills fetch error - not critical
                } finally {
                    setSkillsLoading(false);
                }
            }
            showSuccess(`${user.name} role changed to ${newRole}`);
        } catch (err) {
            setRoleError(
                err?.response?.data?.message ?? `Failed to update role for ${user.name}.`
            );
        } finally {
            setRoleChanging((prev) => ({ ...prev, [user.id]: false }));
        }
    };

    // ── Delete handler ───────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteModal.user) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            await deleteUser(deleteModal.user.id);
            // Remove from list immediately
            setUsers((prev) => prev.filter((u) => u.id !== deleteModal.user.id));
            setTotalElements((prev) => Math.max(0, prev - 1));
            setDeleteModal({ open: false, user: null });
            setDetailModal({ open: false, user: null });
            showSuccess(`${deleteModal.user.name} has been deleted`);
        } catch (err) {
            setDeleteError(
                err?.response?.data?.message ?? 'Failed to delete user. Please try again.'
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    // ── Pagination helpers ───────────────────────────────────────────────────
    const from = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
    const to   = Math.min((page + 1) * PAGE_SIZE, totalElements);

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Success Message ────────────────────────────────────────────── */}
            {showSuccessMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              Admin Panel
            </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-[#cdd6f4]">User Management</h1>
                    <p className="text-gray-500 dark:text-[#7f849c] mt-1">
                        {totalElements > 0
                            ? `${totalElements.toLocaleString()} registered users`
                            : 'Manage all platform users'}
                    </p>
                </div>
                <Button
                    variant="secondary"
                    icon={RefreshCw}
                    onClick={() => fetchUsers()}
                    disabled={loading}
                >
                    Refresh
                </Button>
            </div>

            {/* ── Role error toast ─────────────────────────────────────────── */}
            {roleError && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400 flex-1">{roleError}</p>
                    <button
                        onClick={() => setRoleError(null)}
                        className="text-red-400 hover:text-red-600 text-lg leading-none"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* ── Search + Filter bar ──────────────────────────────────────── */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-sm text-gray-900 dark:text-[#cdd6f4] placeholder-gray-400 dark:placeholder-[#7f849c] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Role filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="pl-9 pr-8 py-2.5 bg-gray-50 dark:bg-[#181825] border border-gray-200 dark:border-[#313244] rounded-xl text-sm text-gray-700 dark:text-[#cdd6f4] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            <option value="">All Roles</option>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* ── Fetch Error ──────────────────────────────────────────────── */}
            {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400 flex-1">{error}</p>
                    <Button variant="ghost" size="sm" onClick={() => fetchUsers()}>
                        Retry
                    </Button>
                </div>
            )}

            {/* ── Table ────────────────────────────────────────────────────── */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Head */}
                        <thead className="bg-gray-50 dark:bg-[#181825] border-b border-gray-200 dark:border-[#313244]">
                        <tr>
                            {['User', 'Role', 'Joined', 'Skills', 'Sessions', 'Actions'].map(
                                (h, i) => (
                                    <th
                                        key={h}
                                        className={`px-6 py-3 text-xs font-semibold text-gray-500 dark:text-[#a6adc8] uppercase tracking-wider ${
                                            i === 5 ? 'text-right' : 'text-left'
                                        }`}
                                    >
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                        </thead>

                        {/* Body */}
                        <tbody className="divide-y divide-gray-100 dark:divide-[#313244] bg-white dark:bg-[#0f0f1b]">
                        {/* Loading skeleton */}
                        {loading &&
                            Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 bg-gray-100 rounded-full" />
                                            <div className="space-y-1.5">
                                                <div className="h-3 bg-gray-100 rounded w-28" />
                                                <div className="h-2.5 bg-gray-100 rounded w-40" />
                                            </div>
                                        </div>
                                    </td>
                                    {[...Array(4)].map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-3 bg-gray-100 rounded w-16" />
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end space-x-2">
                                            <div className="h-7 w-20 bg-gray-100 rounded-lg" />
                                            <div className="h-7 w-16 bg-gray-100 rounded-lg" />
                                            <div className="h-7 w-7 bg-gray-100 rounded-lg" />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                        {/* Empty state */}
                        {!loading && !error && users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-16">
                                    <div className="text-center">
                                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Users className="w-7 h-7 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-[#cdd6f4]">
                                            No users found
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Try adjusting your search or filters
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Data rows */}
                        {!loading &&
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    onClick={() => openUserDetail(user)}
                                    className="hover:bg-gray-50 dark:hover:bg-[#181825] transition-colors cursor-pointer"
                                >
                                    {/* User */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                {user.name?.[0]?.toUpperCase() ?? '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] truncate max-w-[160px]">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate max-w-[160px]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Role — inline dropdown */}
                                    <td className="px-6 py-4">
                                        <div className="relative inline-flex items-center">
                                            {roleChanging[user.id] ? (
                                                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                            ) : (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                                    className={`
                              text-xs font-semibold rounded-full px-2 py-0.5 cursor-pointer
                              appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500
                              transition-colors
                              ${user.role === 'ADMIN'
                                                        ? 'bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400'
                                                        : 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400'
                                                    }
                            `}
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            )}
                                        </div>
                                    </td>

                                    {/* Joined */}
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-[#7f849c] whitespace-nowrap">
                                        {formatDate(user.createdAt)}
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

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openUserDetail(user);
                                                }}
                                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                                            >
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>View Details</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination footer ─────────────────────────────────────── */}
                {!loading && !error && totalElements > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#313244] bg-gray-50 dark:bg-[#181825]">
                        <p className="text-sm text-gray-500 dark:text-[#7f849c]">
                            Showing <span className="font-medium text-gray-900 dark:text-[#cdd6f4]">{from}–{to}</span> of{' '}
                            <span className="font-medium text-gray-900 dark:text-[#cdd6f4]">{totalElements.toLocaleString()}</span> users
                        </p>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 rounded-lg border border-gray-200 dark:border-[#313244] text-gray-500 dark:text-[#7f849c] hover:bg-gray-100 dark:hover:bg-[#313244] hover:text-gray-900 dark:hover:text-[#cdd6f4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page numbers — show at most 5 around current */}
                            {Array.from({ length: totalPages }, (_, i) => i)
                                .filter((i) => Math.abs(i - page) <= 2)
                                .map((i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                            i === page
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-gray-600 dark:text-[#a6adc8] hover:bg-gray-50 dark:hover:bg-[#313244] border border-gray-200 dark:border-[#313244]'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-lg border border-gray-200 dark:border-[#313244] text-gray-500 dark:text-[#7f849c] hover:bg-gray-100 dark:hover:bg-[#313244] hover:text-gray-900 dark:hover:text-[#cdd6f4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* ── User Detail Modal ──────────────────────────────────────────── */}
            <Modal
                isOpen={detailModal.open}
                onClose={() => setDetailModal({ open: false, user: null })}
                title={
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {detailModal.user?.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <p className="text-base font-semibold">{detailModal.user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-[#7f849c]">{detailModal.user?.email}</p>
                        </div>
                    </div>
                }
                size="lg"
                footer={
                    <div className="flex items-center justify-between">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteModal({ open: true, user: detailModal.user })}
                            disabled={skillsLoading}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete User
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setDetailModal({ open: false, user: null })}
                        >
                            Close
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6">
                    {/* User Info Card */}
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* User Email */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium uppercase tracking-wider">Email</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] mt-1 break-all">{detailModal.user?.email}</p>
                            </div>
                            {/* Joined Date */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium uppercase tracking-wider">Joined</p>
                                <div className="flex items-center space-x-1.5 mt-1">
                                    <CalendarDays className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">
                                        {detailModal.user?.createdAt ? new Date(detailModal.user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                            </div>
                            {/* Total Skills */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium uppercase tracking-wider">Skills</p>
                                <div className="flex items-center space-x-1.5 mt-1">
                                    <Layers className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{detailModal.user?.totalSkills ?? 0}</p>
                                </div>
                            </div>
                            {/* Total Sessions */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-[#a6adc8] font-medium uppercase tracking-wider">Sessions</p>
                                <div className="flex items-center space-x-1.5 mt-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">{detailModal.user?.totalSessions ?? 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role Management */}
                    <div className="p-4 bg-gray-50 dark:bg-[#181825] rounded-xl border border-gray-200 dark:border-[#313244]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">User Role</p>
                                <p className="text-xs text-gray-500 dark:text-[#7f849c] mt-1">Assign admin or user privileges</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                {roleChanging[detailModal.user?.id] && (
                                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                )}
                                <select
                                    value={detailModal.user?.role ?? 'USER'}
                                    onChange={(e) => handleRoleChange(detailModal.user, e.target.value)}
                                    disabled={roleChanging[detailModal.user?.id]}
                                    className="px-3 py-2 text-sm font-semibold rounded-lg border border-gray-200 dark:border-[#313244] bg-white dark:bg-[#0f0f1b] text-gray-900 dark:text-[#cdd6f4] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4]">Skills ({userSkills.length})</h3>
                        </div>

                        {/* Loading */}
                        {skillsLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                            </div>
                        )}

                        {/* Error */}
                        {!skillsLoading && skillsError && (
                            <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-400">{skillsError}</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!skillsLoading && !skillsError && userSkills.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Layers className="w-8 h-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500 dark:text-[#7f849c]">No skills yet</p>
                            </div>
                        )}

                        {/* Skills List */}
                        {!skillsLoading && !skillsError && userSkills.length > 0 && (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {userSkills.map((skill) => (
                                    <div key={skill.id} className="p-3 bg-gray-50 dark:bg-[#181825] rounded-lg border border-gray-200 dark:border-[#313244]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-[#cdd6f4]">{skill.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-[#7f849c]">{skill.category?.name || 'Uncategorized'}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant={skill.status === 'completed' ? 'success' : skill.status === 'active' ? 'primary' : 'default'} size="sm">
                                                    {skill.status}
                                                </Badge>
                                                <span className="text-xs font-semibold text-gray-600 dark:text-[#a6adc8]">{skill.progress ?? 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* ── Delete Confirmation Modal ────────────────────────────────── */}
            <Modal
                isOpen={deleteModal.open}
                onClose={() => {
                    if (!deleteLoading) {
                        setDeleteModal({ open: false, user: null });
                        setDeleteError(null);
                    }
                }}
                title="Delete User"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setDeleteModal({ open: false, user: null });
                                setDeleteError(null);
                            }}
                            disabled={deleteLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteConfirm}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting…
                </span>
                            ) : (
                                'Yes, delete'
                            )}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    {/* Warning icon */}
                    <div className="flex justify-center">
                        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <Trash2 className="w-7 h-7 text-red-500 dark:text-red-400" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center">
                        <p className="text-sm text-gray-700 dark:text-[#cdd6f4]">
                            Are you sure you want to permanently delete{' '}
                            <span className="font-semibold text-gray-900 dark:text-[#cdd6f4]">
                {deleteModal.user?.name}
              </span>
                            ? This will remove all their skills, sessions, and data.
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-2">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Inline error */}
                    {deleteError && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                            <p className="text-xs text-red-700 dark:text-red-400">{deleteError}</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;