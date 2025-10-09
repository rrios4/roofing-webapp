import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
}

export function Breadcrumb({
  items,
  className,
  separator = <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />,
  showHome = true,
  homeHref = '/dashboard'
}: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: '' /* 'Home' */, href: homeHref, icon: <HomeIcon className="h-4 w-4" /> }, ...items]
    : items;

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mr-2">{separator}</span>}
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1',
                    isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Convenience component for common breadcrumb patterns
interface PageBreadcrumbProps {
  currentPage: string;
  parentPages?: BreadcrumbItem[];
  className?: string;
  homeHref?: string;
}

export function PageBreadcrumb({
  currentPage,
  parentPages = [],
  className,
  homeHref = '/dashboard'
}: PageBreadcrumbProps) {
  const items = [...parentPages, { label: currentPage }];

  return <Breadcrumb items={items} className={className} homeHref={homeHref} />;
}

export default Breadcrumb;
