<?php
// MongoDB Configuration
require_once __DIR__ . '/../../vendor/autoload.php'; // Composer autoload

use MongoDB\Client;

// Environment detection
$isLocal = (isset($_SERVER['HTTP_HOST']) && 
           (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
            strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false));

if ($isLocal) {
    // Local Configuration
    define('MONGO_URI', 'mongodb://localhost:27017');
} else {
    // Cloud Configuration - MongoDB Atlas
    // Get from environment variable or use default
    define('MONGO_URI', getenv('MONGO_URI') ?: 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority');
}

define('MONGO_DB', 'user_profiles_db');
define('MONGO_COLLECTION', 'profiles');

// Create MongoDB connection function
function getMongoDBConnection() {
    try {
        $mongoClient = new Client(MONGO_URI);
        return $mongoClient->selectDatabase(MONGO_DB);
    } catch (Exception $e) {
        error_log("MongoDB Connection failed: " . $e->getMessage());
        return null;
    }
}

// Get collection function
function getMongoCollection($collectionName = MONGO_COLLECTION) {
    $db = getMongoDBConnection();
    if ($db) {
        return $db->selectCollection($collectionName);
    }
    return null;
}
?>
