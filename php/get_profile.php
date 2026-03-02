<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/mongodb_config.php';
require_once 'config/redis_config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['sessionToken']) || !isset($input['userId'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request!'
    ]);
    exit;
}

$sessionToken = $input['sessionToken'];
$userId = $input['userId'];

// Validate session
if (!RedisConfig::validateSession($sessionToken, $userId)) {
    echo json_encode([
        'success' => false,
        'message' => 'Session expired or invalid!'
    ]);
    exit;
}

try {
    // Fetch profile from MongoDB
    $collection = getMongoCollection();
    if (!$collection) {
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed!'
        ]);
        exit;
    }
    
    $profile = $collection->findOne(['userId' => (string)$userId]);
    
    if ($profile) {
        echo json_encode([
            'success' => true,
            'profile' => [
                'fullName' => $profile['fullName'] ?? '',
                'dob' => $profile['dob'] ?? '',
                'age' => $profile['age'] ?? '',
                'contact' => $profile['contact'] ?? '',
                'address' => $profile['address'] ?? '',
                'city' => $profile['city'] ?? '',
                'country' => $profile['country'] ?? ''
            ]
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'profile' => null
        ]);
    }
    
} catch (Exception $e) {
    error_log("Get profile error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while fetching profile.'
    ]);
}
?>
