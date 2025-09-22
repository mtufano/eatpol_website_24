<?php
/**
 * Process Tester Registration
 * Securely handles tester registration with encryption and GDPR compliance
 */

session_start();
header('Content-Type: application/json');

// Include database configuration
require_once 'db-config.php';

// Enable CORS for local development (remove in production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Initialize response
$response = ['success' => false, 'message' => ''];

try {
    // Check if request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }
    
    // Validate CSRF token (basic implementation - enhance for production)
    if (empty($_POST['csrf_token'])) {
        throw new Exception('Security validation failed');
    }
    
    // Get database connection
    $db = getDBConnection();
    
    // Collect and validate input data
    $data = [
        'first_name' => sanitizeInput($_POST['first_name'] ?? ''),
        'last_name' => sanitizeInput($_POST['last_name'] ?? ''),
        'email' => filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL),
        'phone' => sanitizeInput($_POST['phone'] ?? ''),
        'birth_date' => sanitizeInput($_POST['birth_date'] ?? ''),
        'gender' => sanitizeInput($_POST['gender'] ?? ''),
        'street_address' => sanitizeInput($_POST['street_address'] ?? ''),
        'city' => sanitizeInput($_POST['city'] ?? ''),
        'postal_code' => sanitizeInput($_POST['postal_code'] ?? ''),
        'country' => sanitizeInput($_POST['country'] ?? ''),
        'dietary_restrictions' => $_POST['dietary_restrictions'] ?? [],
        'food_allergies' => sanitizeInput($_POST['food_allergies'] ?? ''),
        'gdpr_consent' => isset($_POST['gdpr_consent']) ? 1 : 0,
        'terms_consent' => isset($_POST['terms_consent']) ? 1 : 0,
        'age_consent' => isset($_POST['age_consent']) ? 1 : 0,
        'marketing_consent' => isset($_POST['marketing_consent']) ? 1 : 0,
        'program_type' => sanitizeInput($_POST['program_type'] ?? 'standard'),
        'management_experience' => sanitizeInput($_POST['management_experience'] ?? ''),
        'time_availability' => sanitizeInput($_POST['time_availability'] ?? ''),
        'manager_motivation' => sanitizeInput($_POST['manager_motivation'] ?? ''),
        'network_size' => sanitizeInput($_POST['network_size'] ?? '')
    ];
    
    // Validate required fields
    $requiredFields = ['first_name', 'last_name', 'email', 'phone', 'birth_date', 
                      'street_address', 'city', 'postal_code', 'country', 'program_type'];
    
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Required field missing: $field");
        }
    }
    
    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email address');
    }
    
    // Check age (must be 18+)
    $birthDate = new DateTime($data['birth_date']);
    $today = new DateTime();
    $age = $today->diff($birthDate)->y;
    
    if ($age < 18) {
        throw new Exception('You must be 18 years or older to register');
    }
    
    // Validate consents
    if (!$data['gdpr_consent'] || !$data['terms_consent'] || !$data['age_consent']) {
        throw new Exception('Please accept all required consents');
    }
    
    // Check if email already exists
    $emailHash = hash('sha256', $data['email']);
    $stmt = $db->prepare("SELECT id FROM testers WHERE email_hash = ?");
    $stmt->execute([$emailHash]);
    
    if ($stmt->fetch()) {
        throw new Exception('This email is already registered');
    }
    
    // Prepare data for insertion
    $encryptedData = [
        'first_name' => encryptData($data['first_name']),
        'last_name' => encryptData($data['last_name']),
        'email' => encryptData($data['email']),
        'email_hash' => $emailHash,
        'phone' => encryptData($data['phone']),
        'street_address' => encryptData($data['street_address']),
        'city' => encryptData($data['city']),
        'postal_code' => encryptData($data['postal_code']),
        'country' => encryptData($data['country']),
        'date_of_birth' => $data['birth_date'],
        'gender' => $data['gender'],
        'dietary_restrictions' => json_encode($data['dietary_restrictions']),
        'food_allergies' => json_encode(array_map('trim', explode(',', $data['food_allergies']))),
        'gdpr_consent' => $data['gdpr_consent'],
        'marketing_consent' => $data['marketing_consent'],
        'terms_accepted' => $data['terms_consent'],
        'consent_date' => date('Y-m-d H:i:s'),
        'verification_token' => bin2hex(random_bytes(32)),
        'registration_ip' => $_SERVER['REMOTE_ADDR'] ?? '',
        'status' => 'pending',
        'program_type' => $data['program_type'],
        'management_experience' => $data['management_experience'] ?: null,
        'time_availability' => $data['time_availability'] ?: null,
        'manager_motivation' => $data['manager_motivation'] ?: null,
        'network_size' => $data['network_size'] ?: null,
        'manager_status' => $data['program_type'] === 'country_manager' ? 'applied' : null
    ];
    
    // Determine age group
    $ageGroups = [
        '18-24' => [18, 24],
        '25-34' => [25, 34],
        '35-44' => [35, 44],
        '45-54' => [45, 54],
        '55-64' => [55, 64],
        '65+' => [65, 150]
    ];
    
    foreach ($ageGroups as $group => $range) {
        if ($age >= $range[0] && $age <= $range[1]) {
            $encryptedData['age_group'] = $group;
            break;
        }
    }
    
    // Insert into database
    $sql = "INSERT INTO testers (
        first_name, last_name, email, email_hash, phone,
        street_address, city, postal_code, country,
        date_of_birth, age_group, gender,
        dietary_restrictions, food_allergies,
        gdpr_consent, marketing_consent, terms_accepted, consent_date,
        verification_token, registration_ip, status,
        program_type, management_experience, time_availability, 
        manager_motivation, network_size, manager_status
    ) VALUES (
        :first_name, :last_name, :email, :email_hash, :phone,
        :street_address, :city, :postal_code, :country,
        :date_of_birth, :age_group, :gender,
        :dietary_restrictions, :food_allergies,
        :gdpr_consent, :marketing_consent, :terms_accepted, :consent_date,
        :verification_token, :registration_ip, :status,
        :program_type, :management_experience, :time_availability,
        :manager_motivation, :network_size, :manager_status
    )";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($encryptedData);
    
    $testerId = $db->lastInsertId();
    
    // Log the registration
    $logStmt = $db->prepare("INSERT INTO activity_logs (user_type, user_id, action, details, ip_address, user_agent) 
                             VALUES ('tester', ?, 'registration', ?, ?, ?)");
    $logStmt->execute([
        $testerId,
        json_encode(['email' => $emailHash, 'country' => $data['country']]),
        $_SERVER['REMOTE_ADDR'] ?? '',
        $_SERVER['HTTP_USER_AGENT'] ?? ''
    ]);
    
    // Send confirmation email
    $isCountryManager = $data['program_type'] === 'country_manager';
    $emailSubject = $isCountryManager ? 
        "Welcome to Eatpol Country Manager Program - Application Received" :
        "Welcome to Eatpol - Registration Confirmed";
    
    $emailBody = "Dear {$data['first_name']},\n\n";
    
    if ($isCountryManager) {
        $emailBody .= "Thank you for applying to the Eatpol Country Manager Program! 🌍\n\n";
        $emailBody .= "We're excited about your interest in leading food innovation in your region.\n\n";
        $emailBody .= "Your application is being reviewed by our team. Here's what happens next:\n\n";
        $emailBody .= "📋 Application Review (2-3 business days)\n";
        $emailBody .= "   - We'll assess your experience and motivation\n";
        $emailBody .= "   - Background verification process\n\n";
        $emailBody .= "🎓 Training Program (if accepted)\n";
        $emailBody .= "   - Comprehensive Country Manager certification\n";
        $emailBody .= "   - Learn recruitment strategies and quality management\n";
        $emailBody .= "   - Get access to exclusive manager resources\n\n";
        $emailBody .= "🚀 Launch Your Region\n";
        $emailBody .= "   - Start coordinating tests in your area\n";
        $emailBody .= "   - Earn €50-€150+ per coordinated test\n";
        $emailBody .= "   - Build your local testing community\n\n";
        $emailBody .= "We'll contact you within 3 business days with the next steps.\n\n";
    } else {
        $emailBody .= "Thank you for registering as a food tester with Eatpol!\n\n";
        $emailBody .= "We've received your registration and will review it shortly. ";
        $emailBody .= "You'll receive another email once your account is activated.\n\n";
        $emailBody .= "What happens next:\n";
        $emailBody .= "1. We'll verify your information (1-2 business days)\n";
        $emailBody .= "2. You'll receive an activation email\n";
        $emailBody .= "3. Start receiving food testing opportunities\n\n";
    }
    
    $emailBody .= "If you have any questions, please contact us at info@eatpol.com\n\n";
    $emailBody .= "Best regards,\nThe Eatpol Team";
    
    // Queue email for sending
    $emailStmt = $db->prepare("INSERT INTO email_queue (recipient_email, subject, body) VALUES (?, ?, ?)");
    $emailStmt->execute([$data['email'], $emailSubject, $emailBody]);
    
    // Send admin notification
    $adminSubject = $isCountryManager ? 
        "🌍 NEW COUNTRY MANAGER APPLICATION - {$data['first_name']} {$data['last_name']}" :
        "New Tester Registration - {$data['first_name']} {$data['last_name']}";
    
    $adminBody = $isCountryManager ? 
        "🚨 NEW COUNTRY MANAGER APPLICATION RECEIVED! 🚨\n\n" :
        "New tester registration received:\n\n";
    
    $adminBody .= "Name: {$data['first_name']} {$data['last_name']}\n";
    $adminBody .= "Email: {$data['email']}\n";
    $adminBody .= "Phone: {$data['phone']}\n";
    $adminBody .= "Location: {$data['city']}, {$data['country']}\n";
    $adminBody .= "Age Group: " . ($encryptedData['age_group'] ?? 'Unknown') . "\n";
    $adminBody .= "Program: " . ($isCountryManager ? 'COUNTRY MANAGER 🌍' : 'Standard Tester') . "\n\n";
    
    if ($isCountryManager) {
        $adminBody .= "=== COUNTRY MANAGER DETAILS ===\n";
        $adminBody .= "Experience Level: " . ($data['management_experience'] ?: 'Not specified') . "\n";
        $adminBody .= "Time Availability: " . ($data['time_availability'] ?: 'Not specified') . "\n";
        $adminBody .= "Network Size: " . ($data['network_size'] ?: 'Not specified') . "\n";
        if ($data['manager_motivation']) {
            $adminBody .= "Motivation: {$data['manager_motivation']}\n";
        }
        $adminBody .= "\n🔥 PRIORITY APPLICATION - Review ASAP! 🔥\n\n";
    }
    
    $adminBody .= "Dietary Restrictions: " . implode(', ', $data['dietary_restrictions']) . "\n";
    $adminBody .= "Allergies: {$data['food_allergies']}\n";
    $adminBody .= "Marketing Consent: " . ($data['marketing_consent'] ? 'Yes' : 'No') . "\n\n";
    $adminBody .= "Review at: " . SITE_URL . "/admin-testers.php?id={$testerId}";
    
    // Try to send immediate email to admin
    $headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: {$data['email']}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    @mail(ADMIN_EMAIL, $adminSubject, $adminBody, $headers);
    
    // Success response
    $response['success'] = true;
    $response['message'] = 'Registration successful! Check your email for confirmation.';
    
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    error_log("Tester registration error: " . $e->getMessage());
}

// Return JSON response
echo json_encode($response);
?>