export const skills = [
    {
        id: 1,
        name: 'React.js',
        level: 'Intermediate',
        progress: 65,
        status: 'active',
        category: 'Frontend Development',
        totalHours: 45,
        lastPracticed: '2 days ago',
        description: 'Modern JavaScript library for building user interfaces',
        sessions: [
            { id: 1, date: '2024-02-14', duration: 120, notes: 'Learned React hooks in depth' },
            { id: 2, date: '2024-02-12', duration: 90, notes: 'Built a todo app with context API' },
            { id: 3, date: '2024-02-10', duration: 150, notes: 'Component lifecycle and useEffect' },
        ]
    },
    {
        id: 2,
        name: 'TypeScript',
        level: 'Beginner',
        progress: 35,
        status: 'active',
        category: 'Programming Languages',
        totalHours: 28,
        lastPracticed: '1 day ago',
        description: 'Typed superset of JavaScript',
        sessions: [
            { id: 4, date: '2024-02-15', duration: 60, notes: 'Type annotations and interfaces' },
            { id: 5, date: '2024-02-13', duration: 90, notes: 'Generics and utility types' },
        ]
    },
    {
        id: 3,
        name: 'Node.js',
        level: 'Advanced',
        progress: 80,
        status: 'active',
        category: 'Backend Development',
        totalHours: 120,
        lastPracticed: '3 days ago',
        description: 'JavaScript runtime for server-side development',
        sessions: [
            { id: 6, date: '2024-02-13', duration: 180, notes: 'Built REST API with Express' },
            { id: 7, date: '2024-02-09', duration: 120, notes: 'Database integration with MongoDB' },
        ]
    },
    {
        id: 4,
        name: 'Python',
        level: 'Expert',
        progress: 95,
        status: 'completed',
        category: 'Programming Languages',
        totalHours: 200,
        lastPracticed: '1 week ago',
        description: 'High-level programming language',
        sessions: [
            { id: 8, date: '2024-02-08', duration: 90, notes: 'Advanced decorators and metaclasses' },
        ]
    },
    {
        id: 5,
        name: 'Figma',
        level: 'Intermediate',
        progress: 55,
        status: 'active',
        category: 'Design',
        totalHours: 38,
        lastPracticed: '5 days ago',
        description: 'Collaborative interface design tool',
        sessions: [
            { id: 9, date: '2024-02-11', duration: 120, notes: 'Auto-layout and component variants' },
        ]
    },
    {
        id: 6,
        name: 'Docker',
        level: 'Beginner',
        progress: 25,
        status: 'paused',
        category: 'DevOps',
        totalHours: 15,
        lastPracticed: '2 weeks ago',
        description: 'Container platform for applications',
        sessions: [
            { id: 10, date: '2024-02-01', duration: 90, notes: 'Docker basics and containerization' },
        ]
    }
];

export const categories = [
    {
        id: 1,
        name: 'Frontend Development',
        skillCount: 3,
        totalMinutes: 4920,
        color: 'indigo',
        description: 'Building user interfaces and web applications'
    },
    {
        id: 2,
        name: 'Backend Development',
        skillCount: 2,
        totalMinutes: 7200,
        color: 'blue',
        description: 'Server-side development and APIs'
    },
    {
        id: 3,
        name: 'Programming Languages',
        skillCount: 4,
        totalMinutes: 13680,
        color: 'purple',
        description: 'Core programming languages and paradigms'
    },
    {
        id: 4,
        name: 'Design',
        skillCount: 2,
        totalMinutes: 2280,
        color: 'yellow',
        description: 'UI/UX design and visual design tools'
    },
    {
        id: 5,
        name: 'DevOps',
        skillCount: 1,
        totalMinutes: 900,
        color: 'green',
        description: 'Deployment, containers, and infrastructure'
    }
];

export const goals = [
    {
        id: 1,
        title: 'Master React Ecosystem',
        description: 'Become proficient in React, Redux, and Next.js',
        targetHours: 100,
        currentHours: 45,
        deadline: '2024-06-30',
        status: 'in_progress',
        priority: 'high'
    },
    {
        id: 2,
        title: 'Build Full-Stack Portfolio',
        description: 'Create 3 complete full-stack applications',
        targetHours: 150,
        currentHours: 78,
        deadline: '2024-08-31',
        status: 'in_progress',
        priority: 'high'
    },
    {
        id: 3,
        title: 'Learn Cloud Technologies',
        description: 'Get familiar with AWS and cloud deployment',
        targetHours: 60,
        currentHours: 12,
        deadline: '2024-09-30',
        status: 'in_progress',
        priority: 'medium'
    },
    {
        id: 4,
        title: 'Complete TypeScript Course',
        description: 'Finish advanced TypeScript course on Udemy',
        targetHours: 40,
        currentHours: 28,
        deadline: '2024-04-30',
        status: 'in_progress',
        priority: 'high'
    }
];

export const userProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Software Developer',
    avatar: 'JD',
    joinedDate: '2023-11-15',
    stats: {
        totalSkills: 6,
        activeSkills: 4,
        completedSkills: 1,
        totalSessions: 124,
        totalHours: 446,
        currentStreak: 12,
        longestStreak: 28
    }
};

export const dashboardStats = {
    totalSkills: 6,
    activeSkills: 4,
    currentStreak: 12,
    weeklyMinutes: 780,
    burnoutRisk: 'low',
    velocity: 'steady',
    weeklyGoal: 20,
    weeklyProgress: 13
};