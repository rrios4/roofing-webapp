# Google Services Integration

This document explains how to use the Google services integration in your roofing webapp to interact with Gmail, Google Drive, and Google Calendar.

## Overview

The Google services integration leverages your existing Supabase Google OAuth authentication to access Google APIs. Users authenticate once with Google through Supabase, and the app can then access their Google services.

## Architecture

```
User Authentication Flow:
1. User signs in with Google via Supabase Auth
2. Supabase stores Google OAuth tokens
3. GoogleService retrieves tokens from Supabase session
4. GoogleService makes authenticated requests to Google APIs
```

## Files Structure

```
src/
├── services/
│   └── google-service.ts          # Core Google API service
├── hooks/
│   └── useGoogleService.tsx       # React hook for Google services
└── components/
    └── forms/
        └── email-invoice-dialog.tsx # Example email component
```

## Setup Required

### 1. Supabase Configuration

Ensure your Supabase project has Google OAuth configured with the following scopes:

```bash
# In your Supabase Dashboard -> Authentication -> Providers -> Google
# Add these scopes:
https://www.googleapis.com/auth/gmail.send
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/calendar.events
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select your project
3. Enable the required APIs:
   - Gmail API
   - Google Drive API
   - Google Calendar API
4. Configure OAuth consent screen
5. Add your Supabase redirect URI to authorized redirect URIs

## Usage Examples

### Basic Setup

```tsx
import { useGoogleService } from '../hooks/useGoogleService';

function MyComponent() {
  const { isInitialized, isLoading, error, sendEmail, getMessages } = useGoogleService();

  if (isLoading) return <div>Loading Google services...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isInitialized) return <div>Google services not available</div>;

  // Now you can use Google services
}
```

### Sending Emails

```tsx
const handleSendEmail = async () => {
  const result = await sendEmail({
    to: ['customer@example.com'],
    cc: ['manager@company.com'],
    subject: 'Invoice from Rios Roofing',
    htmlBody: '<h1>Your Invoice</h1><p>Please find your invoice attached.</p>',
    textBody: 'Your Invoice\n\nPlease find your invoice attached.',
    attachments: [
      {
        filename: 'invoice.pdf',
        content: 'base64-encoded-pdf-content',
        mimeType: 'application/pdf'
      }
    ]
  });

  if (result.success) {
    console.log('Email sent with ID:', result.messageId);
  } else {
    console.error('Failed to send email:', result.error);
  }
};
```

### Reading Gmail Messages

```tsx
const fetchMessages = async () => {
  // Get latest 10 messages
  const messages = await getMessages();

  // Search for specific messages
  const invoiceMessages = await getMessages('subject:invoice', 20);

  console.log('Messages:', messages);
};
```

### Working with Google Drive

```tsx
const handleFileUpload = async () => {
  const result = await uploadFileToDrive(
    'invoice-123.pdf',
    'pdf-content-as-string',
    'application/pdf'
  );

  if (result.success) {
    console.log('File uploaded with ID:', result.fileId);
  }
};

const fetchDriveFiles = async () => {
  const files = await getDriveFiles("name contains 'invoice'", 10);
  console.log('Drive files:', files);
};
```

### Creating Calendar Events

```tsx
const createAppointment = async () => {
  const calendars = await getCalendars();
  const primaryCalendar = calendars.find((cal) => cal.primary);

  if (primaryCalendar) {
    const result = await createCalendarEvent(primaryCalendar.id, {
      summary: 'Roofing Inspection',
      description: 'Site inspection for customer John Doe',
      start: {
        dateTime: '2024-01-15T10:00:00-06:00',
        timeZone: 'America/Chicago'
      },
      end: {
        dateTime: '2024-01-15T11:00:00-06:00',
        timeZone: 'America/Chicago'
      },
      attendees: [{ email: 'customer@example.com' }]
    });

    if (result.success) {
      console.log('Event created with ID:', result.eventId);
    }
  }
};
```

## Available Services

### Gmail API Methods

- `sendEmail(message)` - Send emails with attachments
- `getMessages(query?, maxResults?)` - Retrieve Gmail messages
- `getLabels()` - Get Gmail labels
- `getUserProfile()` - Get Gmail profile info
- `checkGmailPermissions()` - Verify Gmail access

### Google Drive API Methods

- `getDriveFiles(query?, maxResults?)` - List Drive files
- `uploadFileToDrive(fileName, content, mimeType, folderId?)` - Upload files

### Google Calendar API Methods

- `getCalendars()` - List user's calendars
- `createCalendarEvent(calendarId, event)` - Create calendar events

## Error Handling

The service includes comprehensive error handling:

```tsx
const { error, reinitialize } = useGoogleService();

