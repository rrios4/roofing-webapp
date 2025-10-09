import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        blue: 'border-transparent bg-[#BEE3F8] text-[#2B4365] dark:text-[#90CDF4] dark:bg-[#2D3C4C]/80',
        green:
          'border-transparent bg-[#C6F6D5] text-[#21543D] dark:text-[#9AE6B4] dark:bg-[#2E4142]/80',
        gray: 'border-transparent bg-[#EDF2F8] text-[#21543D] dark:text-[#E2E8F0] dark:bg-[#3A404C]/80',
        yellow:
          'border-transparent bg-[#FEFCC0] text-[#744210] dark:text-[#FAF08A] dark:bg-[#3F413C]/80',
        red: 'border-transparent bg-[#FED7D7] text-[#822727] dark:text-[#FEB2B2] dark:bg-[#3F3842]/80',
        orange: ''
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
