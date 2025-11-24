import React from 'react';
import { Badge } from './ui/badge';

type Props = {
  title: string;
  colorScheme?: string;
  variant:
    | 'blue'
    | 'default'
    | 'outline'
    | 'green'
    | 'gray'
    | 'secondary'
    | 'yellow'
    | 'red'
    | 'orange';
};

export default function DefaultStatusBadge({ title, colorScheme, variant }: Props) {
  return (
    <Badge variant={variant}>
      <div className="flex gap-2">
        {variant === 'blue' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-blue-500 dark:bg-blue-400`}></div>
        ) : variant === 'green' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-green-500 dark:bg-green-400`}></div>
        ) : variant === 'gray' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-muted-foreground`}></div>
        ) : variant === 'yellow' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-yellow-500 dark:bg-yellow-400`}></div>
        ) : variant === 'red' ? (
          <div className={`w-1 h-1 p-1 rounded-full my-auto bg-red-500 dark:bg-red-400`}></div>
        ) : (
          ''
        )}

        <p className="text-[12px] font-[500]">{title}</p>
      </div>
    </Badge>
  );
}
