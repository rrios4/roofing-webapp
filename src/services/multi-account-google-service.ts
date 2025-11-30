import supabase from '../lib/supabase-client';
import { ConnectedAccount, EmailSendOptions, EmailAttachment } from '../types/global_types';
import ConnectedAccountsAPI from './api/connected-accounts';
import { Buffer } from 'buffer';

/**
 * Enhanced Google Services Integration
 * Supports multiple connected accounts for sending emails
 */

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

export interface GoogleAuthResult {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string;
}

class MultiAccountGoogleService {
  /**
   * Initiate Google OAuth flow for connecting a new account
   */
  async initiateGoogleAuth(scopes: string[] = ['email', 'profile', 'gmail.send']): Promise<string> {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error(
        'Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.'
      );
    }

    const scopesString = scopes
      .map((scope) => `https://www.googleapis.com/auth/${scope}`)
      .join(' ');

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/google/callback`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopesString);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', `connect_account_${Date.now()}`);

    return authUrl.toString();
  }

  /**
   * Handle Google OAuth callback and exchange code for tokens
   */
  async handleGoogleCallback(authorizationCode: string, state: string): Promise<ConnectedAccount> {
    try {
      const clientId =
        import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;
      const clientSecret =
        import.meta.env.VITE_GOOGLE_CLIENT_SECRET || process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error(
          'Google OAuth credentials are not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_CLIENT_SECRET in your environment variables.'
        );
      }

      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          grant_type: 'authorization_code',
          redirect_uri: `${window.location.origin}/auth/google/callback`
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange authorization code for tokens');
      }

      const tokenData: GoogleAuthResult = await tokenResponse.json();

      // Get user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo = await userInfoResponse.json();

      // Calculate token expiry
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

      // Create connected account data
      const accountData = {
        provider: 'google' as const,
        account_email: userInfo.email,
        account_name: userInfo.name,
        account_id: userInfo.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: expiresAt.toISOString(),
        scopes: tokenData.scope.split(' '),
        is_default: false // User can set this later
      };

      // Save to database
      return await ConnectedAccountsAPI.addConnectedAccount(accountData);
    } catch (error) {
      console.error('Error handling Google callback:', error);
      throw error;
    }
  }

  /**
   * Refresh access token for a connected account
   */
  async refreshAccountToken(account: ConnectedAccount): Promise<ConnectedAccount> {
    try {
      if (!account.refresh_token) {
        throw new Error('No refresh token available for this account');
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
          client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '',
          refresh_token: account.refresh_token,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const tokenData = await response.json();

      // Calculate new expiry
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

      // Update tokens in database
      await ConnectedAccountsAPI.updateAccountTokens(account.id, {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || account.refresh_token,
        token_expires_at: expiresAt.toISOString()
      });

      // Return updated account
      const updatedAccount = await ConnectedAccountsAPI.getAccountById(account.id);
      if (!updatedAccount) {
        throw new Error('Failed to fetch updated account');
      }

      return updatedAccount;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  /**
   * Check if account token needs refresh
   */
  private isTokenExpired(account: ConnectedAccount): boolean {
    if (!account.token_expires_at) {
      return true;
    }

    const expiryTime = new Date(account.token_expires_at).getTime();
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    return currentTime >= expiryTime - fiveMinutes;
  }

  /**
   * Get valid access token for account (refresh if needed)
   */
  private async getValidAccessToken(account: ConnectedAccount): Promise<string> {
    if (this.isTokenExpired(account)) {
      console.log('Token expired, refreshing...');
      const refreshedAccount = await this.refreshAccountToken(account);
      return refreshedAccount.access_token;
    }

    return account.access_token;
  }

  /**
   * Make authenticated request to Google API using specific account
   */
  private async makeGoogleApiRequest(
    account: ConnectedAccount,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const accessToken = await this.getValidAccessToken(account);

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

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
  }

  // ===== EMAIL SERVICES =====

  /**
   * Send email using specified connected account
   */
  async sendEmail(
    emailOptions: EmailSendOptions,
    accountId?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      let account: ConnectedAccount | null = null;

      if (accountId) {
        // Use specific account
        account = await ConnectedAccountsAPI.getAccountById(accountId);
      } else if (emailOptions.from_account_id) {
        // Use account from email options
        account = await ConnectedAccountsAPI.getAccountById(emailOptions.from_account_id);
      } else {
        // Use default Google account
        account = await ConnectedAccountsAPI.getDefaultAccount('google');
      }

      if (!account) {
        throw new Error('No connected Google account found');
      }

      const emailContent = this.createEmailContent({
        to: emailOptions.to,
        cc: emailOptions.cc,
        bcc: emailOptions.bcc,
        subject: emailOptions.subject,
        htmlBody: emailOptions.htmlBody,
        textBody: emailOptions.textBody,
        attachments: emailOptions.attachments
      });

      const response = await this.makeGoogleApiRequest(
        account,
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
   * Get Gmail messages from specific account
   */
  async getMessages(
    accountId: string,
    query?: string,
    maxResults: number = 10
  ): Promise<GmailMessage[]> {
    try {
      const account = await ConnectedAccountsAPI.getAccountById(accountId);
      if (!account) {
        throw new Error('Connected account not found');
      }

      const params = new URLSearchParams({
        maxResults: maxResults.toString(),
        ...(query && { q: query })
      });

      const response = await this.makeGoogleApiRequest(
        account,
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
            account,
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
   * Get user profile from specific account
   */
  async getUserProfile(accountId: string): Promise<{
    emailAddress?: string;
    messagesTotal?: number;
    threadsTotal?: number;
  }> {
    try {
      const account = await ConnectedAccountsAPI.getAccountById(accountId);
      if (!account) {
        throw new Error('Connected account not found');
      }

      const response = await this.makeGoogleApiRequest(
        account,
        'https://gmail.googleapis.com/gmail/v1/users/me/profile'
      );

      return await response.json();
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return {};
    }
  }

  /**
   * Test account connection
   */
  async testAccountConnection(accountId: string): Promise<boolean> {
    try {
      await this.getUserProfile(accountId);
      return true;
    } catch (error) {
      console.error('Account connection test failed:', error);
      return false;
    }
  }

  // ===== HELPER METHODS =====

  /**
   * Create raw email content for Gmail API
   */
  private createEmailContent(message: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    htmlBody?: string;
    textBody?: string;
    attachments?: EmailAttachment[];
  }): string {
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
}

// Export singleton instance
export const multiAccountGoogleService = new MultiAccountGoogleService();
export default multiAccountGoogleService;
