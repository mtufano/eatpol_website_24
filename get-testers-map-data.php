<?php
/**
 * Get Testers Map Data
 * Returns tester locations for the interactive map
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

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
    
    // Encryption key (same as registration-handler.php)
    $encryption_key = 'your-secret-key-2024-eatpol-testers';
    
    function decryptData($encryptedData) {
        global $encryption_key;
        if (empty($encryptedData)) return '';
        
        try {
            $parts = explode('::', $encryptedData);
            if (count($parts) !== 2) return $encryptedData;
            
            $encrypted = base64_decode($parts[0]);
            $iv = base64_decode($parts[1]);
            
            return openssl_decrypt($encrypted, 'AES-256-CBC', $encryption_key, 0, $iv);
        } catch (Exception $e) {
            return $encryptedData;
        }
    }
    
    // Get all testers (including those without postal codes for now)
    $stmt = $pdo->query("
        SELECT 
            id,
            first_name,
            last_name,
            city,
            postal_code,
            country,
            age_group,
            gender,
            program_type,
            is_active,
            created_at
        FROM testers 
        ORDER BY created_at DESC
    ");
    
    $testers = $stmt->fetchAll();
    $mapData = [];
    
    // Postal code to coordinates mapping (sample data - in production, use a geocoding service)
    $postalCodeCoordinates = [
        // Netherlands
        '1011' => ['lat' => 52.3676, 'lng' => 4.9041, 'city' => 'Amsterdam'],
        '1012' => ['lat' => 52.3702, 'lng' => 4.8952, 'city' => 'Amsterdam'],
        '3011' => ['lat' => 51.9225, 'lng' => 4.4792, 'city' => 'Rotterdam'],
        '2511' => ['lat' => 52.0705, 'lng' => 4.3007, 'city' => 'The Hague'],
        '3511' => ['lat' => 52.0907, 'lng' => 5.1214, 'city' => 'Utrecht'],
        // Add more as needed
    ];
    
    foreach ($testers as $tester) {
        try {
            // Decrypt data
            $firstName = decryptData($tester['first_name']);
            $lastName = decryptData($tester['last_name']);
            $postalCode = $tester['postal_code'] ? decryptData($tester['postal_code']) : '';
            $city = decryptData($tester['city']);
            $country = decryptData($tester['country']);
            
            // Skip if essential data is missing
            if (empty($firstName) || empty($city) || empty($country)) {
                continue;
            }
            
            // Try to get coordinates (simplified - in production use proper geocoding)
            $coords = null;
            
            // First try postal code matching
            if (!empty($postalCode)) {
                $postalPrefix = substr($postalCode, 0, 4);
                if (isset($postalCodeCoordinates[$postalPrefix])) {
                    $coords = $postalCodeCoordinates[$postalPrefix];
                }
            }
            
            // If no postal code match, use country/city defaults
            if (!$coords) {
                $countryLower = strtolower($country);
                $cityLower = strtolower($city);
                
                // Add more specific city coordinates
                if (strpos($countryLower, 'netherlands') !== false || strpos($countryLower, 'nederland') !== false) {
                    if (strpos($cityLower, 'amsterdam') !== false) {
                        $coords = ['lat' => 52.3676 + (rand(-50, 50) / 1000), 'lng' => 4.9041 + (rand(-50, 50) / 1000)];
                    } elseif (strpos($cityLower, 'rotterdam') !== false) {
                        $coords = ['lat' => 51.9225 + (rand(-50, 50) / 1000), 'lng' => 4.4792 + (rand(-50, 50) / 1000)];
                    } elseif (strpos($cityLower, 'utrecht') !== false) {
                        $coords = ['lat' => 52.0907 + (rand(-50, 50) / 1000), 'lng' => 5.1214 + (rand(-50, 50) / 1000)];
                    } elseif (strpos($cityLower, 'hague') !== false || strpos($cityLower, 'den haag') !== false) {
                        $coords = ['lat' => 52.0705 + (rand(-50, 50) / 1000), 'lng' => 4.3007 + (rand(-50, 50) / 1000)];
                    } else {
                        $coords = ['lat' => 52.3676 + (rand(-200, 200) / 1000), 'lng' => 4.9041 + (rand(-200, 200) / 1000)];
                    }
                } elseif (strpos($countryLower, 'germany') !== false || strpos($countryLower, 'deutschland') !== false) {
                    $coords = ['lat' => 52.5200 + (rand(-300, 300) / 1000), 'lng' => 13.4050 + (rand(-300, 300) / 1000)];
                } elseif (strpos($countryLower, 'france') !== false) {
                    $coords = ['lat' => 48.8566 + (rand(-300, 300) / 1000), 'lng' => 2.3522 + (rand(-300, 300) / 1000)];
                } elseif (strpos($countryLower, 'united kingdom') !== false || strpos($countryLower, 'uk') !== false || strpos($countryLower, 'britain') !== false) {
                    $coords = ['lat' => 51.5074 + (rand(-300, 300) / 1000), 'lng' => -0.1278 + (rand(-300, 300) / 1000)];
                } elseif (strpos($countryLower, 'belgium') !== false) {
                    $coords = ['lat' => 50.8503 + (rand(-100, 100) / 1000), 'lng' => 4.3517 + (rand(-100, 100) / 1000)];
                } elseif (strpos($countryLower, 'spain') !== false) {
                    $coords = ['lat' => 40.4168 + (rand(-300, 300) / 1000), 'lng' => -3.7038 + (rand(-300, 300) / 1000)];
                } elseif (strpos($countryLower, 'italy') !== false) {
                    $coords = ['lat' => 41.9028 + (rand(-300, 300) / 1000), 'lng' => 12.4964 + (rand(-300, 300) / 1000)];
                } elseif (strpos($countryLower, 'poland') !== false) {
                    $coords = ['lat' => 51.9194 + (rand(-200, 200) / 1000), 'lng' => 19.1451 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'sweden') !== false) {
                    $coords = ['lat' => 60.1282 + (rand(-400, 400) / 1000), 'lng' => 18.6435 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'norway') !== false) {
                    $coords = ['lat' => 60.4720 + (rand(-400, 400) / 1000), 'lng' => 8.4689 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'denmark') !== false) {
                    $coords = ['lat' => 56.2639 + (rand(-100, 100) / 1000), 'lng' => 9.5018 + (rand(-100, 100) / 1000)];
                } elseif (strpos($countryLower, 'finland') !== false) {
                    $coords = ['lat' => 61.9241 + (rand(-400, 400) / 1000), 'lng' => 25.7482 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'switzerland') !== false) {
                    $coords = ['lat' => 46.8182 + (rand(-100, 100) / 1000), 'lng' => 8.2275 + (rand(-100, 100) / 1000)];
                } elseif (strpos($countryLower, 'austria') !== false) {
                    $coords = ['lat' => 47.5162 + (rand(-100, 100) / 1000), 'lng' => 14.5501 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'portugal') !== false) {
                    $coords = ['lat' => 39.3999 + (rand(-200, 200) / 1000), 'lng' => -8.2245 + (rand(-100, 100) / 1000)];
                } elseif (strpos($countryLower, 'czech') !== false) {
                    $coords = ['lat' => 49.8175 + (rand(-100, 100) / 1000), 'lng' => 15.4730 + (rand(-100, 100) / 1000)];
                } elseif (strpos($countryLower, 'hungary') !== false) {
                    $coords = ['lat' => 47.1625 + (rand(-100, 100) / 1000), 'lng' => 19.5033 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'romania') !== false) {
                    $coords = ['lat' => 45.9432 + (rand(-200, 200) / 1000), 'lng' => 24.9668 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'bulgaria') !== false) {
                    $coords = ['lat' => 42.7339 + (rand(-100, 100) / 1000), 'lng' => 25.4858 + (rand(-200, 200) / 1000)];
                } elseif (strpos($countryLower, 'greece') !== false) {
                    $coords = ['lat' => 39.0742 + (rand(-200, 200) / 1000), 'lng' => 21.8243 + (rand(-300, 300) / 1000)];
                } elseif (strpos($countryLower, 'turkey') !== false) {
                    $coords = ['lat' => 38.9637 + (rand(-400, 400) / 1000), 'lng' => 35.2433 + (rand(-600, 600) / 1000)];
                } elseif (strpos($countryLower, 'united states') !== false || strpos($countryLower, 'usa') !== false) {
                    $coords = ['lat' => 37.0902 + (rand(-1000, 1000) / 1000), 'lng' => -95.7129 + (rand(-2000, 2000) / 1000)];
                } elseif (strpos($countryLower, 'canada') !== false) {
                    $coords = ['lat' => 56.1304 + (rand(-1000, 1000) / 1000), 'lng' => -106.3468 + (rand(-2000, 2000) / 1000)];
                } elseif (strpos($countryLower, 'mexico') !== false) {
                    $coords = ['lat' => 23.6345 + (rand(-500, 500) / 1000), 'lng' => -102.5528 + (rand(-800, 800) / 1000)];
                } elseif (strpos($countryLower, 'brazil') !== false) {
                    $coords = ['lat' => -14.2350 + (rand(-800, 800) / 1000), 'lng' => -51.9253 + (rand(-1000, 1000) / 1000)];
                } elseif (strpos($countryLower, 'argentina') !== false) {
                    $coords = ['lat' => -38.4161 + (rand(-600, 600) / 1000), 'lng' => -63.6167 + (rand(-800, 800) / 1000)];
                } elseif (strpos($countryLower, 'australia') !== false) {
                    $coords = ['lat' => -25.2744 + (rand(-800, 800) / 1000), 'lng' => 133.7751 + (rand(-1000, 1000) / 1000)];
                } elseif (strpos($countryLower, 'new zealand') !== false) {
                    $coords = ['lat' => -40.9006 + (rand(-300, 300) / 1000), 'lng' => 174.8860 + (rand(-400, 400) / 1000)];
                } elseif (strpos($countryLower, 'japan') !== false) {
                    $coords = ['lat' => 36.2048 + (rand(-400, 400) / 1000), 'lng' => 138.2529 + (rand(-500, 500) / 1000)];
                } elseif (strpos($countryLower, 'china') !== false) {
                    $coords = ['lat' => 35.8617 + (rand(-800, 800) / 1000), 'lng' => 104.1954 + (rand(-1000, 1000) / 1000)];
                } elseif (strpos($countryLower, 'india') !== false) {
                    $coords = ['lat' => 20.5937 + (rand(-600, 600) / 1000), 'lng' => 78.9629 + (rand(-800, 800) / 1000)];
                } elseif (strpos($countryLower, 'russia') !== false) {
                    $coords = ['lat' => 61.5240 + (rand(-1000, 1000) / 1000), 'lng' => 105.3188 + (rand(-2000, 2000) / 1000)];
                } elseif (strpos($countryLower, 'south africa') !== false) {
                    $coords = ['lat' => -30.5595 + (rand(-400, 400) / 1000), 'lng' => 22.9375 + (rand(-600, 600) / 1000)];
                } elseif (strpos($countryLower, 'egypt') !== false) {
                    $coords = ['lat' => 26.0975 + (rand(-400, 400) / 1000), 'lng' => 31.2357 + (rand(-300, 300) / 1000)];
                } else {
                    // Default to Netherlands area for unknown countries
                    $coords = ['lat' => 52.3676 + (rand(-500, 500) / 1000), 'lng' => 4.9041 + (rand(-500, 500) / 1000)];
                }
            }
            
            if ($coords && isset($coords['lat']) && isset($coords['lng'])) {
                $mapData[] = [
                    'id' => $tester['id'],
                    'lat' => (float)$coords['lat'],
                    'lng' => (float)$coords['lng'],
                    'city' => $city,
                    'country' => $country,
                    'postalCode' => $postalCode ? (substr($postalCode, 0, 2) . '***') : 'Not provided',
                    'ageGroup' => $tester['age_group'] ?: 'Not specified',
                    'gender' => ucfirst($tester['gender'] ?: 'Not specified'),
                    'programType' => $tester['program_type'],
                    'isActive' => $tester['is_active'],
                    'joinedDate' => date('M Y', strtotime($tester['created_at'])),
                    'initials' => strtoupper(substr($firstName, 0, 1) . substr($lastName, 0, 1))
                ];
            }
        } catch (Exception $e) {
            // Skip this tester if decryption fails
            error_log("Error processing tester " . $tester['id'] . ": " . $e->getMessage());
            continue;
        }
    }
    
    // Only show real tester data from database
    
    echo json_encode([
        'success' => true,
        'total' => count($mapData),
        'testers' => $mapData
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error loading tester data',
        'error' => $e->getMessage()
    ]);
}
?>