import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import googleService from '../services/google-service';

/**
 * Debug component to monitor Google Service token status
 * Only use in development environment
 */
export const GoogleServiceDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState(googleService.getTokenDebugInfo());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDebugInfo(googleService.getTokenDebugInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      await googleService.forceRefreshToken();
      setDebugInfo(googleService.getTokenDebugInfo());
    } catch (error) {
      console.error('Failed to refresh token:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatExpiresIn = (expiresIn: number | null) => {
    if (expiresIn === null) return 'Unknown';
    if (expiresIn <= 0) return 'Expired';

    const minutes = Math.floor(expiresIn / (1000 * 60));
    const seconds = Math.floor((expiresIn % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-gray-900 text-white border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          Google Service Debug
          <Badge variant={debugInfo.hasToken && !debugInfo.isExpired ? 'default' : 'destructive'}>
            {debugInfo.hasToken && !debugInfo.isExpired ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <span>Has Token:</span>
          <Badge variant={debugInfo.hasToken ? 'default' : 'secondary'}>
            {debugInfo.hasToken ? 'Yes' : 'No'}
          </Badge>

          <span>Is Expired:</span>
          <Badge variant={debugInfo.isExpired ? 'destructive' : 'default'}>
            {debugInfo.isExpired ? 'Yes' : 'No'}
          </Badge>

          <span>Expires In:</span>
          <span
            className={
              debugInfo.expiresIn && debugInfo.expiresIn < 5 * 60 * 1000 ? 'text-orange-400' : ''
            }>
            {formatExpiresIn(debugInfo.expiresIn)}
          </span>

          <span>Token Preview:</span>
          <span className="font-mono text-xs truncate">{debugInfo.tokenPreview || 'None'}</span>
        </div>

        <Button
          size="sm"
          onClick={handleForceRefresh}
          disabled={isRefreshing}
          className="w-full mt-2">
          {isRefreshing ? 'Refreshing...' : 'Force Refresh Token'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoogleServiceDebug;
