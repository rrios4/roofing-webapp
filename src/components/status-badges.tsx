import React from 'react';
import { Badge } from './ui/badge';

type Props = {
  title: string;
  colorScheme?: string;
  variant: 'blue' | 'default' | 'outline' | 'green' | 'gray' | 'secondary';
};

export default function DefaultStatusBadge({ title, colorScheme, variant }: Props) {
  return (
    <Badge variant={variant}>
      <div className="flex gap-2">
        {variant === 'blue' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-blue-500`}></div>
        ) : variant === 'green' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-[#37A169]`}></div>
        ) : variant === 'gray' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-gray-500`}></div>
        ) : (
          ''
        )}

        <p className="text-[12px] font-[500]">{title}</p>
      </div>
    </Badge>
  );
}
