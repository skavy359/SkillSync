# 🚀 SkillSync Deployment Guide
## Vercel + Railway (Free & Easy)

Complete guide to deploy SkillSync for free using Vercel (Frontend) + Railway (Backend + Database).

---

## 📋 What You'll Get

✅ **Frontend:** Vercel  
✅ **Backend:** Railway  
✅ **Database:** PostgreSQL on Railway  
✅ **Cost:** $0 (free tier)  
✅ **Time:** ~10 minutes  

---

## 🎯 Prerequisites

- [ ] GitHub account (free)
- [ ] Vercel account (free - sign up with GitHub)
- [ ] Railway account (free - sign up with GitHub)
- [ ] Your code pushed to GitHub

---

## 🔧 Step-by-Step Deployment

### **STEP 1: Push Code to GitHub** 🐙

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skillsync.git
git push -u origin main
```

---

### **STEP 2: Deploy Backend to Railway** 🚂

#### 2.1 Create Railway Project

1. Go to **railway.app**
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Find and select your skillsync repository
6. Click **"Deploy"**

#### 2.2 Configure Backend Service

1. Railway will auto-detect your project
2. Select **backend folder** as the source
3. Wait for build to complete (~2 mins)

#### 2.3 Add PostgreSQL Database

1. In Railway dashboard, click **"Add Plugin"**
2. Search for **"PostgreSQL"**
3. Click to add it
4. Railway auto-creates the database! 🎉

#### 2.4 Set Environment Variables

1. Click on your **backend service**
2. Go to **"Variables"** tab
3. Add these variables:

```
DATABASE_URL=(Railway will auto-generate this)
JWT_SECRET=ABWPSBr+wK1tuviHZbPiF3B6DAa4ZOnAI24Hnj7k9xsZJoNW3OezvzlrUST41RGI8G0+otSfyuU2K1MUOLBRnQ==
JWT_EXPIRATION=86400000
SPRING_DATASOURCE_URL=${{Postgres.JDBC_URL}}
SPRING_DATASOURCE_USERNAME=${{Postgres.USER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.PASSWORD}}
```

#### 2.5 Update application.properties

Update `backend/src/main/resources/application.properties`:

```properties
spring.application.name=backend
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Use environment variables
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}

logging.level.org.springframework.web=DEBUG
```

#### 2.6 Get Backend URL

1. Go to Railway dashboard
2. Click your **backend service**
3. Copy the **"Service URL"** (looks like: `https://railway-production-xxx.up.railway.app`)
4. Save this - you'll need it for frontend!

**Backend URL Example:**
```
https://skillsync-backend.railway.app
```

---

### **STEP 3: Deploy Frontend to Vercel** 🎨

#### 3.1 Update API URL

Update `frontend/src/services/api.js`:

```javascript
const API_URL = 'https://your-railway-backend-url.railway.app/api';

// Example:
// const API_URL = 'https://skillsync-backend.railway.app/api';
```

#### 3.2 Commit Changes

```bash
git add .
git commit -m "Update backend URL for deployment"
git push origin main
```

#### 3.3 Deploy to Vercel

1. Go to **vercel.com**
2. Click **"Add New..."** → **"Project"**
3. Import your **Github repository**
4. Vercel auto-detects it's a Vite project
5. Set **Root Directory** → `./frontend`
6. Click **"Deploy"**
7. Wait ~2-3 minutes ⏳
8. Get your **Frontend URL** (looks like: `https://skillsync.vercel.app`)

---

## ✅ Verification Checklist

- [ ] Backend deployed on Railway
- [ ] PostgreSQL database created on Railway
- [ ] Environment variables set on Railway
- [ ] Frontend deployed on Vercel
- [ ] API URL updated in frontend code
- [ ] Frontend → Backend connection working

### **Test It:**

1. Open your Vercel URL: `https://skillsync.vercel.app`
2. Try to register/login
3. If it works, you're live! 🎉

---

## 🐛 Troubleshooting

### **Frontend loads but API calls fail**

**Problem:** CORS error or 404 on API calls

**Solution:**
1. Check Backend URL in `api.js` is correct
2. Verify Railway backend is running (no build errors)
3. Clear browser cache and reload
4. Check Railway logs for errors

### **Railway backend build fails**

**Problem:** Maven or Java compilation error

**Solution:**
1. Railway shows build logs - read them!
2. Common: Missing environment variables
3. Try rebuilding in Railway dashboard
4. Check `pom.xml` has correct dependencies

### **Database connection error**

**Problem:** "Connection refused" or "Unknown host"

**Solution:**
1. Verify PostgreSQL plugin is added to Railway
2. Check `DATABASE_URL` in environment variables
3. Restart the service

### **Blank page on Vercel frontend**

**Problem:** Frontend deployed but nothing shows

**Solution:**
1. Check browser console (F12) for errors
2. Verify API URL is correct
3. Check Vercel build logs
4. Try `npm run build` locally to test

---

## 📊 Live URLs After Deployment

| Service | URL Format |
|---------|-----------|
| **Frontend** | https://skillsync.vercel.app |
| **Backend API** | https://skillsync-backend.railway.app/api |
| **Database** | Managed by Railway (no direct access needed) |

---

## 🎯 Next Steps After Deployment

1. **Test all features:**
   - Register new user
   - Add skills
   - Log sessions
   - Check leaderboard
   - Download achievement card

2. **Share with friends:**
   - Send Vercel URL to beta testers
   - Gather feedback
   - Post on LinkedIn with screenshots!

3. **Monitor performance:**
   - Check Vercel analytics
   - Monitor Railway usage
   - Watch for errors in logs

4. **Keep development flowing:**
   - Push code changes to GitHub
   - Vercel auto-deploys on push
   - Railway auto-deploys on push
   - No manual deployments needed! 🚀

---

## 💡 Pro Tips

✅ **Auto-deployment:**
- Every `git push` to main automatically deploys
- No manual docker commands needed
- Takes 2-3 minutes per deployment

✅ **Monitor costs:**
- Railway: $5/month credit (plenty for hobby)
- Vercel: 100GB bandwidth free
- Should cost $0/month if under limits

✅ **Custom domain (Optional):**
- Vercel: Add custom domain in settings (free)
- Railway: Can use custom domain (paid feature)

✅ **Logs & Debugging:**
- Vercel: Deployment logs + live console
- Railway: Build logs + Runtime logs
- Both have good debugging interfaces

---

## 🎉 You're Done!

Your SkillSync is now live on the internet!

**Share the good news:**
- Post on LinkedIn (don't forget screenshots!)
- Share with friends
- Get feedback
- Keep iterating! 🚀

---

## 📞 Need Help?

**Common Resources:**
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://railway.app/docs)
- [Spring Boot Deployment](https://spring.io/guides/gs/deploying-spring-boot-app-to-cloud/)

**Your URLs after deployment:**
```
Frontend: https://skillsync.vercel.app
Backend: https://your-railway-url.railway.app/api
```

Save these! You'll need them for documentation and LinkedIn post! 📸

---

**SkillSync is live! 🚀✨**
