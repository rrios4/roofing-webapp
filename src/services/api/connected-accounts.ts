import supabase from '../../lib/supabase-client';
import { TABLES } from '../../lib/db-tables';
import { ConnectedAccount, ConnectedAccountCreate } from '../../types/global_types';

/**
 * Connected Accounts API Service
 * Manages user's connected third-party accounts (Google, Microsoft, etc.)
 */

export class ConnectedAccountsAPI {
  /**
   * Get all connected accounts for the current user
   */
  static async fetchConnectedAccounts(): Promise<ConnectedAccount[]> {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch connected accounts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      throw error;
    }
  }

  /**
   * Add a new connected account
   */
  static async addConnectedAccount(accountData: ConnectedAccountCreate): Promise<ConnectedAccount> {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Check if this account is already connected
      const { data: existing } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .select('id')
        .eq('user_id', user.id)
        .eq('provider', accountData.provider)
        .eq('account_id', accountData.account_id)
        .single();

      if (existing) {
        throw new Error('This account is already connected');
      }

      // If this is set as default, unset other defaults
      if (accountData.is_default) {
        await supabase
          .from(TABLES.CONNECTED_ACCOUNTS)
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('provider', accountData.provider);
      }

      const newAccount = {
        ...accountData,
        user_id: user.id,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .insert(newAccount)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add connected account: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error adding connected account:', error);
      throw error;
    }
  }

  /**
   * Remove a connected account
   */
  static async removeConnectedAccount(accountId: string): Promise<void> {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Failed to remove connected account: ${error.message}`);
      }
    } catch (error) {
      console.error('Error removing connected account:', error);
      throw error;
    }
  }

  /**
   * Set default account for a provider
   */
  static async setDefaultAccount(accountId: string): Promise<void> {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Get the account to find its provider
      const { data: account, error: fetchError } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .select('provider')
        .eq('id', accountId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !account) {
        throw new Error('Account not found');
      }

      // Unset all defaults for this provider
      await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('provider', account.provider);

      // Set this account as default
      const { error } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .update({
          is_default: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Failed to set default account: ${error.message}`);
      }
    } catch (error) {
      console.error('Error setting default account:', error);
      throw error;
    }
  }

  /**
   * Update connected account tokens
   */
  static async updateAccountTokens(
    accountId: string,
    tokens: {
      access_token: string;
      refresh_token?: string;
      token_expires_at?: string;
    }
  ): Promise<void> {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .update({
          ...tokens,
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(`Failed to update account tokens: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating account tokens:', error);
      throw error;
    }
  }

  /**
   * Get default account for a provider
   */
  static async getDefaultAccount(
    provider: 'google' | 'microsoft' | 'other'
  ): Promise<ConnectedAccount | null> {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (error) {
        // No default account found is not an error
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to get default account: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting default account:', error);
      throw error;
    }
  }

  /**
   * Get account by ID
   */
  static async getAccountById(accountId: string): Promise<ConnectedAccount | null> {
    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from(TABLES.CONNECTED_ACCOUNTS)
        .select('*')
        .eq('id', accountId)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to get account: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting account by ID:', error);
      throw error;
    }
  }
}

export default ConnectedAccountsAPI;
