import supabase from '../lib/supabase-client';
import { Buffer } from 'buffer';

/**
 * Google Services Integration
 * Provides methods to interact with Google services using authenticated user tokens
 */

export interface EmailMessage {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded content
  mimeType: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body: {
      data?: string;
      size: number;
    };
    parts?: Array<{
      mimeType: string;
      body: {
        data?: string;
        size: number;
      };
    }>;
  };
}

class GoogleService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null; // Track token expiry

  /**
   * Initialize the service with user's Google access token
   */
  async initialize(): Promise<boolean> {
    try {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('No active session found:', error);
        this.clearTokens();
        return false;
      }

      // Get Google access token from Supabase session
      const googleAccessToken = session.provider_token;

      if (!googleAccessToken) {
        console.error('No Google access token found in session');
        this.clearTokens();
        return false;
      }

      this.accessToken = googleAccessToken;
      // Set expiry to 50 minutes from now (tokens usually expire in 1 hour)
      this.tokenExpiry = Date.now() + 50 * 60 * 1000;
      console.log('Google service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Google service:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Clear cached tokens
   */
  clearTokens(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    console.log('Google service tokens cleared');
  }

  /**
   * Check if current token is expired or about to expire
   */
  private isTokenExpired(): boolean {
    if (!this.tokenExpiry || !this.accessToken) {
      return true;
    }
    // Consider expired if less than 5 minutes remaining
    return Date.now() >= this.tokenExpiry - 5 * 60 * 1000;
  }

  /**
   * Refresh the access token if needed
   */
  private async refreshTokenIfNeeded(): Promise<boolean> {
    // Check if we need to refresh the token
    if (!this.isTokenExpired()) {
      return true; // Token is still valid
    }

    console.log('Token expired or missing, refreshing...');

    try {
      // Always get the latest session to ensure we have fresh tokens
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('No active session found during token refresh:', error);
        this.clearTokens();
        return false;
      }

      // Get Google access token from current session
      const googleAccessToken = session.provider_token;

      if (!googleAccessToken) {
        console.error('No Google access token found in current session');
        this.clearTokens();
        return false;
      }

      // Update our cached token with the latest one
      this.accessToken = googleAccessToken;
      this.tokenExpiry = Date.now() + 50 * 60 * 1000; // 50 minutes from now
      console.log('Google token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Failed to refresh Google token:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Generic method to make authenticated requests to Google APIs
   */
  private async makeGoogleApiRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    // Always refresh token before making request
    const tokenRefreshed = await this.refreshTokenIfNeeded();

    if (!tokenRefreshed || !this.accessToken) {
      throw new Error('No access token available - please log in again');
    }

    const makeRequest = async (isRetry: boolean = false): Promise<Response> => {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      // Handle token expiration errors
      if (!response.ok && response.status === 401 && !isRetry) {
        console.log('Received 401 error, refreshing token and retrying...');

        // Force refresh the token
        this.accessToken = null;
        const refreshed = await this.refreshTokenIfNeeded();

        if (refreshed && this.accessToken) {
          console.log('Token refreshed, retrying request...');
          return makeRequest(true); // Retry with fresh token
        } else {
          throw new Error('Token refresh failed - please log in again');
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google API request failed:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          endpoint
        });
        throw new Error(`Google API request failed: ${response.status} - ${errorText}`);
      }

      return response;
    };

    return makeRequest();
  }

  // ===== GMAIL SERVICES =====

  /**
   * Send an email via Gmail API
   */
  async sendEmail(
    message: EmailMessage
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const emailContent = this.createEmailContent(message);

      const response = await this.makeGoogleApiRequest(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          body: JSON.stringify({
            raw: Buffer.from(emailContent, 'utf-8')
              .toString('base64')
              .replace(/\+/g, '-')
              .replace(/\//g, '_')
              .replace(/=+$/, '')
          })
        }
      );

      const result = await response.json();
      return { success: true, messageId: result.id };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get user's Gmail messages
   */
  async getMessages(query?: string, maxResults: number = 10): Promise<GmailMessage[]> {
    try {
      const params = new URLSearchParams({
        maxResults: maxResults.toString(),
        ...(query && { q: query })
      });

      const response = await this.makeGoogleApiRequest(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`
      );

      const data = await response.json();

      if (!data.messages) {
        return [];
      }

      // Get full message details for each message
      const messages = await Promise.all(
        data.messages.map(async (msg: { id: string }) => {
          const messageResponse = await this.makeGoogleApiRequest(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`
          );
          return await messageResponse.json();
        })
      );

      return messages;
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }

  /**
   * Get user's Gmail labels
   */
  async getLabels(): Promise<Array<{ id: string; name: string; type: string }>> {
    try {
      const response = await this.makeGoogleApiRequest(
        'https://gmail.googleapis.com/gmail/v1/users/me/labels'
      );

      const data = await response.json();
      return data.labels || [];
    } catch (error) {
      console.error('Failed to get labels:', error);
      return [];
    }
  }

  /**
   * Get user's Gmail profile
   */
  async getUserProfile(): Promise<{
    emailAddress?: string;
    messagesTotal?: number;
    threadsTotal?: number;
  }> {
    try {
      const response = await this.makeGoogleApiRequest(
        'https://gmail.googleapis.com/gmail/v1/users/me/profile'
      );

      return await response.json();
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return {};
    }
  }

  // ===== GOOGLE DRIVE SERVICES =====

  /**
   * List files from Google Drive
   */
  async getDriveFiles(
    query?: string,
    maxResults: number = 10
  ): Promise<Array<{ id: string; name: string; mimeType: string }>> {
    try {
      const params = new URLSearchParams({
        pageSize: maxResults.toString(),
        fields: 'files(id,name,mimeType,createdTime,modifiedTime)',
        ...(query && { q: query })
      });

      const response = await this.makeGoogleApiRequest(
        `https://www.googleapis.com/drive/v3/files?${params}`
      );

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Failed to get Drive files:', error);
      return [];
    }
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFileToDrive(
    fileName: string,
    fileContent: string,
    mimeType: string,
    folderId?: string
  ): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
      const metadata = {
        name: fileName,
        ...(folderId && { parents: [folderId] })
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: mimeType }));

      const response = await this.makeGoogleApiRequest(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          body: form,
          headers: {
            Authorization: `Bearer ${this.accessToken}`
            // Don't set Content-Type header, let the browser set it with boundary
          }
        }
      );

      const result = await response.json();
      return { success: true, fileId: result.id };
    } catch (error) {
      console.error('Failed to upload file to Drive:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // ===== GOOGLE CALENDAR SERVICES =====

  /**
   * Get user's calendars
   */
  async getCalendars(): Promise<Array<{ id: string; summary: string; primary?: boolean }>> {
    try {
      const response = await this.makeGoogleApiRequest(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList'
      );

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Failed to get calendars:', error);
      return [];
    }
  }

  /**
   * Create a calendar event
   */
  async createCalendarEvent(
    calendarId: string,
    event: {
      summary: string;
      description?: string;
      start: { dateTime: string; timeZone?: string };
      end: { dateTime: string; timeZone?: string };
      attendees?: Array<{ email: string }>;
    }
  ): Promise<{ success: boolean; eventId?: string; error?: string }> {
    try {
      const response = await this.makeGoogleApiRequest(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          method: 'POST',
          body: JSON.stringify(event)
        }
      );

      const result = await response.json();
      return { success: true, eventId: result.id };
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // ===== HELPER METHODS =====

  /**
   * Create raw email content for Gmail API
   */
  private createEmailContent(message: EmailMessage): string {
    const boundary = '===============boundary===============';
    let emailContent = '';

    // Headers
    emailContent += `To: ${message.to.join(', ')}\r\n`;
    if (message.cc && message.cc.length > 0) {
      emailContent += `Cc: ${message.cc.join(', ')}\r\n`;
    }
    if (message.bcc && message.bcc.length > 0) {
      emailContent += `Bcc: ${message.bcc.join(', ')}\r\n`;
    }
    emailContent += `Subject: ${message.subject}\r\n`;
    emailContent += `MIME-Version: 1.0\r\n`;

    if (message.attachments && message.attachments.length > 0) {
      emailContent += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

      // Email body part
      emailContent += `--${boundary}\r\n`;
      emailContent += `Content-Type: text/html; charset="UTF-8"\r\n`;
      emailContent += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
      emailContent += `${message.htmlBody || message.textBody || ''}\r\n`;

      // Attachment parts
      message.attachments.forEach((attachment) => {
        emailContent += `--${boundary}\r\n`;
        emailContent += `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"\r\n`;
        emailContent += `Content-Disposition: attachment; filename="${attachment.filename}"\r\n`;
        emailContent += `Content-Transfer-Encoding: base64\r\n\r\n`;
        emailContent += `${attachment.content}\r\n`;
      });

      emailContent += `--${boundary}--\r\n`;
    } else {
      // Simple email without attachments
      if (message.htmlBody) {
        emailContent += `Content-Type: text/html; charset="UTF-8"\r\n\r\n`;
        emailContent += message.htmlBody;
      } else {
        emailContent += `Content-Type: text/plain; charset="UTF-8"\r\n\r\n`;
        emailContent += message.textBody || '';
      }
    }

    return emailContent;
  }

  /**
   * Check if user has required Gmail scopes
   */
  async checkGmailPermissions(): Promise<boolean> {
    try {
      await this.getUserProfile();
      return true;
    } catch (error) {
      console.error('Gmail permissions not available:', error);
      return false;
    }
  }

  /**
   * Get debug information about the current token state
   */
  getTokenDebugInfo(): {
    hasToken: boolean;
    isExpired: boolean;
    expiresIn: number | null;
    tokenPreview: string | null;
  } {
    return {
      hasToken: !!this.accessToken,
      isExpired: this.isTokenExpired(),
      expiresIn: this.tokenExpiry ? Math.max(0, this.tokenExpiry - Date.now()) : null,
      tokenPreview: this.accessToken ? `${this.accessToken.substring(0, 10)}...` : null
    };
  }

  /**
   * Force refresh token (useful for debugging)
   */
  async forceRefreshToken(): Promise<boolean> {
    console.log('Forcing token refresh...');
    this.clearTokens();
    return await this.refreshTokenIfNeeded();
  }
}

// Export singleton instance
export const googleService = new GoogleService();
export default googleService;
