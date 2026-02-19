# SkillSync - Learning Analytics Platform

A modern, professional SaaS-style learning analytics platform built with React and TailwindCSS. Track your skills, log learning sessions, monitor progress, and analyze your learning patterns.

## ✨ Features

### Core Features
- 📊 **Dashboard** - Overview of learning progress with activity heatmap and quick actions
- 💡 **Skills Management** - Track and organize learning skills with multiple levels
- 🕐 **Sessions Tracking** - Comprehensive view of all learning sessions with search and statistics
- 📁 **Categories** - Group and organize skills by category with detailed stats
- 🎯 **Goals** - Set and track learning goals with priority levels and deadlines
- 📈 **Analytics** - Deep dive into learning patterns and burnout analysis
- 👤 **Profile** - Personal information and learning statistics
- ⚙️ **Settings** - Customize notifications, legal info, and account details
- 🛡️ **Admin Dashboard** - System administration and user management
- 🔐 **User Management** - Admin controls for managing platform users

### Dashboard Features
- Total skills overview (active and completed counts)
- Weekly activity heatmap with minute-level precision
- Recent sessions viewer with quick navigation
- Recent skills sorted by activity recency
- Quick-add new skill modal with category and description
- Session logging with date and duration tracking
- Real-time progress indicators

### Sessions Page
- Complete session history across all skills
- Advanced search and filtering capabilities
- Session statistics (total count, time spent, average duration)
- Sortable by date and skill
- Empty state handling

### Skills Management
- Multiple skill levels (Beginner, Intermediate, Advanced, Expert)
- Category assignment and filtering
- Status tracking (Active, Completed, Paused)
- Individual skill detail pages
- Session history per skill
- Progress percentage visualization

### Goals Tracking
- Priority level indicators
- Deadline management
- Progress bars with visual representation
- Goal creation and editing
- Target achievement visualization

### Analytics & Insights
- Burnout risk detection and health monitoring
- Weekly activity patterns with GitHub-style heatmap
- Category distribution analysis
- Learning velocity metrics
- Consistency and streak tracking
- Data-driven recommendations

### Admin Features
- User management and monitoring
- System statistics overview
- User activity tracking
- Account administration

### Additional Capabilities
- Real-time progress tracking with visual indicators
- Learning streak monitoring
- Session notes and documentation
- Responsive design for all devices
- Dark mode interface
- JWT authentication and secure sessions
- Role-based access control (User/Admin)

## 🎨 Design System

### UI/UX Principles
- **Clean & Modern** - Inspired by Linear, Vercel, and Notion
- **Professional SaaS Grade** - Production-ready aesthetics
- **Dark Mode First** - Optimized for dark theme with Catppuccin color palette
- **Consistent Components** - Reusable, composable UI component library
- **Smooth Interactions** - Hover states, transitions, and animations
- **Responsive & Accessible** - Mobile-first design that works across all devices

### Color Palette (Catppuccin Dark)
- **Background**: #1e1e2e (Dark base)
- **Surface**: #313244 (Card backgrounds)
- **Text**: #cdd6f4 (Primary text)
- **Accents**: Green, Yellow, Red for status indicators
- **Borders**: #45475a (Subtle separation)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern functional components with hooks
- **Vite 7.3** - Lightning-fast build tool and dev server
- **TailwindCSS 4.1** - Utility-first CSS framework
- **Lucide React** - Beautiful, consistent icon library
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

### Backend
- **Java 17** - Modern Java runtime
- **Spring Boot 4.0.2** - Enterprise application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Relational database
- **JWT** - Secure token-based authentication

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
- Summary statistics with active and completed skills
- Weekly activity heatmap showing minute-level progress
- Recent sessions with quick navigation to Sessions page
- Recent skills sorted by most recent activity
- Quick action buttons (Add New Skill, Log Session)
- Session logging modal with date and duration

### Skills
- Grid view of all skills with detailed cards
- Filter by status (Active, Completed, Paused)
- Search functionality
- Add new skill modal with category assignment
- View detailed skill information
- Session history per skill

### Skill Detail
- Individual skill progress tracking
- Session history and notes
- Add/edit skill information
- Category and level management

