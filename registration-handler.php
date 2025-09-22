<?php
/**
 * Comprehensive Registration Handler with Database Integration and Email Notifications
 * GDPR Compliant with Encryption and Audit Logging
 */

session_start();
require_once 'db-config.php';
require_once 'email-config.php';
require_once 'phpmailer-simple.php';

header('Content-Type: application/json');

class RegistrationHandler {
    private $db;
    private $emailConfig;
    private $encryptionKey;
    
    public function __construct() {
        $this->db = $this->connectDatabase();
        $this->emailConfig = include 'email-config.php';
        // Use a secure encryption key (in production, store this securely)
        $this->encryptionKey = hash('sha256', 'eatpol_secure_key_2024' . $_SERVER['HTTP_HOST']);
    }
    
    private function connectDatabase() {
        try {
            require_once 'db-config.php';
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            return $pdo;
        } catch (PDOException $e) {
            $this->logError("Database connection failed: " . $e->getMessage());
            return null;
        }
    }
    
    public function processRegistration() {
        try {
            // Validate input
            $data = $this->validateInput();
            if (!$data['valid']) {
                return $this->jsonResponse(false, 'Validation failed', $data['errors']);
            }
            
            // Check for existing email
            if ($this->emailExists($data['email'])) {
                return $this->jsonResponse(false, 'Email already registered');
            }
            
            // Encrypt sensitive data
            $encryptedData = $this->encryptSensitiveData($data);
            
            // Save to database
            $testerId = $this->saveTesterData($encryptedData);
            if (!$testerId) {
                return $this->jsonResponse(false, 'Failed to save registration');
            }
            
            // Send notification emails
            $emailResult = $this->sendNotificationEmails($data, $testerId);
            
            // Log activity
            $this->logActivity('tester_registration', $testerId, [
                'email_hash' => hash('sha256', $data['email']),
                'program_type' => $data['program_type'] ?? 'standard',
                'country' => $data['country'] ?? null
            ]);
            
            return $this->jsonResponse(true, 'Registration successful', [
                'tester_id' => $testerId,
                'email_sent' => $emailResult['admin_sent'],
                'confirmation_sent' => $emailResult['user_sent'],
                'redirect' => 'thank_you_new_tester.html'
            ]);
            
        } catch (Exception $e) {
            $this->logError("Registration error: " . $e->getMessage());
            return $this->jsonResponse(false, 'Registration failed due to server error');
        }
    }
    
    private function validateInput() {
        $required = ['first_name', 'last_name', 'email'];
        $errors = [];
        $data = [];
        
        // Basic required fields
        foreach ($required as $field) {
            $value = $_POST[$field] ?? '';
            if (empty(trim($value))) {
                $errors[] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
            } else {
                $data[$field] = trim($value);
            }
        }
        
        // Email validation
        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email format';
        }
        
        // GDPR consent validation
        if (!isset($_POST['gdpr_consent']) || $_POST['gdpr_consent'] !== 'yes') {
            $errors[] = 'GDPR consent is required';
        }
        
        // Collect all form data
        $allFields = [
            'phone', 'street_address', 'city', 'postal_code', 'country',
            'date_of_birth', 'age_group', 'gender', 'program_type',
            'management_experience', 'time_availability', 'network_size',
            'bank_account', 'payment_method', 'manager_motivation'
        ];
        
        foreach ($allFields as $field) {
            if (isset($_POST[$field]) && !empty(trim($_POST[$field]))) {
                $data[$field] = trim($_POST[$field]);
            }
        }
        
        // Handle checkboxes and arrays
        $data['gdpr_consent'] = isset($_POST['gdpr_consent']) && $_POST['gdpr_consent'] === 'yes';
        $data['marketing_consent'] = isset($_POST['marketing_consent']) && $_POST['marketing_consent'] === 'yes';
        $data['terms_accepted'] = isset($_POST['terms_accepted']) && $_POST['terms_accepted'] === 'yes';
        
        // Process dietary restrictions and allergies
        $data['dietary_restrictions'] = $this->processDietaryData($_POST['dietary_restrictions'] ?? []);
        $data['food_allergies'] = $this->processFoodAllergies($_POST['food_allergies'] ?? []);
        