// Check for initialization errors
if (error) {
  console.error('Google service error:', error);

  // Try to reinitialize if needed
  await reinitialize();
}
```

## Permissions and Scopes

The integration requires the following Google OAuth scopes:

- `https://www.googleapis.com/auth/gmail.send` - Send emails
- `https://www.googleapis.com/auth/gmail.readonly` - Read emails
- `https://www.googleapis.com/auth/drive.file` - Access Drive files
- `https://www.googleapis.com/auth/calendar.events` - Manage calendar events

## Security Considerations

1. **Token Storage**: Access tokens are managed by Supabase and not stored in localStorage
2. **Scope Limitations**: Only request necessary scopes for your use case
3. **Error Handling**: Always handle API failures gracefully
4. **Rate Limiting**: Google APIs have rate limits - implement appropriate retry logic if needed

## Practical Use Cases for Roofing Business

### 1. Invoice Email Automation

```tsx
// Automatically email invoices to customers
const emailInvoice = async (invoice, customer) => {
  await sendEmail({
    to: [customer.email],
    subject: `Invoice ${invoice.number} from Rios Roofing`,
    htmlBody: generateInvoiceHTML(invoice),
    attachments: [
      {
        filename: `invoice-${invoice.number}.pdf`,
        content: await generateInvoicePDF(invoice),
        mimeType: 'application/pdf'
      }
    ]
  });
};
```

### 2. Appointment Scheduling

```tsx
// Create calendar events for appointments
const scheduleInspection = async (customer, datetime) => {
  await createCalendarEvent('primary', {
    summary: `Roof Inspection - ${customer.name}`,
    description: `Address: ${customer.address}\nPhone: ${customer.phone}`,
    start: { dateTime: datetime },
    end: { dateTime: addHours(datetime, 1) },
    attendees: [{ email: customer.email }]
  });
};
```

### 3. Document Management

```tsx
// Store contracts and estimates in Drive
const saveContract = async (customerName, contractContent) => {
  await uploadFileToDrive(
    `${customerName}-roofing-contract.pdf`,
    contractContent,
    'application/pdf',
    'contracts-folder-id'
  );
};
```

## Troubleshooting

### Common Issues

1. **"Google service not initialized"**
   - Ensure user is logged in with Google
   - Check that Supabase has Google OAuth configured
   - Verify required scopes are granted

2. **"Failed to send email"**
   - Check Gmail API is enabled in Google Cloud Console
   - Verify email addresses are valid
   - Ensure user has Gmail access permissions

3. **"No access token available"**
   - User needs to re-authenticate with Google
   - Check Supabase session is active
   - Call `reinitialize()` to refresh token

### Debug Mode

Enable debug logging:

```tsx
// In google-service.ts, add console.log statements
console.log('Access token:', this.accessToken);
console.log('API response:', response);
```

### Testing

Test the integration with a simple component:

```tsx
function GoogleServiceTest() {
  const { sendEmail, isInitialized } = useGoogleService();

  const testEmail = async () => {
    if (!isInitialized) return;

    const result = await sendEmail({
      to: ['test@example.com'],
      subject: 'Test Email',
      textBody: 'This is a test email from the roofing app.'
    });

    console.log('Test result:', result);
  };

  return (
    <button onClick={testEmail} disabled={!isInitialized}>
      Send Test Email
    </button>
  );
}
```

## Future Enhancements

Consider these additional features:

1. **Email Templates**: Create reusable email templates for different scenarios
2. **Batch Operations**: Send multiple emails efficiently
3. **Calendar Integration**: Sync with existing calendar applications
4. **File Sync**: Automatically backup important documents to Drive
5. **Analytics**: Track email open rates and responses
