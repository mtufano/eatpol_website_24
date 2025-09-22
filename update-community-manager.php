<?php
/**
 * Update Country Manager to Community Manager
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
    
    echo "Updating program_type ENUM to support Community Manager...\n";
    
    // First, add community_manager to the enum while keeping country_manager
    $sql = "ALTER TABLE testers 
            MODIFY COLUMN program_type ENUM('standard', 'community_manager', 'country_manager') DEFAULT 'standard'";
    $pdo->exec($sql);
    echo "✓ Added community_manager to ENUM\n";
    
    // Update any existing country_manager entries
    $stmt = $pdo->prepare("UPDATE testers SET program_type = 'community_manager' WHERE program_type = 'country_manager'");
    $stmt->execute();
    $updated = $stmt->rowCount();
    echo "✓ Updated $updated existing Country Manager entries to Community Manager\n";
    
    // Remove the old country_manager option from enum
    $sql = "ALTER TABLE testers 
            MODIFY COLUMN program_type ENUM('standard', 'community_manager') DEFAULT 'standard'";
    $pdo->exec($sql);
    echo "✓ Removed old country_manager option from ENUM\n";
    
    echo "\n✅ Successfully updated database to use Community Manager instead of Country Manager!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>