# GUVI Internship Project - User Registration & Profile Management System

A complete user registration and profile management system built with HTML, CSS, JavaScript (jQuery), PHP, MySQL, MongoDB, and Redis.

## 🎯 Project Requirements

This project fulfills all the internship requirements:

- ✅ HTML, JS, CSS, and PHP code in separate files
- ✅ jQuery AJAX for all backend interactions (no form submission)
- ✅ Bootstrap for responsive form design
- ✅ MySQL with Prepared Statements (storing registered user data)
- ✅ MongoDB (storing user profile details)
- ✅ Redis (storing session information)
- ✅ Browser localStorage for session management (no PHP sessions)

## 📁 Project Structure

```
guviPS/
├── signup.html              # User registration page
├── login.html               # User login page
├── profile.html             # User profile page
├── css/
│   └── style.css           # Styling for all pages
├── js/
│   ├── signup.js           # Signup page logic with AJAX
│   ├── login.js            # Login page logic with AJAX
│   └── profile.js          # Profile page logic with AJAX
├── php/
│   ├── config/
│   │   ├── mysql_config.php    # MySQL configuration
│   │   ├── mongodb_config.php  # MongoDB configuration
│   │   └── redis_config.php    # Redis configuration
│   ├── signup.php          # User registration endpoint
│   ├── login.php           # User login endpoint
│   ├── get_profile.php     # Get user profile endpoint
│   ├── update_profile.php  # Update user profile endpoint
│   └── logout.php          # User logout endpoint
├── sql/
│   └── schema.sql          # MySQL database schema
├── composer.json           # PHP dependencies
└── README.md              # This file
```

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript (jQuery)
- **Backend**: PHP 7.4+
- **Databases**: 
  - MySQL (user authentication data)
  - MongoDB (user profile details)
  - Redis (session management)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **XAMPP** or **WAMP** (includes Apache, MySQL, PHP)
   - Download: https://www.apachefriends.org/
   
2. **MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Install MongoDB Compass (GUI) for easier management
   
3. **Redis**
   - For Windows: https://github.com/microsoftarchive/redis/releases
   - Download Redis-x64-3.0.504.msi or later
   
4. **Composer** (PHP dependency manager)
   - Download: https://getcomposer.org/download/

## 🚀 Installation & Setup

### Step 1: Clone/Download the Project

Place the project folder in your web server directory:
- XAMPP: `C:\xampp\htdocs\guviPS`
- WAMP: `C:\wamp64\www\guviPS`

### Step 2: Install PHP Dependencies

Open Command Prompt in the project directory and run:

```bash
composer install
```

This will install the MongoDB PHP library and other dependencies.

### Step 3: Setup MySQL Database

1. Start Apache and MySQL from XAMPP/WAMP Control Panel
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Import the database schema:
   - Click on "Import" tab
   - Choose file: `sql/schema.sql`
   - Click "Go"

Or run the SQL commands directly:

```bash
mysql -u root -p < sql/schema.sql
```

### Step 4: Configure Database Connections

Update the following files if your database credentials are different:

**`php/config/mysql_config.php`**
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');  // Your MySQL password
define('DB_NAME', 'user_registration_db');
```

**`php/config/mongodb_config.php`**
```php
define('MONGO_HOST', 'localhost');
define('MONGO_PORT', 27017);
```

**`php/config/redis_config.php`**
```php
const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = 6379;
```

### Step 5: Start MongoDB

1. Open Command Prompt as Administrator
2. Navigate to MongoDB bin folder (or add to PATH)
3. Start MongoDB:

```bash
mongod
```

Keep this window open. MongoDB should be running on port 27017.

### Step 6: Start Redis

1. Open Command Prompt as Administrator
2. Navigate to Redis installation folder
3. Start Redis:

```bash
redis-server
```

Keep this window open. Redis should be running on port 6379.

### Step 7: Enable PHP Extensions

Edit your `php.ini` file (found in XAMPP/WAMP PHP directory):

Uncomment or add these lines:
```ini
extension=mysqli
extension=redis
extension=mongodb
extension=json
```

Restart Apache after making changes.

### Step 8: Access the Application

1. Open your browser
2. Navigate to: http://localhost/guviPS/signup.html
3. Start by registering a new user!

## 🔄 Application Flow

1. **Register** (signup.html)
   - User enters username, email, and password
   - Data stored in MySQL using prepared statements
   - Initial empty profile created in MongoDB

2. **Login** (login.html)
   - User enters email and password
   - Credentials verified against MySQL
   - Session token generated and stored in Redis
   - Session info saved in browser localStorage

3. **Profile** (profile.html)
   - User can view and update profile details
   - Profile data stored in MongoDB
   - Session validated via Redis before any operation
   - User can logout (clears Redis session and localStorage)

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ Prepared statements to prevent SQL injection
- ✅ Session validation on every request
- ✅ Session expiry (1 hour by default)
- ✅ Input validation on both client and server side
- ✅ CORS headers configured

## 📝 API Endpoints

All endpoints accept and return JSON data.

### POST /php/signup.php
Register a new user
```json
Request:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful!"
}
```

### POST /php/login.php
Login user
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "sessionToken": "abc123...",
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### POST /php/get_profile.php
Get user profile (requires authentication)
```json
Request:
{
  "sessionToken": "abc123...",
  "userId": 1
}

