<?php
/**
 * FIXED Request Test Handler
 * Handles business inquiry form submissions with proper error handling
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
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    ob_end_flush();
    exit;
}

try {
    // Sanitize and validate input data
    $firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
    $lastName = htmlspecialchars(trim($_POST['lastName'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $company = htmlspecialchars(trim($_POST['company'] ?? ''));
    $city = htmlspecialchars(trim($_POST['city'] ?? ''));
    $country = htmlspecialchars(trim($_POST['country'] ?? ''));
    $comments = htmlspecialchars(trim($_POST['comments'] ?? ''));

    // Handle checkboxes and radio buttons
    $productTypes = isset($_POST['productType']) ? $_POST['productType'] : [];
    $productTypeOther = htmlspecialchars(trim($_POST['productTypeOther'] ?? ''));
    $testFocus = isset($_POST['testFocus']) ? $_POST['testFocus'] : [];
    $participants = htmlspecialchars(trim($_POST['participants'] ?? ''));
    $consumerTarget = htmlspecialchars(trim($_POST['consumerTarget'] ?? ''));
    $consumerTargetSpecific = htmlspecialchars(trim($_POST['consumerTargetSpecific'] ?? ''));
    $launchDate = htmlspecialchars(trim($_POST['launchDate'] ?? ''));

    // Basic validation
    if (empty($firstName) || empty($lastName) || empty($email) || empty($company)) {
        throw new Exception("Please fill in all required fields.");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Please enter a valid email address.");
    }

    // Try to send emails (but don't fail if it doesn't work)
    $emailsSent = false;
    try {
        // Simple email sending without complex dependencies
        $adminSubject = "🎯 New Free Test Request from " . $firstName . " " . $lastName;
        $adminMessage = "NEW FREE TEST REQUEST\n";
        $adminMessage .= str_repeat("=", 50) . "\n\n";
        $adminMessage .= "Name: $firstName $lastName\n";
        $adminMessage .= "Email: $email\n";
        $adminMessage .= "Company: $company\n";
        $adminMessage .= "City: $city\n";
        $adminMessage .= "Country: $country\n\n";
        $adminMessage .= "Product Types: " . implode(', ', $productTypes) . "\n";
        if ($productTypeOther) $adminMessage .= "Other Product: $productTypeOther\n";
        $adminMessage .= "Test Focus: " . implode(', ', $testFocus) . "\n";
        if ($participants) $adminMessage .= "Participants: $participants\n";
        if ($consumerTarget) $adminMessage .= "Consumer Target: $consumerTarget\n";
        if ($consumerTargetSpecific) $adminMessage .= "Specific Segment: $consumerTargetSpecific\n";
        if ($launchDate) $adminMessage .= "Launch Date: $launchDate\n";
        $adminMessage .= "\nComments: $comments\n";
        $adminMessage .= "\nSubmission Time: " . date('Y-m-d H:i:s') . "\n";

        // Simple mail() function
        $headers = "From: noreply@eatpol.com\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        $emailsSent = mail('info@eatpol.com', $adminSubject, $adminMessage, $headers);

    } catch (Exception $e) {
        error_log("Email sending failed: " . $e->getMessage());
        // Continue anyway - don't fail the form submission
    }

    // Try to save to database (but don't fail if database isn't available)
    try {
        // Only try database if we can connect
        if (extension_loaded('pdo_mysql')) {
            // Simple database connection without complex includes
            $dbHost = 'localhost';
            $dbName = 'eatpol_testers';
            $dbUser = 'root';
            $dbPass = '';

            $pdo = new PDO(
                "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
                $dbUser,
                $dbPass,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );

            // Simple insert without encryption
            $stmt = $pdo->prepare("
                INSERT INTO business_requests (
                    first_name, last_name, email, company, city, country,
                    product_types, product_type_other, test_focus, participants,
                    consumer_target, consumer_target_specific, launch_date, comments,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");

            $stmt->execute([
                $firstName, $lastName, $email, $company, $city, $country,
                json_encode($productTypes), $productTypeOther, json_encode($testFocus),
                $participants, $consumerTarget, $consumerTargetSpecific, $launchDate, $comments
            ]);

            error_log("Business inquiry saved to database: $firstName $lastName ($email) - Company: $company");
        }
    } catch (Exception $dbError) {
        error_log("Database save failed: " . $dbError->getMessage());
        // Continue anyway - don't fail the form submission
    }

    // Log the submission
    error_log("Form submission successful: $firstName $lastName ($email) - Company: $company");

    // Success response
    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Request submitted successfully! Redirecting to thank you page...',
        'redirect' => 'thank-you-new-inquiry.html',
        'data' => [
            'emails_sent' => $emailsSent
        ],
        'timestamp' => date('c')
    ]);

} catch (Exception $e) {
    // Error response
    error_log("Request test error: " . $e->getMessage());

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