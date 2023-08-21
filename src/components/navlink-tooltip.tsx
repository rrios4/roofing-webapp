import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Link } from 'react-router-dom';

type Props = {
  icon: any;
  title: string;
};

export default function NavLinkTooltip({icon, title}: Props) {
  return (
    <>
      <Link to={'/'}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="">{icon}</div>
            </TooltipTrigger>
            <TooltipContent>
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
    </>
  );
}
