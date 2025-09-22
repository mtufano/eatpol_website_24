<?php
/**
 * Database Configuration for Eatpol Tester Registration System
 * 
 * SECURITY NOTES:
 * 1. Update these credentials with your actual database info
 * 2. Never commit real credentials to version control
 * 3. Use environment variables in production
 * 4. Ensure database user has minimal required privileges
 */

// Load environment variables
function loadEnvFile($path) {
    if (!file_exists($path)) return [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $env[trim($parts[0])] = trim($parts[1]);
        }
    }
    return $env;
}

$env = loadEnvFile(__DIR__ . '/.env');

// Database Configuration - using environment variables
define('DB_HOST', $env['DB_HOST'] ?? 'localhost');
define('DB_NAME', $env['DB_NAME'] ?? 'eatpol_testers');
define('DB_USER', $env['DB_USER'] ?? 'root');
define('DB_PASS', $env['DB_PASS'] ?? '');
define('DB_CHARSET', 'utf8mb4');

// Encryption key for sensitive data - loaded from environment
define('ENCRYPTION_KEY', $env['ENCRYPTION_KEY'] ?? 'change_this_to_random_32_character_string_12345');

// Security Settings
define('BCRYPT_COST', 12);              // Password hashing strength
define('SESSION_LIFETIME', 3600);       // 1 hour session timeout
define('MAX_LOGIN_ATTEMPTS', 5);        // Max failed login attempts
define('LOCKOUT_TIME', 900);            // 15 minutes lockout after max attempts

// Email Settings (for notifications)
define('ADMIN_EMAIL', 'info@eatpol.com');
define('FROM_EMAIL', 'noreply@eatpol.com');
define('FROM_NAME', 'Eatpol Tester Registration');

// Application Settings
define('SITE_URL', 'https://eatpol.com');  // Your website URL
define('REQUIRE_SSL', true);                // Force HTTPS for forms
define('ENABLE_CAPTCHA', true);            // Enable reCAPTCHA
define('RECAPTCHA_SITE_KEY', 'your_recaptcha_site_key');
define('RECAPTCHA_SECRET_KEY', 'your_recaptcha_secret_key');

// Data Retention (GDPR)
define('DATA_RETENTION_DAYS', 730);     // 2 years
define('LOG_RETENTION_DAYS', 90);       // 3 months for logs

// Error Reporting (set to 0 in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);  // Never show errors to users
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');

// Create logs directory if it doesn't exist
if (!file_exists(__DIR__ . '/logs')) {
    mkdir(__DIR__ . '/logs', 0755, true);
}

/**
 * Database Connection Function
 */
function getDBConnection() {
    static $connection = null;
    
    if ($connection === null) {
        try {
            $connection = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
                ]
            );
        } catch (PDOException $e) {
            // Log error securely, don't expose to user
            error_log("Database connection failed: " . $e->getMessage());
            die("Connection failed. Please try again later.");
        }
    }
    
    return $connection;
}

/**
 * Encryption Functions for Sensitive Data
 */
function encryptData($data) {
    $key = hash('sha256', ENCRYPTION_KEY, true);
    $iv = openssl_random_pseudo_bytes(16);
    $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
    return base64_encode($encrypted . '::' . $iv);
}

function decryptData($data) {
    $key = hash('sha256', ENCRYPTION_KEY, true);
    list($encrypted_data, $iv) = array_pad(explode('::', base64_decode($data), 2), 2, null);
    if (!$iv) return false;
    return openssl_decrypt($encrypted_data, 'AES-256-CBC', $key, 0, $iv);
}

/**
 * Security Functions
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function isHTTPS() {
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
        || $_SERVER['SERVER_PORT'] == 443
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https');
}

// Force HTTPS in production
if (REQUIRE_SSL && !isHTTPS() && php_sapi_name() != 'cli') {
    header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
?>