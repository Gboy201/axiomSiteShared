<?php
// EMAIL NOTIFICATION CONFIGURATION
// Copy this file to email_config_local.php and update with your settings
// The _local version will be ignored by git for security

return [
    // Your email address to receive notifications
    'notification_email' => 'your-email@example.com',
    
    // Email subject line
    'email_subject' => 'New Axiom Startup Application Received',
    
    // Enable/disable email notifications
    'send_notifications' => true,
    
    // Email sender information
    'from_email' => 'noreply@axiomstartup.com',
    'from_name' => 'Axiom Startup Website',
    
    // Email settings for production (when using SMTP)
    'smtp_settings' => [
        'host' => 'your-smtp-host.com',
        'port' => 587,
        'username' => 'your-smtp-username',
        'password' => 'your-smtp-password',
        'encryption' => 'tls'
    ]
];
?> 