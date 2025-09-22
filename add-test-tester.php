<?php
/**
 * Add a test tester to verify the map works
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
    
    // Encryption key (same as in registration-handler.php)
    $encryption_key = 'your-secret-key-2024-eatpol-testers';
    
    function encryptData($data, $key) {
        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
        return base64_encode($encrypted) . '::' . base64_encode($iv);
    }
    
    // Test tester data
    $testData = [
        'first_name' => 'John',
        'last_name' => 'Smith',
        'email' => 'john.smith@example.com',
        'city' => 'Amsterdam',
        'country' => 'Netherlands',
        'postal_code' => '1012',
        'age_group' => '25-34',
        'gender' => 'male',
        'program_type' => 'standard'
    ];
    
    // Encrypt sensitive data
    $encryptedData = [
        'first_name' => encryptData($testData['first_name'], $encryption_key),
        'last_name' => encryptData($testData['last_name'], $encryption_key),
        'email' => encryptData($testData['email'], $encryption_key),
        'email_hash' => hash('sha256', $testData['email']),
        'city' => encryptData($testData['city'], $encryption_key),
        'country' => encryptData($testData['country'], $encryption_key),
        'postal_code' => encryptData($testData['postal_code'], $encryption_key),
        'age_group' => $testData['age_group'],
        'gender' => $testData['gender'],
        'program_type' => $testData['program_type'],
        'gdpr_consent' => 1,
        'terms_accepted' => 1,
        'registration_ip' => '127.0.0.1',
        'verification_token' => bin2hex(random_bytes(32))
    ];
    
    // Insert test tester
    $sql = "INSERT INTO testers (
        first_name, last_name, email, email_hash, city, country, postal_code,
        age_group, gender, program_type, gdpr_consent, terms_accepted,
        registration_ip, verification_token
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $encryptedData['first_name'],
        $encryptedData['last_name'],
        $encryptedData['email'],
        $encryptedData['email_hash'],
        $encryptedData['city'],
        $encryptedData['country'],
        $encryptedData['postal_code'],
        $encryptedData['age_group'],
        $encryptedData['gender'],
        $encryptedData['program_type'],
        $encryptedData['gdpr_consent'],
        $encryptedData['terms_accepted'],
        $encryptedData['registration_ip'],
        $encryptedData['verification_token']
    ]);
    
    echo "✅ Test tester added successfully!\n";
    echo "Name: {$testData['first_name']} {$testData['last_name']}\n";
    echo "Location: {$testData['city']}, {$testData['country']}\n";
    echo "Program: " . ($testData['program_type'] === 'community_manager' ? 'Community Manager' : 'Standard Tester') . "\n\n";
    
    // Check total testers
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM testers");
    $count = $stmt->fetch()['count'];
    echo "Total testers in database: $count\n\n";
    
    echo "🗺️ You can now see the tester on the map at: http://localhost/testers.html\n";
    echo "📊 Check admin dashboard at: http://localhost/admin-login.html\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>