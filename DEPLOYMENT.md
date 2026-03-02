# 🚀 Deploy Your Project Online (FREE)

This guide will help you deploy your GUVI internship project online using free services.

## 🎯 Quick Deployment Options

### Option 1: InfinityFree (Recommended - Free PHP Hosting)

**Features:**
- ✅ Free PHP & MySQL hosting
- ✅ No ads
- ✅ Unlimited bandwidth
- ✅ Free subdomain

**Steps:**

1. **Sign up for InfinityFree**
   - Visit: https://infinityfree.net
   - Create free account
   - Choose a subdomain (e.g., `yourname.infinityfreeapp.com`)

2. **Upload Your Files**
   - Login to control panel (VistaPanel)
   - Go to "Online File Manager"
   - Navigate to `htdocs` folder
   - Upload all project files (HTML, CSS, JS, PHP)

3. **Create MySQL Database**
   - In control panel, go to "MySQL Databases"
   - Create new database
   - Note down: Database name, Username, Password, Host
   - Import `sql/schema.sql` using phpMyAdmin

4. **Update Configuration**
   - Edit `php/config/mysql_config.php` with your database credentials
   - Upload the updated file

5. **Setup Cloud Databases** (see below)

---

### Option 2: 000webhost (Alternative Free Hosting)

**Visit:** https://www.000webhost.com/free-website-sign-up

Similar steps to InfinityFree:
1. Sign up for free account
2. Upload files via File Manager or FTP
3. Create MySQL database
4. Update configuration files
5. Setup cloud databases

---

## ☁️ Setup Cloud Databases (Required for both options)

### 1. MongoDB Atlas (Free Cloud MongoDB)

**Steps:**

1. **Sign up:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create free account (M0 Free Tier - 512MB storage)

2. **Create Cluster:**
   - Choose AWS/GCP/Azure (any region)
   - Select M0 Free tier
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access:**
   - Go to "Database Access" → Add Database User
   - Create username and password
   - Set permissions to "Read and write to any database"

4. **Setup Network Access:**
   - Go to "Network Access" → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String:**
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<username>` and `<password>` with your credentials

6. **Update Your Code:**
   - Edit `php/config/mongodb_config.php`
   - Replace MONGO_URI with your connection string

---

### 2. Redis Cloud (Free Cloud Redis)

**Steps:**

1. **Sign up:**
   - Visit: https://redis.com/try-free/
   - Create free account (30MB free)

2. **Create Database:**
   - Click "New Database"
   - Choose "Free" plan
   - Select region closest to your hosting
   - Click "Create database"

3. **Get Credentials:**
   - Click on your database
   - Note down:
     - **Endpoint:** (e.g., redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com)
     - **Port:** (e.g., 12345)
     - **Password:** Click "eye" icon to reveal

4. **Update Your Code:**
   - Edit `php/config/redis_config.php`
   - Update REDIS_HOST, REDIS_PORT, and REDIS_PASSWORD

---

## 📝 Updated Configuration Files

### For MySQL (InfinityFree/000webhost):

Edit `php/config/mysql_config.php`:
```php
define('DB_HOST', 'sql123.infinityfree.com'); // Your host
define('DB_USER', 'if0_12345678'); // Your username
define('DB_PASS', 'yourpassword'); // Your password
define('DB_NAME', 'if0_12345678_user_registration_db'); // Your database
```

### For MongoDB Atlas:

Edit `php/config/mongodb_config.php`:
```php
function getMongoDBConnection() {
    try {
        $mongoClient = new Client("mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority");
        return $mongoClient->selectDatabase('user_profiles_db');
    } catch (Exception $e) {
        error_log("MongoDB Connection failed: " . $e->getMessage());
        return null;
    }
}
```

### For Redis Cloud:

Edit `php/config/redis_config.php`:
```php
const REDIS_HOST = 'redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com';
const REDIS_PORT = 12345;
const REDIS_PASSWORD = 'your_redis_password';

public static function getRedisConnection() {
    if (self::$redis === null) {
        try {
            self::$redis = new Redis();
            self::$redis->connect(self::REDIS_HOST, self::REDIS_PORT);
            if (self::REDIS_PASSWORD) {
                self::$redis->auth(self::REDIS_PASSWORD);
            }
        } catch (Exception $e) {
            error_log("Redis Connection failed: " . $e->getMessage());
            return null;
        }
    }
    return self::$redis;
}
```

---

## 🔧 Install PHP Dependencies on Hosting

Some free hosts include Composer. If not, you can:

**Option A:** Install dependencies locally, then upload the `vendor` folder

```bash
cd C:\Users\kriti\OneDrive\Desktop\guviPS
composer install
```

Then upload the entire `vendor` folder to your hosting.

**Option B:** Use hosting's terminal (if available)

In hosting control panel terminal:
```bash
cd htdocs
composer install
```

---

## ✅ Testing Your Deployed Application

1. **Visit your site:**
   - InfinityFree: `https://yourname.infinityfreeapp.com`
   - 000webhost: `https://yourname.000webhostapp.com`

2. **Test signup:**
   - Go to `/signup.html`
   - Create a new account

3. **Test login:**
   - Login with your credentials
   - Should redirect to profile page

4. **Test profile:**
   - Update your profile information
   - Logout and login again to verify persistence

---

## 🎬 Alternative: Quick Demo Using Replit

If you want to test immediately without hosting setup:

1. **Visit:** https://replit.com
2. **Create New Repl** → PHP
3. **Upload your files**
4. **Setup environment variables** for databases
5. **Run** → Get instant public URL

---

## 📧 Free MySQL Database Alternatives

If your hosting doesn't provide MySQL:

- **RemoteMySQL:** https://remotemysql.com (Free 100MB)
- **FreeSQLDatabase:** https://www.freesqldatabase.com
- **db4free:** https://www.db4free.net

---

## 🆘 Common Issues

### Issue: "Class 'MongoDB\Client' not found"
- Upload entire `vendor` folder from local after running `composer install`

### Issue: "502 Bad Gateway"
- Check if database credentials are correct
- Verify MongoDB Atlas allows connections from anywhere

### Issue: Redis connection failed
- Verify Redis Cloud credentials
- Check if Redis password is set correctly

### Issue: CORS errors
- Add `.htaccess` file (already included in project)

---

## 🎉 Your Live URLs Will Be:

- **Signup:** `https://yoursite.com/signup.html`
- **Login:** `https://yoursite.com/login.html`
- **Profile:** `https://yoursite.com/profile.html`

---

## 💡 Pro Tips

1. Use environment variables for sensitive data
2. Test locally first if possible
3. Keep database credentials secure
4. Use HTTPS (provided free by hosting)
5. Monitor MongoDB Atlas and Redis Cloud usage (free tier limits)

---

## 📞 Need Help?

1. Check hosting provider's documentation
2. Verify all database connections are working
3. Check browser console for JavaScript errors (F12)
4. Review PHP error logs in hosting control panel

---

**Setup Time:** ~30-45 minutes for first-time deployment

**Cost:** $0 (All services are FREE)

Good luck with your GUVI internship application! 🚀
