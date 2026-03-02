# 🚀 Deploy to Vercel - Complete Guide

Your project has been converted to Node.js and is ready for Vercel!

## 📋 Prerequisites

You need FREE cloud databases since Vercel is serverless:

### 1. **PlanetScale** (Free MySQL) - RECOMMENDED
- Visit: https://planetscale.com
- Sign up with GitHub
- Create database
- Get connection string

### 2. **MongoDB Atlas** (Free MongoDB)
- Visit: https://mongodb.com/cloud/atlas/register
- Create FREE M0 cluster
- Get connection string

### 3. **Redis Cloud** (Free Redis)
- Visit: https://redis.com/try-free/
- Create free database
- Get credentials

---

## 🚀 Deploy to Vercel (5 Minutes)

### Step 1: Push to GitHub

```bash
cd C:\Users\kriti\OneDrive\Desktop\guviPS

# Initialize git
git init
git add .
git commit -m "Initial commit - GUVI Internship Project"

# Create repo on GitHub.com and push
git remote add origin https://github.com/yourusername/guvi-project.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to: **https://vercel.com**
2. **Sign up with GitHub**
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. Vercel auto-detects settings ✅
6. Click **"Deploy"**

### Step 3: Add Environment Variables

In Vercel dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:

```
DB_HOST=your_planetscale_host
DB_USER=your_planetscale_user
DB_PASS=your_planetscale_password
DB_NAME=user_registration_db

MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/

REDIS_HOST=redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com
REDIS_PORT=12345
REDIS_PASSWORD=your_redis_password
```

3. Click **"Save"**
4. **Redeploy** your project

---

## ✅ That's It!

Your site will be live at: `https://your-project.vercel.app`

Test pages:
- https://your-project.vercel.app/signup.html
- https://your-project.vercel.app/login.html
- https://your-project.vercel.app/profile.html

---

## 🗄️ Setup Free Databases

### PlanetScale (MySQL) - EASIEST

1. Visit: https://planetscale.com
2. Sign in with GitHub
3. Click **"Create database"**
4. Name: `user-registration-db`
5. Region: Choose closest to you
6. Click **"Create database"**
7. Go to **"Connect"** → Choose **"Node.js"**
8. Copy connection details
9. In PlanetScale console, run this SQL:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_username (username)
);
```

---

## 🔧 Alternative: Deploy Without GitHub

If you don't want to use GitHub:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy directly:
```bash
cd C:\Users\kriti\OneDrive\Desktop\guviPS
vercel
```

3. Follow prompts and add environment variables when asked

---

## 📞 Troubleshooting

### Error: "Module not found"
- Make sure `package.json` is in root folder
- Run `npm install` locally first

### Error: "Database connection failed"
- Verify environment variables in Vercel dashboard
- Check database credentials
- Make sure PlanetScale/MongoDB/Redis are accessible

### Error: "502 Bad Gateway"
- Check Vercel function logs
- Verify API routes are correct
- Check database connections

---

## 🎉 Success!

Once deployed, you have:
- ✅ Live website on Vercel
- ✅ Free MySQL on PlanetScale
- ✅ Free MongoDB on Atlas
- ✅ Free Redis on Redis Cloud
- ✅ Automatic HTTPS
- ✅ Global CDN

**Total Cost: $0** 🎊

---

## 📝 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **PlanetScale:** https://planetscale.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Redis Cloud:** https://app.redislabs.com

---

## 🆘 Need Help?

Check Vercel deployment logs:
- Go to your project in Vercel
- Click on latest deployment
- View **"Functions"** logs

Good luck with your GUVI internship! 🚀
