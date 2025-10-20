<?php
/**
 * Assessment Handler
 * Handles product readiness assessment submissions
 */

// Prevent any output before headers
ob_start();

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Start session only if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set JSON content type early
header('Content-Type: application/json');

// Handle both GET and POST for debugging
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Assessment handler is accessible',
        'method' => 'GET',
        'timestamp' => date('c')
    ]);
    ob_end_flush();
    exit;
}

// Only process POST requests for form submission
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    ob_clean();
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    ob_end_flush();
    exit;
}

try {
    // Get JSON data from request body
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    if (!$data) {
        throw new Exception("Invalid JSON data received");
    }

    // Extract contact information
    $firstName = htmlspecialchars(trim($data['contact']['firstName'] ?? ''));
    $email = filter_var(trim($data['contact']['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $company = htmlspecialchars(trim($data['contact']['company'] ?? ''));
    $phone = htmlspecialchars(trim($data['contact']['phone'] ?? ''));

    // Extract assessment data
    $score = intval($data['score'] ?? 0);
    $riskLevel = htmlspecialchars($data['riskLevel'] ?? 'unknown');
    $isPlantBased = $data['isPlantBased'] ?? false;
    $answers = $data['answers'] ?? [];

    // Basic validation
    if (empty($firstName) || empty($email) || empty($company)) {
        throw new Exception("Missing required contact information");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email address");
    }

    // Determine risk emoji
    $emoji = '📊';
    if ($riskLevel === 'high') $emoji = '🚨';
    elseif ($riskLevel === 'moderate') $emoji = '⚠️';
    elseif ($riskLevel === 'low') $emoji = '✅';
    elseif ($riskLevel === 'ready') $emoji = '🚀';

    // Determine recommended package
    $recommendedPackage = 'Custom Package';
    if ($riskLevel === 'high') {
        $recommendedPackage = $isPlantBased ? 'Foundation Package (DOMUS + TEXTURA)' : 'Foundation Package (DOMUS + VOX)';
    } elseif ($riskLevel === 'moderate') {
        $recommendedPackage = $isPlantBased ? 'Optimization Package (TEXTURA + VOX)' : 'Optimization Package (VOX + TEXTURA)';
    } elseif ($riskLevel === 'low') {
        $recommendedPackage = 'Competitive Edge Package (Full Suite)';
    } elseif ($riskLevel === 'ready') {
        $recommendedPackage = 'Strategic Partnership (Custom Models)';
    }

    // Build email message
    $adminSubject = "$emoji Product Assessment: $firstName from $company ($score% score)";
    $adminMessage = "NEW PRODUCT READINESS ASSESSMENT COMPLETED\n";
    $adminMessage .= str_repeat("=", 70) . "\n\n";

    // Contact Information
    $adminMessage .= "CONTACT INFORMATION\n";
    $adminMessage .= str_repeat("-", 70) . "\n";
    $adminMessage .= "Name: $firstName\n";
    $adminMessage .= "Email: $email\n";
    $adminMessage .= "Company: $company\n";
    if ($phone) $adminMessage .= "Phone: $phone\n";
    $adminMessage .= "\n";

    // Assessment Results
    $adminMessage .= "ASSESSMENT RESULTS\n";
    $adminMessage .= str_repeat("-", 70) . "\n";
    $adminMessage .= "Overall Score: $score%\n";
    $adminMessage .= "Risk Level: " . strtoupper($riskLevel) . "\n";
    $adminMessage .= "Plant-Based Product: " . ($isPlantBased ? 'YES' : 'NO') . "\n";
    $adminMessage .= "Recommended Package: $recommendedPackage\n";
    $adminMessage .= "\n";

    // Best Practice Questions (Scored)
    $adminMessage .= "BEST PRACTICE QUESTIONS (SCORED)\n";
    $adminMessage .= str_repeat("-", 70) . "\n";

    $questions = [
        'q1' => 'Real home environment testing',
        'q2' => 'Complete consumer journey capture',
        'q3' => 'Sample size (30+ households)',
        'q4' => 'AI/video analysis for non-verbal feedback',
        'q5' => 'Texture acceptance measurement',
        'q6' => 'Packaging usability testing',
        'q7' => 'Emotional response capture',
        'q8' => 'Multiple iterations before launch',
        'q9' => 'Competitor benchmarking',
        'q10' => 'Speed of insights (< 2 weeks)'
    ];

    $totalPoints = 0;
    foreach ($questions as $qId => $qText) {
        if (isset($answers[$qId])) {
            $answer = $answers[$qId];
            $points = $answer['points'] ?? 0;
            $totalPoints += $points;
            $adminMessage .= "$qText: " . ($answer['value'] ?? 'N/A') . " ($points/10 pts)\n";
        }
    }
    $adminMessage .= "\nTotal Score: $totalPoints/100 points ($score%)\n\n";

    // Qualifying Questions
    $adminMessage .= "QUALIFYING QUESTIONS\n";
    $adminMessage .= str_repeat("-", 70) . "\n";

    // Q11: Product types
    if (isset($answers['q11'])) {
        $adminMessage .= "Product Types:\n";
        foreach ($answers['q11'] as $product) {
            $adminMessage .= "  - " . $product['text'] . "\n";
        }
        $adminMessage .= "\n";
    }

    // Q12: Primary challenge
    if (isset($answers['q12'])) {
        $adminMessage .= "Primary Challenge (90 days): " . $answers['q12']['value'] . "\n\n";
    }

    // Q13: Success obstacles
    if (isset($answers['q13'])) {
        $adminMessage .= "Success Obstacles:\n";
        foreach ($answers['q13'] as $obstacle) {
            $adminMessage .= "  - " . $obstacle['text'] . "\n";
        }
        $adminMessage .= "\n";
    }

    // Q14: Interested solutions
    if (isset($answers['q14'])) {
        $adminMessage .= "Interested Solutions:\n";
        foreach ($answers['q14'] as $solution) {
            $adminMessage .= "  - " . $solution['text'] . "\n";
        }
        $adminMessage .= "\n";
    }

    // Q15: Testing concerns
    if (isset($answers['q15'])) {
        $adminMessage .= "Testing Concerns:\n";
        foreach ($answers['q15'] as $concern) {
            $adminMessage .= "  - " . $concern['text'] . "\n";
        }
        $adminMessage .= "\n";
    }

    // Testing Maturity Breakdown
    $adminMessage .= "TESTING MATURITY BREAKDOWN\n";
    $adminMessage .= str_repeat("-", 70) . "\n";
    if ($riskLevel === 'high') {
        $adminMessage .= "STATUS: HIGH RISK - 72% failure probability\n";
        $adminMessage .= "Critical gaps in real-world validation, behavioral data, and texture testing.\n";
        $adminMessage .= "Immediate action needed before further investment.\n";
    } elseif ($riskLevel === 'moderate') {
        $adminMessage .= "STATUS: MODERATE RISK - Solid foundation, missing precision\n";
        $adminMessage .= "Testing captures basics but lacks emotional drivers and behavioral precision.\n";
        $adminMessage .= "Opportunity for 34% higher purchase intent with optimization.\n";
    } elseif ($riskLevel === 'low') {
        $adminMessage .= "STATUS: LOW RISK - Strong foundation, ready for competitive edge\n";
        $adminMessage .= "In top 20% of companies. Can reach top 5% with enterprise tools.\n";
        $adminMessage .= "Focus on insight velocity and multi-modal analysis.\n";
    } else {
        $adminMessage .= "STATUS: LAUNCH READY - World-class testing\n";
        $adminMessage .= "In top 5%. Ready for predictive modeling and strategic partnership.\n";
        $adminMessage .= "Opportunity to build proprietary consumer intelligence.\n";
    }
    $adminMessage .= "\n";

    $adminMessage .= "Submission Time: " . date('Y-m-d H:i:s') . "\n";
    $adminMessage .= str_repeat("=", 70) . "\n";

    // Send email
    $emailsSent = false;
    try {
        $headers = "From: noreply@eatpol.com\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        $emailsSent = mail('info@eatpol.com', $adminSubject, $adminMessage, $headers);

        if (!$emailsSent) {
            error_log("Warning: Email sending failed for assessment from $firstName ($email)");
        }
    } catch (Exception $e) {
        error_log("Email sending error: " . $e->getMessage());
        // Continue anyway - don't fail the form submission
    }

    // Log the submission
    error_log("Assessment submission successful: $firstName ($email) - Score: $score% - Risk: $riskLevel");

    // Success response
    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Assessment submitted successfully',
        'data' => [
            'score' => $score,
            'riskLevel' => $riskLevel,
            'emails_sent' => $emailsSent
        ],
        'timestamp' => date('c')
    ]);

} catch (Exception $e) {
    // Error response
    error_log("Assessment error: " . $e->getMessage());

    ob_clean();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'timestamp' => date('c')
    ]);
}

ob_end_flush();
?>
