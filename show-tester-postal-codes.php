<?php
/**
 * Display Tester Postal Codes
 * Shows decrypted postal codes from the database
 */

try {
    // Database connection
    $pdo = new PDO(
        "mysql:host=localhost;dbname=eatpol_testers;charset=utf8mb4",
        'root',
        '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    // Load encryption functions
    require_once 'db-config.php';
    
    echo "===========================================\n";
    echo "TESTER DATA - POSTAL CODES\n";
    echo "===========================================\n\n";
    
    // Get all testers
    $stmt = $pdo->query("
        SELECT 
            id,
            first_name,
            last_name,
            email,
            city,
            postal_code,
            country,
            program_type,
            created_at
        FROM testers 
        ORDER BY created_at DESC
    ");
    
    $testers = $stmt->fetchAll();
    
    if (empty($testers)) {
        echo "No testers found in the database.\n";
    } else {
        echo "Found " . count($testers) . " tester(s) in the database:\n\n";
        
        foreach ($testers as $index => $tester) {
            echo "--- Tester #" . ($index + 1) . " (ID: {$tester['id']}) ---\n";
            echo "Name: " . decryptData($tester['first_name']) . " " . decryptData($tester['last_name']) . "\n";
            echo "Email: " . decryptData($tester['email']) . "\n";
            echo "City: " . decryptData($tester['city']) . "\n";
            echo "Postal Code: " . ($tester['postal_code'] ? decryptData($tester['postal_code']) : 'Not provided') . "\n";
            echo "Country: " . decryptData($tester['country']) . "\n";
            echo "Program: " . ucfirst(str_replace('_', ' ', $tester['program_type'])) . "\n";
            echo "Registered: " . $tester['created_at'] . "\n";
            echo "\n";
        }
        
        // Summary statistics
        echo "===========================================\n";
        echo "SUMMARY\n";
        echo "===========================================\n";
        
        // Count by program type
        $stmt = $pdo->query("SELECT program_type, COUNT(*) as count FROM testers GROUP BY program_type");
        $programCounts = $stmt->fetchAll();
        
        echo "\nBy Program Type:\n";
        foreach ($programCounts as $program) {
            echo "- " . ucfirst(str_replace('_', ' ', $program['program_type'])) . ": " . $program['count'] . "\n";
        }
        
        // Count testers with postal codes
        $stmt = $pdo->query("SELECT COUNT(*) as with_postal FROM testers WHERE postal_code IS NOT NULL AND postal_code != ''");
        $withPostal = $stmt->fetch()['with_postal'];
        
        echo "\nPostal Code Stats:\n";
        echo "- With postal code: $withPostal\n";
        echo "- Without postal code: " . (count($testers) - $withPostal) . "\n";
    }
    
    echo "\n===========================================\n";
    echo "Data stored in: MySQL Database 'eatpol_testers'\n";
    echo "Table: 'testers'\n";
    echo "Encryption: AES-256-CBC for PII fields\n";
    echo "===========================================\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "\nMake sure Apache and MySQL are running.\n";
}
?>