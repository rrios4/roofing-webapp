import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ConnectedAccountsAPI from '../services/api/connected-accounts';
import { ConnectedAccount, ConnectedAccountCreate } from '../types/global_types';
import { toast } from 'sonner';

/**
 * Custom hooks for managing connected accounts
 */

export function useConnectedAccounts() {
  return useQuery({
    queryKey: ['connected-accounts'],
    queryFn: ConnectedAccountsAPI.fetchConnectedAccounts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}

export function useAddConnectedAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountData: ConnectedAccountCreate) =>
      ConnectedAccountsAPI.addConnectedAccount(accountData),
    onSuccess: (newAccount) => {
      queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
      toast.success(`${newAccount.account_email} connected successfully`);
    },
    onError: (error: Error) => {
      console.error('Error adding connected account:', error);
      toast.error(error.message || 'Failed to connect account');
    }
  });
}

export function useRemoveConnectedAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => ConnectedAccountsAPI.removeConnectedAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
      toast.success('Account disconnected successfully');
    },
    onError: (error: Error) => {
      console.error('Error removing connected account:', error);
      toast.error(error.message || 'Failed to disconnect account');
    }
  });
}

export function useSetDefaultAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => ConnectedAccountsAPI.setDefaultAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
      toast.success('Default account updated');
    },
    onError: (error: Error) => {
      console.error('Error setting default account:', error);
      toast.error(error.message || 'Failed to set default account');
    }
  });
}

export function useUpdateAccountTokens() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      tokens
    }: {
      accountId: string;
      tokens: {
        access_token: string;
        refresh_token?: string;
        token_expires_at?: string;
      };
    }) => ConnectedAccountsAPI.updateAccountTokens(accountId, tokens),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
    },
    onError: (error: Error) => {
      console.error('Error updating account tokens:', error);
    }
  });
}

export function useDefaultAccount(provider: 'google' | 'microsoft' | 'other') {
  return useQuery({
    queryKey: ['default-account', provider],
    queryFn: () => ConnectedAccountsAPI.getDefaultAccount(provider),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}

export function useConnectedAccount(accountId: string | null) {
  return useQuery({
    queryKey: ['connected-account', accountId],
    queryFn: () => (accountId ? ConnectedAccountsAPI.getAccountById(accountId) : null),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
}
