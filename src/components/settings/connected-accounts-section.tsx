import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { toast } from 'sonner';
import { GoogleIcon } from '../ui/custom-icons';
import {
  PlusIcon,
  MoreHorizontalIcon,
  MailIcon,
  CheckIcon,
  TrashIcon,
  StarIcon,
  AlertTriangleIcon,
  LinkIcon
} from 'lucide-react';
import { ConnectedAccount } from '../../types/global_types';
import {
  useConnectedAccounts,
  useAddConnectedAccount,
  useRemoveConnectedAccount,
  useSetDefaultAccount
} from '../../hooks/useConnectedAccounts';
import multiAccountGoogleService from '../../services/multi-account-google-service';
import { abbreviateName } from '../../lib/utils';

export default function ConnectedAccountsSection() {
  const { data: connectedAccounts, isLoading } = useConnectedAccounts();
  const addAccountMutation = useAddConnectedAccount();
  const removeAccountMutation = useRemoveConnectedAccount();
  const setDefaultMutation = useSetDefaultAccount();

  const [accountToRemove, setAccountToRemove] = useState<ConnectedAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const googleAccounts =
    connectedAccounts?.filter((account) => account.provider === 'google') || [];

  const handleConnectGoogle = async () => {
    try {
      setIsConnecting(true);
      const authUrl = await multiAccountGoogleService.initiateGoogleAuth([
        'email',
        'profile',
        'gmail.send',
        'gmail.readonly'
      ]);

      // Open in popup window
      const popup = window.open(
        authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for popup to close or receive message
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
        }
      }, 1000);

      // Listen for message from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup?.close();
          setIsConnecting(false);
          toast.success('Google account connected successfully!');
          // Refresh will happen via the mutation
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup?.close();
          setIsConnecting(false);
          toast.error(event.data.error || 'Failed to connect Google account');
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        if (popup && !popup.closed) {
          popup.close();
          setIsConnecting(false);
        }
      }, 300000); // 5 minute timeout
    } catch (error) {
      console.error('Error connecting Google account:', error);
      setIsConnecting(false);

      // Handle specific configuration errors
      if (error instanceof Error && error.message.includes('not configured')) {
        toast.error(
          'Google OAuth is not configured. Please contact your administrator to set up Google integration.',
          {
            duration: 5000
          }
        );
      } else {
        toast.error('Failed to connect Google account');
      }
    }
  };

  const handleRemoveAccount = async (account: ConnectedAccount) => {
    try {
      await removeAccountMutation.mutateAsync(account.id);
      setAccountToRemove(null);
    } catch (error) {
      console.error('Error removing account:', error);
    }
  };

  const handleSetDefault = async (account: ConnectedAccount) => {
    try {
      await setDefaultMutation.mutateAsync(account.id);
    } catch (error) {
      console.error('Error setting default account:', error);
    }
  };

  const handleTestConnection = async (account: ConnectedAccount) => {
    try {
      const isValid = await multiAccountGoogleService.testAccountConnection(account.id);
      if (isValid) {
        toast.success('Connection test successful');
      } else {
        toast.error('Connection test failed - account may need to be reconnected');
      }
    } catch (error) {
      toast.error('Connection test failed');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            Connected Accounts
          </CardTitle>
          <CardDescription className="text-sm">
            Connect external accounts to send emails and access services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Accounts Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Google Accounts</h3>
                <Badge variant="secondary" className="text-xs">
                  {googleAccounts.length}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleConnectGoogle}
                disabled={isConnecting || addAccountMutation.isPending}
                className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Account'}
              </Button>
            </div>

            {googleAccounts.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <MailIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No Google accounts connected</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect a Google account to send emails through Gmail
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {googleAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://www.gravatar.com/avatar/${account.account_email}?d=identicon`}
                      />
                      <AvatarFallback className="text-sm">
                        {abbreviateName(account.account_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{account.account_name}</p>
                        {account.is_default && (
                          <Badge variant="default" className="text-xs">
                            <StarIcon className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {account.account_email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              account.is_active ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {account.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="text-xs text-muted-foreground">
                          {account.scopes.length} permissions
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!account.is_default && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(account)}
                          disabled={setDefaultMutation.isPending}
                          className="text-xs">
                          Set Default
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTestConnection(account)}>
                            <CheckIcon className="h-4 w-4 mr-2" />
                            Test Connection
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setAccountToRemove(account)}
                            className="text-destructive">
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Disconnect
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Future providers section placeholder */}
          <Separator />
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">More providers coming soon...</p>
            <p className="text-xs">Microsoft Outlook, Yahoo Mail, and others</p>
          </div>
        </CardContent>
      </Card>

      {/* Remove Account Dialog */}
      <AlertDialog open={!!accountToRemove} onOpenChange={() => setAccountToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-destructive" />
              Disconnect Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect <strong>{accountToRemove?.account_email}</strong>?
              You will no longer be able to send emails from this account until you reconnect it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => accountToRemove && handleRemoveAccount(accountToRemove)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={removeAccountMutation.isPending}>
              {removeAccountMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
