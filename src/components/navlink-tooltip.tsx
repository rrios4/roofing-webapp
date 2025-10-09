import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Link } from 'react-router-dom';

type Props = {
  icon: any;
  title: string;
  path: string;
};

export default function NavLinkTooltip({ icon, title, path }: Props) {
  return (
    <>
      <Link to={path} className="">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="p-2 rounded-lg border border-white dark:border-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-800 transition duration-150 ease-in-out hover:scale-110">
                {icon}
              </div>
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
    </>
  );
}
