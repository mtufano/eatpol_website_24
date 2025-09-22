<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin-login.html');
    exit;
}

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
    
    // Encryption key (should match registration-handler.php)
    $encryption_key = 'your-secret-key-2024-eatpol-testers';
    
    function decryptData($encryptedData, $key) {
        if (empty($encryptedData)) return '';
        
        try {
            $parts = explode('::', $encryptedData);
            if (count($parts) !== 2) return $encryptedData;
            
            $encrypted = base64_decode($parts[0]);
            $iv = base64_decode($parts[1]);
            
            return openssl_decrypt($encrypted, 'AES-256-CBC', $key, 0, $iv);
        } catch (Exception $e) {
            return $encryptedData;
        }
    }
    
    // Get testers
    $stmt = $pdo->query("SELECT * FROM testers ORDER BY created_at DESC");
    $testers = $stmt->fetchAll();
    
    // Get business requests
    $stmt = $pdo->query("SELECT * FROM business_requests ORDER BY created_at DESC");
    $businessRequests = $stmt->fetchAll();
    
} catch (Exception $e) {
    die("Database error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Eatpol</title>
    <style>
        :root {
            --bright-blue: #1297e0;
            --green: #00bf63;
            --dark-blue: #1b48ab;
            --navy: #2c3e50;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .header h1 {
            color: var(--dark-blue);
            font-size: 2rem;
        }
        
        .logout-btn {
            background: var(--bright-blue);
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-weight: 500;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: 700;
            color: var(--bright-blue);
        }
        
        .stat-label {
            color: var(--navy);
            font-weight: 500;
            margin-top: 5px;
        }
        
        .section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            overflow: hidden;
        }
        
        .section-header {
            background: var(--dark-blue);
            color: white;
            padding: 20px;
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .table-container {
            overflow-x: auto;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: var(--navy);
        }
        
        .program-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .standard {
            background: rgba(18, 151, 224, 0.1);
            color: var(--bright-blue);
        }
        
        .community-manager {
            background: rgba(0, 191, 99, 0.1);
            color: var(--green);
        }
        
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status-new {
            background: rgba(255, 193, 7, 0.1);
            color: #856404;
        }
        
        .status-active {
            background: rgba(40, 167, 69, 0.1);
            color: #155724;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Eatpol Admin Dashboard</h1>
            <div>
                <span>Welcome, <?php echo htmlspecialchars($_SESSION['admin_username']); ?></span>
                <a href="admin-logout.php" class="logout-btn">Logout</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number"><?php echo count($testers); ?></div>
                <div class="stat-label">Total Testers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo count(array_filter($testers, fn($t) => $t['program_type'] === 'standard')); ?></div>
                <div class="stat-label">Standard Testers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo count(array_filter($testers, fn($t) => $t['program_type'] === 'community_manager')); ?></div>
                <div class="stat-label">Community Managers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number"><?php echo count($businessRequests); ?></div>
                <div class="stat-label">Business Requests</div>
            </div>
        </div>
        
        <!-- Testers Section -->
        <div class="section">
            <div class="section-header">👥 Registered Testers</div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Location</th>
                            <th>Age Group</th>
                            <th>Gender</th>
                            <th>Program</th>
                            <th>Registered</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($testers)): ?>
                            <tr>
                                <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                                    No testers registered yet. Visit <a href="testers.html" target="_blank">testers.html</a> to register the first tester!
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($testers as $tester): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars(decryptData($tester['first_name'], $encryption_key) . ' ' . decryptData($tester['last_name'], $encryption_key)); ?></td>
                                    <td><?php echo htmlspecialchars(decryptData($tester['email'], $encryption_key)); ?></td>
                                    <td><?php echo htmlspecialchars(decryptData($tester['city'], $encryption_key) . ', ' . decryptData($tester['country'], $encryption_key)); ?></td>
                                    <td><?php echo htmlspecialchars($tester['age_group'] ?? 'N/A'); ?></td>
                                    <td><?php echo htmlspecialchars(ucfirst($tester['gender'] ?? 'N/A')); ?></td>
                                    <td>
                                        <span class="program-badge <?php echo $tester['program_type'] === 'community_manager' ? 'community-manager' : 'standard'; ?>">
                                            <?php echo $tester['program_type'] === 'community_manager' ? 'Community Manager' : 'Standard Tester'; ?>
                                        </span>
                                    </td>
                                    <td><?php echo date('M j, Y', strtotime($tester['created_at'])); ?></td>
                                    <td>
                                        <span class="status-badge status-active">
                                            <?php echo $tester['is_active'] ? 'Active' : 'Inactive'; ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Business Requests Section -->
        <div class="section">
            <div class="section-header">💼 Business Requests</div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Participants</th>
                            <th>Status</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($businessRequests)): ?>
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                                    No business requests yet. Visit <a href="request-test-new.html" target="_blank">request-test-new.html</a> to submit the first request!
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($businessRequests as $request): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars(decryptData($request['first_name'], $encryption_key) . ' ' . decryptData($request['last_name'], $encryption_key)); ?></td>
                                    <td><?php echo htmlspecialchars(decryptData($request['email'], $encryption_key)); ?></td>
                                    <td><?php echo htmlspecialchars(decryptData($request['company'], $encryption_key)); ?></td>
                                    <td><?php echo htmlspecialchars(decryptData($request['city'], $encryption_key) . ', ' . decryptData($request['country'], $encryption_key)); ?></td>
                                    <td><?php echo htmlspecialchars($request['participants'] ?? 'N/A'); ?></td>
                                    <td>
                                        <span class="status-badge status-new">
                                            <?php echo ucfirst($request['submission_status']); ?>
                                        </span>
                                    </td>
                                    <td><?php echo date('M j, Y', strtotime($request['created_at'])); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>