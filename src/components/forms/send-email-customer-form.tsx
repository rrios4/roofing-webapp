import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { useGoogleService } from '../../hooks/useGoogleService';
import { Loader2, Mail } from 'lucide-react';
import { GoogleReconnectDialog } from '../google-reconnect-dialog';

interface SendEmailCustomerDialogProps {
  customerEmail: string;
  customerName: string;
  trigger?: React.ReactNode;
}

export const SendEmailCustomerDialog: React.FC<SendEmailCustomerDialogProps> = ({
  customerEmail,
  customerName,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [reconnectOpen, setReconnectOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { toast } = useToast();
  const { sendEmail, isInitialized, isLoading: serviceLoading } = useGoogleService();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in both the subject and message before sending.'
      });
      return;
    }

    setIsSending(true);
    try {
      const result = await sendEmail({
        to: [customerEmail],
        subject,
        htmlBody: `<div style="font-family: sans-serif; white-space: pre-wrap;">${message.replace(/\n/g, '<br/>')}</div>`
      });

      if (result.success) {
        toast({
          variant: 'success',
          title: 'Email sent! 🎉',
          description: `Your email to ${customerName} was sent successfully.`
        });
        setIsOpen(false);
        setSubject('');
        setMessage('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to send email',
          description: result.error || 'An unknown error occurred.'
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to send email',
        description: err?.message || 'An unknown error occurred.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const isServiceReady = isInitialized && !serviceLoading;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Compose
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>New Email to {customerName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* To field — read-only */}
          <div className="space-y-1">
            <Label>To</Label>
            <Input value={customerEmail} readOnly className="bg-muted text-muted-foreground" />
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>

          {/* Body */}
          <div className="space-y-1">
            <Label htmlFor="email-body">Message</Label>
            <Textarea
              id="email-body"
              placeholder="Write your message here..."
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              className="resize-none"
            />
          </div>

          {!isServiceReady && (
            <div className="flex items-center gap-2 p-3 border border-yellow-200 rounded-md bg-yellow-50">
              <p className="text-sm text-yellow-700 flex-1">
                Gmail is not connected. Re-connect to send emails.
              </p>
              <Button variant="outline" size="sm" onClick={() => setReconnectOpen(true)}>
                <Mail className="w-3 h-3 mr-1.5" />
                Connect Google
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending || !isServiceReady}>
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <GoogleReconnectDialog open={reconnectOpen} onOpenChange={setReconnectOpen} />
    </>
  );
};

export default SendEmailCustomerDialog;
