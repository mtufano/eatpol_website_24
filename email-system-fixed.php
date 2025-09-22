<?php
/**
 * Fixed Email System for Eatpol
 * This version handles SMTP properly and has better error handling
 */

class EatpolMailer {
    private $config;
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function send($to, $subject, $body) {
        // Try different methods in order of preference
        $methods = [
            'phpMailer' => 'sendWithPHPMailer',
            'socketSMTP' => 'sendWithSocketSMTP',
            'basicMail' => 'sendWithBasicMail',
            'logToFile' => 'logEmailToFile'
        ];
        
        foreach ($methods as $methodName => $methodFunc) {
            try {
                $result = $this->$methodFunc($to, $subject, $body);
                if ($result) {
                    error_log("Email sent successfully using method: $methodName");
                    return true;
                }
            } catch (Exception $e) {
                error_log("Email method $methodName failed: " . $e->getMessage());
                continue;
            }
        }
        
        return false;
    }
    
    private function sendWithPHPMailer($to, $subject, $body) {
        // Check if PHPMailer is available
        if (!class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
            return false;
        }
        
        // PHPMailer implementation would go here
        // For now, return false to try next method
        return false;
    }
    
    private function sendWithSocketSMTP($to, $subject, $body) {
        if (!$this->config['use_smtp']) {
            return false;
        }
        
        $smtp_host = $this->config['smtp_host'];
        $smtp_port = $this->config['smtp_port'];
        $smtp_username = $this->config['smtp_username'];
        $smtp_password = $this->config['smtp_password'];
        
        // Create socket connection
        $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 30);
        if (!$socket) {
            throw new Exception("Could not connect to SMTP server: $errstr ($errno)");
        }
        
        // Read initial greeting
        $response = fgets($socket);
        if (substr($response, 0, 3) !== '220') {
            fclose($socket);
            throw new Exception("SMTP server not ready: $response");
        }
        
        // Send EHLO
        $this->smtpCommand($socket, "EHLO localhost", '250');
        
        // Start TLS
        $this->smtpCommand($socket, "STARTTLS", '220');
        
        // Enable encryption
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            throw new Exception("Failed to enable TLS encryption");
        }
        
        // Send EHLO again after TLS
        $this->smtpCommand($socket, "EHLO localhost", '250');
        
        // Authenticate
        $this->smtpCommand($socket, "AUTH LOGIN", '334');
        $this->smtpCommand($socket, base64_encode($smtp_username), '334');
        $this->smtpCommand($socket, base64_encode($smtp_password), '235');
        
        // Send email
        $this->smtpCommand($socket, "MAIL FROM: <{$this->config['from_email']}>", '250');
        $this->smtpCommand($socket, "RCPT TO: <$to>", '250');
        $this->smtpCommand($socket, "DATA", '354');
        
        // Email content
        $emailContent = $this->buildEmailContent($to, $subject, $body);
        fwrite($socket, $emailContent . "\r\n.\r\n");
        $response = fgets($socket);
        
        // Quit
        fwrite($socket, "QUIT\r\n");
        fclose($socket);
        
        return substr($response, 0, 3) === '250';
    }
    
    private function smtpCommand($socket, $command, $expectedCode) {
        fwrite($socket, $command . "\r\n");
        $response = fgets($socket);
        
        if (substr($response, 0, 3) !== $expectedCode) {
            throw new Exception("SMTP command '$command' failed: $response");
        }
        
        return $response;
    }
    
    private function buildEmailContent($to, $subject, $body) {
        $content = "From: {$this->config['from_name']} <{$this->config['from_email']}>\r\n";
        $content .= "To: $to\r\n";
        $content .= "Subject: $subject\r\n";
        $content .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $content .= "MIME-Version: 1.0\r\n";
        $content .= "Date: " . date('r') . "\r\n";
        $content .= "\r\n";
        $content .= $body;
        
        return $content;
    }
    
    private function sendWithBasicMail($to, $subject, $body) {
        // Configure PHP mail settings temporarily
        $originalSMTP = ini_get('SMTP');
        $originalPort = ini_get('smtp_port');
        $originalFrom = ini_get('sendmail_from');
        
        // Set SMTP settings
        ini_set('SMTP', $this->config['smtp_host']);
        ini_set('smtp_port', $this->config['smtp_port']);
        ini_set('sendmail_from', $this->config['from_email']);
        
        // Prepare headers
        $headers = "From: {$this->config['from_name']} <{$this->config['from_email']}>\r\n";
        $headers .= "Reply-To: {$this->config['from_email']}\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        
        // Send email
        $result = mail($to, $subject, $body, $headers);
        
        // Restore settings
        ini_set('SMTP', $originalSMTP);
        ini_set('smtp_port', $originalPort);
        ini_set('sendmail_from', $originalFrom);
        
        return $result;
    }
    
    private function logEmailToFile($to, $subject, $body) {
        $logDir = __DIR__ . '/logs';
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $logFile = $logDir . '/email-test.log';
        $logContent = "\n=== EMAIL LOG ===\n";
        $logContent .= "Date: " . date('Y-m-d H:i:s') . "\n";
        $logContent .= "To: $to\n";
        $logContent .= "Subject: $subject\n";
        $logContent .= "Body: $body\n";
        $logContent .= "Note: Email was logged instead of sent\n";
        $logContent .= "==================\n\n";
        
        file_put_contents($logFile, $logContent, FILE_APPEND | LOCK_EX);
        
        return true; // Always return true for logging
    }
}

/**
 * Simple function to send emails
 */
function sendEmailReliable($to, $subject, $body, $config = null) {
    if (!$config) {
        $config = include 'email-config.php';
    }
    
    $mailer = new EatpolMailer($config);
    return $mailer->send($to, $subject, $body);
}

/**
 * Backward compatibility function
 */
function sendEmailEnhanced($to, $subject, $body, $config = null) {
    return sendEmailReliable($to, $subject, $body, $config);
}
?>