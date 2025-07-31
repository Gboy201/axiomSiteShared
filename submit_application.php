<?php
header('Content-Type: text/html; charset=UTF-8');

// EMAIL CONFIGURATION
// Load email configuration (use local version if it exists)
$emailConfigFile = file_exists('email_config_local.php') ? 'email_config_local.php' : 'email_config.php';
$emailConfig = include $emailConfigFile;

$NOTIFICATION_EMAIL = $emailConfig['notification_email'];
$EMAIL_SUBJECT = $emailConfig['email_subject'];
$SEND_EMAIL_NOTIFICATIONS = $emailConfig['send_notifications'];
$FROM_EMAIL = $emailConfig['from_email'];
$FROM_NAME = $emailConfig['from_name'];

// Function to sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to validate URL
function isValidURL($url) {
    return empty($url) || filter_var($url, FILTER_VALIDATE_URL);
}

// Function to send email notification
function sendEmailNotification($applicationData) {
    global $NOTIFICATION_EMAIL, $EMAIL_SUBJECT, $SEND_EMAIL_NOTIFICATIONS, $FROM_EMAIL, $FROM_NAME;
    
    if (!$SEND_EMAIL_NOTIFICATIONS) {
        return true; // Return true so it doesn't block the process
    }
    
    // Create email content
    $emailBody = createEmailBody($applicationData);
    
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: {$FROM_NAME} <{$FROM_EMAIL}>" . "\r\n";
    $headers .= "Reply-To: " . $applicationData[2] . "\r\n"; // Applicant's email
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    
    // Send email
    $success = mail($NOTIFICATION_EMAIL, $EMAIL_SUBJECT, $emailBody, $headers);
    
    if ($success) {
        error_log("✅ Email notification sent successfully for application: " . $applicationData[1]);
    } else {
        error_log("❌ Failed to send email notification for application: " . $applicationData[1]);
        // Don't fail the entire process if email fails
    }
    
    return $success;
}

