# Eatpol Tester Registration System - Setup Instructions

## Overview
This is a secure, GDPR-compliant system for managing food tester registrations with encrypted personal data storage.

## Security Features
- **Encryption**: All personal data (names, addresses, emails) are encrypted using AES-256-CBC
- **Hashed emails**: Email addresses are also stored as SHA-256 hashes for unique constraints
- **CSRF protection**: Forms include CSRF tokens
- **SQL injection prevention**: Uses PDO prepared statements
- **GDPR compliance**: Explicit consent tracking, data export, and deletion capabilities
- **Audit logging**: All actions are logged for security auditing

## Setup Steps

### 1. Database Setup

1. Access your MySQL/MariaDB database (via phpMyAdmin or command line)
2. Run the SQL commands in `database-schema.sql` to create:
   - Database: `eatpol_testers`
   - All required tables
   - Default admin user

### 2. Configuration

Edit `db-config.php` with your actual settings:

```php
// Database credentials
define('DB_HOST', 'localhost');        // Your MySQL host
define('DB_NAME', 'eatpol_testers');   // Database name
define('DB_USER', 'your_username');    // Your MySQL username
define('DB_PASS', 'your_password');    // Your MySQL password

// IMPORTANT: Generate a new encryption key
// Run this PHP code to generate: echo bin2hex(random_bytes(32));
define('ENCRYPTION_KEY', 'your_32_character_random_string');

// Update email settings
define('ADMIN_EMAIL', 'info@eatpol.com');
define('SITE_URL', 'https://eatpol.com');
```

### 3. File Permissions

Set appropriate permissions on your server:
```bash
chmod 755 testers.html
chmod 644 process-tester-registration.php
chmod 600 db-config.php  # More restrictive for config file
chmod 755 logs/          # Create logs directory
```

### 4. SSL Certificate

Ensure your website has HTTPS enabled for secure data transmission.

### 5. Testing

1. Visit `testers.html` in your browser
2. Fill out the registration form with test data
3. Check that data is encrypted in the database
4. Verify email notifications are sent

## Files Included

- **testers.html** - Complete tester page with integrated registration form
- **process-tester-registration.php** - Processes registrations securely
- **db-config.php** - Database configuration and security functions
- **database-schema.sql** - MySQL database structure
- **admin-testers.php** - Admin panel for managing testers (to be created)

## Default Admin Access

- Username: `admin`
- Password: `ChangeMe123!`
- **IMPORTANT**: Change this password immediately after first login!

## Data Flow

1. User fills out registration form
2. JavaScript validates input client-side
3. Form submits to PHP processor
4. PHP validates and sanitizes all input
5. Personal data is encrypted before storage
6. Email hash created for unique constraint
7. Data stored in MySQL database
8. Confirmation emails sent to user and admin
9. Admin reviews and approves registration

## GDPR Compliance

The system includes:
- Explicit consent checkboxes
- Data encryption for PII
- Right to access (data export)
- Right to deletion
- Data retention policies (2 years)
- Audit trail of all processing

## Security Best Practices

1. **Never commit real credentials** to version control
2. **Use environment variables** for production credentials
3. **Regularly update** PHP and MySQL versions
4. **Monitor logs** for suspicious activity
5. **Backup database** regularly
6. **Test restore procedures** periodically

## Troubleshooting

### Database Connection Errors
- Verify credentials in `db-config.php`
- Check MySQL service is running
- Ensure database user has proper permissions

### Encryption Issues
- Verify OpenSSL extension is enabled in PHP
- Check encryption key is exactly 32 characters
- Ensure PHP has write permissions for logs

### Email Not Sending
- Check mail server configuration
- Verify `mail()` function is enabled
- Consider using SMTP library for production

## Support

For issues or questions:
- Email: info@eatpol.com
- Check error logs in `/logs/error.log`
- Review activity logs in database

## Next Steps

1. Create admin panel interface (`admin-testers.php`)
2. Implement email verification system
3. Add reCAPTCHA for bot protection
4. Set up automated backups
5. Configure rate limiting