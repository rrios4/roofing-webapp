import { useQuery } from '@tanstack/react-query';
import { googleService, GmailMessageMetadata } from '../../services/google-service';

export type { GmailMessageMetadata };

export const useCustomerEmails = (customerEmail?: string) => {
  const query = customerEmail
    ? `to:${customerEmail} OR from:${customerEmail}`
    : undefined;

  const {
    data: emails,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<GmailMessageMetadata[]>({
    queryKey: ['customerEmails', customerEmail],
    queryFn: () => googleService.getMessagesMetadata(query),
    enabled: !!customerEmail,
    staleTime: 2 * 60 * 1000 // treat as fresh for 2 minutes
  });

  return { emails: emails ?? [], isLoading, isError, error, refetch };
};
