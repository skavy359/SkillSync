import React, { useState } from 'react';
import {
    Lightbulb,
    LayoutDashboard,
    Users,
    LogOut,
    ChevronDown,
    ShieldCheck,
    Menu,
    X,
    FileText,
    Settings,
    BarChart3,
    Lock,
    Bell,
} from 'lucide-react';

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    {
        id: 'admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        id: 'admin/users',
        label: 'Users',
        icon: Users,
    },
    {
        id: 'admin/accounts',
        label: 'Accounts',
        icon: Lock,
    },
    {
        id: 'admin/audit-logs',
        label: 'Audit Logs',
        icon: FileText,
    },
    {
        id: 'admin/analytics',
        label: 'Analytics',
        icon: BarChart3,
    },
    {
        id: 'admin/notifications',
        label: 'Notifications',
        icon: Bell,
    },
    {
        id: 'admin/settings',
        label: 'Settings',
        icon: Settings,
    },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const AdminSidebar = ({ currentPage, onNavigate, onLogout, mobileOpen, onMobileClose }) => {
    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-40 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-[#1e1e2e] border-r border-gray-200 dark:border-[#313244] flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 dark:border-[#313244]">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="text-gray-900 dark:text-[#cdd6f4] font-bold text-base">SkillSync</span>
                            <div className="flex items-center space-x-1 mt-0.5">
                                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                                <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  Admin
                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden text-gray-500 dark:text-[#7f849c] hover:text-gray-900 dark:hover:text-[#cdd6f4] p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onNavigate(item.id);
                                    onMobileClose();
                                }}
                                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all text-left
                  ${active
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-[#a6adc8] hover:text-gray-900 dark:hover:text-[#cdd6f4] hover:bg-gray-100 dark:hover:bg-[#313244]'
                                }
                `}
                            >
                                <Icon className="w-4.5 h-4.5 flex-shrink-0 w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom — logout */}
                <div className="px-3 pb-4 border-t border-gray-200 dark:border-[#313244] pt-4">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-[#a6adc8] hover:text-gray-900 dark:hover:text-[#cdd6f4] hover:bg-gray-100 dark:hover:bg-[#313244] transition-all"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

// ─── Topbar ───────────────────────────────────────────────────────────────────
const AdminTopbar = ({ onMobileMenuOpen }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="h-14 bg-white dark:bg-[#1e1e2e] border-b border-gray-200 dark:border-[#313244] flex items-center justify-between px-5 flex-shrink-0">
            {/* Mobile menu button */}
            <button
                onClick={onMobileMenuOpen}
                className="lg:hidden p-2 text-gray-500 dark:text-[#7f849c] hover:text-gray-700 dark:hover:text-[#cdd6f4] hover:bg-gray-100 dark:hover:bg-[#313244] rounded-lg transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Admin badge */}
            <div className="hidden lg:flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-[#cdd6f4]">Admin Panel</span>
            </div>

            {/* User dropdown */}
            <div className="relative ml-auto">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2.5 hover:bg-gray-100 dark:hover:bg-[#313244] rounded-xl px-3 py-1.5 transition-colors"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        A
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-800 dark:text-[#cdd6f4]">
            Admin
          </span>
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 dark:text-[#7f849c] transition-transform duration-200 ${
                            dropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                </button>

                {dropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1e1e2e] border border-gray-200 dark:border-[#313244] rounded-xl shadow-lg z-20 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#313244]">
                                <p className="text-xs font-semibold text-gray-500 dark:text-[#7f849c] uppercase tracking-wider">
                                    Signed in as
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-[#cdd6f4] mt-0.5">Administrator</p>
                            </div>
                            <div className="p-1.5">
                                <button
                                    onClick={() => setDropdownOpen(false)}
                                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

// ─── Layout wrapper ───────────────────────────────────────────────────────────
const AdminLayout = ({ children, currentPage, onNavigate, onLogout }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#11111b] overflow-hidden">
            <AdminSidebar
                currentPage={currentPage}
                onNavigate={onNavigate}
                onLogout={onLogout}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <AdminTopbar onMobileMenuOpen={() => setMobileOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-5 py-7">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;