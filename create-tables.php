<?php
/**
 * Direct Table Creation Script
 * This creates tables one by one with proper error handling
 */

echo "<h1>🗄️ Direct Database Table Creation</h1>";

try {
    // Load database configuration
    $config = include 'db-config.php';
    
    // Connect to database
    $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset=utf8mb4";
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "✅ Connected to database<br><br>";
    
    // Create tables one by one
    $tables = [
        'testers' => "CREATE TABLE IF NOT EXISTS testers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(500) NOT NULL,
            last_name VARCHAR(500) NOT NULL,
            email VARCHAR(500) NOT NULL,
            email_hash VARCHAR(64) NOT NULL,
            phone VARCHAR(500),
            street_address VARCHAR(1000),
            city VARCHAR(500),
            postal_code VARCHAR(100),
            country VARCHAR(500),
            date_of_birth DATE,
            age_group ENUM('18-24', '25-34', '35-44', '45-54', '55-64', '65+'),
            gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
            dietary_restrictions JSON,
            food_allergies JSON,
            gdpr_consent BOOLEAN DEFAULT FALSE,
            marketing_consent BOOLEAN DEFAULT FALSE,
            terms_accepted BOOLEAN DEFAULT FALSE,
            consent_date TIMESTAMP NULL,
            status ENUM('pending', 'active', 'inactive', 'blocked') DEFAULT 'pending',
            verification_token VARCHAR(64),
            email_verified BOOLEAN DEFAULT FALSE,
            tests_participated INT DEFAULT 0,
            tests_completed INT DEFAULT 0,
            last_test_date DATE NULL,
            rating DECIMAL(3,2) DEFAULT NULL,
            bank_account VARCHAR(1000),
            payment_method ENUM('bank_transfer', 'paypal', 'other'),
            program_type ENUM('standard', 'country_manager') DEFAULT 'standard',
            management_experience ENUM('none', 'some', 'experienced', 'expert') NULL,
            time_availability VARCHAR(20) NULL,
            manager_motivation TEXT NULL,
            network_size VARCHAR(20) NULL,
            manager_status ENUM('applied', 'training', 'active', 'inactive') NULL,
            manager_region VARCHAR(100) NULL,
            training_completed BOOLEAN DEFAULT FALSE,
            testers_recruited INT DEFAULT 0,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            registration_ip VARCHAR(45),
            last_login TIMESTAMP NULL,
            notes TEXT,
            UNIQUE KEY unique_email (email_hash),
            INDEX idx_status (status),
            INDEX idx_registration_date (registration_date),
            INDEX idx_age_group (age_group)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'admin_users' => "CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            two_factor_enabled BOOLEAN DEFAULT FALSE,
            two_factor_secret VARCHAR(255),
            role ENUM('super_admin', 'admin', 'viewer') DEFAULT 'viewer',
            permissions JSON,
            is_active BOOLEAN DEFAULT TRUE,
            last_login TIMESTAMP NULL,
            last_login_ip VARCHAR(45),
            failed_login_attempts INT DEFAULT 0,
            locked_until TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_by INT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'activity_logs' => "CREATE TABLE IF NOT EXISTS activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_type ENUM('admin', 'tester') NOT NULL,
            user_id INT,
            action VARCHAR(100) NOT NULL,
            details JSON,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user (user_type, user_id),
            INDEX idx_action (action),
            INDEX idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'email_queue' => "CREATE TABLE IF NOT EXISTS email_queue (
            id INT AUTO_INCREMENT PRIMARY KEY,
            recipient_email VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
            attempts INT DEFAULT 0,
            scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            sent_at TIMESTAMP NULL,
            error_message TEXT,
            INDEX idx_status (status),
            INDEX idx_scheduled (scheduled_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'sessions' => "CREATE TABLE IF NOT EXISTS sessions (
            id VARCHAR(128) PRIMARY KEY,
            user_id INT,
            user_type ENUM('admin', 'tester'),
            ip_address VARCHAR(45),
            user_agent TEXT,
            payload TEXT,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user (user_id),
            INDEX idx_last_activity (last_activity)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'data_requests' => "CREATE TABLE IF NOT EXISTS data_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tester_id INT NOT NULL,
            request_type ENUM('export', 'delete') NOT NULL,
            status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
            requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP NULL,
            file_path VARCHAR(500),
            expires_at TIMESTAMP NULL,
            INDEX idx_status (status),
            INDEX idx_requested (requested_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    ];
    
    echo "<h2>📊 Creating Tables:</h2>";
    echo "<div style='background: #f9f9f9; padding: 15px; border-radius: 8px; font-family: monospace;'>";
    
    foreach ($tables as $tableName => $sql) {
        try {
            $pdo->exec($sql);
            echo "✅ <strong>$tableName</strong> - Created successfully<br>";
        } catch (PDOException $e) {
            echo "❌ <strong>$tableName</strong> - Error: " . $e->getMessage() . "<br>";
        }
    }
    
    echo "</div>";
    
    // Create default admin user
    echo "<br><h2>👤 Creating Admin User:</h2>";
    try {
        $stmt = $pdo->prepare("INSERT IGNORE INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            'admin',
            'info@eatpol.com',
            '$2y$12$YQxPZE8kN2V2vL5HqPqmCuWKLqFxevHxUxPp3IF6n2YqXC9MhqPYy', // ChangeMe123!
            'super_admin'
        ]);
        echo "✅ <strong>Default admin user created</strong><br>";
        echo "Username: <strong>admin</strong><br>";
        echo "Password: <strong>ChangeMe123!</strong><br>";
        echo "<em>Please change this password immediately!</em><br>";
    } catch (PDOException $e) {
        echo "⚠️ Admin user creation: " . $e->getMessage() . "<br>";
    }
    
    // Verify tables
    echo "<br><h2>🔍 Final Verification:</h2>";
    echo "<div style='background: #f0f8ff; padding: 15px; border-radius: 8px;'>";
    
    foreach (array_keys($tables) as $tableName) {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM $tableName");
        $stmt->execute();
        $count = $stmt->fetch()['count'];
        echo "✅ <strong>$tableName</strong> - $count records<br>";
    }
    
    echo "</div>";
    
    echo "<br><div style='background: #e8f5e9; border: 1px solid #4caf50; color: #2e7d32; padding: 20px; border-radius: 10px;'>";
    echo "<h3>🎉 Database setup completed successfully!</h3>";
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ol>";
    echo "<li>📧 Test email configuration at <a href='test-email-enhanced.php'>test-email-enhanced.php</a></li>";
    echo "<li>🧪 Test registration form at <a href='testers.html'>testers.html</a></li>";
    echo "<li>👨‍💼 Access admin panel at <a href='admin.html'>admin.html</a></li>";
    echo "</ol>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div style='background: #ffebee; border: 1px solid #f44336; color: #c62828; padding: 20px; border-radius: 10px;'>";
    echo "<h3>❌ Setup Failed!</h3>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
    echo "</div>";
}
?>