import { useState, useEffect, useCallback } from 'react';
import { googleService, EmailMessage } from '../services/google-service';
import { useAuth } from './useAuth';

export interface UseGoogleServiceReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // Gmail functions
  sendEmail: (
    message: EmailMessage
  ) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  getMessages: (query?: string, maxResults?: number) => Promise<any[]>;
  getLabels: () => Promise<Array<{ id: string; name: string; type: string }>>;
  getUserProfile: () => Promise<{
    emailAddress?: string;
    messagesTotal?: number;
    threadsTotal?: number;
  }>;

  // Drive functions
  getDriveFiles: (
    query?: string,
    maxResults?: number
  ) => Promise<Array<{ id: string; name: string; mimeType: string }>>;
  uploadFileToDrive: (
    fileName: string,
    fileContent: string,
    mimeType: string,
    folderId?: string
  ) => Promise<{ success: boolean; fileId?: string; error?: string }>;

  // Calendar functions
  getCalendars: () => Promise<Array<{ id: string; summary: string; primary?: boolean }>>;
  createCalendarEvent: (
    calendarId: string,
    event: any
  ) => Promise<{ success: boolean; eventId?: string; error?: string }>;

  // Utility functions
  checkGmailPermissions: () => Promise<boolean>;
  reinitialize: () => Promise<void>;
}

/**
 * React hook for using Google services
 * Automatically initializes when user is authenticated
 */
export const useGoogleService = (): UseGoogleServiceReturn => {
  const { user, session } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google service when user session is available
  useEffect(() => {
    const initializeService = async () => {
      if (!user || !session) {
        setIsInitialized(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const success = await googleService.initialize();
        setIsInitialized(success);

        if (!success) {
          setError(
            'Failed to initialize Google service. Please ensure you have the required permissions.'
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, [user, session]);

  // Wrapper function to handle errors consistently
  const handleServiceCall = useCallback(
    async function <T>(
      serviceCall: () => Promise<T>,
      errorMessage = 'Service call failed'
    ): Promise<T | null> {
      if (!isInitialized) {
        setError('Google service not initialized');
        return null;
      }

      setError(null);
      try {
        return await serviceCall();
      } catch (err) {
        const message = err instanceof Error ? err.message : errorMessage;
        setError(message);
        console.error(errorMessage, err);
        return null;
      }
    },
    [isInitialized]
  );

  // Gmail functions
  const sendEmail = useCallback(
    async (message: EmailMessage) => {
      const result = await handleServiceCall(
        () => googleService.sendEmail(message),
        'Failed to send email'
      );
      return result || { success: false, error: 'Service not available' };
    },
    [handleServiceCall]
  );

  const getMessages = useCallback(
    async (query?: string, maxResults?: number) => {
      const result = await handleServiceCall(
        () => googleService.getMessages(query, maxResults),
        'Failed to get messages'
      );
      return result || [];
    },
    [handleServiceCall]
  );

  const getLabels = useCallback(async () => {
    const result = await handleServiceCall(() => googleService.getLabels(), 'Failed to get labels');
    return result || [];
  }, [handleServiceCall]);

  const getUserProfile = useCallback(async () => {
    const result = await handleServiceCall(
      () => googleService.getUserProfile(),
      'Failed to get user profile'
    );
    return result || {};
  }, [handleServiceCall]);

  // Drive functions
  const getDriveFiles = useCallback(
    async (query?: string, maxResults?: number) => {
      const result = await handleServiceCall(
        () => googleService.getDriveFiles(query, maxResults),
        'Failed to get Drive files'
      );
      return result || [];
    },
    [handleServiceCall]
  );

  const uploadFileToDrive = useCallback(
    async (fileName: string, fileContent: string, mimeType: string, folderId?: string) => {
      const result = await handleServiceCall(
        () => googleService.uploadFileToDrive(fileName, fileContent, mimeType, folderId),
        'Failed to upload file to Drive'
      );
      return result || { success: false, error: 'Service not available' };
    },
    [handleServiceCall]
  );

  // Calendar functions
  const getCalendars = useCallback(async () => {
    const result = await handleServiceCall(
      () => googleService.getCalendars(),
      'Failed to get calendars'
    );
    return result || [];
  }, [handleServiceCall]);

  const createCalendarEvent = useCallback(
    async (calendarId: string, event: any) => {
      const result = await handleServiceCall(
        () => googleService.createCalendarEvent(calendarId, event),
        'Failed to create calendar event'
      );
      return result || { success: false, error: 'Service not available' };
    },
    [handleServiceCall]
  );

  // Utility functions
  const checkGmailPermissions = useCallback(async () => {
    const result = await handleServiceCall(
      () => googleService.checkGmailPermissions(),
      'Failed to check Gmail permissions'
    );
    return result || false;
  }, [handleServiceCall]);

  const reinitialize = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await googleService.initialize();
      setIsInitialized(success);

      if (!success) {
        setError('Failed to reinitialize Google service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reinitialization failed');
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    sendEmail,
    getMessages,
    getLabels,
    getUserProfile,
    getDriveFiles,
    uploadFileToDrive,
    getCalendars,
    createCalendarEvent,
    checkGmailPermissions,
    reinitialize
  };
};
