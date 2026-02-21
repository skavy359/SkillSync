import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Goals from './pages/Goals';
import Sessions from './pages/Sessions';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import { getMyProfile } from './services/profileService';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authPage, setAuthPage] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [adminPage, setAdminPage] = useState('admin');
    const [showCategoryDeleteSuccess, setShowCategoryDeleteSuccess] = useState(false);

    // Apply saved theme on app mount
    useEffect(() => {
        const saved = localStorage.getItem('theme') || 'system';
        const applyTheme = (isDark) => {
            if (isDark) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        };
        if (saved === 'dark') applyTheme(true);
        else if (saved === 'light') applyTheme(false);
        else {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(mq.matches);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            // Fetch user profile so Topbar has name/email
            getMyProfile()
                .then((profile) => {
                    setCurrentUser({
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        role: profile.role,
                    });
                })
                .catch(() => {
                    // Token invalid — force logout
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                });
        }
    }, []);

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);

        // Route based on role
        if (userData?.role === 'ADMIN') {
            setAdminPage('admin');
        } else {
            setCurrentPage('dashboard');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setAuthPage('login');
    };

    const handleAdminNavigate = (page) => {
        setAdminPage(page);
    };

    // ── Not authenticated → show Login / Register ──────────────────────────
    if (!isAuthenticated) {
        if (authPage === 'register') {
            return <Register onNavigate={setAuthPage} onLogin={handleLogin} />;
        }
        return <Login onNavigate={setAuthPage} onLogin={handleLogin} />;
    }

    // ── Admin panel (safe null check with optional chaining) ──────────────
    if (currentUser?.role === 'ADMIN' && adminPage.startsWith('admin')) {
        const renderAdminPage = () => {
            switch (adminPage) {
                case 'admin':
                    return <AdminDashboard onNavigate={handleAdminNavigate} />;
                case 'admin/users':
                    return <AdminUsers />;
                default:
                    return <AdminDashboard onNavigate={handleAdminNavigate} />;
            }
        };

        return (
            <AdminLayout
                currentPage={adminPage}
                onNavigate={handleAdminNavigate}
                onLogout={handleLogout}
            >
                {renderAdminPage()}
            </AdminLayout>
        );
    }

    // ── Regular user app ──────────────────────────────────────────────────
    const renderUserPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onNavigate={setCurrentPage} onSelectSkill={setSelectedSkillId} />;
            case 'skills':
                return <Skills onNavigate={setCurrentPage} onSelectSkill={setSelectedSkillId} />;
            case 'skill-detail':
                return <SkillDetail skillId={selectedSkillId} onNavigate={setCurrentPage} />;
            case 'categories':
                return <Categories onNavigate={setCurrentPage} onSelectCategory={setSelectedCategoryId} onShowDeleteSuccess={showCategoryDeleteSuccess} onDismissDeleteSuccess={() => setShowCategoryDeleteSuccess(false)} />;
            case 'category-detail':
                return <CategoryDetail categoryId={selectedCategoryId} onNavigate={setCurrentPage} onSelectSkill={setSelectedSkillId} onCategoryDeleted={() => {
                    setShowCategoryDeleteSuccess(true);
                    setCurrentPage('categories');
                }} />;
            case 'goals':
                return <Goals />;
            case 'sessions':
                return <Sessions onNavigate={setCurrentPage} />;
            case 'analytics':
                return <Analytics />;
            case 'notifications':
                return <Notifications />;
            case 'profile':
                return <Profile />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard onNavigate={setCurrentPage} onSelectSkill={setSelectedSkillId} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#11111b]">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onLogout={handleLogout} currentUser={currentUser} onNavigate={setCurrentPage} onSelectSkill={setSelectedSkillId} />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {renderUserPage()}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;