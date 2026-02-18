# SkillSync - Learning Analytics Platform

A modern, professional SaaS-style learning analytics platform built with React and TailwindCSS. Track your skills, log learning sessions, monitor progress, and analyze your learning patterns.

## ✨ Features

### Core Features
- 📊 **Dashboard** - Overview of your learning progress and statistics
- 💡 **Skills Management** - Track and organize your learning skills
- 📁 **Categories** - Group skills into organized categories
- 🎯 **Goals** - Set and track learning goals with deadlines
- 📈 **Analytics** - Detailed insights into your learning patterns
- 👤 **Profile** - Personal achievements and settings

### Key Capabilities
- Real-time progress tracking with visual progress bars
- Burnout risk detection and health monitoring
- Learning streak tracking
- Session logging with notes
- Category-based organization
- Goal progress visualization
- Achievement system
- Responsive design for all devices

## 🎨 Design System

### UI/UX Principles
- **Clean & Minimal** - Inspired by Notion, Linear, and Vercel
- **Professional SaaS Grade** - Production-ready aesthetics
- **Consistent Components** - Reusable UI component library
- **Smooth Interactions** - Hover states and transitions
- **Responsive Layout** - Mobile-first design

### Color Palette
- **Primary**: Indigo/Blue (#4F46E5)
- **Background**: Gray-50 (#F9FAFB)
- **Cards**: White with subtle shadows
- **Accents**: Green, Yellow, Purple for status indicators

## 🛠️ Tech Stack

- **React 18** - Modern functional components with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
skillsync/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   ├── Topbar.jsx           # Top navigation bar
│   │   ├── SkillCard.jsx        # Skill display card
│   │   └── ui/
│   │       ├── Card.jsx         # Reusable card container
│   │       ├── Button.jsx       # Button component
│   │       ├── Badge.jsx        # Status badges
│   │       ├── Modal.jsx        # Modal dialog
│   │       ├── ProgressBar.jsx  # Progress visualization
│   │       └── StatCard.jsx     # Statistic card
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main dashboard page
│   │   ├── Skills.jsx           # Skills list page
│   │   ├── SkillDetail.jsx      # Individual skill page
│   │   ├── Categories.jsx       # Categories page
│   │   ├── Goals.jsx            # Goals tracking page
│   │   ├── Analytics.jsx        # Analytics page
│   │   └── Profile.jsx          # User profile page
│   ├── data/
│   │   └── dummyData.js         # Mock data
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```
## 📱 Pages Overview

### Dashboard
- Summary statistics cards
- Recent skills and sessions
- Burnout risk indicator
- Quick actions

### Skills
- Grid view of all skills
- Filter by status (active, completed, paused)
- Search functionality
- Add/edit skills modal

### Skill Detail
- Detailed skill information
- Progress tracking
- Session history
- Add session functionality

### Categories
- Category overview with stats
- Skills per category
- Total learning time
- Activity indicators

### Goals
- Goal cards with progress bars
- Priority indicators
- Deadline tracking
- Goal creation modal

### Analytics
- Burnout analysis
- Weekly activity chart
- Category distribution
- Learning insights and recommendations

### Profile
- User information
- Learning statistics
- Achievements showcase
- Settings and preferences

## 📊 Features in Detail

### Skill Tracking
- Multiple skill levels (Beginner, Intermediate, Advanced, Expert)
- Progress percentage tracking
- Category assignment
- Status management (Active, Completed, Paused)

### Session Logging
- Duration tracking
- Date recording
- Session notes
- Historical view

### Analytics
- Burnout risk calculation
- Learning velocity tracking
- Consistency metrics
- Weekly activity visualization

### Goal Management
- Target hour setting
- Deadline tracking
- Priority levels
- Progress visualization

## 📄 License

This project is open source and available for personal and commercial use.

## 👨‍💻 Author
Built with ❤️ as a modern SaaS learning platform showcase.

---

**SkillSync** - Master your skills, track your progress, achieve your goals.