Response:
{
  "success": true,
  "profile": {
    "fullName": "John Doe",
    "dob": "1990-01-01",
    "age": "34",
    "contact": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA"
  }
}
```

### POST /php/update_profile.php
Update user profile (requires authentication)
```json
Request:
{
  "sessionToken": "abc123...",
  "userId": 1,
  "fullName": "John Doe",
  "dob": "1990-01-01",
  "age": "34",
  "contact": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully!"
}
```

### POST /php/logout.php
Logout user
```json
Request:
{
  "sessionToken": "abc123...",
  "userId": 1
}

Response:
{
  "success": true,
  "message": "Logged out successfully!"
}
```

## 🧪 Testing the Application

1. **Test Registration:**
   - Go to signup.html
   - Fill in all fields
   - Click "Sign Up"
   - Should redirect to login page

2. **Test Login:**
   - Use the credentials you just registered
   - Click "Login"
   - Should redirect to profile page

3. **Test Profile Update:**
   - Fill in profile details (age, DOB, contact, etc.)
   - Click "Update Profile"
   - Refresh page to verify data persists

4. **Test Session:**
   - Open browser DevTools (F12)
   - Go to Application/Storage > Local Storage
   - Verify sessionToken is stored
   - Close and reopen browser
   - Visit profile.html directly - should still be logged in

5. **Test Logout:**
   - Click "Logout" button
   - Should redirect to login page
   - Try accessing profile.html - should redirect to login

## 🐛 Troubleshooting

### MySQL Connection Error
- Ensure MySQL service is running in XAMPP/WAMP
- Check database credentials in `php/config/mysql_config.php`
- Verify database exists: `user_registration_db`

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check if MongoDB is listening on port 27017
- Verify PHP MongoDB extension is installed: `php -m | grep mongodb`

### Redis Connection Error
- Ensure Redis service is running
- Check if Redis is listening on port 6379
- Verify PHP Redis extension is installed: `php -m | grep redis`

### Composer Dependencies Error
- Run `composer install` in project directory
- If composer is not installed, download from getcomposer.org

### AJAX Requests Failing
- Check browser console for errors (F12)
- Ensure Apache server is running
- Verify file paths are correct
- Check if PHP files have proper CORS headers

### Session Not Persisting
- Check if localStorage is enabled in browser
- Verify Redis is storing sessions (use redis-cli: `KEYS session:*`)
- Check session expiry time in redis_config.php

## 📦 Database Collections

### MySQL - users table
```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- username (VARCHAR 50, UNIQUE)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 255, HASHED)
- created_at (TIMESTAMP)
- last_login (TIMESTAMP)
```

### MongoDB - profiles collection
```json
{
  "userId": "string",
  "fullName": "string",
  "dob": "string",
  "age": "string",
  "contact": "string",
  "address": "string",
  "city": "string",
  "country": "string",
  "createdAt": "UTCDateTime",
  "updatedAt": "UTCDateTime"
}
```

### Redis - session keys
```
Key: session:<sessionToken>
Value: {
  "userId": "string",
  "username": "string",
  "email": "string",
  "createdAt": timestamp
}
Expiry: 3600 seconds (1 hour)
```

## 🎨 Features

- 🎨 Responsive design with Bootstrap 5
- ⚡ Fast AJAX-based communication
- 🔒 Secure password hashing
- 📱 Mobile-friendly interface
- ✅ Form validation (client & server side)
- 🚀 Session management with Redis
- 💾 Dual database architecture (MySQL + MongoDB)
- 🎯 Clean separation of concerns

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all services are running (Apache, MySQL, MongoDB, Redis)
3. Check browser console for JavaScript errors
4. Check PHP error logs in XAMPP/WAMP logs folder

## 📄 License

This project is created for GUVI internship application purposes.

## 👨‍💻 Author

Created as part of GUVI Internship Application

---

**Note**: This project follows all the requirements specified in the internship problem statement. Make sure to test all functionality before submission!
