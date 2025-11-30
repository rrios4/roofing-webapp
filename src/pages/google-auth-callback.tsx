import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import multiAccountGoogleService from '../services/multi-account-google-service';
import { useAddConnectedAccount } from '../hooks/useConnectedAccounts';

interface CallbackState {
  status: 'loading' | 'success' | 'error';
  message: string;
  accountEmail?: string;
}

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [callbackState, setCallbackState] = useState<CallbackState>({
    status: 'loading',
    message: 'Processing Google authentication...'
  });

  const addAccountMutation = useAddConnectedAccount();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Handle OAuth errors
        if (error) {
          let errorMessage = 'Authentication failed';
          switch (error) {
            case 'access_denied':
              errorMessage =
                'Access was denied. Please try again and grant the necessary permissions.';
              break;
            case 'invalid_request':
              errorMessage = 'Invalid request. Please try again.';
              break;
            default:
              errorMessage = `Authentication error: ${error}`;
          }

          setCallbackState({
            status: 'error',
            message: errorMessage
          });
          toast.error(errorMessage);
          return;
        }

        // Check for required parameters
        if (!code || !state) {
          setCallbackState({
            status: 'error',
            message: 'Missing authentication parameters. Please try connecting your account again.'
          });
          toast.error('Authentication failed: Missing parameters');
          return;
        }

        // Validate state parameter (security check)
        if (!state.startsWith('connect_account_')) {
          setCallbackState({
            status: 'error',
            message: 'Invalid authentication state. Please try again.'
          });
          toast.error('Authentication failed: Invalid state');
          return;
        }

        setCallbackState({
          status: 'loading',
          message: 'Exchanging authorization code for access tokens...'
        });

        // Handle the OAuth callback
        const connectedAccount = await multiAccountGoogleService.handleGoogleCallback(code, state);

        setCallbackState({
          status: 'loading',
          message: 'Saving account information...'
        });

        // Add the connected account to the database
        await addAccountMutation.mutateAsync(connectedAccount);

        setCallbackState({
          status: 'success',
          message: 'Google account connected successfully!',
          accountEmail: connectedAccount.account_email
        });

        toast.success(`Google account ${connectedAccount.account_email} connected successfully!`);

        // Redirect to settings after a short delay
        setTimeout(() => {
          navigate('/settings', { replace: true });
        }, 2000);
      } catch (error) {
        console.error('OAuth callback error:', error);

        let errorMessage = 'Failed to connect Google account';
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        setCallbackState({
          status: 'error',
          message: errorMessage
        });

        toast.error(errorMessage);
      }
    };

    handleCallback();
  }, [searchParams, addAccountMutation, navigate]);

  const handleReturnToSettings = () => {
    navigate('/settings', { replace: true });
  };

  const handleTryAgain = () => {
    navigate('/settings', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {callbackState.status === 'loading' && (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            )}
            {callbackState.status === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {callbackState.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            Google Account Connection
          </CardTitle>
          <CardDescription>
            {callbackState.status === 'loading' && 'Processing your authentication request...'}
            {callbackState.status === 'success' && 'Your account has been successfully connected!'}
            {callbackState.status === 'error' && 'There was a problem connecting your account.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">{callbackState.message}</p>
            {callbackState.accountEmail && (
              <p className="text-sm font-medium text-gray-900 mt-2">{callbackState.accountEmail}</p>
            )}
          </div>

          {callbackState.status === 'loading' && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait while we process your request...
              </div>
            </div>
          )}

          {callbackState.status === 'success' && (
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-600">
                Redirecting you to settings in a moment...
              </div>
              <Button onClick={handleReturnToSettings} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Settings
              </Button>
            </div>
          )}

          {callbackState.status === 'error' && (
            <div className="space-y-3">
              <Button onClick={handleTryAgain} className="w-full">
                Try Again
              </Button>
              <Button onClick={handleReturnToSettings} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
