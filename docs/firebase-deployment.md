# Firebase Deployment Guide

This guide explains how to set up and deploy the React application to Firebase Hosting.

## Prerequisites

- Node.js installed (v20 or later)
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase project created in the [Firebase Console](https://console.firebase.google.com)
- GitHub repository with access to add secrets

## Initial Setup

1. **Login to Firebase CLI**
   ```bash
   firebase login
   ```

2. **Initialize Firebase in your project**
   ```bash
   firebase init
   ```
   During initialization:
   - Select "Hosting" when prompted for features
   - Choose your Firebase project
   - Specify `dist` as your public directory (for Vite builds)
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys: Yes

3. **Environment Variables Setup**
   
   Create a `.env` file in your project root:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_KEY=your_supabase_key
   ```

4. **Add GitHub Secrets**
   
   Go to your GitHub repository → Settings → Secrets and variables → Actions and add:
   - `REACT_APP_SUPABASE_URL`: Your Supabase URL
   - `REACT_APP_SUPABASE_KEY`: Your Supabase key
   - `FIREBASE_SERVICE_ACCOUNT_RRIOS_ROOFING_WEBAPP`: (Automatically added by Firebase CLI)

## Deployment Workflows

The project includes two GitHub Actions workflows:

1. **Production Deployment** (`firebase-hosting-merge.yml`)
   - Triggers on merges to `main` branch
   - Builds the application
   - Deploys to production

2. **Preview Deployment** (`firebase-hosting-pull-request.yml`)
   - Triggers on pull requests
   - Creates preview deployments
   - Useful for testing changes before merging

## Manual Deployment

To deploy manually:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

   Or deploy only hosting:
   ```bash
   firebase deploy --only hosting
   ```

## Environment Variables

The following environment variables are required:

| Variable | Description | Source |
|----------|-------------|---------|
| `REACT_APP_SUPABASE_URL` | Supabase project URL | Supabase Dashboard |
| `REACT_APP_SUPABASE_KEY` | Supabase anonymous key | Supabase Dashboard |

## Troubleshooting

1. **Permission Issues**
   - Ensure you're logged in with the correct Firebase account
   - Verify you have the necessary permissions in the Firebase project
   - Check if the Firebase API is enabled in Google Cloud Console

2. **Build Failures**
   - Verify all environment variables are set in GitHub Secrets
   - Check if the build command works locally
   - Review GitHub Actions logs for specific error messages

3. **Deployment Issues**
   - Ensure Firebase CLI is properly initialized
   - Verify the `dist` directory exists and contains built files
   - Check Firebase project configuration in `.firebaserc`

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli) 