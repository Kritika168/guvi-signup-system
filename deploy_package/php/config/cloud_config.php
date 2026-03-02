<?php
// Cloud Configuration for Online Deployment

// Environment detection
$isLocal = (isset($_SERVER['HTTP_HOST']) && (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false));

if ($isLocal) {
    // Local Development Configuration
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'user_registration_db');
    
    define('MONGO_URI', 'mongodb://localhost:27017');
    define('MONGO_DB', 'user_profiles_db');
    
    define('REDIS_HOST', '127.0.0.1');
    define('REDIS_PORT', 6379);
    define('REDIS_PASSWORD', null);
} else {
    // Cloud/Production Configuration
    // Replace these with your actual cloud service credentials
    
    // Cloud MySQL (e.g., FreeMySQLHosting, RemoteMySQL, or your hosting provider)
    define('DB_HOST', getenv('DB_HOST') ?: 'sql.freedb.tech');
    define('DB_USER', getenv('DB_USER') ?: 'freedb_your_username');
    define('DB_PASS', getenv('DB_PASS') ?: 'your_password');
    define('DB_NAME', getenv('DB_NAME') ?: 'freedb_user_registration_db');
    
    // MongoDB Atlas (Free Tier: https://www.mongodb.com/cloud/atlas/register)
    // Format: mongodb+srv://username:password@cluster.mongodb.net/database
    define('MONGO_URI', getenv('MONGO_URI') ?: 'mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority');
    define('MONGO_DB', getenv('MONGO_DB') ?: 'user_profiles_db');
    
    // Redis Cloud (Free Tier: https://redis.com/try-free/)
    define('REDIS_HOST', getenv('REDIS_HOST') ?: 'redis-12345.c1.us-east-1-2.ec2.cloud.redislabs.com');
    define('REDIS_PORT', getenv('REDIS_PORT') ?: 12345);
    define('REDIS_PASSWORD', getenv('REDIS_PASSWORD') ?: 'your_redis_password');
}

// Session configuration
define('SESSION_EXPIRY', 3600); // 1 hour
?>