// Function to create formatted email body
function createEmailBody($data) {
    $timestamp = $data[0];
    $fullName = $data[1];
    $email = $data[2];
    $age = $data[3];
    $school = $data[4];
    $startupName = $data[5];
    $participantType = $data[6];
    $teamMembers = $data[7];
    $startupIdea = $data[8];
    $googleMeet = $data[9];
    $mvpReady = $data[10];
    $mvpDetails = $data[11];
    $socialLinks = $data[12];
    $favoriteStartup = $data[13];
    $responseSpeed = $data[14];
    $agreement = $data[15];
    
    $html = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #1a1a2e; color: #ffd700; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1a1a2e; }
            .value { margin-top: 5px; padding: 8px; background: #f9f9f9; border-left: 3px solid #ffd700; }
            .startup-idea { background: #fff3cd; border-left: 3px solid #856404; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
            .highlight { background: #ffd700; color: #1a1a2e; padding: 2px 6px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h1>🚀 New Axiom Startup Application!</h1>
            <p>Received: {$timestamp}</p>
        </div>
        
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Applicant Information</div>
                <div class='value'>
                    <strong>Name:</strong> {$fullName}<br>
                    <strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a><br>
                    <strong>Age:</strong> {$age}<br>
                    <strong>School:</strong> {$school}
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>🏢 Startup Information</div>
                <div class='value'>
                    <strong>Startup Name:</strong> <span class='highlight'>{$startupName}</span><br>
                    <strong>Participant Type:</strong> {$participantType}<br>
                    <strong>Team Members:</strong> {$teamMembers}
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>💡 Startup Idea</div>
                <div class='value startup-idea'>
                    {$startupIdea}
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>🔧 MVP & Development</div>
                <div class='value'>
                    <strong>MVP Ready:</strong> {$mvpReady}<br>
                    <strong>MVP Details:</strong> {$mvpDetails}
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>📞 Contact & Availability</div>
                <div class='value'>
                    <strong>Google Meet Available:</strong> {$googleMeet}<br>
                    <strong>Response Speed:</strong> {$responseSpeed}<br>";
    
    if (!empty($socialLinks)) {
        $html .= "<strong>Social Links:</strong> <a href='{$socialLinks}' target='_blank'>{$socialLinks}</a><br>";
    }
    
    $html .= "
                </div>
            </div>
            
            <div class='field'>
                <div class='label'>⭐ Additional Information</div>
                <div class='value'>
                    <strong>Favorite Startup:</strong> {$favoriteStartup}
                </div>
            </div>
        </div>
        
        <div class='footer'>
            <p>🎮 This application was submitted through the Axiom Startup Quest website</p>
            <p>Reply directly to this email to contact the applicant</p>
        </div>
    </body>
    </html>";
    
    return $html;
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and validate all form fields
    $full_name = sanitizeInput($_POST['full_name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $age = sanitizeInput($_POST['age'] ?? '');
    $school = sanitizeInput($_POST['school'] ?? '');
    $startup_name = sanitizeInput($_POST['startup_name'] ?? '');
    $participant_type = sanitizeInput($_POST['participant_type'] ?? '');
    $team_members = sanitizeInput($_POST['team_members'] ?? '');
    $startup_idea = sanitizeInput($_POST['startup_idea'] ?? '');
    $google_meet = sanitizeInput($_POST['google_meet'] ?? '');
    $mvp_ready = sanitizeInput($_POST['mvp_ready'] ?? '');
    $mvp_details = sanitizeInput($_POST['mvp_details'] ?? '');
    $social_links = sanitizeInput($_POST['social_links'] ?? '');
    $favorite_startup = sanitizeInput($_POST['favorite_startup'] ?? '');
    $response_speed = sanitizeInput($_POST['response_speed'] ?? '');
    $agreement = isset($_POST['agreement']) ? 'Yes' : '';

    // Validation
    if (empty($full_name)) {
        $errors[] = "Full name is required.";
    }

    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!isValidEmail($email)) {
        $errors[] = "Please enter a valid email address.";
    }

    if (empty($age) || !is_numeric($age) || $age < 13 || $age > 100) {
        $errors[] = "Please enter a valid age between 13 and 100.";
    }

    if (empty($school)) {
        $errors[] = "School is required.";
    }

    if (empty($startup_name)) {
        $errors[] = "Startup name is required.";
    }

    if (empty($participant_type) || !in_array($participant_type, ['individual', 'group'])) {
        $errors[] = "Please select participant type.";
    }

    if (empty($team_members)) {
        $errors[] = "Team members field is required.";
    }

    if (empty($startup_idea)) {
        $errors[] = "Startup idea description is required.";
    }

    if (empty($google_meet) || !in_array($google_meet, ['yes', 'no'])) {
        $errors[] = "Please select Google Meet availability.";
    }

    if (empty($mvp_ready) || !in_array($mvp_ready, ['yes', 'no'])) {
        $errors[] = "Please select MVP readiness.";
    }

    if (empty($mvp_details)) {
        $errors[] = "MVP details are required.";
    }

    if (!isValidURL($social_links)) {
        $errors[] = "Please enter a valid URL for social links or leave it empty.";
    }

    if (empty($favorite_startup)) {
        $errors[] = "Favorite startup field is required.";
    }

    if (empty($response_speed)) {
        $errors[] = "Response speed field is required.";
    }

    if (empty($agreement)) {
        $errors[] = "You must agree to the terms before submitting.";
    }

    // If no errors, save to individual CSV file
    if (empty($errors)) {
        // Create applications directory if it doesn't exist (using temp folder for development)
        $applications_dir = 'axiom_applications_temp';
        if (!file_exists($applications_dir)) {
            if (!mkdir($applications_dir, 0755, true)) {
                $errors[] = "Unable to create applications directory.";
            }
        }
        
        if (empty($errors)) {
            // Create safe filename with person's name and date
            $safe_name = preg_replace('/[^a-zA-Z0-9\s]/', '', $full_name);
            $safe_name = str_replace(' ', '_', trim($safe_name));
            $date_str = date('Y-m-d_H-i-s');
            $csv_filename = $safe_name . '_' . $date_str . '.csv';
            $csv_file = $applications_dir . '/' . $csv_filename;
            
            // Prepare data for CSV
            $data = [
                date('Y-m-d H:i:s'), // Timestamp
                $full_name,
                $email,
                $age,
                $school,
                $startup_name,
                $participant_type,
                $team_members,
                $startup_idea,
                $google_meet,
                $mvp_ready,
                $mvp_details,
                $social_links,
                $favorite_startup,
                $response_speed,
                $agreement
            ];

            // Open file for writing
            $file = fopen($csv_file, 'w');
            
            if ($file) {
                // Write header
                $headers = [
                    'Timestamp',
                    'Full Name',
                    'Email',
                    'Age',
                    'School',
                    'Startup Name',
                    'Participant Type',
                    'Team Members',
                    'Startup Idea',
                    'Google Meet Available',
                    'MVP Ready',
                    'MVP Details',
                    'Social Links',
                    'Favorite Startup',
                    'Response Speed',
                    'Terms Agreement'
                ];
                fputcsv($file, $headers);
                
                // Write data
                fputcsv($file, $data);
                fclose($file);
                
                // Send email notification
                sendEmailNotification($data);
                
                // Redirect to thank you page on success
                header('Location: thank-you.html');
                exit();
            } else {
                $errors[] = "Unable to save application. Please try again.";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Submitted - Axiom Startup</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation Bar -->
    <nav id="navbar">
        <div class="nav-left">
            <a href="index.html" class="nav-title">Axiom</a>
        </div>
        <div class="nav-right">
            <a href="apply.html" class="nav-link">Apply</a>
            <a href="about.html" class="nav-link">About</a>
            <a href="sponsors.html" class="nav-link">Sponsors</a>
            <a href="schedule.html" class="nav-link">Schedule</a>
            <a href="team.html" class="nav-link">Team</a>
            <a href="contact.html" class="nav-link">Contact</a>
        </div>
        <div class="hamburger" id="hamburger">
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
        </div>
    </nav>

    <div id="page-container">
        <div id="apply-content">
            <?php if (!empty($errors)): ?>
                <div class="form-message error">
                    <h2>❌ Submission Failed</h2>
                    <p>Please fix the following errors:</p>
                    <ul style="text-align: left; margin: 15px 0;">
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="apply.html" class="submit-btn" style="display: inline-block; text-decoration: none; max-width: 300px;">Try Again</a>
                </div>
            <?php else: ?>
                <div class="form-message error">
                    <h2>❌ Invalid Request</h2>
                    <p>Please submit the form properly.</p>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <a href="apply.html" class="submit-btn" style="display: inline-block; text-decoration: none; max-width: 300px;">Go to Application</a>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Hamburger Menu JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const hamburger = document.getElementById('hamburger');
            const navRight = document.querySelector('.nav-right');
            
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navRight.classList.toggle('active');
            });
            
            // Close menu when clicking on a nav link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navRight.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!hamburger.contains(event.target) && !navRight.contains(event.target)) {
                    hamburger.classList.remove('active');
                    navRight.classList.remove('active');
                }
            });
        });
    </script>
</body>
</html> 