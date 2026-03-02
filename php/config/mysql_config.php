<?php
// MySQL Database Configuration

// Environment detection
$isLocal = (isset($_SERVER['HTTP_HOST']) && 
           (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
            strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false));

if ($isLocal) {
    // Local Configuration
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'user_registration_db');
} else {
    // Cloud Configuration
    // Use environment variables or update these with your hosting credentials
    define('DB_HOST', getenv('DB_HOST') ?: 'sql.freedb.tech');
    define('DB_USER', getenv('DB_USER') ?: 'freedb_username');
    define('DB_PASS', getenv('DB_PASS') ?: 'password');
    define('DB_NAME', getenv('DB_NAME') ?: 'freedb_user_registration_db');
}

// Create connection function
function getMySQLConnection() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("MySQL Connection failed: " . $conn->connect_error);
        }
        
        return $conn;
    } catch (Exception $e) {
        error_log($e->getMessage());
        return null;
    }
}

// Close connection function
function closeMySQLConnection($conn) {
    if ($conn && !$conn->connect_error) {
        $conn->close();
    }
}
?>
