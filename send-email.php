<?php
// Enable CORS for frontend requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['firstName', 'lastName', 'email', 'company', 'city', 'country', 'comments'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit();
    }
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Sanitize input data
$data = [
    'firstName' => htmlspecialchars(trim($input['firstName'])),
    'lastName' => htmlspecialchars(trim($input['lastName'])),
    'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
    'company' => htmlspecialchars(trim($input['company'])),
    'city' => htmlspecialchars(trim($input['city'])),
    'country' => htmlspecialchars(trim($input['country'])),
    'comments' => htmlspecialchars(trim($input['comments'])),
    'productTypes' => $input['productTypes'] ?? [],
    'productTypeOther' => htmlspecialchars(trim($input['productTypeOther'] ?? '')),
    'testFocus' => $input['testFocus'] ?? [],
    'participants' => htmlspecialchars(trim($input['participants'] ?? '')),
    'consumerTarget' => htmlspecialchars(trim($input['consumerTarget'] ?? '')),
    'consumerTargetSpecific' => htmlspecialchars(trim($input['consumerTargetSpecific'] ?? '')),
    'launchDate' => htmlspecialchars(trim($input['launchDate'] ?? '')),
    'timestamp' => $input['timestamp'] ?? date('c'),
    'submissionId' => $input['submissionId'] ?? uniqid('eatpol_', true)
];

// Prepare email content
$to = 'info@eatpol.com';
$subject = "🚀 New Test Request from {$data['company']} - #{$data['submissionId']}";

// Priority assessment
$priority = 'Standard';
if ($data['participants'] === '100' || $data['launchDate'] === 'Within 3 months') {
    $priority = '🔥 HIGH PRIORITY';
}

// Create comprehensive email body
$emailBody = "
🚀 NEW TEST REQUEST RECEIVED

═══════════════════════════════════════

📋 SUBMISSION DETAILS:
• Priority Level: {$priority}
• Submission ID: #{$data['submissionId']}
• Received: " . date('M j, Y g:i A', strtotime($data['timestamp'])) . "

═══════════════════════════════════════

👤 CONTACT INFORMATION:
• Name: {$data['firstName']} {$data['lastName']}
• Email: {$data['email']}
• Company: {$data['company']}
• Location: {$data['city']}, {$data['country']}

═══════════════════════════════════════

🥘 PRODUCT DETAILS:
• Product Types: " . (empty($data['productTypes']) ? 'None selected' : implode(', ', $data['productTypes'])) . "
" . (!empty($data['productTypeOther']) ? "• Other Product: {$data['productTypeOther']}\n" : "") . "
═══════════════════════════════════════

🧪 TESTING REQUIREMENTS:
• Focus Areas: " . (empty($data['testFocus']) ? 'None selected' : implode(', ', $data['testFocus'])) . "
• Participants: {$data['participants']}
• Target Group: {$data['consumerTarget']}
" . (!empty($data['consumerTargetSpecific']) ? "• Specific Segment: {$data['consumerTargetSpecific']}\n" : "") . "• Launch Date: {$data['launchDate']}

═══════════════════════════════════════

💬 ADDITIONAL COMMENTS:
{$data['comments']}

═══════════════════════════════════════

🔄 NEXT STEPS:
✓ Contact client within 3 business days (as promised on website)
✓ Review full details in admin panel
✓ Prepare customized test proposal

═══════════════════════════════════════

📊 ADMIN PANEL:
View all submissions: " . (isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'https://eatpol.com') . "/admin.html

═══════════════════════════════════════
This email was automatically sent from the Eatpol contact form.
Reply directly to this email to contact the customer.
";

// Email headers
$headers = [
    'From' => "Eatpol Website <noreply@eatpol.com>",
    'Reply-To' => $data['email'],
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Priority' => ($priority === '🔥 HIGH PRIORITY') ? '1' : '3'
];

// Convert headers to string format
$headerString = '';
foreach ($headers as $key => $value) {
    $headerString .= "$key: $value\r\n";
}

// Attempt to send email
$emailSent = false;
$errorMessage = '';

try {
    // Try to send with mail() function
    if (function_exists('mail')) {
        $emailSent = mail($to, $subject, $emailBody, $headerString);
        if (!$emailSent) {
            $errorMessage = 'mail() function failed';
        }
    } else {
        $errorMessage = 'mail() function not available';
    }
} catch (Exception $e) {
    $errorMessage = 'Exception: ' . $e->getMessage();
}

// If basic mail() fails, try alternative methods
if (!$emailSent) {
    // Try using sendmail directly if available
    if (function_exists('exec') && !$emailSent) {
        try {
            $tempFile = tempnam(sys_get_temp_dir(), 'eatpol_email_');
            file_put_contents($tempFile, $emailBody);
            
            $sendmailCmd = "sendmail -t < $tempFile";
            $sendmailHeaders = "To: $to\r\nSubject: $subject\r\n$headerString\r\n";
            
            file_put_contents($tempFile, $sendmailHeaders . "\r\n" . $emailBody);
            exec($sendmailCmd, $output, $return_code);
            
            if ($return_code === 0) {
                $emailSent = true;
            }
            
            unlink($tempFile);
        } catch (Exception $e) {
            // Continue to response
        }
    }
}

// Log the submission regardless of email success
$logEntry = [
    'timestamp' => date('c'),
    'submissionId' => $data['submissionId'],
    'email' => $data['email'],
    'company' => $data['company'],
    'emailSent' => $emailSent,
    'errorMessage' => $errorMessage
];

// Try to log to file
try {
    $logFile = __DIR__ . '/submissions.log';
    file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
} catch (Exception $e) {
    // Log file creation failed, continue
}

// Prepare response
if ($emailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully to info@eatpol.com',
        'submissionId' => $data['submissionId'],
        'priority' => $priority
    ]);
} else {
    // Email failed but we still want to save the data
    http_response_code(202); // Accepted but not fully processed
    echo json_encode([
        'success' => false,
        'message' => 'Email delivery failed, but data has been saved. Please check admin panel.',
        'error' => $errorMessage,
        'submissionId' => $data['submissionId'],
        'fallback' => true // Indicates frontend should use mailto fallback
    ]);
}
?>