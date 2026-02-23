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
- 🏆 **Leaderboard** - Compete with other learners and see rankings
- 📤 **Share Progress** - Download and share your achievements

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
- **Recharts** - Data visualization library

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
├── backend/
│   ├── src/main/java/com/skillsync/backend/
│   │   ├── controller/     # REST API endpoints
│   │   ├── service/        # Business logic
│   │   ├── model/          # Data models
│   │   ├── dto/            # Data transfer objects
│   │   ├── repository/     # Database access
│   │   └── security/       # Auth & security
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   ├── hooks/          # Custom React hooks
│   │   └── main.jsx        # Entry point
│   └── package.json
│
└── README.md
```

## 🎮 All Your Pages at a Glance

| Page | What it Does | Icon |
|------|-------------|------|
| **Dashboard** | View your learning stats & activity | 📊 |
| **Skills** | Manage all your learning skills | 💡 |
| **Sessions** | Log & track study sessions | 🕐 |
| **Categories** | Organize skills by topic | 📁 |
| **Goals** | Set learning targets | 🎯 |
| **Analytics** | Deep dive into your patterns | 📈 |
| **Leaderboard** | Compete with others | 🏆 |
| **Share Progress** | Download & share achievements | 📤 |
| **Profile** | Your learning journey | 👤 |
| **Settings** | Customize your experience | ⚙️ |
| **Admin Panel** | Manage the platform | 🛡️ |

## 🚀 Quick Start

### What You Need
```
✓ Java 17+           ✓ PostgreSQL 12+
✓ Node.js 18+        ✓ Maven 3.8+
```

### Let's Go! 🎯

**Step 1: Backend (the 🧠 of the app)**
```bash
cd backend
# Update database in: src/main/resources/application.properties
mvn spring-boot:run
# 🎉 Backend live on port 8080
```

**Step 2: Frontend (the ✨ beautiful part)**
```bash
cd frontend
npm install
npm run dev
# ✨ Frontend live on port 5173
```

**Step 3: Open & Start Learning! 🚀**
```
Visit: http://localhost:5173
```

---

## 💫 What Makes SkillSync Special?

### 🏆 Compete & Celebrate  
Show off your learning with leaderboards and shareable achievement cards. See who's crushing their goals! Your rank appears with a special "YOU" badge. Download as PNG or PDF! 📸

### 🎮 Gamified Learning
Track streaks, earn achievements, and climb the leaderboards. Learning never felt so rewarding! Every session counts! ⭐

### 💚 Health First
Our burnout detection keeps you from overworking. Consistent but sustainable progress is the goal. We monitor your wellbeing! 

### 📊 Visual Insights  
GitHub-style heatmaps, category breakdowns, and personalized recommendations. See patterns you never noticed before! 

### 👥 Community Vibes
Compete with friends, share achievements, celebrate wins together. Learning is better together! 

### 🛡️ Admin Power
Full platform control with user management, audit logs, and system statistics. Keep things running smoothly!

---

## 🎨 Dark Mode & Beautiful UI  

Everything's built with Catppuccin dark theme:
- 👁️ **Easy on the eyes** - Perfect for long study sessions
- ✨ **Modern design** - Inspired by Linear, Vercel, and Notion
- 📱 **Mobile friendly** - Works great on any device
- ⚡ **Smooth interactions** - Delightful animations everywhere

---

## 🌟 Key Highlights

### Learn & Track
✅ Add unlimited skills with multiple levels  
✅ Log learning sessions with timestamps  
✅ Organize by categories  
✅ Track progress with visual indicators  

### Analyze & Improve
✅ Weekly activity heatmap (GitHub style!)  
✅ Burnout risk detection  
✅ Personalized insights  
✅ Learning velocity metrics  

### Share & Celebrate
✅ Beautiful achievement cards  
✅ Download as PNG or PDF  
✅ Leaderboard rankings  
✅ Share your journey with others  

### Admin Features
✅ User management & monitoring  
✅ Platform statistics  
✅ Audit logs for compliance  
✅ System settings & controls  

---

## 📊 Dashboard Highlights

- 📈 Real-time statistics dashboard
- 🔥 Weekly activity heatmap with minute-level precision
- 🎯 Quick-add skills and sessions
- 📋 Recent activity overview
- 📊 Category breakdown charts
- 🏆 Top achievements display

---

## 🚀 Ready to Transform Your Learning?

1. **Clone the repo** 📦
2. **Follow Quick Start** ⚡
3. **Create your first skill** 💡
4. **Log a learning session** 🕐
5. **Watch your dashboard light up!** 🌟

### Pro Tips 💡
- Use categories to organize your skills
- Log sessions consistently for better insights
- Check analytics weekly to spot patterns
- Share achievements with friends for motivation
- Monitor burnout score to stay healthy

---

## 🤝 Contributing

We'd love your contributions! Feel free to:
- Report bugs 🐛
- Suggest features ✨
- Submit pull requests 🚀
- Share feedback 💬

---

## 📄 License

This project is open source and available for personal and commercial use.

## 👨‍💻 Author
Built with ❤️ as a modern SaaS learning platform showcase.

---

**SkillSync** - Master your skills, track your progress, achieve your goals. 🚀✨
