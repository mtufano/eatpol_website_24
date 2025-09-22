<?php
/**
 * Admin Login Handler
 * Handles authentication for admin users
 */

// Start session
session_start();

// Set JSON content type
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        throw new Exception('Username and password are required');
    }
    
    $username = trim($input['username']);
    $password = $input['password'];
    
    if (empty($username) || empty($password)) {
        throw new Exception('Username and password cannot be empty');
    }
    
    // Database connection
    $dbConfig = [
        'host' => 'localhost',
        'dbname' => 'eatpol_testers',
        'username' => 'root',
        'password' => ''
    ];
    
    $pdo = new PDO(
        "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset=utf8mb4",
        $dbConfig['username'],
        $dbConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    
    // Find admin user
    $stmt = $pdo->prepare("
        SELECT id, username, email, password_hash, role, is_active, created_at
        FROM admin_users 
        WHERE username = ? AND is_active = 1
    ");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        throw new Exception('Invalid username or password');
    }
    
    // Verify password
    if (!password_verify($password, $admin['password_hash'])) {
        throw new Exception('Invalid username or password');
    }
    
    // Update last login
    $stmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$admin['id']]);
    
    // Set session data
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_username'] = $admin['username'];
    $_SESSION['admin_role'] = $admin['role'];
    $_SESSION['admin_email'] = $admin['email'];
    $_SESSION['login_time'] = time();
    
    // Log the login
    error_log("Admin login successful: {$admin['username']} (ID: {$admin['id']})");
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'admin' => [
            'username' => $admin['username'],
            'role' => $admin['role']
        ]
    ]);
    
} catch (Exception $e) {
    // Log the error
    error_log("Admin login error: " . $e->getMessage());
    
    // Error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>