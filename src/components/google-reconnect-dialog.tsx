import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { MailIcon, ShieldCheckIcon } from 'lucide-react';

interface GoogleReconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleReconnectDialog: React.FC<GoogleReconnectDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { googleLogin } = useAuth();

  const handleReconnect = async () => {
    onOpenChange(false);
    await googleLogin();
    // googleLogin() triggers a full-page OAuth redirect — no further handling needed here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50">
              <MailIcon className="w-5 h-5 text-blue-600" />
            </div>
            <DialogTitle>Gmail Access Required</DialogTitle>
          </div>
          <DialogDescription asChild>
            <div className="text-sm text-muted-foreground space-y-3 pt-1">
              <p>
                Your Google session has expired or Gmail access was not granted. Re-connecting will
                redirect you to Google to authorize the following permissions:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>
                    <strong>Send email</strong> — compose and send emails on your behalf
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheckIcon className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>
                    <strong>Read email</strong> — view email threads with customers
                  </span>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground">
                You will be redirected to Google and returned to the app after authorizing.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleReconnect}>
            <MailIcon className="w-4 h-4 mr-2" />
            Re-connect with Google
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleReconnectDialog;
