import React, { useState } from 'react';
import { useCustomerEmails, GmailMessageMetadata } from '../hooks/useAPI/use-customer-emails';
import { useGoogleService } from '../hooks/useGoogleService';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SendEmailCustomerDialog } from './forms/send-email-customer-form';
import { GoogleReconnectDialog } from './google-reconnect-dialog';
import {
  ExternalLinkIcon,
  InboxIcon,
  MailIcon,
  RefreshCwIcon,
  SendIcon,
  TriangleAlertIcon
} from 'lucide-react';

interface CustomerEmailsTabProps {
  customerEmail?: string;
  customerName: string;
}

function parseEmailAddress(raw: string): string {
  // "John Doe <john@example.com>" → "john@example.com"
  // "john@example.com" → "john@example.com"
  const match = raw.match(/<(.+?)>/);
  return match ? match[1] : raw.trim();
}

function parseDisplayName(raw: string): string {
  const match = raw.match(/^(.+?)\s*</);
  return match ? match[1].trim().replace(/^"|"$/g, '') : raw.trim();
}

function formatEmailDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isThisYear = d.getFullYear() === now.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    if (isThisYear) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function openInGmail(messageId: string) {
  window.open(`https://mail.google.com/mail/u/0/#all/${messageId}`, '_blank', 'noopener,noreferrer');
}

const EmailRowSkeleton = () => (
  <div className="flex items-start gap-3 p-3 border-b last:border-b-0">
    <Skeleton className="h-4 w-14 mt-1 flex-shrink-0" />
    <div className="flex-1 min-w-0 space-y-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-full max-w-sm" />
    </div>
    <Skeleton className="h-3 w-12 flex-shrink-0 mt-1" />
  </div>
);

const CustomerEmailsTab: React.FC<CustomerEmailsTabProps> = ({ customerEmail, customerName }) => {
  const { isInitialized, isLoading: serviceLoading } = useGoogleService();
  const { emails, isLoading, isError, refetch } = useCustomerEmails(customerEmail);
  const [reconnectOpen, setReconnectOpen] = useState(false);

  if (!customerEmail) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <MailIcon className="w-10 h-10 text-muted-foreground" />
        <p className="font-medium">No email address on file</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Add an email address to this customer to view and send emails.
        </p>
      </div>
    );
  }

  if (!isInitialized && !serviceLoading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <TriangleAlertIcon className="w-10 h-10 text-yellow-500" />
          <div className="space-y-1">
            <p className="font-medium">Gmail not connected</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your Google session has expired or Gmail access was not granted.
            </p>
          </div>
          <Button onClick={() => setReconnectOpen(true)}>
            <MailIcon className="w-4 h-4 mr-2" />
            Connect Google
          </Button>
        </div>
        <GoogleReconnectDialog open={reconnectOpen} onOpenChange={setReconnectOpen} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Loading emails…' : `${emails.length} email${emails.length !== 1 ? 's' : ''} found`}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCwIcon className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <SendEmailCustomerDialog
            customerEmail={customerEmail}
            customerName={customerName}
            trigger={
              <Button size="sm">
                <MailIcon className="w-4 h-4 mr-2" />
                Compose
              </Button>
            }
          />
        </div>
      </div>

      {/* Email list */}
      <div className="border rounded-md overflow-hidden">
        {/* Loading */}
        {(isLoading || serviceLoading) && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <EmailRowSkeleton key={i} />
            ))}
          </>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
            <TriangleAlertIcon className="w-8 h-8 text-destructive" />
            <p className="font-medium text-sm">Failed to load emails</p>
            <p className="text-xs text-muted-foreground">
              Check your connection or try refreshing.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && emails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
            <InboxIcon className="w-8 h-8 text-muted-foreground" />
            <p className="font-medium text-sm">No emails found</p>
            <p className="text-xs text-muted-foreground">
              No emails to or from {customerEmail} were found in your Gmail.
            </p>
          </div>
        )}

        {/* Rows */}
        {!isLoading &&
          !isError &&
          emails.map((email: GmailMessageMetadata) => {
            const isSent = email.labelIds.includes('SENT');
            const isUnread = email.labelIds.includes('UNREAD');
            const counterpart = isSent ? email.to : email.from;
            const displayName = parseDisplayName(counterpart);

            return (
              <div
                key={email.id}
                className="flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors group"
                onClick={() => openInGmail(email.id)}>
                {/* Direction badge */}
                <div className="flex-shrink-0 mt-0.5">
                  {isSent ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 gap-1 text-blue-600 border-blue-200">
                      <SendIcon className="w-2.5 h-2.5" />
                      Sent
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 gap-1 text-green-600 border-green-200">
                      <InboxIcon className="w-2.5 h-2.5" />
                      Received
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span
                      className={`text-sm truncate ${isUnread ? 'font-semibold' : 'font-medium'}`}>
                      {email.subject}
                    </span>
                    {isUnread && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    <span className="font-medium">{displayName || counterpart}</span>
                    {email.snippet && ` — ${email.snippet}`}
                  </p>
                </div>

                {/* Date + open icon */}
                <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatEmailDate(email.date)}
                  </span>
                  <ExternalLinkIcon className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
      </div>
      </div>
      <GoogleReconnectDialog open={reconnectOpen} onOpenChange={setReconnectOpen} />
    </>
  );
};

export default CustomerEmailsTab;
