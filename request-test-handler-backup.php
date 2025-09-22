<?php
/**
 * Enhanced Request Test Handler with Working Email System
 * Handles business inquiry form submissions with proper email delivery
 */

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Start output buffering
ob_start();

// Start session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set JSON content type
header('Content-Type: application/json');

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Load email configuration and working mailer
    $emailConfig = include 'email-config.php';
    require_once 'email-working.php';
    
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
    
    // Prepare admin notification email (plain text for reliability)
    $adminSubject = "🎯 New Free Test Request from " . $firstName . " " . $lastName;
    $adminMessage = "NEW FREE TEST REQUEST\n";
    $adminMessage .= str_repeat("=", 50) . "\n\n";
    
    $adminMessage .= "PERSONAL INFORMATION:\n";
    $adminMessage .= "Name: $firstName $lastName\n";
    $adminMessage .= "Email: $email\n";
    $adminMessage .= "Company: $company\n";
    $adminMessage .= "City: $city\n";
    $adminMessage .= "Country: $country\n\n";
    
    $adminMessage .= "PRODUCT INFORMATION:\n";
    $adminMessage .= "Product Types:\n";
    if (!empty($productTypes)) {
        foreach ($productTypes as $type) {
            $adminMessage .= "  - " . htmlspecialchars($type) . "\n";
        }
    }
    if (!empty($productTypeOther)) {
        $adminMessage .= "  - Other: $productTypeOther\n";
    }
    $adminMessage .= "\n";
    
    $adminMessage .= "TESTING REQUIREMENTS:\n";
    $adminMessage .= "What to Test:\n";
    if (!empty($testFocus)) {
        foreach ($testFocus as $focus) {
            $adminMessage .= "  - " . htmlspecialchars($focus) . "\n";
        }
    }
    $adminMessage .= "\n";
    
    if (!empty($participants)) {
        $adminMessage .= "Number of Participants: $participants\n";
    }
    if (!empty($consumerTarget)) {
        $adminMessage .= "Consumer Target: $consumerTarget\n";
    }
    if (!empty($consumerTargetSpecific)) {
        $adminMessage .= "Specific Segment: $consumerTargetSpecific\n";
    }
    if (!empty($launchDate)) {
        $adminMessage .= "Launch Date: $launchDate\n";
    }
    $adminMessage .= "\n";
    
    if (!empty($comments)) {
        $adminMessage .= "ADDITIONAL COMMENTS:\n";
        $adminMessage .= "$comments\n\n";
    }
    
    $adminMessage .= "REQUEST DETAILS:\n";
    $adminMessage .= "Submission Time: " . date('Y-m-d H:i:s') . "\n\n";
    
    $adminMessage .= "Next Steps:\n";
    $adminMessage .= "1. Review the test request details\n";
    $adminMessage .= "2. Contact the client within 1 business day\n";
    $adminMessage .= "3. Discuss testing requirements and pricing\n";
    $adminMessage .= "4. Schedule the testing session\n";
    
    // Prepare user confirmation email
    $userSubject = "Your Free Test Request - Eatpol";
    $userMessage = "Dear $firstName,\n\n";
    $userMessage .= "Thank you for your interest in Eatpol testing services!\n\n";
    $userMessage .= "We've received your free test request and our team will review your information. ";
    $userMessage .= "You'll hear back from us within 1 business day with next steps and any questions we might have.\n\n";
    
    $userMessage .= "Your Request Summary:\n";
    $userMessage .= "- Company: $company\n";
    $userMessage .= "- Product Types: " . (!empty($productTypes) ? implode(', ', $productTypes) : 'Not specified') . "\n";
    if (!empty($productTypeOther)) {
        $userMessage .= "- Other Product Type: $productTypeOther\n";
    }
    $userMessage .= "- Testing Focus: " . (!empty($testFocus) ? implode(', ', $testFocus) : 'Not specified') . "\n";
    if (!empty($participants)) {
        $userMessage .= "- Participants: $participants\n";
    }
    if (!empty($launchDate)) {
        $userMessage .= "- Launch Date: $launchDate\n";
    }
    $userMessage .= "\n";
    
    $userMessage .= "What happens next?\n";
    $userMessage .= "1. Our team reviews your request\n";
    $userMessage .= "2. We contact you within 1 business day\n";
    $userMessage .= "3. We design a customized test plan for your needs\n";
    $userMessage .= "4. We conduct the test and deliver actionable insights\n\n";
    
    $userMessage .= "If you have any immediate questions, feel free to contact us at info@eatpol.com\n\n";
    $userMessage .= "Best regards,\n";
    $userMessage .= "The Eatpol Team\n";
    $userMessage .= "Website: https://eatpol.com";
    
    // Send emails using working email system
    $adminEmailSent = false;
    $userEmailSent = false;
    
    try {
        $adminEmailSent = sendEmailWorking($emailConfig['to_email'], $adminSubject, $adminMessage, $emailConfig);
    } catch (Exception $e) {
        error_log("Admin email failed: " . $e->getMessage());
    }
    
    try {
        $userEmailSent = sendEmailWorking($email, $userSubject, $userMessage, $emailConfig);
    } catch (Exception $e) {
        error_log("User email failed: " . $e->getMessage());
    }
    
    // Save to database
    try {
        // Load database configuration
        require_once 'db-config.php';

        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        
        // Prepare data for database
        $emailHash = hash('sha256', $email);
        
        // Insert business request
        $stmt = $pdo->prepare("
            INSERT INTO business_requests (
                first_name, last_name, email, email_hash, company, city, country,
                product_types, product_type_other, test_focus, participants,
                consumer_target, consumer_target_specific, launch_date, comments
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            encryptData($firstName),
            encryptData($lastName),
            encryptData($email),
            $emailHash,
            encryptData($company),
            encryptData($city),
            encryptData($country),
            json_encode($productTypes),
            $productTypeOther ? encryptData($productTypeOther) : null,
            json_encode($testFocus),
            $participants,
            $consumerTarget,
            $consumerTargetSpecific ? encryptData($consumerTargetSpecific) : null,
            $launchDate,
            encryptData($comments)
        ]);
        
        $requestId = $pdo->lastInsertId();
        
        // Log activity
        $stmt = $pdo->prepare("
            INSERT INTO business_request_activity (request_id, activity_type, description)
            VALUES (?, 'created', ?)
        ");
        $stmt->execute([
            $requestId,
            "Business inquiry submitted by $firstName $lastName from $company"
        ]);
        
        error_log("Business inquiry saved to database: ID $requestId - $firstName $lastName ($email) - Company: $company");
        
    } catch (Exception $dbError) {
        // Don't fail the entire request if database save fails
        error_log("Database save failed for business inquiry: " . $dbError->getMessage());
    }
    
    // Success response with redirect
    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Request submitted successfully! Redirecting to thank you page...',
        'redirect' => 'thank-you-new-inquiry.html',
        'data' => [
            'admin_email_sent' => $adminEmailSent,
            'user_email_sent' => $userEmailSent
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