# Data Deletion Request Page - Setup Instructions

## Overview
A data deletion request page has been created at `data-deletion.html` with Apple-inspired styling and Netlify Forms integration.

## Files Created
1. **data-deletion.html** - Main data deletion request form page
2. **deletion-thank-you.html** - Thank you page after form submission
3. **netlify.toml** - Netlify configuration file
4. **DATA_DELETION_SETUP.md** - This setup guide

## Page Access
- URL: `https://eatpol.com/data-deletion.html` or `https://eatpol.com/data-deletion`
- The page is **not linked** from index.html (requires direct URL access)

## Email Notification Setup

### Important: Netlify Form Notifications Configuration

To receive email notifications when users submit data deletion requests, you need to configure Netlify Form Notifications in your Netlify dashboard:

### Step 1: Deploy to Netlify
1. Commit and push all changes to your Git repository
2. Netlify will automatically detect the form named `data-deletion-request`

### Step 2: Enable Form Notifications
1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your **eatpol.com** site
3. Navigate to **Site settings** → **Forms**
4. Find the form named **data-deletion-request**
5. Click on the form to open settings

### Step 3: Add Email Notification
1. Scroll to **Form notifications** section
2. Click **Add notification**
3. Select **Email notification**
4. Configure:
   - **Email to notify**: `info@eatpol.com`
   - **Event to listen for**: `New form submission`
   - Click **Save**

### Step 4: Customize Email Template (Optional)
You can customize the email format in the notification settings:
- Use field names: `{{Full_Name}}`, `{{Email}}`, `{{Phone}}`, etc.
- Add custom subject line: "Data Deletion Request from {{Full_Name}}"

## Form Fields

The form collects the following data:

### Required Fields:
- **Full_Name** - Participant's full name
- **Email** - Participant's email address
- **Data type checkboxes** - At least one must be selected:
  - Delete_Videos
  - Delete_Audio
  - Delete_Personal
  - Delete_All

### Optional Fields:
- **Phone** - Phone number
- **Study_Details** - Study or project name
- **Additional_Info** - Additional comments

## Email Format

When a user submits the form, you'll receive an email with all the form fields formatted as:

```
Full Name: [User's Name]
Email: [User's Email]
Phone: [User's Phone or empty]
Study Details: [Study name or empty]
Delete Videos: yes/no
Delete Audio: yes/no
Delete Personal: yes/no
Delete All: yes/no
Additional Info: [User's comments or empty]
```

## Form Flow

1. User visits `eatpol.com/data-deletion.html`
2. User fills out the form
3. Client-side validation checks:
   - Full name is provided
   - Valid email format
   - At least one data type checkbox is selected
4. Form submits to Netlify
5. Netlify sends email notification to `info@eatpol.com`
6. User is redirected to `deletion-thank-you.html`

## Testing

### Test the Form:
1. Visit: `https://eatpol.com/data-deletion.html`
2. Fill out the form with test data
3. Submit the form
4. You should:
   - Be redirected to the thank you page
   - Receive an email at `info@eatpol.com` within a few minutes

### Verify Netlify Form Detection:
1. Go to Netlify dashboard → Site settings → Forms
2. You should see `data-deletion-request` listed
3. Check form submissions under **Forms** tab

## Troubleshooting

### Not Receiving Emails?

1. **Check Netlify Dashboard**:
   - Go to Forms → data-deletion-request
   - Check if submissions are appearing
   - If yes, the form is working but notifications aren't set up

2. **Verify Email Notification**:
   - Go to form settings → Notifications
   - Ensure email notification is enabled
   - Check the email address is correct: `info@eatpol.com`

3. **Check Spam Folder**:
   - Netlify emails might go to spam initially
   - Mark as "Not Spam" to train your email filter

4. **Test with Netlify's Form Submission**:
   - In dashboard, go to Forms → data-deletion-request → Submissions
   - Manually test notification by clicking "Resend notification"

### Form Not Appearing in Netlify?

1. Ensure the site has been deployed after adding the form
2. Check that the form has `data-netlify="true"` attribute
3. Verify the hidden static form is present in the HTML
4. Redeploy the site if needed

## Alternative: Webhook Integration

If email notifications don't work, you can set up a webhook:

1. Use services like Zapier or Make.com
2. Create a webhook URL that forwards to email
3. Add webhook in Netlify Forms settings
4. Select "Outgoing webhook" instead of email notification

## GDPR Compliance

The page includes:
- Clear explanation of data collected
- Complete list of all data types
- User control over what to delete
- 30-day processing timeline (GDPR requirement)
- Contact information for support

## Support

For issues or questions:
- Email: info@eatpol.com
- Phone: +31 (0) 611 61 22 01

---

**Last Updated**: December 2025
