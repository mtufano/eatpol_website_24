<?php
/**
 * Admin Data Handler
 * Provides data for the admin dashboard
 */

session_start();

// Check authentication
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

header('Content-Type: application/json');

try {
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
    
    // Load encryption functions
    require_once 'db-config.php';
    
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'stats':
            // Get statistics
            $stats = [];
            
            // Total testers
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM testers");
            $stats['total_testers'] = $stmt->fetch()['count'];
            
            // New testers this week
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM testers WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
            $stats['new_testers'] = $stmt->fetch()['count'];
            
            // Total business requests
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM business_requests");
            $stats['total_requests'] = $stmt->fetch()['count'];
            
            // New requests this week
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM business_requests WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
            $stats['new_requests'] = $stmt->fetch()['count'];
            
            echo json_encode(['success' => true, 'stats' => $stats]);
            break;
            
        case 'testers':
            // Get all testers
            $stmt = $pdo->query("
                SELECT id, first_name, last_name, email, city, country, 
                       program_type, is_active, created_at 
                FROM testers 
                ORDER BY created_at DESC 
                LIMIT 100
            ");
            $testers = $stmt->fetchAll();
            
            // Decrypt data for display
            foreach ($testers as &$tester) {
                $tester['first_name'] = decryptData($tester['first_name']);
                $tester['last_name'] = decryptData($tester['last_name']);
                $tester['email'] = decryptData($tester['email']);
                $tester['city'] = decryptData($tester['city']);
                $tester['country'] = decryptData($tester['country']);
            }
            
            echo json_encode(['success' => true, 'testers' => $testers]);
            break;
            
        case 'requests':
            // Get all business requests
            $stmt = $pdo->query("
                SELECT id, first_name, last_name, email, company, 
                       product_types, participants, launch_date, created_at 
                FROM business_requests 
                ORDER BY created_at DESC 
                LIMIT 100
            ");
            $requests = $stmt->fetchAll();
            
            // Decrypt data for display
            foreach ($requests as &$request) {
                $request['first_name'] = decryptData($request['first_name']);
                $request['last_name'] = decryptData($request['last_name']);
                $request['email'] = decryptData($request['email']);
                $request['company'] = decryptData($request['company']);
            }
            
            echo json_encode(['success' => true, 'requests' => $requests]);
            break;
            
        default:
            throw new Exception('Invalid action');
    }
    
} catch (Exception $e) {
    error_log("Admin data error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>