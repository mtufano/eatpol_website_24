<?php
/**
 * Create Testers Table Specifically
 */

try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=eatpol_testers;charset=utf8mb4",
        'root',
        '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    echo "Creating 'testers' table...\n\n";
    
    // Drop table if exists to recreate cleanly
    $pdo->exec("DROP TABLE IF EXISTS testers");
    echo "Dropped existing testers table if it existed\n";
    
    // Create testers table
    $sql = "
    CREATE TABLE testers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        
        -- Basic Information (Encrypted)
        first_name VARCHAR(500) NOT NULL COMMENT 'Encrypted',
        last_name VARCHAR(500) NOT NULL COMMENT 'Encrypted',
        email VARCHAR(500) NOT NULL COMMENT 'Encrypted',
        email_hash VARCHAR(64) NOT NULL COMMENT 'SHA256 hash for uniqueness',
        phone VARCHAR(500) COMMENT 'Encrypted',
        
        -- Address Information (Encrypted)
        street_address VARCHAR(1000) COMMENT 'Encrypted',
        city VARCHAR(500) COMMENT 'Encrypted',
        postal_code VARCHAR(100) COMMENT 'Encrypted',
        country VARCHAR(500) COMMENT 'Encrypted',
        
        -- Demographics
        age_group ENUM('18-24', '25-34', '35-44', '45-54', '55-64', '65+'),
        gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
        birth_date DATE COMMENT 'For age verification',
        
        -- Program Information
        program_type ENUM('standard', 'community_manager') DEFAULT 'standard',
        motivation TEXT COMMENT 'Why they want to join (encrypted)',
        dietary_restrictions TEXT COMMENT 'Allergies, preferences (encrypted)',
        
        -- Consent and Legal
        gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
        marketing_consent BOOLEAN DEFAULT FALSE,
        terms_accepted BOOLEAN NOT NULL DEFAULT FALSE,
        
        -- Status
        is_active BOOLEAN DEFAULT TRUE,
        email_verified BOOLEAN DEFAULT FALSE,
        profile_complete BOOLEAN DEFAULT FALSE,
        
        -- Metadata
        registration_ip VARCHAR(45),
        user_agent TEXT,
        referral_source VARCHAR(200),
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        email_verified_at TIMESTAMP NULL,
        
        -- Indexes
        UNIQUE KEY unique_email_hash (email_hash),
        INDEX idx_program_type (program_type),
        INDEX idx_created_at (created_at),
        INDEX idx_is_active (is_active),
        INDEX idx_age_group (age_group),
        INDEX idx_gender (gender)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($sql);
    echo "✅ 'testers' table created successfully!\n\n";
    
    // Verify table structure
    $stmt = $pdo->query("DESCRIBE testers");
    $columns = $stmt->fetchAll();
    
    echo "📊 Table structure:\n";
    foreach ($columns as $column) {
        echo "   {$column['Field']} ({$column['Type']})\n";
    }
    
    echo "\n🎉 Testers table is ready!\n";
    echo "\nYou can now:\n";
    echo "1. Register new testers at: http://localhost/testers.html\n";
    echo "2. View them on the map after registration\n";
    echo "3. Access admin dashboard to see all data\n";
    
} catch (Exception $e) {
    echo "❌ Error creating testers table: " . $e->getMessage() . "\n";
    echo "\nSQL Error details:\n";
    print_r($pdo->errorInfo());
}
?>