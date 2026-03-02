# 🚀 QUICK START - Deploy Online in 3 Steps!

Your project is ready to deploy! Choose from these FREE options:

---

## ⚡ Option 1: InfinityFree (EASIEST - Recommended)

### 📝 Step-by-Step:

**1. Sign up (2 minutes):**
   - Go to: https://infinityfree.net
   - Click "Sign Up Now"
   - Fill in details and create account
   - Choose a subdomain (e.g., `yourname.infinityfreeapp.com`)

**2. Upload Files (5 minutes):**
   - Login to control panel (VistaPanel)
   - Click "Online File Manager" or use FileZilla FTP
   - Navigate to `htdocs` folder
   - Upload ALL files from your `guviPS` folder

**3. Setup Databases (15-20 minutes):**

   **MySQL (included with InfinityFree):**
   - In control panel → "MySQL Databases"
   - Click "Create Database"
   - Note: Database name, Username, Password, Hostname
   - Go to phpMyAdmin
   - Import file: `sql/schema.sql`
   - Update `php/config/mysql_config.php` with credentials

   **MongoDB Atlas (FREE Cloud MongoDB):**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create FREE M0 cluster (512MB)
   - Setup database user & allow network access (0.0.0.0/0)
   - Get connection string → Update in `php/config/mongodb_config.php`

   **Redis Cloud (FREE Cloud Redis):**
   - Visit: https://redis.com/try-free/
   - Create FREE database (30MB)
   - Get endpoint, port, password
   - Update in `php/config/redis_config.php`

**4. Install Dependencies:**
   - On your computer, run:
```bash
cd C:\Users\kriti\OneDrive\Desktop\guviPS
composer install
```
   - Upload the generated `vendor` folder to your hosting

**5. Test Your Site:**
   - Visit: `https://yourname.infinityfreeapp.com`
   - Test signup, login, profile update!

---

## ⚡ Option 2: 000webhost (Alternative Free Host)

Similar to InfinityFree:
- Sign up: https://www.000webhost.com/free-website-sign-up
- Upload files to `public_html` folder
- Create MySQL database
- Setup MongoDB Atlas & Redis Cloud (same as above)
- Visit: `https://yourname.000webhostapp.com`

---

## ⚡ Option 3: Replit (INSTANT TEST - No Setup!)

**Perfect for quick testing:**

1. Go to: https://replit.com
2. Sign up with Google/GitHub
3. Create New Repl → Select "PHP Web Server"
4. Upload your files (drag & drop)
5. Click "Run" → Instant live URL!

Note: For databases, you'll still need MongoDB Atlas & Redis Cloud (free tiers)

---

## 🎯 Your Credentials Setup Checklist

### ✅ MongoDB Atlas (FREE):
- [ ] Account created
- [ ] Cluster created (M0 Free tier)
- [ ] Database user added
- [ ] Network access: 0.0.0.0/0 allowed
- [ ] Connection string copied
- [ ] Updated in `php/config/mongodb_config.php`

### ✅ Redis Cloud (FREE):
- [ ] Account created  
- [ ] Database created (30MB free)
- [ ] Host, Port, Password noted
- [ ] Updated in `php/config/redis_config.php`

### ✅ Web Hosting:
- [ ] Account created
- [ ] Files uploaded
- [ ] MySQL database created & schema imported
- [ ] Credentials updated in `php/config/mysql_config.php`
- [ ] `vendor` folder uploaded (after composer install)

---

## 🔗 Your Live Site URLs

After deployment, your site will be available at:
- **InfinityFree:** `https://yourname.infinityfreeapp.com`
- **000webhost:** `https://yourname.000webhostapp.com`
- **Replit:** `https://yourproject.username.repl.co`

Main pages:
- Signup: `/signup.html`
- Login: `/login.html`
- Profile: `/profile.html`

---

## 🆘 Quick Troubleshooting

**"Class 'MongoDB\Client' not found"**
→ Upload the `vendor` folder (run `composer install` locally first)

**"Failed to connect to MongoDB"**
→ Check MongoDB Atlas connection string & network access settings

**"Redis connection failed"**
→ Verify Redis Cloud credentials (host, port, password)

**"Database connection error"**
→ Check MySQL credentials in config file

---

## 📞 Support Links

- InfinityFree Support: https://forum.infinityfree.net
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Redis Cloud Docs: https://docs.redis.com/latest/rc/
- Composer Install: https://getcomposer.org

---

## ⏱️ Estimated Time

- **Total Setup:** 30-45 minutes
- **Cost:** $0 (100% FREE)

---

## 🎉 You're Ready!

Once everything is setup:
1. Visit your live URL
2. Test registration
3. Test login
4. Test profile updates
5. Submit for your GUVI internship!

**Good luck! 🚀**
