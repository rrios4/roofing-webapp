import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from './ui/use-toast';
import { useGoogleService } from '../hooks/useGoogleService';
import {
  Loader2,
  Mail,
  Calendar,
  HardDrive,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

/**
 * Test component for Google Services Integration
 * Use this component to verify that Google services are working correctly
 */
export const GoogleServiceTest: React.FC = () => {
  const [testResults, setTestResults] = useState<
    Record<string, 'idle' | 'loading' | 'success' | 'error'>
  >({});
  const [testOutputs, setTestOutputs] = useState<Record<string, any>>({});

  const { toast } = useToast();
  const {
    isInitialized,
    isLoading,
    error,
    sendEmail,
    getMessages,
    getLabels,
    getUserProfile,
    getDriveFiles,
    getCalendars,
    checkGmailPermissions,
    reinitialize
  } = useGoogleService();

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setTestResults((prev) => ({ ...prev, [testName]: 'loading' }));

    try {
      const result = await testFn();
      setTestResults((prev) => ({ ...prev, [testName]: 'success' }));
      setTestOutputs((prev) => ({ ...prev, [testName]: result }));

      toast({
        title: `${testName} Test Passed`,
        description: 'Test completed successfully',
        variant: 'default'
      });
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [testName]: 'error' }));
      setTestOutputs((prev) => ({ ...prev, [testName]: error }));

      toast({
        title: `${testName} Test Failed`,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Running...</Badge>;
      case 'success':
        return (
          <Badge variant="default" className="bg-green-500">
            Pass
          </Badge>
        );
      case 'error':
        return <Badge variant="destructive">Fail</Badge>;
      default:
        return <Badge variant="outline">Idle</Badge>;
    }
  };

  const tests = [
    {
      name: 'Gmail Permissions',
      description: 'Check if Gmail API access is available',
      icon: <Mail className="w-4 h-4" />,
      test: async () => {
        const hasPermissions = await checkGmailPermissions();
        if (!hasPermissions) {
          throw new Error('Gmail permissions not available');
        }
        return { hasPermissions };
      }
    },
    {
      name: 'Gmail Profile',
      description: 'Get user Gmail profile information',
      icon: <Mail className="w-4 h-4" />,
      test: async () => {
        const profile = await getUserProfile();
        if (!profile.emailAddress) {
          throw new Error('Could not retrieve Gmail profile');
        }
        return profile;
      }
    },
    {
      name: 'Gmail Labels',
      description: 'Fetch Gmail labels',
      icon: <Mail className="w-4 h-4" />,
      test: async () => {
        const labels = await getLabels();
        if (!Array.isArray(labels) || labels.length === 0) {
          throw new Error('Could not retrieve Gmail labels');
        }
        return { count: labels.length, labels: labels.slice(0, 5) };
      }
    },
    {
      name: 'Gmail Messages',
      description: 'Fetch recent Gmail messages',
      icon: <Mail className="w-4 h-4" />,
      test: async () => {
        const messages = await getMessages(undefined, 5);
        return { count: messages.length, hasMessages: messages.length > 0 };
      }
    },
    {
      name: 'Test Email',
      description: 'Send a test email to yourself',
      icon: <Mail className="w-4 h-4" />,
      test: async () => {
        const profile = await getUserProfile();
        if (!profile.emailAddress) {
          throw new Error('Cannot send test email - no email address available');
        }

        const result = await sendEmail({
          to: [profile.emailAddress],
          subject: 'Test Email from Roofing App',
          textBody: `This is a test email sent from the Roofing App Google Services integration.\n\nTest performed at: ${new Date().toLocaleString()}\n\nIf you received this email, the Gmail integration is working correctly!`,
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Test Email from Roofing App</h2>
              <p>This is a test email sent from the Roofing App Google Services integration.</p>
              <p><strong>Test performed at:</strong> ${new Date().toLocaleString()}</p>
              <p>If you received this email, the Gmail integration is working correctly! ✅</p>
              <hr style="margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                This email was sent automatically as part of the Google Services integration test.
              </p>
            </div>
          `
        });

        if (!result.success) {
          throw new Error(result.error || 'Failed to send test email');
        }

        return { messageId: result.messageId, recipient: profile.emailAddress };
      }
    },
    {
      name: 'Google Drive',
      description: 'List files in Google Drive',
      icon: <HardDrive className="w-4 h-4" />,
      test: async () => {
        const files = await getDriveFiles(undefined, 10);
        return { count: files.length, hasFiles: files.length > 0 };
      }
    },
    {
      name: 'Google Calendar',
      description: 'List available calendars',
      icon: <Calendar className="w-4 h-4" />,
      test: async () => {
        const calendars = await getCalendars();
        if (!Array.isArray(calendars)) {
          throw new Error('Could not retrieve calendars');
        }
        const primaryCalendar = calendars.find((cal) => cal.primary);
        return {
          count: calendars.length,
          hasCalendars: calendars.length > 0,
          hasPrimary: !!primaryCalendar,
          calendars: calendars.slice(0, 3).map((cal) => ({ id: cal.id, summary: cal.summary }))
        };
      }
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Google Services Integration Test</h1>
        <p className="text-muted-foreground">
          Use this page to test and verify your Google services integration
        </p>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>Current status of the Google services integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Initialized:</span>
              {isInitialized ? (
                <Badge variant="default" className="bg-green-500">
                  Yes
                </Badge>
              ) : (
                <Badge variant="destructive">No</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Loading:</span>
              {isLoading ? (
                <Badge variant="secondary">Loading...</Badge>
              ) : (
                <Badge variant="outline">Ready</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Error:</span>
              {error ? (
                <Badge variant="destructive">Yes</Badge>
              ) : (
                <Badge variant="default" className="bg-green-500">
                  No
                </Badge>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {error}
              </p>
              <Button variant="outline" size="sm" className="mt-2" onClick={reinitialize}>
                Try to Reinitialize
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Cases */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Test Cases</h2>

        {tests.map((test) => (
          <Card key={test.name}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {test.icon}
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(testResults[test.name] || 'idle')}
                  <Button
                    size="sm"
                    onClick={() => runTest(test.name, test.test)}
                    disabled={!isInitialized || isLoading || testResults[test.name] === 'loading'}>
                    {getStatusIcon(testResults[test.name] || 'idle')}
                    <span className="ml-2">Run Test</span>
                  </Button>
                </div>
              </div>

              {testOutputs[test.name] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Test Output:</h4>
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(testOutputs[test.name], null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Run All Tests */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={async () => {
            for (const test of tests) {
              await runTest(test.name, test.test);
              // Small delay between tests
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }}
          disabled={!isInitialized || isLoading}>
          Run All Tests
        </Button>
      </div>
    </div>
  );
};
