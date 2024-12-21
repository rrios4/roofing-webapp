import React from 'react';
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';

type Props = {
  variant: 'default' | 'primary' | 'secondary';
};

export default function ButtonLoading({ variant }: Props) {
  return (
    <Button disabled variant={variant}>
      <Loader2Icon className="mr-2 h-4 w-4 animate-spi" />
      Please wait
    </Button>
  );
}
