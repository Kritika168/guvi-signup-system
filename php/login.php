<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config/mysql_config.php';
require_once 'config/redis_config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['email']) || !isset($input['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required!'
    ]);
    exit;
}

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
    // Fetch user using prepared statement
    $stmt = $conn->prepare("SELECT id, username, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password!'
        ]);
        $stmt->close();
        closeMySQLConnection($conn);
        exit;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password!'
        ]);
        closeMySQLConnection($conn);
        exit;
    }
    
    // Generate session token
    $sessionToken = bin2hex(random_bytes(32));
    
    // Store session in Redis
    $sessionStored = RedisConfig::setSession($sessionToken, $user['id'], [
        'username' => $user['username'],
        'email' => $user['email']
    ]);
    
    if (!$sessionStored) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create session!'
        ]);
        closeMySQLConnection($conn);
        exit;
    }
    
    // Update last login time using prepared statement
    $stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $stmt->bind_param("i", $user['id']);
    $stmt->execute();
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful!',
        'sessionToken' => $sessionToken,
        'userId' => $user['id'],
        'username' => $user['username'],
        'email' => $user['email']
    ]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred during login.'
    ]);
}

closeMySQLConnection($conn);
?>
