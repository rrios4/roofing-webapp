import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import DefaultPageHeader, { PageHeader } from '../components/ui/page-header';
import {
  UserIcon,
  MailIcon,
  ShieldIcon,
  ClockIcon,
  MapPinIcon,
  GlobeIcon,
  KeyIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LogOutIcon,
  RefreshCwIcon,
  SettingsIcon
} from 'lucide-react';
import { abbreviateName } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';

export default function ProfilePage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const user = auth?.user as any;
  const userMetadata = user?.user_metadata;
  const appMetadata = user?.app_metadata;

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await auth?.signOut();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.'
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: 'There was an error signing you out. Please try again.'
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 space-y-4">
        <DefaultPageHeader
          title="Profile"
          subheading="Loading profile information..."
          showActionButton={false}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-20 rounded-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 mb-8">
      <PageHeader
        title="Profile"
        subheading="Manage your account information and preferences"
        showActionButton={false}
        showSeparator={false}
      />

      {/* Profile Overview Card */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your profile information from Google authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={userMetadata?.avatar_url || userMetadata?.picture}
                  alt={userMetadata?.full_name || 'User'}
                />
                <AvatarFallback className="text-lg">
                  {abbreviateName(userMetadata?.full_name || userMetadata?.name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-semibold">
                    {userMetadata?.full_name || userMetadata?.name || 'No Name'}
                  </h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userMetadata?.email_verified && (
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Email Verified
                    </Badge>
                  )}
                  {appMetadata?.provider && (
                    <Badge variant="outline" className="capitalize">
                      <GlobeIcon className="h-3 w-3 mr-1" />
                      {appMetadata.provider}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.location.reload()}>
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh Profile
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={handleSignOut}
              disabled={isSigningOut}>
              {isSigningOut ? (
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOutIcon className="h-4 w-4 mr-2" />
              )}
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Account Details Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription>Information about your account and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-sm font-mono break-all">{user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-sm capitalize">{user.role || 'User'}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Confirmed</span>
                {user.email_confirmed_at ? (
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Confirmed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-yellow-700 bg-yellow-100">
                    <AlertCircleIcon className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Phone Confirmed</span>
                {user.phone_confirmed_at ? (
                  <Badge variant="secondary" className="text-green-700 bg-green-100">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Confirmed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-gray-700 bg-gray-100">
                    <AlertCircleIcon className="h-3 w-3 mr-1" />
                    Not Set
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyIcon className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>Login providers and security information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Authentication Providers
              </p>
              <div className="space-y-2">
                {appMetadata?.providers?.map((provider: string) => (
                  <div key={provider} className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      <GlobeIcon className="h-3 w-3 mr-1" />
                      {provider}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {provider === 'google' ? 'Google OAuth' : provider}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Created</p>
                <p className="text-sm flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" />
                  {formatDate(user.created_at)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm flex items-center gap-2">
                  <ClockIcon className="h-3 w-3" />
                  {formatDate(user.updated_at)}
                </p>
              </div>

              {user.last_sign_in_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
                  <p className="text-sm flex items-center gap-2">
                    <ClockIcon className="h-3 w-3" />
                    {formatDate(user.last_sign_in_at)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional User Metadata */}
      {userMetadata && Object.keys(userMetadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeIcon className="h-5 w-5" />
              Provider Information
            </CardTitle>
            <CardDescription>
              Additional information from your authentication provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(userMetadata)
                .filter(
                  ([key, value]) =>
                    value &&
                    key !== 'avatar_url' &&
                    key !== 'picture' &&
                    key !== 'full_name' &&
                    key !== 'name' &&
                    key !== 'email'
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm break-all">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
