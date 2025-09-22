<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and validate input data
    $firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
    $lastName = htmlspecialchars(trim($_POST['lastName'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $company = htmlspecialchars(trim($_POST['company'] ?? ''));
    $city = htmlspecialchars(trim($_POST['city'] ?? ''));
    $country = htmlspecialchars(trim($_POST['country'] ?? ''));
    $comments = htmlspecialchars(trim($_POST['comments'] ?? ''));
    
    // Handle checkboxes and radio buttons
    $productTypes = isset($_POST['productType']) ? $_POST['productType'] : [];
    $productTypeOther = htmlspecialchars(trim($_POST['productTypeOther'] ?? ''));
    $testFocus = isset($_POST['testFocus']) ? $_POST['testFocus'] : [];
    $participants = htmlspecialchars(trim($_POST['participants'] ?? ''));
    $consumerTarget = htmlspecialchars(trim($_POST['consumerTarget'] ?? ''));
    $consumerTargetSpecific = htmlspecialchars(trim($_POST['consumerTargetSpecific'] ?? ''));
    $launchDate = htmlspecialchars(trim($_POST['launchDate'] ?? ''));
    
    // Basic validation
    if (empty($firstName) || empty($lastName) || empty($email) || empty($company)) {
        $error = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } else {
        // Prepare email content
        $to = "info@eatpol.com";
        $subject = "New Free Test Request from Eatpol Website";
        
        $message = "
        <html>
        <head>
            <title>New Free Test Request</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .header { background: #1297e0; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #1b48ab; }
                .value { margin-left: 10px; }
                .section { margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-left: 4px solid #1297e0; }
                .list-item { margin-left: 20px; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h2>New Free Test Request</h2>
            </div>
            <div class='content'>
                <div class='section'>
                    <h3>Personal Information</h3>
                    <div class='field'><span class='label'>Name:</span> <span class='value'>$firstName $lastName</span></div>
                    <div class='field'><span class='label'>Email:</span> <span class='value'>$email</span></div>
                    <div class='field'><span class='label'>Company:</span> <span class='value'>$company</span></div>
                    <div class='field'><span class='label'>City:</span> <span class='value'>$city</span></div>
                    <div class='field'><span class='label'>Country:</span> <span class='value'>$country</span></div>
                </div>
                
                <div class='section'>
                    <h3>Product Information</h3>
                    <div class='field'>
                        <span class='label'>Product Types:</span>
                        <div class='value'>";
        
        if (!empty($productTypes)) {
            foreach ($productTypes as $type) {
                $message .= "<div class='list-item'>• " . htmlspecialchars($type) . "</div>";
            }
        }
        if (!empty($productTypeOther)) {
            $message .= "<div class='list-item'>• Other: $productTypeOther</div>";
        }
        
        $message .= "
                        </div>
                    </div>
                </div>
                
                <div class='section'>
                    <h3>Testing Requirements</h3>
                    <div class='field'>
                        <span class='label'>What to Test:</span>
                        <div class='value'>";
        
        if (!empty($testFocus)) {
            foreach ($testFocus as $focus) {
                $message .= "<div class='list-item'>• " . htmlspecialchars($focus) . "</div>";
            }
        }
        
        $message .= "
                        </div>
                    </div>
                    <div class='field'><span class='label'>Number of Participants:</span> <span class='value'>$participants</span></div>
                    <div class='field'><span class='label'>Consumer Target:</span> <span class='value'>$consumerTarget</span></div>";
        
        if (!empty($consumerTargetSpecific)) {
            $message .= "<div class='field'><span class='label'>Specific Segment:</span> <span class='value'>$consumerTargetSpecific</span></div>";
        }
        
        $message .= "
                    <div class='field'><span class='label'>Launch Date:</span> <span class='value'>$launchDate</span></div>
                </div>";
        
        if (!empty($comments)) {
            $message .= "
                <div class='section'>
                    <h3>Additional Comments</h3>
                    <div class='field'><span class='value'>$comments</span></div>
                </div>";
        }
        
        $message .= "
            </div>
        </body>
        </html>";
        
        // Email headers
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: $email" . "\r\n";
        $headers .= "Reply-To: $email" . "\r\n";
        
        // Send email
        if (mail($to, $subject, $message, $headers)) {
            $success = "Thank you! Your request has been submitted successfully. We'll get back to you within 1 business day.";
        } else {
            $error = "Sorry, there was an error sending your request. Please try again or contact us directly at info@eatpol.com.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo isset($success) ? 'Request Submitted' : 'Request a Free Test'; ?> - Eatpol</title>
  <!-- Favicons -->
  <link rel="icon" href="img/favicon.ico" type="image/x-icon">
  <link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" href="img/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png">

  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  
  <style>
    :root {
      --bright-blue: #1297e0;
      --green: #00bf63;
      --dark-blue: #1b48ab;
      --medium-blue: #6990cd;
      --light-blue: #b8daef;
      --white: #ffffff;
      --navy: #112752;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Roboto', sans-serif; 
      line-height: 1.6; 
      color: var(--navy); 
      background: linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 100%);
      min-height: 100vh;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Header */
    .header {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: saturate(180%) blur(20px);
      padding: 20px 0;
      box-shadow: 0 1px 0 0 rgba(17, 39, 82, 0.1);
      margin-bottom: 40px;
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 24px;
      font-weight: 700;
      color: var(--dark-blue);
      text-decoration: none;
    }
    
    .back-link {
      color: var(--bright-blue);
      text-decoration: none;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.3s ease;
    }
    
    .back-link:hover {
      color: var(--green);
      transform: translateX(-3px);
    }
    
    /* Form Section */
    .form-section {
      padding: 60px 0;
      animation: fadeInUp 0.8s ease-out;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .form-title {
      font-size: 48px;
      font-weight: 700;
      color: var(--dark-blue);
      text-align: center;
      margin-bottom: 16px;
      background: linear-gradient(135deg, var(--dark-blue), var(--bright-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .form-subtitle {
      font-size: 20px;
      color: var(--navy);
      text-align: center;
      opacity: 0.8;
      margin-bottom: 40px;
    }
    
    .form-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    }
    
    .success-card {
      background: linear-gradient(135deg, rgba(0, 191, 99, 0.1), rgba(18, 151, 224, 0.1));
      border: 2px solid var(--green);
      text-align: center;
    }
    
    .error-card {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.1));
      border: 2px solid #dc2626;
    }
    
    .success-message {
      color: var(--green);
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .error-message {
      color: #dc2626;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 28px;
    }
    
    .form-group-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 28px;
    }
    
    .form-label {
      font-size: 18px;
      font-weight: 600;
      color: var(--dark-blue);
      margin-bottom: 10px;
      display: block;
    }
    
    .form-input {
      width: 100%;
      padding: 14px 18px;
      font-size: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.3s ease;
      font-family: 'Roboto', sans-serif;
    }
    
    .form-input:focus {
      outline: none;
      border-color: var(--bright-blue);
      box-shadow: 0 0 0 4px rgba(18, 151, 224, 0.1);
    }
    
    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }
    
    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 10px;
    }
    
    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 10px;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }
    
    .checkbox-item:hover {
      background-color: rgba(184, 218, 239, 0.2);
    }
    
    .checkbox-input {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: var(--bright-blue);
    }
    
    .checkbox-label {
      cursor: pointer;
      font-size: 16px;
      user-select: none;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }
    
    .radio-item {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 10px;
      border-radius: 8px;
      transition: background-color 0.3s ease;
    }
    
    .radio-item:hover {
      background-color: rgba(184, 218, 239, 0.2);
    }
    
    .radio-input {
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: var(--bright-blue);
    }
    
    .submit-btn {
      width: 100%;
      padding: 18px 32px;
      background: linear-gradient(135deg, var(--bright-blue), var(--green));
      color: white;
      border: none;
      border-radius: 980px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      margin-top: 20px;
    }
    
    .submit-btn:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 20px rgba(0, 191, 99, 0.3);
    }
    
    .submit-btn:active {
      transform: scale(0.98);
    }
    
    .btn-secondary {
      background: transparent;
      color: var(--bright-blue);
      border: 2px solid var(--bright-blue);
      display: inline-block;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 980px;
      font-weight: 500;
      transition: all 0.3s ease;
      margin-right: 15px;
    }
    
    .btn-secondary:hover {
      background: var(--bright-blue);
      color: white;
      transform: scale(1.02);
    }
    
    .privacy-note {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: var(--navy);
      opacity: 0.7;
    }
    
    .privacy-note a {
      color: var(--bright-blue);
      text-decoration: none;
    }
    
    .privacy-note a:hover {
      color: var(--green);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .form-title {
        font-size: 36px;
      }
      
      .form-group-row {
        grid-template-columns: 1fr;
      }
      
      .checkbox-group {
        grid-template-columns: 1fr;
      }
      
      .form-card {
        padding: 24px;
      }
      
      .btn-secondary {
        display: block;
        text-align: center;
        margin-bottom: 15px;
        margin-right: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <a href="index.html" class="logo">
        <img src="img/logo7.png" alt="Eatpol" style="height: 40px;">
        Eatpol
      </a>
      <a href="index.html" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to Home
      </a>
    </div>
  </header>

  <!-- Form Section -->
  <section class="form-section">
    <div class="container">
      
      <?php if (isset($success)): ?>
        <!-- Success Message -->
        <h1 class="form-title">Request Submitted!</h1>
        <p class="form-subtitle">Thank you for your interest in Eatpol testing services.</p>
        
        <div class="form-card success-card">
          <div class="success-message"><?php echo $success; ?></div>
          <div style="text-align: center;">
            <a href="index.html" class="btn-secondary">Return to Home</a>
            <a href="request-test.php" class="submit-btn" style="width: auto; display: inline-block;">Submit Another Request</a>
          </div>
        </div>
        
      <?php else: ?>
        
        <h1 class="form-title">Request Your Free Test</h1>
        <p class="form-subtitle">Tell us about your product and testing needs. We'll get back to you within 1 business day.</p>
        
        <?php if (isset($error)): ?>
          <div class="form-card error-card" style="margin-bottom: 20px;">
            <div class="error-message"><?php echo $error; ?></div>
          </div>
        <?php endif; ?>
        
        <div class="form-card">
          <form method="POST" action="request-test.php">
            <!-- Personal Information -->
            <div class="form-group-row">
              <div class="form-group">
                <label class="form-label" for="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" class="form-input" value="<?php echo htmlspecialchars($_POST['firstName'] ?? ''); ?>" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" class="form-input" value="<?php echo htmlspecialchars($_POST['lastName'] ?? ''); ?>" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="email">Email *</label>
              <input type="email" id="email" name="email" class="form-input" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" required>
            </div>
            
            <div class="form-group-row">
              <div class="form-group">
                <label class="form-label" for="company">Company *</label>
                <input type="text" id="company" name="company" class="form-input" value="<?php echo htmlspecialchars($_POST['company'] ?? ''); ?>" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="city">City</label>
                <input type="text" id="city" name="city" class="form-input" value="<?php echo htmlspecialchars($_POST['city'] ?? ''); ?>">
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="country">Country</label>
              <input type="text" id="country" name="country" class="form-input" value="<?php echo htmlspecialchars($_POST['country'] ?? ''); ?>">
            </div>
            
            <!-- Product Type -->
            <div class="form-group">
              <label class="form-label">What type of food product are you testing? *</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Snack/Bar" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Snack/Bar', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Snack / Bar</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Beverage" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Beverage', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Beverage</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Ready Meal/Frozen Meal" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Ready Meal/Frozen Meal', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Ready Meal / Frozen Meal</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Ingredient/Cooking Aid" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Ingredient/Cooking Aid', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Ingredient / Cooking Aid</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Plant-based Alternative" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Plant-based Alternative', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Plant-based Alternative</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Bakery/Pastry" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Bakery/Pastry', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Bakery / Pastry</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Dairy or Dairy-alternative" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Dairy or Dairy-alternative', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Dairy or Dairy-alternative</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Meat or Fish Product" class="checkbox-input" <?php echo (isset($_POST['productType']) && in_array('Meat or Fish Product', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Meat or Fish Product</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="productType[]" value="Other" class="checkbox-input" id="otherCheckbox" <?php echo (isset($_POST['productType']) && in_array('Other', $_POST['productType'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Other (please specify)</span>
                </label>
              </div>
              <input type="text" name="productTypeOther" class="form-input" placeholder="Please specify..." style="margin-top: 10px; display: none;" id="otherInput" value="<?php echo htmlspecialchars($_POST['productTypeOther'] ?? ''); ?>">
            </div>
            
            <!-- Testing Focus -->
            <div class="form-group">
              <label class="form-label">What do you want to test? (Check all that apply)</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input type="checkbox" name="testFocus[]" value="Taste/Recipe/Sensory Test" class="checkbox-input" <?php echo (isset($_POST['testFocus']) && in_array('Taste/Recipe/Sensory Test', $_POST['testFocus'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Taste / Recipe / Sensory Test</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="testFocus[]" value="Packaging" class="checkbox-input" <?php echo (isset($_POST['testFocus']) && in_array('Packaging', $_POST['testFocus'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Packaging</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="testFocus[]" value="Branding/Positioning" class="checkbox-input" <?php echo (isset($_POST['testFocus']) && in_array('Branding/Positioning', $_POST['testFocus'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Branding / Positioning</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="testFocus[]" value="Usage/Preparation Experience" class="checkbox-input" <?php echo (isset($_POST['testFocus']) && in_array('Usage/Preparation Experience', $_POST['testFocus'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Usage / Preparation Experience</span>
                </label>
                <label class="checkbox-item">
                  <input type="checkbox" name="testFocus[]" value="Competitor Comparison" class="checkbox-input" <?php echo (isset($_POST['testFocus']) && in_array('Competitor Comparison', $_POST['testFocus'])) ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Competitor Comparison</span>
                </label>
              </div>
            </div>
            
            <!-- Number of Participants -->
            <div class="form-group">
              <label class="form-label">How many participants do you want to involve?</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" name="participants" value="50" class="radio-input" <?php echo (isset($_POST['participants']) && $_POST['participants'] == '50') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">50 Participants</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="participants" value="100" class="radio-input" <?php echo (isset($_POST['participants']) && $_POST['participants'] == '100') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">100 Participants</span>
                </label>
              </div>
            </div>
            
            <!-- Consumer Target -->
            <div class="form-group">
              <label class="form-label">Which type of consumers do you want to target?</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" name="consumerTarget" value="General Population" class="radio-input" <?php echo (isset($_POST['consumerTarget']) && $_POST['consumerTarget'] == 'General Population') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">General Population</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="consumerTarget" value="Specific Segment" class="radio-input" id="specificSegment" <?php echo (isset($_POST['consumerTarget']) && $_POST['consumerTarget'] == 'Specific Segment') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Specific Segment (flexitarians, parents, athletes, etc.)</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="consumerTarget" value="Not Sure" class="radio-input" <?php echo (isset($_POST['consumerTarget']) && $_POST['consumerTarget'] == 'Not Sure') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Not Sure</span>
                </label>
              </div>
              <input type="text" name="consumerTargetSpecific" class="form-input" placeholder="Please specify segment..." style="margin-top: 10px; display: none;" id="segmentInput" value="<?php echo htmlspecialchars($_POST['consumerTargetSpecific'] ?? ''); ?>">
            </div>
            
            <!-- Launch Date -->
            <div class="form-group">
              <label class="form-label">When is your planned launch date?</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input type="radio" name="launchDate" value="Within 3 months" class="radio-input" <?php echo (isset($_POST['launchDate']) && $_POST['launchDate'] == 'Within 3 months') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">Within 3 months</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="launchDate" value="3-6 months" class="radio-input" <?php echo (isset($_POST['launchDate']) && $_POST['launchDate'] == '3-6 months') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">3–6 months</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="launchDate" value="6-12 months" class="radio-input" <?php echo (isset($_POST['launchDate']) && $_POST['launchDate'] == '6-12 months') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">6–12 months</span>
                </label>
                <label class="radio-item">
                  <input type="radio" name="launchDate" value="More than 12 months / early stage" class="radio-input" <?php echo (isset($_POST['launchDate']) && $_POST['launchDate'] == 'More than 12 months / early stage') ? 'checked' : ''; ?>>
                  <span class="checkbox-label">More than 12 months / early stage</span>
                </label>
              </div>
            </div>
            
            <!-- Additional Comments -->
            <div class="form-group">
              <label class="form-label" for="comments">Additional Comments (Optional)</label>
              <textarea id="comments" name="comments" class="form-input form-textarea" placeholder="Tell us more about your testing needs..."><?php echo htmlspecialchars($_POST['comments'] ?? ''); ?></textarea>
            </div>
            
            <button type="submit" class="submit-btn">Submit Request</button>
            
            <p class="privacy-note">
              By submitting this form, you agree to our <a href="privacy.html">Privacy Policy</a>.
              We'll only use your information to respond to your request.
            </p>
          </form>
        </div>
        
      <?php endif; ?>
      
    </div>
  </section>

  <script>
    // Show/hide other input field
    document.getElementById('otherCheckbox').addEventListener('change', function() {
      document.getElementById('otherInput').style.display = this.checked ? 'block' : 'none';
    });
    
    // Show/hide specific segment input field
    document.getElementById('specificSegment').addEventListener('change', function() {
      document.getElementById('segmentInput').style.display = this.checked ? 'block' : 'none';
    });
    
    // Hide segment input when other radio is selected
    document.querySelectorAll('input[name="consumerTarget"]').forEach(radio => {
      if (radio.id !== 'specificSegment') {
        radio.addEventListener('change', function() {
          if (this.checked) {
            document.getElementById('segmentInput').style.display = 'none';
          }
        });
      }
    });
    
    // Show fields on page load if needed
    window.addEventListener('load', function() {
      if (document.getElementById('otherCheckbox').checked) {
        document.getElementById('otherInput').style.display = 'block';
      }
      if (document.getElementById('specificSegment').checked) {
        document.getElementById('segmentInput').style.display = 'block';
      }
    });
  </script>
</body>
</html>