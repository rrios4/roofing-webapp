import React from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import {
  ChevronRightIcon,
  DatabaseIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  SettingsIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../components/common/theme-provider';
import { abbreviateName } from '../lib/utils';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex flex-col w-full gap-3 sm:gap-4 pb-3 sm:py-3 max-w-4xl mx-auto">
      <PageHeader
        title="Settings"
        subheading="Manage your account and application preferences"
        showActionButton={false}
        showSeparator={true}
      />

      <div className="grid gap-3 sm:gap-4">
        {/* User Profile Card */}
        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <UserIcon className="h-5 w-5 text-muted-foreground" />
              Profile
            </CardTitle>
            <CardDescription className="text-sm">
              Your account information and profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                <AvatarImage
                  src={(user as any)?.user_metadata?.avatar_url}
                  alt={(user as any)?.user_metadata?.full_name || 'User'}
                />
                <AvatarFallback className="text-sm sm:text-base font-semibold">
                  {(user as any)?.user_metadata?.full_name
                    ? abbreviateName((user as any).user_metadata.full_name)
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {(user as any)?.user_metadata?.full_name || 'User'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {(user as any)?.email || 'No email available'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since{' '}
                  {new Date((user as any)?.created_at || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              {isDarkMode ? (
                <MoonIcon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <SunIcon className="h-5 w-5 text-muted-foreground" />
              )}
              Appearance
            </CardTitle>
            <CardDescription className="text-sm">
              Customize how the application looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-sm sm:text-base font-medium">
                  Dark Mode
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleThemeToggle}
                className="ml-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="w-full">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <SettingsIcon className="h-5 w-5 text-muted-foreground" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm">
              Frequently used settings and management tools
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {/* Data Management Link */}
            <Link to="/data-management" className="block">
              <Button variant="ghost" className="w-full justify-between h-auto p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <DatabaseIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm sm:text-base font-medium">Data Management</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Manage your business data and system settings
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Separator className="my-2" />

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-3 sm:p-4 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <LogOutIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm sm:text-base font-medium">Sign Out</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