        return [
            'valid' => empty($errors),
            'errors' => $errors,
            ...$data
        ];
    }
    
    private function processDietaryData($restrictions) {
        $options = ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'low_sodium', 'kosher', 'halal'];
        $result = [];
        
        if (is_array($restrictions)) {
            foreach ($options as $option) {
                $result[$option] = in_array($option, $restrictions);
            }
        }
        
        return json_encode($result);
    }
    
    private function processFoodAllergies($allergies) {
        if (is_array($allergies)) {
            return json_encode(array_values($allergies));
        } elseif (is_string($allergies)) {
            return json_encode(array_map('trim', explode(',', $allergies)));
        }
        return json_encode([]);
    }
    
    private function emailExists($email) {
        $emailHash = hash('sha256', strtolower($email));
        $stmt = $this->db->prepare("SELECT id FROM testers WHERE email_hash = ?");
        $stmt->execute([$emailHash]);
        return $stmt->fetchColumn() !== false;
    }
    
    private function encryptSensitiveData($data) {
        $sensitiveFields = [
            'first_name', 'last_name', 'email', 'phone', 
            'street_address', 'city', 'postal_code', 'country', 'bank_account'
        ];
        
        $encrypted = $data;
        
        foreach ($sensitiveFields as $field) {
            if (isset($data[$field])) {
                $encrypted[$field] = $this->encrypt($data[$field]);
            }
        }
        
        // Add email hash for uniqueness check
        $encrypted['email_hash'] = hash('sha256', strtolower($data['email']));
        
        return $encrypted;
    }
    
    private function encrypt($data) {
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $this->encryptionKey, 0, $iv);
        return base64_encode($iv . $encrypted);
    }
    
    private function decrypt($data) {
        $data = base64_decode($data);
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        return openssl_decrypt($encrypted, 'AES-256-CBC', $this->encryptionKey, 0, $iv);
    }
    
    private function saveTesterData($data) {
        $sql = "INSERT INTO testers (
            first_name, last_name, email, email_hash, phone,
            street_address, city, postal_code, country,
            date_of_birth, age_group, gender,
            dietary_restrictions, food_allergies,
            gdpr_consent, marketing_consent, terms_accepted, consent_date,
            verification_token, program_type, management_experience,
            time_availability, network_size, bank_account, payment_method,
            manager_motivation, registration_ip
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?
        )";
        
        $verificationToken = bin2hex(random_bytes(32));
        
        $params = [
            $data['first_name'] ?? '',
            $data['last_name'] ?? '',
            $data['email'] ?? '',
            $data['email_hash'],
            $data['phone'] ?? null,
            $data['street_address'] ?? null,
            $data['city'] ?? null,
            $data['postal_code'] ?? null,
            $data['country'] ?? null,
            $data['date_of_birth'] ?? null,
            $data['age_group'] ?? null,
            $data['gender'] ?? null,
            $data['dietary_restrictions'],
            $data['food_allergies'],
            $data['gdpr_consent'],
            $data['marketing_consent'],
            $data['terms_accepted'],
            $verificationToken,
            $data['program_type'] ?? 'standard',
            $data['management_experience'] ?? null,
            $data['time_availability'] ?? null,
            $data['network_size'] ?? null,
            $data['bank_account'] ?? null,
            $data['payment_method'] ?? null,
            $data['manager_motivation'] ?? null,
            $_SERVER['REMOTE_ADDR'] ?? null
        ];
        
        $stmt = $this->db->prepare($sql);
        
        if ($stmt->execute($params)) {
            return $this->db->lastInsertId();
        }
        
        return false;
    }
    
    private function sendNotificationEmails($data, $testerId) {
        $results = ['admin_sent' => false, 'user_sent' => false];
        
        // 1. Send notification to admin (info@eatpol.com)
        $adminSubject = "🎯 New Tester Registration - " . $data['first_name'] . " " . $data['last_name'];
        $adminMessage = $this->buildAdminNotification($data, $testerId);
        
        try {
            $results['admin_sent'] = sendEmailEnhanced(
                $this->emailConfig['to_email'], 
                $adminSubject, 
                $adminMessage, 
                $this->emailConfig
            );
        } catch (Exception $e) {
            $this->logError("Admin email failed: " . $e->getMessage());
        }
        
        // 2. Send confirmation to user
        $userSubject = "Welcome to Eatpol - Registration Confirmed";
        $userMessage = $this->buildUserConfirmation($data);
        
        try {
            $results['user_sent'] = sendEmailEnhanced(
                $data['email'], 
                $userSubject, 
                $userMessage, 
                $this->emailConfig
            );
        } catch (Exception $e) {
            $this->logError("User email failed: " . $e->getMessage());
        }
        
        return $results;
    }
    
    private function buildAdminNotification($data, $testerId) {
        $message = "🎯 NEW TESTER REGISTRATION\n";
        $message .= "=" . str_repeat("=", 40) . "\n\n";
        
        $message .= "📋 BASIC INFORMATION:\n";
        $message .= "Name: {$data['first_name']} {$data['last_name']}\n";
        $message .= "Email: {$data['email']}\n";
        $message .= "Phone: " . ($data['phone'] ?? 'Not provided') . "\n";
        $message .= "Country: " . ($data['country'] ?? 'Not provided') . "\n\n";
        
        $message .= "🏠 ADDRESS:\n";
        $message .= "Street: " . ($data['street_address'] ?? 'Not provided') . "\n";
        $message .= "City: " . ($data['city'] ?? 'Not provided') . "\n";
        $message .= "Postal Code: " . ($data['postal_code'] ?? 'Not provided') . "\n\n";
        
        $message .= "👤 DEMOGRAPHICS:\n";
        $message .= "Age Group: " . ($data['age_group'] ?? 'Not provided') . "\n";
        $message .= "Gender: " . ($data['gender'] ?? 'Not provided') . "\n";
        $message .= "Date of Birth: " . ($data['date_of_birth'] ?? 'Not provided') . "\n\n";
        
        if (isset($data['program_type']) && $data['program_type'] === 'country_manager') {
            $message .= "🌟 COUNTRY MANAGER APPLICATION:\n";
            $message .= "Experience: " . ($data['management_experience'] ?? 'Not provided') . "\n";
            $message .= "Time Availability: " . ($data['time_availability'] ?? 'Not provided') . "\n";
            $message .= "Network Size: " . ($data['network_size'] ?? 'Not provided') . "\n";
            $message .= "Motivation: " . ($data['manager_motivation'] ?? 'Not provided') . "\n\n";
        }
        
        $message .= "✅ CONSENT STATUS:\n";
        $message .= "GDPR Consent: " . ($data['gdpr_consent'] ? 'YES' : 'NO') . "\n";
        $message .= "Marketing Consent: " . ($data['marketing_consent'] ? 'YES' : 'NO') . "\n";
        $message .= "Terms Accepted: " . ($data['terms_accepted'] ? 'YES' : 'NO') . "\n\n";
        
        $message .= "🔗 ADMIN ACTIONS:\n";
        $message .= "Tester ID: #$testerId\n";
        $message .= "Registration Time: " . date('Y-m-d H:i:s') . "\n";
        $message .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n\n";
        
        $message .= "Next Steps:\n";
        $message .= "1. Review registration in admin panel\n";
        $message .= "2. Verify email address\n";
        $message .= "3. Activate tester account\n";
        $message .= "4. Send welcome materials\n\n";
        
        $message .= "View in admin panel: " . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "/admin.html\n";
        
        return $message;
    }
    
    private function buildUserConfirmation($data) {
        $message = "🎉 Welcome to Eatpol!\n\n";
        $message .= "Dear {$data['first_name']},\n\n";
        $message .= "Thank you for registering as a tester with Eatpol! We're excited to have you join our community.\n\n";
        
        $message .= "📋 Registration Summary:\n";
        $message .= "Name: {$data['first_name']} {$data['last_name']}\n";
        $message .= "Email: {$data['email']}\n";
        $message .= "Registration Date: " . date('Y-m-d H:i:s') . "\n\n";
        
        if (isset($data['program_type']) && $data['program_type'] === 'country_manager') {
            $message .= "🌟 Country Manager Application:\n";
            $message .= "We've received your application to become a country manager. Our team will review your application and contact you within 5-7 business days.\n\n";
        }
        
        $message .= "What happens next?\n";
        $message .= "1. Our team will review your registration\n";
        $message .= "2. We'll verify your email address\n";
        $message .= "3. You'll receive further instructions within 2-3 business days\n";
        $message .= "4. Once approved, you'll get access to testing opportunities\n\n";
        
        $message .= "🔒 Data Protection:\n";
        $message .= "Your personal data is encrypted and stored securely in compliance with GDPR regulations. You can request access to your data or deletion at any time by contacting us.\n\n";
        
        $message .= "Questions? Contact us:\n";
        $message .= "Email: info@eatpol.com\n";
        $message .= "Website: https://eatpol.com\n\n";
        
        $message .= "Thank you for choosing Eatpol!\n\n";
        $message .= "Best regards,\n";
        $message .= "The Eatpol Team";
        
        return $message;
    }
    
    private function logActivity($action, $userId, $details = []) {
        try {
            $sql = "INSERT INTO activity_logs (user_type, user_id, action, details, ip_address, user_agent) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                'tester',
                $userId,
                $action,
                json_encode($details),
                $_SERVER['REMOTE_ADDR'] ?? null,
                $_SERVER['HTTP_USER_AGENT'] ?? null
            ]);
        } catch (Exception $e) {
            error_log("Activity log error: " . $e->getMessage());
        }
    }
    
    private function logError($message) {
        error_log("[Registration Handler] " . $message);
    }
    
    private function jsonResponse($success, $message, $data = null) {
        $response = [
            'success' => $success,
            'message' => $message,
            'timestamp' => date('c')
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        return json_encode($response, JSON_PRETTY_PRINT);
    }
}

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $handler = new RegistrationHandler();
    echo $handler->processRegistration();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>