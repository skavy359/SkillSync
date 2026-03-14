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
    BarChart3,
    Bell,
    Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
    { id: 'admin', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin/users', label: 'Users', icon: Users },
    { id: 'admin/audit-logs', label: 'Audit Logs', icon: FileText },
    { id: 'admin/analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin/notifications', label: 'Notifications', icon: Bell },
];

const AdminSidebar = ({ currentPage, onNavigate, onLogout, mobileOpen, onMobileClose }) => {
    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={onMobileClose}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-[#181825]/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/5 flex flex-col
          transform transition-all duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]
          lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col px-6 py-8 border-b border-gray-200/50 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/30 transition-colors" />

                    <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                                <Lightbulb className="w-5 h-5 text-white" />
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight flex items-center gap-1">
                                    SkillSync <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                </h1>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                                        Command Center
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onMobileClose}
                            className="lg:hidden w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">Core Modules</p>
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
                                    relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl
                                    text-sm font-bold transition-all duration-300 overflow-hidden group
                                    ${active
                                        ? 'text-indigo-700 dark:text-indigo-300 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5'
                                    }
                                `}
                            >
                                {active && (
                                    <>
                                        <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full" />
                                    </>
                                )}
                                <Icon className={`relative z-10 w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="relative z-10">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="px-4 py-6 border-t border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-[#11111b]/30">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:shadow-sm transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Secure Logout</span>
                    </button>
                </div>
            </aside>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
};

const AdminTopbar = ({ onMobileMenuOpen, adminName, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const displayName = adminName || 'Admin';
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-[#11111b]/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuOpen}
                    className="lg:hidden w-10 h-10 rounded-xl bg-white dark:bg-[#181825] border border-gray-200 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm hover:shadow active:scale-95 transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-inner">
                    <ShieldCheck className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">System Privileges Active</span>
                </div>
            </div>

            <div className="relative">
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white dark:bg-[#181825] border border-gray-200/80 dark:border-white/10 rounded-full shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500 p-[2px]">
                        <div className="w-full h-full bg-white dark:bg-[#181825] rounded-full flex items-center justify-center">
                            <span className="text-xs font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-600">{initials}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-start hidden sm:flex">
                        <span className="text-xs font-bold text-gray-900 dark:text-white leading-none">{displayName}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Administrator</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                        <div className="absolute right-0 mt-3 w-56 bg-white/90 dark:bg-[#1e1e2e]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Authenticated As</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{adminName || 'Root Administrator'}</p>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Terminate Session</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

const AdminLayout = ({ children, currentPage, onNavigate, onLogout, adminName }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#0B0F19] overflow-hidden selection:bg-indigo-500/30">
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <AdminSidebar
                currentPage={currentPage}
                onNavigate={onNavigate}
                onLogout={onLogout}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 z-10 relative">
                <AdminTopbar onMobileMenuOpen={() => setMobileOpen(true)} adminName={adminName} onLogout={onLogout} />
                <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;