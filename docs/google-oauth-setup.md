# Google OAuth Setup Guide

This guide will help you set up Google OAuth integration for your roofing webapp's connected accounts feature.

## Prerequisites

You need a Google Cloud Project with OAuth 2.0 credentials configured.

## Step 1: Create Google Cloud Project (if you haven't already)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API and Google+ API for your project

## Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials** in your Google Cloud Console
2. Click **+ CREATE CREDENTIALS > OAuth client ID**
3. Choose **Web application** as the application type
4. Add your authorized redirect URIs:
   - For development: `http://localhost:5173/auth/google/callback`
   - For production: `https://yourdomain.com/auth/google/callback`
5. Click **Create**
6. Copy your **Client ID** and **Client Secret**

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key

   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_from_step_2
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_from_step_2
   ```

## Step 4: Test the Integration

1. Restart your development server:
   ```bash
   pnpm dev
   ```

2. Go to **Settings > Connected Accounts**
3. Click **Connect Google Account**
4. You should see a Google OAuth popup asking for permissions

## Troubleshooting

### Error: "Missing required parameter: client_id"
- Check that `VITE_GOOGLE_CLIENT_ID` is set in your `.env.local` file
- Restart your development server after adding environment variables

### Error: "redirect_uri_mismatch"
- Make sure you've added the correct redirect URI to your Google OAuth credentials
- For development: `http://localhost:5173/auth/google/callback`
- For production: `https://yourdomain.com/auth/google/callback`

### Error: "invalid_client"
- Verify your `VITE_GOOGLE_CLIENT_SECRET` is correct
- Make sure there are no extra spaces in your environment variables

## Required OAuth Scopes

The application requests these Google OAuth scopes:
- `email` - Access to user's email address
- `profile` - Access to user's basic profile info
- `gmail.send` - Permission to send emails on user's behalf
- `gmail.readonly` - Permission to read Gmail messages (optional for future features)

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Google Client Secret secure
- Regularly review and rotate your OAuth credentials
- Consider using different credentials for development and production