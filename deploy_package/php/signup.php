<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/mysql_config.php';
require_once 'config/mongodb_config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required!'
    ]);
    exit;
}

$username = trim($input['username']);
$email = trim($input['email']);
$password = $input['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format!'
    ]);
    exit;
}

// Validate password length
if (strlen($password) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 6 characters long!'
    ]);
    exit;
}

// Connect to MySQL
$conn = getMySQLConnection();
if (!$conn) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed!'
    ]);
    exit;
}

try {
    // Check if email already exists using prepared statement
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Email already registered!'
        ]);
        $stmt->close();
        closeMySQLConnection($conn);
        exit;
    }
    $stmt->close();
    
    // Check if username already exists using prepared statement
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Username already taken!'
        ]);
        $stmt->close();
        closeMySQLConnection($conn);
        exit;
    }
    $stmt->close();
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    // Insert user using prepared statement
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);
    
    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        
        // Create initial profile document in MongoDB
        try {
            $mongoCollection = getMongoCollection();
            if ($mongoCollection) {
                $mongoCollection->insertOne([
                    'userId' => (string)$userId,
                    'fullName' => '',
                    'dob' => '',
                    'age' => '',
                    'contact' => '',
                    'address' => '',
                    'city' => '',
                    'country' => '',
                    'createdAt' => new MongoDB\BSON\UTCDateTime(),
                    'updatedAt' => new MongoDB\BSON\UTCDateTime()
                ]);
            }
        } catch (Exception $e) {
            error_log("MongoDB insert failed: " . $e->getMessage());
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed. Please try again.'
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    error_log("Signup error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred during registration.'
    ]);
}

closeMySQLConnection($conn);
?>
