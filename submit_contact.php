<?php
// Contact form submission handler
// This file handles contact form submissions and saves them to CSV files

// Include email configuration
$email_config_file = file_exists('email_config_local.php') ? 'email_config_local.php' : 'email_config.php';
if (file_exists($email_config_file)) {
    $email_config = include $email_config_file;
} else {
    // Default configuration if no config file exists
    $email_config = [
        'notification_email' => 'admin@axiomstartup.com',
        'email_subject' => 'New Contact Form Submission - Axiom Startup',
        'send_notifications' => false, // Disabled by default for development
        'from_email' => 'noreply@axiomstartup.com',
        'from_name' => 'Axiom Startup Contact Form'
    ];
}

// Function to sanitize input
function sanitizeInput($input) {
    return htmlspecialchars(stripslashes(trim($input)));
}

// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Function to send email notification
function sendEmailNotification($contactData, $config) {
    if (!$config['send_notifications']) {
        return true; // Skip sending if disabled
    }

    $to = $config['notification_email'];
    $subject = $config['email_subject'];
    
    // Create HTML email content
    $message = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; }
            .container { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background-color: #ffd700; color: #000; padding: 20px; text-align: center; border-radius: 5px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ffd700; }
            .field-label { font-weight: bold; color: #333; }
            .field-value { margin-top: 5px; }
            .message-box { background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
                <p>Axiom Startup Competition</p>
            </div>
            
            <div class='field'>
                <div class='field-label'>Submission Time:</div>
                <div class='field-value'>" . $contactData['timestamp'] . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Name:</div>
                <div class='field-value'>" . htmlspecialchars($contactData['name']) . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Organization:</div>
                <div class='field-value'>" . htmlspecialchars($contactData['organization']) . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Email:</div>
                <div class='field-value'>" . htmlspecialchars($contactData['email']) . "</div>
            </div>
            
            <div class='field'>
                <div class='field-label'>Message:</div>
                <div class='message-box'>" . nl2br(htmlspecialchars($contactData['message'])) . "</div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: " . $config['from_name'] . " <" . $config['from_email'] . ">" . "\r\n";
    $headers .= "Reply-To: " . $contactData['email'] . "\r\n";
    
    return mail($to, $subject, $message, $headers);
}

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect and sanitize form data
    $name = sanitizeInput($_POST['name'] ?? '');
    $organization = sanitizeInput($_POST['organization'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    $timestamp = date('Y-m-d H:i:s');
    
    // Validate required fields
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required.";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!isValidEmail($email)) {
        $errors[] = "Please enter a valid email address.";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required.";
    }
    
    // If no errors, process the submission
    if (empty($errors)) {
        // Prepare contact data
        $contactData = [
            'timestamp' => $timestamp,
            'name' => $name,
            'organization' => !empty($organization) ? $organization : 'Not specified',
            'email' => $email,
            'message' => $message
        ];
        
        // Determine storage directory (development vs production)
        $isProduction = !in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1', '::1']);
        $storageDir = $isProduction ? 'axiom_contacts' : 'axiom_contacts_temp';
        
        // Create directory if it doesn't exist
        if (!file_exists($storageDir)) {
            mkdir($storageDir, 0755, true);
        }
        
        // Generate unique filename
        $sanitizedName = preg_replace('/[^a-zA-Z0-9]/', '_', $name);
        $dateString = date('Y-m-d_H-i-s');
        $filename = $storageDir . '/' . $sanitizedName . '_' . $dateString . '.csv';
        
        // Write to CSV file
        $csvFile = fopen($filename, 'w');
        if ($csvFile) {
            // Write CSV headers
            fputcsv($csvFile, ['Timestamp', 'Name', 'Organization', 'Email', 'Message']);
            
            // Write contact data
            fputcsv($csvFile, [
                $contactData['timestamp'],
                $contactData['name'],
                $contactData['organization'],
                $contactData['email'],
                $contactData['message']
            ]);
            
            fclose($csvFile);
            
            // Send email notification
            $emailSent = sendEmailNotification($contactData, $email_config);
            
            // Create success response
            $successMessage = "Thank you for contacting us! We'll get back to you soon.";
            if (!$emailSent && $email_config['send_notifications']) {
                $successMessage .= " (Note: Email notification could not be sent, but your message has been saved.)";
            }
            
            // For now, just redirect back to contact page with success
            // In a real application, you might redirect to a thank-you page
            header('Location: contact.html?success=1');
            exit();
            
        } else {
            $errors[] = "Sorry, there was an error saving your message. Please try again.";
        }
    }
    
    // If there are errors, display them
    if (!empty($errors)) {
        echo "<h2>Form Submission Error</h2>";
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>" . htmlspecialchars($error) . "</li>";
        }
        echo "</ul>";
        echo "<p><a href='contact.html'>Go back to contact form</a></p>";
    }
} else {
    // If accessed directly without POST, redirect to contact page
    header('Location: contact.html');
    exit();
}
?>