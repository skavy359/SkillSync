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
} from '../services/adminService';
import UserSkillsModal from '../components/UserSkillsModal';
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

    // ── Skills modal ────────────────────────────────────────────────────────
    const [skillsModal, setSkillsModal] = useState({ open: false, user: null });

    // ── Delete modal ────────────────────────────────────────────────────────
    const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError]     = useState(null);

    // ── Role change ─────────────────────────────────────────────────────────
    const [roleChanging, setRoleChanging] = useState({}); // { [userId]: bool }
    const [roleError, setRoleError]       = useState(null);

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
            setUsers(result?.content ?? []);
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
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
            );
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

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">
              Admin Panel
            </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">
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
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 flex-1">{roleError}</p>
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
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Role filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 flex-1">{error}</p>
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
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {['User', 'Role', 'Joined', 'Skills', 'Sessions', 'Actions'].map(
                                (h, i) => (
                                    <th
                                        key={h}
                                        className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
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
                        <tbody className="divide-y divide-gray-100 bg-white">
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
                                        <p className="text-sm font-semibold text-gray-700">
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
                                    className="hover:bg-gray-50/70 transition-colors"
                                >
                                    {/* User */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                {user.name?.[0]?.toUpperCase() ?? '?'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
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
                              text-xs font-semibold rounded-full px-3 py-1 pr-6 border cursor-pointer
                              appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500
                              transition-colors
                              ${user.role === 'ADMIN'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
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
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {formatDate(user.createdAt)}
                                    </td>

                                    {/* Skills */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1.5 text-sm text-gray-700">
                                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="font-medium">{user.totalSkills ?? 0}</span>
                                        </div>
                                    </td>

                                    {/* Sessions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1.5 text-sm text-gray-700">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="font-medium">{user.totalSessions ?? 0}</span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            {/* View Skills */}
                                            <button
                                                onClick={() => setSkillsModal({ open: true, user })}
                                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
                                            >
                                                <BookOpen className="w-3.5 h-3.5" />
                                                <span>Skills</span>
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => setDeleteModal({ open: true, user })}
                                                className="inline-flex items-center justify-center w-8 h-8 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
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
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{from}–{to}</span> of{' '}
                            <span className="font-medium text-gray-900">{totalElements.toLocaleString()}</span> users
                        </p>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
                                                : 'text-gray-600 hover:bg-white border border-gray-200'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* ── User Skills Modal ────────────────────────────────────────── */}
            <UserSkillsModal
                isOpen={skillsModal.open}
                onClose={() => setSkillsModal({ open: false, user: null })}
                user={skillsModal.user}
            />

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
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="text-center">
                        <p className="text-sm text-gray-700">
                            Are you sure you want to permanently delete{' '}
                            <span className="font-semibold text-gray-900">
                {deleteModal.user?.name}
              </span>
                            ? This will remove all their skills, sessions, and data.
                        </p>
                        <p className="text-xs text-red-500 font-medium mt-2">
                            This action cannot be undone.
                        </p>
                    </div>

                    {/* Inline error */}
                    {deleteError && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-xs text-red-700">{deleteError}</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;