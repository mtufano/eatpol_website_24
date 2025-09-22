<?php
// Email Configuration for Eatpol Contact Form
// This file loads settings from .env file for security

// Load environment variables from .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return [];
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue; // Skip comments
        
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $env[trim($parts[0])] = trim($parts[1]);
        }
    }
    
    return $env;
}

$env = loadEnv(__DIR__ . '/.env');

return [
    // Email recipient
    'to_email' => $env['TO_EMAIL'] ?? 'info@eatpol.com',
    
    // Email sender (this should be from your domain)
    'from_email' => $env['FROM_EMAIL'] ?? 'noreply@eatpol.com',
    'from_name' => $env['FROM_NAME'] ?? 'Eatpol Website',
    
    // Email server settings (if using SMTP instead of mail())
    'use_smtp' => filter_var($env['USE_SMTP'] ?? 'true', FILTER_VALIDATE_BOOLEAN),
    'smtp_host' => $env['SMTP_HOST'] ?? 'smtp.gmail.com',
    'smtp_port' => intval($env['SMTP_PORT'] ?? 587),
    'smtp_username' => $env['SMTP_USERNAME'] ?? 'your_gmail@gmail.com',
    'smtp_password' => $env['SMTP_PASSWORD'] ?? 'your_app_password_here',
    'smtp_security' => $env['SMTP_SECURITY'] ?? 'tls',
    
    // Advanced settings
    'log_submissions' => true, // Log all submissions to file
    'require_ssl' => false, // Require HTTPS for form submissions
    'rate_limit' => 10, // Max submissions per IP per hour (0 to disable)
    
    // Email template settings
    'priority_keywords' => ['100', 'Within 3 months'], // Triggers high priority
    'auto_reply' => false, // Send auto-reply to customer (future feature)
];
?>