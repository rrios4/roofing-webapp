import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Send, Mail } from 'lucide-react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';

import { useGoogleService } from '../../hooks/useGoogleService';
import { ModernQuoteDocument } from '../pdf-render/modern-quote-doc-final';
import { formatNumber, formatMoneyValue } from '../../lib/utils';
import { Checkbox } from '../ui/checkbox';

// Ensure Buffer is available for PDF generation in browser
if (typeof Buffer === 'undefined') {
  // @ts-ignore
  globalThis.Buffer = (await import('buffer')).Buffer;
}

interface EmailQuoteDialogProps {
  quote: any;
  trigger?: React.ReactNode;
}

// Email Templates
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  description: string;
}

interface PDFDisplayOptions {
  showServiceDetails: boolean;
  showMeasurementNote: boolean;
  showCustomerNotes: boolean;
}

const getEmailTemplates = (quote: any): EmailTemplate[] => [
  {
    id: 'standard',
    name: 'Standard Quote',
    description: 'Standard quote submission for customer review',
    subject: `Quote QT-${formatNumber(quote?.quote_number || 0)} from Rios Roofing - Your Roofing Estimate`,
    message: `Dear ${quote?.customer?.first_name || 'Customer'},

      Thank you for your interest in Rios Roofing services! We're pleased to present your personalized roofing quote as requested.

      Please find your detailed quote attached to this email. This quote includes a comprehensive breakdown of all materials, labor, and services required for your roofing project.

      Key Quote Details:
      • Quote expires on: ${quote?.expiration_date ? new Date(quote.expiration_date).toLocaleDateString() : 'Please see attached quote'}
      • Service: ${quote?.service?.name || 'Roofing Service'}
      ${quote?.total ? `• Total Amount: ${formatMoneyValue(quote.total)}` : ''}

      We believe this quote provides excellent value and reflects our commitment to quality workmanship and premium materials. Our experienced team is ready to transform your roofing project with the same dedication that has made us a trusted name in the Houston area.

      To accept this quote or if you have any questions about the scope of work, materials, or timeline, please don't hesitate to contact us. We're here to help make your roofing project a success!

      We look forward to the opportunity to work with you and provide the exceptional roofing services your property deserves.

      Best regards,
      Rios Roofing Services
      150 Tallant St, Houston TX 77076
      Phone: 832-310-3593
      Email: rrios.roofing@gmail.com`
  },
  {
    id: 'custom',
    name: 'Custom Message',
    description: 'Template with customizable message field for personalized communication',
    subject: `Quote QT-${formatNumber(quote?.quote_number || 0)} from Rios Roofing`,
    message: `Dear ${quote?.customer?.first_name || 'Customer'},

      Please find your roofing quote attached to this email.

      [CUSTOM MESSAGE - Please customize this section with your specific message]

      Quote Details:
      • Quote Number: QT-${formatNumber(quote?.quote_number || 0)}
      • Service: ${quote?.service?.name || 'Roofing Service'}
      ${quote?.expiration_date ? `• Expires: ${new Date(quote.expiration_date).toLocaleDateString()}` : ''}
      ${quote?.total ? `• Total Amount: ${formatMoneyValue(quote.total)}` : ''}

      If you have any questions or would like to proceed with this quote, please contact us at your convenience.

      Best regards,
      Rios Roofing Services
      150 Tallant St, Houston TX 77076
      Phone: 832-310-3593
      Email: rrios.roofing@gmail.com`
  }
];

