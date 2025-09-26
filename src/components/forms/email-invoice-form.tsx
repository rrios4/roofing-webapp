import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { useGoogleService } from '../../hooks/useGoogleService';
import { formatMoneyValue, formatNumber } from '../../lib/utils';
import { Mail, Loader2 } from 'lucide-react';

interface EmailInvoiceDialogProps {
  invoice: any;
  trigger?: React.ReactNode;
}

export const EmailInvoiceDialog: React.FC<EmailInvoiceDialogProps> = ({ 
  invoice, 
  trigger 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailForm, setEmailForm] = useState({
    to: invoice?.customer?.email || '',
    cc: '',
    subject: `Invoice INV-${formatNumber(invoice?.invoice_number || 0)} from Rios Roofing`,
    message: `Dear ${invoice?.customer?.first_name || 'Customer'},

Please find attached your invoice for the roofing services provided.

Invoice Details:
- Invoice Number: INV-${formatNumber(invoice?.invoice_number || 0)}
- Amount Due: $${formatMoneyValue(invoice?.total || 0)}
- Due Date: ${invoice?.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}

If you have any questions about this invoice, please don't hesitate to contact us.

Thank you for choosing Rios Roofing!

Best regards,
Rios Roofing Services
150 Tallant St, Houston TX 77076
Phone: 832-310-3593
Email: rrios.roofing@gmail.com`
  });

  const { toast } = useToast();
  const { 
    sendEmail, 
    isInitialized, 
    isLoading: serviceLoading, 
    error: serviceError,
    checkGmailPermissions 
  } = useGoogleService();

  const handleFormChange = (field: string, value: string) => {
    setEmailForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendEmail = async () => {
    if (!emailForm.to.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a recipient email address.',
        variant: 'destructive'
      });
      return;
    }

    if (!emailForm.subject.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter an email subject.',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);

    try {
      // Check permissions first
      const hasPermissions = await checkGmailPermissions();
      if (!hasPermissions) {
        toast({
          title: 'Permission Required',
          description: 'Gmail access is required to send emails. Please ensure you have granted the necessary permissions.',
          variant: 'destructive'
        });
        return;
      }

      const result = await sendEmail({
        to: emailForm.to.split(',').map((email: string) => email.trim()),
        cc: emailForm.cc ? emailForm.cc.split(',').map((email: string) => email.trim()) : undefined,
        subject: emailForm.subject,
        htmlBody: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
              <h1>Rios Roofing Services</h1>
            </div>
            <div style="padding: 20px; background-color: #f8f9fa;">
              ${emailForm.message.replace(/\n/g, '<br>')}
            </div>
            <div style="background-color: #e9ecef; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
              <p>This email was sent from The Roofing App</p>
              <p>If you have any questions, please contact us at rrios.roofing@gmail.com</p>
            </div>
          </div>
        `,
        textBody: emailForm.message
      });

      if (result.success) {
        toast({
          title: 'Email Sent Successfully',
          description: `Invoice email has been sent to ${emailForm.to}`,
          variant: 'default'
        });
        setIsOpen(false);
        // Reset form
        setEmailForm(prev => ({
          ...prev,
          cc: '',
          message: prev.message // Keep the default message template
        }));
      } else {
        toast({
          title: 'Failed to Send Email',
          description: result.error || 'An unknown error occurred while sending the email.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Email Send Error',
        description: error instanceof Error ? error.message : 'Failed to send email',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const isReady = isInitialized && !serviceLoading;
  const hasError = serviceError !== null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            size="sm" 
            variant="outline"
            disabled={!isReady || hasError}
            title={
              !isReady 
                ? 'Loading Google services...' 
                : hasError 
                  ? 'Google services unavailable' 
                  : 'Email invoice'
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Invoice
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Invoice</DialogTitle>
          <DialogDescription>
            Send invoice INV-{formatNumber(invoice?.invoice_number || 0)} to your customer via email.
          </DialogDescription>
        </DialogHeader>

        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-800">
              <strong>Service Error:</strong> {serviceError}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Please ensure you have granted Gmail permissions when signing in with Google.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <Label htmlFor="to" className="text-left">
              To *
            </Label>
            <Input
              id="to"
              placeholder="customer@example.com"
              value={emailForm.to}
              onChange={(e) => handleFormChange('to', e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="cc" className="text-left">
              CC
            </Label>
            <Input
              id="cc"
              placeholder="Optional - separate multiple emails with commas"
              value={emailForm.cc}
              onChange={(e) => handleFormChange('cc', e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="subject" className="text-left">
              Subject *
            </Label>
            <Input
              id="subject"
              value={emailForm.subject}
              onChange={(e) => handleFormChange('subject', e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="message" className="text-left pt-2">
              Message *
            </Label>
            <Textarea
              id="message"
              rows={12}
              value={emailForm.message}
              onChange={(e) => handleFormChange('message', e.target.value)}
              className="col-span-3 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending || !isReady || hasError}
          >
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
  );
};