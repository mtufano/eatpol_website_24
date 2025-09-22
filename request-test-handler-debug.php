<?php
/**
 * SIMPLIFIED Debug Request Test Handler
 * Minimal version to identify and fix the issues
 */

// Prevent any output before headers
ob_start();

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set JSON content type early
header('Content-Type: application/json');

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Get basic form data
    $firstName = trim($_POST['firstName'] ?? '');
    $lastName = trim($_POST['lastName'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $company = trim($_POST['company'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $country = trim($_POST['country'] ?? '');
    $comments = trim($_POST['comments'] ?? '');

    // Basic validation
    if (empty($firstName) || empty($lastName) || empty($email) || empty($company)) {
        throw new Exception("Please fill in all required fields.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Please enter a valid email address.");
    }

    // Log the successful submission
    $logMessage = "Form submission - Name: $firstName $lastName, Email: $email, Company: $company";
    error_log($logMessage);

    // Clean output buffer
    ob_clean();

    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Request submitted successfully! Redirecting to thank you page...',
        'redirect' => 'thank-you-new-inquiry.html',
        'debug' => [
            'firstName' => $firstName,
            'lastName' => $lastName,
            'email' => $email,
            'company' => $company
        ],
        'timestamp' => date('c')
    ]);

} catch (Exception $e) {
    // Error response
    error_log("Debug handler error: " . $e->getMessage());

    ob_clean();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'timestamp' => date('c')
    ]);
}

ob_end_flush();
?>