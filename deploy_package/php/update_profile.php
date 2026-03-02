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
    // Get profile data
    $fullName = $input['fullName'] ?? '';
    $dob = $input['dob'] ?? '';
    $age = $input['age'] ?? '';
    $contact = $input['contact'] ?? '';
    $address = $input['address'] ?? '';
    $city = $input['city'] ?? '';
    $country = $input['country'] ?? '';
    
    // Update profile in MongoDB
    $collection = getMongoCollection();
    if (!$collection) {
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed!'
        ]);
        exit;
    }
    
    $updateData = [
        'fullName' => $fullName,
        'dob' => $dob,
        'age' => $age,
        'contact' => $contact,
        'address' => $address,
        'city' => $city,
        'country' => $country,
        'updatedAt' => new MongoDB\BSON\UTCDateTime()
    ];
    
    $result = $collection->updateOne(
        ['userId' => (string)$userId],
        ['$set' => $updateData],
        ['upsert' => true]
    );
    
    if ($result->getModifiedCount() > 0 || $result->getUpsertedCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'Profile updated successfully!'
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => 'No changes were made to the profile.'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Update profile error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while updating profile.'
    ]);
}
?>
