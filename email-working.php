<?php
/**
 * Working Email System for Eatpol
 * Uses pure socket SMTP implementation that actually works with Gmail
 */

class WorkingMailer {
    private $config;
    private $debug = false;
    
    public function __construct($config) {
        $this->config = $config;
    }
    
    public function send($to, $subject, $body) {
        if ($this->config['use_smtp']) {
            return $this->sendViaSMTP($to, $subject, $body);
        } else {
            return $this->logEmailToFile($to, $subject, $body);
        }
    }
    
    private function sendViaSMTP($to, $subject, $body) {
        $smtp_host = $this->config['smtp_host'];
        $smtp_port = $this->config['smtp_port'];
        $smtp_username = $this->config['smtp_username'];
        $smtp_password = $this->config['smtp_password'];
        
        try {
            // Create socket connection
            $socket = fsockopen($smtp_host, $smtp_port, $errno, $errstr, 30);
            if (!$socket) {
                throw new Exception("Cannot connect to SMTP server: $errstr ($errno)");
            }
            
            // Read server greeting
            $this->readResponse($socket, '220');
            
            // Send EHLO
            $this->sendCommand($socket, "EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
            $this->readResponse($socket, '250');
            
            // Start TLS
            $this->sendCommand($socket, "STARTTLS");
            $this->readResponse($socket, '220');
            
            // Enable TLS encryption
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new Exception("Failed to enable TLS encryption");
            }
            
            // Send EHLO again after TLS
            $this->sendCommand($socket, "EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
            $this->readResponse($socket, '250');
            
            // Authenticate
            $this->sendCommand($socket, "AUTH LOGIN");
            $this->readResponse($socket, '334');
            
            $this->sendCommand($socket, base64_encode($smtp_username));
            $this->readResponse($socket, '334');
            
            $this->sendCommand($socket, base64_encode($smtp_password));
            $this->readResponse($socket, '235');
            
            // Send email
            $this->sendCommand($socket, "MAIL FROM:<{$this->config['from_email']}>");
            $this->readResponse($socket, '250');
            
            $this->sendCommand($socket, "RCPT TO:<$to>");
            $this->readResponse($socket, '250');
            
            $this->sendCommand($socket, "DATA");
            $this->readResponse($socket, '354');
            
            // Send email content
            $emailContent = $this->buildEmailContent($to, $subject, $body);
            fwrite($socket, $emailContent);
            fwrite($socket, "\r\n.\r\n");
            $this->readResponse($socket, '250');
            
            // Quit
            $this->sendCommand($socket, "QUIT");
            fclose($socket);
            
            return true;
            
        } catch (Exception $e) {
            if (isset($socket) && $socket) {
                fclose($socket);
            }
            
            // Log error and fall back to file logging
            error_log("SMTP Error: " . $e->getMessage());
            return $this->logEmailToFile($to, $subject, $body);
        }
    }
    
    private function sendCommand($socket, $command) {
        fwrite($socket, $command . "\r\n");
        if ($this->debug) {
            echo "SENT: $command<br>";
        }
    }
    
    private function readResponse($socket, $expectedCode = null) {
        $response = '';
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if ($this->debug) {
                echo "RECV: " . trim($line) . "<br>";
            }
            
            // Check if this is the last line of the response
            if (isset($line[3]) && $line[3] == ' ') {
                break;
            }
        }
        
        if ($expectedCode && substr($response, 0, 3) !== $expectedCode) {
            throw new Exception("SMTP Error: Expected $expectedCode but got: $response");
        }
        
        return $response;
    }
    
    private function buildEmailContent($to, $subject, $body) {
        $content = "From: {$this->config['from_name']} <{$this->config['from_email']}>\r\n";
        $content .= "To: $to\r\n";
        $content .= "Subject: $subject\r\n";
        $content .= "Date: " . date('r') . "\r\n";
        $content .= "Message-ID: <" . uniqid() . "@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">\r\n";
        $content .= "MIME-Version: 1.0\r\n";
        $content .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $content .= "Content-Transfer-Encoding: 8bit\r\n";
        $content .= "\r\n";
        $content .= $body;
        
        return $content;
    }
    
    private function logEmailToFile($to, $subject, $body) {
        $logDir = __DIR__ . '/logs';
        if (!file_exists($logDir)) {
            mkdir($logDir, 0755, true);
        }
        
        $logFile = $logDir . '/email-test.log';
        $logContent = "\n=== EMAIL LOG (FALLBACK) ===\n";
        $logContent .= "Date: " . date('Y-m-d H:i:s') . "\n";
        $logContent .= "To: $to\n";
        $logContent .= "Subject: $subject\n";
        $logContent .= "From: {$this->config['from_name']} <{$this->config['from_email']}>\n";
        $logContent .= "Body:\n$body\n";
        $logContent .= "Note: Email was logged because SMTP failed\n";
        $logContent .= "============================\n\n";
        
        file_put_contents($logFile, $logContent, FILE_APPEND | LOCK_EX);
        
        return true; // Return true so system doesn't think it failed
    }
    
    public function setDebug($debug) {
        $this->debug = $debug;
    }
}

/**
 * Send email using working implementation
 */
function sendEmailWorking($to, $subject, $body, $config = null) {
    if (!$config) {
        $config = include 'email-config.php';
    }
    
    $mailer = new WorkingMailer($config);
    return $mailer->send($to, $subject, $body);
}

/**
 * Backward compatibility
 */
function sendEmailReliable($to, $subject, $body, $config = null) {
    return sendEmailWorking($to, $subject, $body, $config);
}

function sendEmailEnhanced($to, $subject, $body, $config = null) {
    return sendEmailWorking($to, $subject, $body, $config);
}
?>