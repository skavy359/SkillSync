import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Categories from './pages/Categories';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [selectedSkillId, setSelectedSkillId] = useState(null);

    const renderPage = () => {
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
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;