<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

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

try {
    // Delete session from Redis
    RedisConfig::deleteSession($sessionToken);
    
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully!'
    ]);
    
} catch (Exception $e) {
    error_log("Logout error: " . $e->getMessage());
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully!'
    ]);
}
?>
