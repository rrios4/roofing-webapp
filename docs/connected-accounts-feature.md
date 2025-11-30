# Connected Accounts Feature

## Overview

The Connected Accounts feature allows users to connect external email accounts (starting with Google) to send emails directly from the roofing webapp. This enables users to maintain their professional email identity while using the app's email functionality.

## Architecture

### Database Design

**Table: `connected_accounts`**
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users)
- provider ('google', 'microsoft', 'other')
- account_email (VARCHAR)
- account_name (VARCHAR)
- account_id (VARCHAR) -- Provider's unique ID
- access_token (TEXT)
- refresh_token (TEXT)
- token_expires_at (TIMESTAMP)
- scopes (TEXT[]) -- Granted permissions
- is_default (BOOLEAN)
- is_active (BOOLEAN)
- created_at/updated_at (TIMESTAMP)
```

### Key Features

1. **Multiple Account Support**: Users can connect multiple Google accounts
2. **Default Account Selection**: Users can set a default account for email sending
3. **Token Management**: Automatic refresh of expired access tokens
4. **Security**: Row-level security ensures users only see their accounts
5. **OAuth2 Flow**: Secure authentication using Google OAuth2

## Components

### Frontend Components

1. **ConnectedAccountsSection** (`src/components/settings/connected-accounts-section.tsx`)
   - Main UI component for managing connected accounts
   - Displays connected accounts with status indicators
   - Provides connect/disconnect functionality
   - Allows setting default accounts

2. **GoogleAuthCallback** (`src/pages/google-auth-callback.tsx`)
   - Handles OAuth callback from Google
   - Exchanges authorization code for tokens
   - Communicates with parent window via postMessage

### Services

1. **ConnectedAccountsAPI** (`src/services/api/connected-accounts.ts`)
   - CRUD operations for connected accounts
   - Database interaction layer
   - Enforces business rules

2. **MultiAccountGoogleService** (`src/services/multi-account-google-service.ts`)
   - Google OAuth flow management
   - Token refresh handling
   - Gmail API interactions
   - Multi-account email sending

### Hooks

1. **useConnectedAccounts** (`src/hooks/useConnectedAccounts.tsx`)
   - React Query hooks for connected accounts
   - Optimistic updates and caching
   - Error handling with toast notifications

## Setup Instructions

### 1. Database Migration

Run the migration script to create the `connected_accounts` table:

```bash
# Execute the SQL migration
psql -f docs/connected-accounts-migration.sql
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API and Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://yourdomain.com/auth/google/callback`
   - Authorized JavaScript origins: `https://yourdomain.com`

### 3. Environment Variables

Add to your `.env` file:

```bash
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Router Setup

Add the Google auth callback route to your router:

```tsx
// In your App.tsx or router setup
import { GoogleAuthCallback } from './pages';

// Add this route
<Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
```

## Usage

### For End Users

1. Go to Settings page
2. Navigate to "Connected Accounts" section
3. Click "Connect Account" under Google Accounts
4. Authorize the application in the popup window
5. Account will be added and available for email sending

### For Developers

#### Sending Emails

```tsx
import multiAccountGoogleService from './services/multi-account-google-service';

// Send email using default account
const result = await multiAccountGoogleService.sendEmail({
  to: ['recipient@example.com'],
  subject: 'Test Email',
  htmlBody: '<p>Hello from connected account!</p>'
});

// Send email using specific account
const result = await multiAccountGoogleService.sendEmail({
  to: ['recipient@example.com'],
  subject: 'Test Email',
  htmlBody: '<p>Hello!</p>',
  from_account_id: 'connected-account-id'
});
```

#### Managing Connected Accounts

```tsx
import { useConnectedAccounts, useSetDefaultAccount } from './hooks/useConnectedAccounts';

function MyComponent() {
  const { data: accounts } = useConnectedAccounts();
  const setDefaultMutation = useSetDefaultAccount();

  const handleSetDefault = (accountId: string) => {
    setDefaultMutation.mutate(accountId);
  };

  return (
    <div>
      {accounts?.map(account => (
        <div key={account.id}>
          {account.account_email}
          {account.is_default && <span>Default</span>}
          <button onClick={() => handleSetDefault(account.id)}>
            Set as Default
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Security Considerations

1. **Token Storage**: Access tokens are stored in the database, encrypted at rest
2. **RLS Policies**: Row-level security ensures users only access their accounts
3. **HTTPS Required**: OAuth flow requires HTTPS in production
4. **Scope Limitation**: Only request necessary Google API scopes
5. **Token Expiry**: Automatic token refresh prevents stale tokens

## API Scopes

The application requests these Google API scopes:

- `email`: Access to user's email address
- `profile`: Access to user's basic profile info
- `gmail.send`: Permission to send emails
- `gmail.readonly`: Permission to read email metadata (for features like message history)

## Error Handling

The system handles various error scenarios:

1. **Token Expiry**: Automatic refresh using refresh token
2. **Invalid Credentials**: User prompted to reconnect account
3. **Network Errors**: Retry logic with exponential backoff
4. **Permission Errors**: Clear error messages to user
5. **Duplicate Accounts**: Prevention of connecting same account twice

## Future Enhancements

1. **Microsoft Outlook Support**: Add Microsoft Graph API integration
2. **Yahoo Mail Support**: Add Yahoo Mail API support
3. **Email Templates**: Pre-defined templates for common communications
4. **Email Scheduling**: Schedule emails to be sent later
5. **Email Analytics**: Track email open rates and engagement
6. **Team Sharing**: Allow team members to use shared accounts

## Troubleshooting

### Common Issues

1. **OAuth Popup Blocked**: Ensure popups are allowed for your domain
2. **Token Refresh Failed**: Check Google Cloud Console for API quotas
3. **CORS Errors**: Verify authorized origins in Google OAuth setup
4. **Database Errors**: Ensure migration was applied correctly

### Debug Tools

The system includes debug methods for troubleshooting:

```tsx
// Test account connection
const isValid = await multiAccountGoogleService.testAccountConnection(accountId);

// Get token debug info (for development only)
const debugInfo = multiAccountGoogleService.getTokenDebugInfo();
```

## Performance Considerations

1. **Token Caching**: Tokens cached to minimize database queries
2. **Optimistic Updates**: UI updates immediately for better UX
3. **Lazy Loading**: Account lists loaded on demand
4. **Efficient Queries**: Database indexes on frequently queried columns
5. **Connection Pooling**: Supabase handles database connection pooling