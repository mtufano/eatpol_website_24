<?php
/**
 * Admin Authentication Check
 * Verifies if admin is logged in
 */

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['authenticated' => false]);
    exit;
}

// Check session timeout (2 hours)
if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > 7200) {
    session_destroy();
    echo json_encode(['authenticated' => false, 'message' => 'Session expired']);
    exit;
}

echo json_encode([
    'authenticated' => true,
    'username' => $_SESSION['admin_username'] ?? 'Admin',
    'role' => $_SESSION['admin_role'] ?? 'admin'
]);
?>