# GUVI Internship Project Setup Guide

## Quick Start Checklist

### ✅ Step 1: Install Required Software

- [ ] XAMPP/WAMP installed and working
- [ ] MongoDB installed and running
- [ ] Redis installed and running
- [ ] Composer installed globally

### ✅ Step 2: Setup Project

- [ ] Project placed in web server directory (htdocs/www)
- [ ] Run `composer install` in project directory
- [ ] MySQL database created using schema.sql
- [ ] Database connections configured in php/config/ files

### ✅ Step 3: Start Services

Open 3 separate Command Prompt windows:

**Window 1 - MongoDB:**
```bash
cd "C:\Program Files\MongoDB\Server\6.0\bin"
mongod
```

**Window 2 - Redis:**
```bash
cd "C:\Program Files\Redis"
redis-server
```

**Window 3 - Apache & MySQL:**
- Start from XAMPP/WAMP Control Panel

### ✅ Step 4: Verify Installation

1. Check PHP extensions:
```bash
php -m | grep -E "mysqli|redis|mongodb|json"
```

2. Test MongoDB connection:
```bash
mongosh
> show dbs
> exit
```

3. Test Redis connection:
```bash
redis-cli
> PING
> exit
```

4. Test MySQL connection:
- Open http://localhost/phpmyadmin
- Check if `user_registration_db` database exists

### ✅ Step 5: Test Application

1. Open browser: http://localhost/guviPS
2. Register a new user
3. Login with credentials
4. Update profile information
5. Test logout functionality

## Common Issues & Solutions

### Issue: "Class 'MongoDB\Client' not found"
**Solution:** Run `composer install` to install MongoDB PHP library

### Issue: "Class 'Redis' not found"
**Solution:** Enable redis extension in php.ini:
- Locate php.ini file
- Uncomment: `extension=redis`
- Restart Apache

### Issue: "Connection refused" for MongoDB
**Solution:** Start MongoDB service:
```bash
mongod
```

### Issue: "Connection refused" for Redis
**Solution:** Start Redis service:
```bash
redis-server
```

### Issue: MySQL connection failed
**Solution:** 
- Start MySQL from XAMPP/WAMP
- Check credentials in php/config/mysql_config.php
- Import schema.sql into MySQL

## Verification Commands

### Check if services are running:

**MongoDB (should show databases):**
```bash
mongosh --eval "show dbs"
```

**Redis (should return PONG):**
```bash
redis-cli PING
```

**MySQL (should list databases):**
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

**Apache (should return PHP version):**
```bash
php -v
```

## File Permissions (if on Linux/Mac)

```bash
chmod -R 755 guviPS/
chmod -R 777 guviPS/vendor/
```

## Port Configuration

Make sure these ports are free:
- **3306** - MySQL
- **27017** - MongoDB
- **6379** - Redis
- **80** - Apache

Check ports on Windows:
```bash
netstat -ano | findstr "3306 27017 6379 80"
```

## Environment-Specific Notes

### For Windows Users:
- Use `\` in file paths
- Run Command Prompt as Administrator
- Install Redis from: https://github.com/microsoftarchive/redis/releases
- Install MongoDB from: https://www.mongodb.com/try/download/community

### For Mac Users:
- Use Homebrew for installations:
```bash
brew install mongodb-community
brew install redis
brew install composer
```

### For Linux Users:
```bash
sudo apt-get install mongodb redis-server composer php-mysql php-mongodb php-redis
```

## Need Help?

1. Check README.md for detailed documentation
2. Review troubleshooting section
3. Verify all services are running
4. Check browser console for errors (F12)
5. Check PHP error logs in XAMPP/WAMP logs folder

---

**Remember:** All services (MongoDB, Redis, Apache, MySQL) must be running simultaneously for the application to work properly!
