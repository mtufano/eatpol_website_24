<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get JSON data from request body
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

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
    $error = '';
    if (empty($firstName) || empty($email) || empty($company)) {
        $error = "Missing required contact information.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email address.";
    } else {
        // Determine risk emoji and level
        $emoji = '📊';
        $riskText = 'MODERATE RISK';
        if ($riskLevel === 'high') {
            $emoji = '🚨';
            $riskText = 'HIGH RISK';
        } elseif ($riskLevel === 'moderate') {
            $emoji = '⚠️';
            $riskText = 'MODERATE RISK';
        } elseif ($riskLevel === 'low') {
            $emoji = '✅';
            $riskText = 'LOW RISK';
        } elseif ($riskLevel === 'ready') {
            $emoji = '🚀';
            $riskText = 'LAUNCH READY';
        }

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

        // Prepare email content
        $to = "info@eatpol.com";
        $subject = "$emoji Product Assessment: $firstName from $company ($score% score)";

        $message = "
        <html>
        <head>
            <title>New Product Readiness Assessment</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .header { background: #1297e0; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .section { margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-left: 4px solid #1297e0; }
                .high-risk { border-left-color: #dc2626; }
                .moderate-risk { border-left-color: #f59e0b; }
                .low-risk { border-left-color: #10b981; }
                .ready { border-left-color: #6366f1; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; color: #1b48ab; }
                .value { margin-left: 10px; }
                .score-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; }
                .score-high { background: #dc2626; }
                .score-moderate { background: #f59e0b; }
                .score-low { background: #10b981; }
                .score-ready { background: #6366f1; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #1297e0; color: white; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h2>$emoji Product Readiness Assessment Completed</h2>
            </div>
            <div class='content'>
                <div class='section'>
                    <h3>Contact Information</h3>
                    <div class='field'><span class='label'>Name:</span> <span class='value'>$firstName</span></div>
                    <div class='field'><span class='label'>Email:</span> <span class='value'>$email</span></div>
                    <div class='field'><span class='label'>Company:</span> <span class='value'>$company</span></div>";

        if (!empty($phone)) {
            $message .= "<div class='field'><span class='label'>Phone:</span> <span class='value'>$phone</span></div>";
        }

        $message .= "
                </div>

                <div class='section " . strtolower(str_replace(' ', '-', $riskLevel)) . "-risk'>
                    <h3>Assessment Results</h3>
                    <div class='field'>
                        <span class='label'>Overall Score:</span>
                        <span class='score-badge score-" . strtolower(str_replace(' ', '-', $riskLevel)) . "'>$score%</span>
                    </div>
                    <div class='field'><span class='label'>Risk Level:</span> <span class='value'><strong>$riskText</strong></span></div>
                    <div class='field'><span class='label'>Plant-Based Product:</span> <span class='value'>" . ($isPlantBased ? 'YES' : 'NO') . "</span></div>
                    <div class='field'><span class='label'>Recommended Package:</span> <span class='value'><strong>$recommendedPackage</strong></span></div>
                </div>

                <div class='section'>
                    <h3>Best Practice Questions (Scored)</h3>
                    <table>
                        <tr>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Points</th>
                        </tr>";

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
                $answerValue = $answer['value'] ?? 'N/A';
                $points = $answer['points'] ?? 0;
                $totalPoints += $points;
                $message .= "<tr>
                    <td>$qText</td>
                    <td>$answerValue</td>
                    <td>$points/10</td>
                </tr>";
            }
        }

        $message .= "
                        <tr style='font-weight: bold; background: #f8f9fa;'>
                            <td colspan='2'>TOTAL SCORE</td>
                            <td>$totalPoints/100 ($score%)</td>
                        </tr>
                    </table>
                </div>

                <div class='section'>
                    <h3>Qualifying Questions</h3>";

        // Q11: Product types
        if (isset($answers['q11'])) {
            $message .= "<div class='field'>
                <span class='label'>Product Types:</span>
                <div class='value'>";
            foreach ($answers['q11'] as $product) {
                $message .= "• " . htmlspecialchars($product['text']) . "<br>";
            }
            $message .= "</div></div>";
        }

        // Q12: Primary challenge
        if (isset($answers['q12'])) {
            $message .= "<div class='field'><span class='label'>Primary Challenge (90 days):</span> <span class='value'>" . htmlspecialchars($answers['q12']['value']) . "</span></div>";
        }

        // Q13: Success obstacles
        if (isset($answers['q13'])) {
            $message .= "<div class='field'>
                <span class='label'>Success Obstacles:</span>
                <div class='value'>";
            foreach ($answers['q13'] as $obstacle) {
                $message .= "• " . htmlspecialchars($obstacle['text']) . "<br>";
            }
            $message .= "</div></div>";
        }

        // Q14: Interested solutions
        if (isset($answers['q14'])) {
            $message .= "<div class='field'>
                <span class='label'>Interested Solutions:</span>
                <div class='value'>";
            foreach ($answers['q14'] as $solution) {
                $message .= "• " . htmlspecialchars($solution['text']) . "<br>";
            }
            $message .= "</div></div>";
        }

        // Q15: Testing concerns
        if (isset($answers['q15'])) {
            $message .= "<div class='field'>
                <span class='label'>Testing Concerns:</span>
                <div class='value'>";
            foreach ($answers['q15'] as $concern) {
                $message .= "• " . htmlspecialchars($concern['text']) . "<br>";
            }
            $message .= "</div></div>";
        }

        $message .= "
                </div>

                <div class='section'>
                    <h3>Next Steps</h3>
                    <p>The user has been redirected to book a strategy call via Outlook.</p>
                    <p><strong>Submission Time:</strong> " . date('Y-m-d H:i:s') . "</p>
                </div>
            </div>
        </body>
        </html>";

        // Email headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: noreply@eatpol.com" . "\r\n";
        $headers .= "Reply-To: $email" . "\r\n";

        // Send email
        if (mail($to, $subject, $message, $headers)) {
            // Return JSON success response
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'message' => 'Assessment submitted successfully',
                'data' => [
                    'score' => $score,
                    'riskLevel' => $riskLevel
                ]
            ]);
            exit;
        } else {
            $error = "Sorry, there was an error sending your assessment. Please try again or contact us directly at info@eatpol.com.";
        }
    }

    // If there was an error, return error response
    if (!empty($error)) {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $error
        ]);
        exit;
    }
}
?>
