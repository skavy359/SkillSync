import React, { useState, useEffect } from 'react';

// ── User App ─────────────────────────────────────────────────────────────────
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Categories from './pages/Categories';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// ── Auth ─────────────────────────────────────────────────────────────────────
import Login from './pages/Login';
import Register from './pages/Register';

// ── Admin ─────────────────────────────────────────────────────────────────────
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

// ─────────────────────────────────────────────────────────────────────────────

function App() {
    // Auth state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authPage, setAuthPage] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);

    // User app routing
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedSkillId, setSelectedSkillId] = useState(null);

    // Admin routing
    const [adminPage, setAdminPage] = useState('admin');

    // ── Check for existing session on mount ─────────────────────────────
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Token exists - try to restore session
            // You can either:
            // A) Decode JWT to get user info
            // B) Call /api/profile to get current user
            // For now, we'll just mark as authenticated
            setIsAuthenticated(true);
            // TODO: Fetch user profile here
        }
    }, []);

    // ── Handlers ───────────────────────────────────────────────────────────
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
                return <Categories />;
            case 'goals':
                return <Goals />;
            case 'analytics':
                return <Analytics />;
            case 'profile':
                return <Profile />;
            default:
                return <Dashboard onNavigate={setCurrentPage} onSelectSkill={setSelectedSkillId} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar onLogout={handleLogout} />
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