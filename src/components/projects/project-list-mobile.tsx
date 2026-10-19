import React from 'react';
import { ChevronRightIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { ProjectWithRelations } from '../../types/db_types';
import DefaultStatusBadge from '../status-badges';
import { Skeleton } from '../ui/skeleton';
import { formatMoneyValue, formatNumber } from '../../lib/utils';
import { getStatusVariant } from '../../lib/project-utils';

type Props = {
  projects: ProjectWithRelations[];
  isLoading: boolean;
  onExpand: (project: ProjectWithRelations) => void;
  emptyAction?: React.ReactNode;
};

// Phone replacement for the projects DataTable: one tappable row per project
export default function ProjectListMobile({ projects, isLoading, onExpand, emptyAction }: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 border border-dashed border-border rounded-xl text-sm text-muted-foreground">
        No projects found
        {emptyAction}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {projects.map((project) => {
        const address = project.street_address || project.address || '';
        const cityLine = [project.city, project.state, project.zipcode].filter(Boolean).join(', ');
        const owner = project.customer_details
          ? `${project.customer_details.first_name ?? ''} ${project.customer_details.last_name ?? ''}`.trim()
          : project.property_owner_name;
        return (
          <li key={project.id}>
            <button
              type="button"
              onClick={() => onExpand(project)}
              className="w-full text-left bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 active:bg-muted/60 transition-colors">
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    PRJ-{formatNumber(project.project_number ?? 0)}
                  </span>
                  <DefaultStatusBadge
                    title={project.project_status?.name || 'Unknown'}
                    variant={getStatusVariant(project.project_status?.name)}
                  />
                  <span className="ml-auto text-sm font-semibold tabular-nums">
                    {project.estimated_value != null
                      ? `$${formatMoneyValue(project.estimated_value)}`
                      : ''}
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-sm font-medium min-w-0">
                  <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate">
                    {address || <span className="italic text-muted-foreground">No address</span>}
                    {cityLine && (
                      <span className="text-muted-foreground font-normal">, {cityLine}</span>
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                  <UserIcon className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {owner || <span className="italic">Unassigned</span>}
                  </span>
                  {project.service_details?.name && (
                    <span className="truncate">· {project.service_details.name}</span>
                  )}
                </p>
              </div>
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
