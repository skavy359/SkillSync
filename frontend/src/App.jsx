import React, { useState, useEffect } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SplashScreen from './components/SplashScreen';
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
import Leaderboard from './pages/Leaderboard';
import SkillSharing from './pages/SkillSharing';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminAuditLogs from './pages/AdminAuditLogs';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminAccounts from './pages/AdminAccounts';
import AdminNotifications from './pages/AdminNotifications';
import { getMyProfile } from './services/profileService';

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authPage, setAuthPage] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [adminPage, setAdminPage] = useState('admin');
    const [showCategoryDeleteSuccess, setShowCategoryDeleteSuccess] = useState(false);

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
            getMyProfile()
                .then((profile) => {
                    setCurrentUser({
                        id: profile.id,
                        name: profile.name,
                        email: profile.email,
                        role: profile.role,
                    });
                    if (profile.role === 'ADMIN') {
                        setAdminPage('admin');
                    } else {
                        setCurrentPage('dashboard');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                });
        }
    }, []);

    const handleSplashComplete = () => {
        setShowSplash(false);
    };

    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setCurrentUser(userData);

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

    if (showSplash) {
        return <SplashScreen onComplete={handleSplashComplete} isAuthenticated={isAuthenticated} />;
    }

    if (!isAuthenticated) {
        if (authPage === 'register') {
            return (
                <>
                    <Register onNavigate={setAuthPage} onLogin={handleLogin} />
                    <VercelAnalytics />
                </>
            );
        }
        return (
            <>
                <Login onNavigate={setAuthPage} onLogin={handleLogin} />
                <VercelAnalytics />
            </>
        );
    }

    if (currentUser?.role === 'ADMIN' && adminPage.startsWith('admin')) {
        const renderAdminPage = () => {
            switch (adminPage) {
                case 'admin':
                    return <AdminDashboard onNavigate={handleAdminNavigate} />;
                case 'admin/users':
                    return <AdminUsers />;
                case 'admin/audit-logs':
                    return <AdminAuditLogs />;
                case 'admin/analytics':
                    return <AdminAnalytics />;
                case 'admin/accounts':
                    return <AdminAccounts />;
                case 'admin/notifications':
                    return <AdminNotifications />;
                default:
                    return <AdminDashboard onNavigate={handleAdminNavigate} />;
            }
        };

        return (
            <AdminLayout
                currentPage={adminPage}
                onNavigate={handleAdminNavigate}
                onLogout={handleLogout}
                adminName={currentUser?.name}
            >
                {renderAdminPage()}
                <VercelAnalytics />
            </AdminLayout>
        );
    }

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
            case 'leaderboard':
                return <Leaderboard />;
            case 'skill-sharing':
                return <SkillSharing />;
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
            <VercelAnalytics />
        </div>
    );
}

export default App;