### Sessions
- Comprehensive view of all learning sessions
- Search and filter by skill name or notes
- Session statistics (total count, total time, average duration)
- Sortable by date
- Visual indication of session details

### Categories
- Category overview with learning statistics
- Skills per category display
- Total time invested per category
- Category-based organization and filtering

### Goals
- Goal cards with priority levels
- Deadline tracking and management
- Progress visualization with bars
- Goal creation and progress updates
- Achievement indicators

### Analytics
- Burnout risk analysis and health scoring
- Weekly activity chart with detailed patterns
- Category distribution visualization
- Learning insights and recommendations
- Velocity and consistency metrics

### Profile
- User information and statistics
- Learning achievements showcase
- Account details and preferences
- Personal learning journey overview

### Settings
- Notification preferences and management
- Legal information (Terms of Service, Privacy Policy)
- About section with version and license info
- Account preferences

### Admin Dashboard
- System statistics and overview
- User activity monitoring
- Platform metrics and analytics
- Administrative controls

### Admin Users
- User list and management
- User account administration
- Activity monitoring
- Role and permission management

## 📊 Features in Detail

### Dashboard Intelligence
- **Activity Heatmap** - GitHub-style visualization of weekly learning activity with minute-level precision
- **Smart Skill Sorting** - Recent skills displayed based on most recent session activity
- **Real-time Statistics** - Total skills count split between active and completed
- **Quick Actions** - Rapid access to add skills and log sessions without navigation
- **Session Modal** - Inline session logging with date selection and duration tracking

### Skill Tracking
- **Multiple Skill Levels** - Beginner, Intermediate, Advanced, Expert progression
- **Progress Percentage** - Visual tracking of learning completion
- **Category Assignment** - Organize skills by knowledge domain
- **Status Management** - Active, Completed, or Paused skill states
- **Session Integration** - Automatic progress updates from logged sessions

### Session Management
- **Comprehensive History** - View all learning sessions in one place
- **Advanced Search** - Filter sessions by skill, date, and notes
- **Session Statistics** - Total sessions, total time, and average duration per skill
- **Detailed Tracking** - Date, duration, and notes for each session
- **Session Navigation** - Quick access from dashboard and skill pages

### Analytics & Insights
- **Burnout Risk Calculation** - Smart algorithm detecting overwork and fatigue
- **Activity Patterns** - Visual representation of learning consistency
- **Weekly Heatmap** - Minute-by-minute breakdown of weekly progress
- **Category Analysis** - Distribution of learning time across skills and categories
- **Learning Velocity** - Metrics showing learning speed and consistency
- **Actionable Recommendations** - Insights based on learning patterns

### Goal Management
- **Target Setting** - Define learning objectives with hour targets
- **Deadline Tracking** - Set and monitor goal completion dates
- **Priority Levels** - Organize goals by importance
- **Progress Visualization** - Clear progress indicators for each goal
- **Achievement Validation** - Goal completion tracking

### Authentication & Security
- **JWT-based Authentication** - Secure token-based login system
- **Role-based Access Control** - User and Admin role separation
- **Session Management** - Secure session handling with automatic logout
- **Password Security** - Encrypted password storage and transmission

### Admin Capabilities
- **User Management** - Complete admin control over user accounts
- **System Monitoring** - Real-time statistics and user activity tracking
- **User Administration** - Enable/disable accounts and manage permissions
- **Platform Analytics** - System-wide learning metrics and statistics
- **Role Management** - Control user access levels and permissions

### User Experience
- **Dark Mode Interface** - Eye-friendly dark theme with Catppuccin colors
- **Responsive Design** - Seamless experience across desktop and mobile
- **Smooth Animations** - Polished interactions and transitions
- **Modal-based Input** - Clean form interfaces without page navigation
- **Empty States** - Helpful guidance when no data is available
- **Professional Polish** - SaaS-grade UI with attention to detail

## 📄 License

This project is open source and available for personal and commercial use.

## 👨‍💻 Author
Built with ❤️ as a modern SaaS learning platform showcase.

---

**SkillSync** - Master your skills, track your progress, achieve your goals.