export const EmailQuoteDialog: React.FC<EmailQuoteDialogProps> = ({ quote, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [customMessage, setCustomMessage] = useState('');

  // PDF Display Options state
  const [displayOptions, setDisplayOptions] = useState<PDFDisplayOptions>({
    showServiceDetails: true,
    showMeasurementNote: true,
    showCustomerNotes: true
  });

  // Toggle display option
  const toggleOption = (key: keyof PDFDisplayOptions) => {
    setDisplayOptions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Debug: Log the quote data being passed to the dialog
  console.log('🔍 EmailQuoteDialog - Quote data received:', {
    quote,
    quoteId: quote?.id,
    quoteNumber: quote?.quote_number,
    quoteTotal: quote?.total,
    subtotal: quote?.subtotal,
    customerEmail: quote?.customer?.email,
    customerName: quote?.customer
      ? `${quote.customer.first_name} ${quote.customer.last_name}`
      : 'Unknown',
    service: quote?.service?.name,
    status: quote?.quote_status?.name || quote?.status?.name,
    expirationDate: quote?.expiration_date,
    lineItems: quote?.quote_line_item?.length || 0
  });

  // Get email templates
  const emailTemplates = getEmailTemplates(quote);
  const currentTemplate =
    emailTemplates.find((t) => t.id === selectedTemplate) || emailTemplates[0];

  const [emailForm, setEmailForm] = useState({
    to: quote?.customer?.email || '',
    cc: '',
    subject: currentTemplate.subject,
    message: currentTemplate.message
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
    setEmailForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      let messageContent = template.message;

      // For custom template, replace the placeholder with current custom message
      if (templateId === 'custom' && customMessage) {
        messageContent = template.message.replace(
          '[CUSTOM MESSAGE - Please customize this section with your specific message]',
          customMessage
        );
      }

      setEmailForm((prev) => ({
        ...prev,
        subject: template.subject,
        message: messageContent
      }));
    }
  };

  const handleCustomMessageChange = (message: string) => {
    setCustomMessage(message);

    // If custom template is selected, update the email form message
    if (selectedTemplate === 'custom') {
      const template = emailTemplates.find((t) => t.id === 'custom');
      if (template) {
        const updatedMessage = template.message.replace(
          '[CUSTOM MESSAGE - Please customize this section with your specific message]',
          message
        );
        setEmailForm((prev) => ({
          ...prev,
          message: updatedMessage
        }));
      }
    }
  };

  // Helper function to get quote PDF filename
  const getQuotePDFFilename = (quote: any): string => {
    const quoteNumber = formatNumber(quote.quote_number || 0);
    const customerName = quote.customer
      ? `${quote.customer.first_name}_${quote.customer.last_name}`.replace(/\s+/g, '_')
      : 'Unknown_Customer';
    return `QT-${quoteNumber}_${customerName}.pdf`;
  };

  // Helper function to generate PDF as base64
  const generatePDFBase64 = async (quoteData: any): Promise<string> => {
    try {
      // Ensure Buffer is available for PDF generation
      if (typeof Buffer === 'undefined') {
        throw new Error('Buffer is not available for PDF generation');
      }

      // Generate PDF blob with display options
      const blob = await pdf(
        <ModernQuoteDocument quote={quoteData} displayOptions={displayOptions} />
      ).toBlob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Remove the data:application/pdf;base64, prefix to get just the base64 string
          const base64String = base64data.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(new Error('Failed to convert PDF blob to base64'));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (error instanceof Error) {
        throw new Error(`PDF generation failed: ${error.message}`);
      }
      throw new Error('Failed to generate PDF for email attachment');
    }
  };

  const handleSendEmail = async () => {
    // Debug: Log email form and quote data before processing
    console.log('📧 handleSendEmail - Starting email process:', {
      emailForm,
      quote,
      quoteTotal: quote?.total,
      subtotal: quote?.subtotal,
      service: quote?.service?.name,
      selectedTemplate,
      customMessage: selectedTemplate === 'custom' ? customMessage : 'N/A'
    });

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

    // Validate custom message for custom template
    if (selectedTemplate === 'custom' && !customMessage.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a custom message for the custom template.',
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
          description:
            'Gmail permissions are required to send emails. Please authorize the application.',
          variant: 'destructive'
        });
        return;
      }

      // Show progress for PDF generation
      toast({
        title: 'Preparing Email',
        description: 'Generating quote PDF attachment...',
        variant: 'default'
      });

      // Generate PDF for attachment
      let pdfBase64: string;
      let pdfFilename: string;

      try {
        pdfBase64 = await generatePDFBase64(quote);
        pdfFilename = getQuotePDFFilename(quote);
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        toast({
          title: 'PDF Generation Failed',
          description:
            pdfError instanceof Error
              ? pdfError.message
              : 'Could not generate PDF attachment. The email will be sent without the PDF.',
          variant: 'destructive'
        });

        // Continue without PDF attachment
        pdfBase64 = '';
        pdfFilename = '';
      }

      // Load company logo SVG from public folder and convert to base64
      let logoBase64 = '';
      try {
        const response = await fetch('/company-logo.svg');
        if (response.ok) {
          const svgText = await response.text();
          logoBase64 = Buffer.from(svgText, 'utf-8').toString('base64');
        } else {
          console.warn('Could not load company logo from /company-logo.svg');
        }
      } catch (error) {
        console.error('Error loading company logo:', error);
      }

      // Prepare quote summary for email
      const quoteSummary = `
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Quote Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Quote Number:</td>
              <td style="padding: 8px 0; color: #6b7280;">QT-${formatNumber(quote?.quote_number || 0)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Service:</td>
              <td style="padding: 8px 0; color: #6b7280;">${quote?.service?.name || 'Roofing Service'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Quote Date:</td>
              <td style="padding: 8px 0; color: #6b7280;">${quote?.quote_date ? new Date(quote.quote_date).toLocaleDateString() : 'N/A'}</td>
            </tr>
            ${
              quote?.expiration_date
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Expiration Date:</td>
              <td style="padding: 8px 0; color: #dc2626;">${new Date(quote.expiration_date).toLocaleDateString()}</td>
            </tr>
            `
                : ''
            }
            ${
              quote?.subtotal
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subtotal:</td>
              <td style="padding: 8px 0; color: #6b7280;">${formatMoneyValue(quote.subtotal)}</td>
            </tr>
            `
                : ''
            }
            ${
              quote?.total
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; font-size: 16px;">Total Amount:</td>
              <td style="padding: 8px 0; color: #059669; font-weight: bold; font-size: 16px;">${formatMoneyValue(quote.total)}</td>
            </tr>
            `
                : ''
            }
          </table>
          
          ${
            quote?.quote_line_item && quote.quote_line_item.length > 0
              ? `
          <div style="margin-top: 20px;">
            <h4 style="color: #1e40af; margin: 0 0 10px 0;">Line Items:</h4>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #374151;">Description</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #374151;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #374151;">Rate</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #374151;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${quote.quote_line_item
                  .map(
                    (item: any) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 12px; color: #374151;">${item.description || 'Service Item'}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #f3f4f6; font-size: 12px; color: #6b7280;">${item.qty || 1}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #f3f4f6; font-size: 12px; color: #6b7280;">${item.rate ? formatMoneyValue(item.rate) : 'N/A'}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #f3f4f6; font-size: 12px; color: #6b7280;">${item.amount ? formatMoneyValue(item.amount) : 'N/A'}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          `
              : ''
          }

          ${
            quote?.public_note || quote?.cust_note
              ? `
          <div style="margin-top: 15px; padding: 15px; background-color: #fffbeb; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 14px;">Additional Notes:</h4>
            <p style="color: #78350f; margin: 0; font-size: 13px; line-height: 1.5;">${quote.public_note || quote.cust_note}</p>
          </div>
          `
              : ''
          }
        </div>
      `;

      // Build the complete HTML email content
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Quote from Rios Roofing</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="data:image/svg+xml;base64,${logoBase64}" alt="RiosRoofing Services" style="max-width: 200px; height: auto;">
          </div>
          
          <div style="white-space: pre-line; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            ${emailForm.message}
          </div>
          
          ${quoteSummary}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">This email was sent from your Rios Roofing management system.</p>
            <p style="margin: 5px 0 0 0;">For questions about this quote, please contact us directly.</p>
          </div>
        </body>
        </html>
      `;

      const emailData = {
        to: [emailForm.to],
        cc: emailForm.cc ? [emailForm.cc] : undefined,
        subject: emailForm.subject,
        htmlBody: htmlContent,
        attachments:
          pdfBase64 && pdfFilename
            ? [
                {
                  filename: pdfFilename,
                  content: pdfBase64,
                  mimeType: 'application/pdf'
                }
              ]
            : undefined
      };

      console.log('📧 Sending email with data:', {
        to: emailData.to,
        cc: emailData.cc,
        subject: emailData.subject,
        hasAttachment: !!pdfBase64,
        attachmentFilename: pdfFilename,
        bodyLength: htmlContent.length
      });

      // Show progress for email sending
      toast({
        title: 'Sending Email',
        description: 'Your quote is being sent...',
        variant: 'default'
      });

      const result = await sendEmail(emailData);

      if (result.success) {
        toast({
          title: 'Email Sent Successfully!',
          description: `Quote has been sent to ${emailForm.to}`,
          variant: 'default'
        });
        setIsOpen(false);

        // Reset form
        setEmailForm({
          to: quote?.customer?.email || '',
          cc: '',
          subject: currentTemplate.subject,
          message: currentTemplate.message
        });
        setCustomMessage('');
        setSelectedTemplate('standard');
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: 'Failed to Send Email',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while sending the email.',
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
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Quote
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Quote via Email
          </DialogTitle>
          <DialogDescription>
            Send Quote QT-{formatNumber(quote?.quote_number || 0)} to{' '}
            {quote?.customer?.first_name || 'the customer'} with PDF attachment
          </DialogDescription>
        </DialogHeader>

        {hasError && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-red-600">
              Gmail service error: {serviceError}. Please check your authentication.
            </p>
          </div>
        )}

        {!isReady && !hasError && (
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <p className="text-sm text-yellow-600">Gmail service is initializing... Please wait.</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Email Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select email template" />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Message Field for Custom Template */}
          {selectedTemplate === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message *</Label>
              <Textarea
                id="customMessage"
                placeholder="Enter your custom message here..."
                value={customMessage}
                onChange={(e) => handleCustomMessageChange(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-sm text-muted-foreground">
                This message will replace the placeholder in the custom template.
              </p>
            </div>
          )}

          <Separator />

          {/* PDF Display Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">PDF Display Options</Label>
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showServiceDetails"
                  checked={displayOptions.showServiceDetails}
                  onCheckedChange={() => toggleOption('showServiceDetails')}
                />
                <Label htmlFor="showServiceDetails" className="text-sm font-normal cursor-pointer">
                  Show service details
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showMeasurementNote"
                  checked={displayOptions.showMeasurementNote}
                  onCheckedChange={() => toggleOption('showMeasurementNote')}
                />
                <Label htmlFor="showMeasurementNote" className="text-sm font-normal cursor-pointer">
                  Show measurement note
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showCustomerNotes"
                  checked={displayOptions.showCustomerNotes}
                  onCheckedChange={() => toggleOption('showCustomerNotes')}
                />
                <Label htmlFor="showCustomerNotes" className="text-sm font-normal cursor-pointer">
                  Show customer notes
                </Label>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                These options control what information is included in the PDF attachment.
              </p>
            </div>
          </div>

          <Separator />

          {/* Email Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="to">To *</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="customer@email.com"
                  value={emailForm.to}
                  onChange={(e) => handleFormChange('to', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  type="email"
                  placeholder="manager@company.com"
                  value={emailForm.cc}
                  onChange={(e) => handleFormChange('cc', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Email subject"
                value={emailForm.subject}
                onChange={(e) => handleFormChange('subject', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Email message"
                value={emailForm.message}
                onChange={(e) => handleFormChange('message', e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>

          {/* Quote Summary Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Quote Details (will be included in email):</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Quote Number: QT-{formatNumber(quote?.quote_number || 0)}</div>
              <div>Service: {quote?.service?.name || 'N/A'}</div>
              {quote?.quote_date && (
                <div>Quote Date: {new Date(quote.quote_date).toLocaleDateString()}</div>
              )}
              {quote?.expiration_date && (
                <div>Expires: {new Date(quote.expiration_date).toLocaleDateString()}</div>
              )}
              {quote?.total && (
                <div className="font-medium col-span-2">Total: {formatMoneyValue(quote.total)}</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={!isReady || isSending || hasError}
              className="gap-2">
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Quote
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
