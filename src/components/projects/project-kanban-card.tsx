import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CalendarIcon, MapPinIcon, ExpandIcon, PackageIcon } from 'lucide-react';
import { abbreviateName, formatMoneyValue, getAvatarColor } from '../../lib/utils';
import { ProjectWithRelations } from '../../types/db_types';

type Props = {
  project: ProjectWithRelations;
  onExpand: (project: ProjectWithRelations) => void;
  onDragStart?: (project: ProjectWithRelations) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
};

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return 'Not scheduled';
  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  };
  const fmtShort = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  };
  if (start && !end) return `From ${fmt(start)}`;
  if (!start && end) return `Through ${fmt(end)}`;
  return `${fmtShort(start!)} – ${fmt(end!)}`;
}

export default function ProjectKanbanCard({
  project,
  onExpand,
  onDragStart,
  onDragEnd,
  isDragging
}: Props) {
  const navigate = useNavigate();
  const customer = project.customer_details;
  const hasCustomer = !!customer;
  const displayName = hasCustomer
    ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
    : null;
  const typeName = project.project_type?.name;
  const address = project.street_address || project.address || '';
  const cityLine = [project.city, project.state, project.zipcode].filter(Boolean).join(', ');
  const fullAddress = cityLine ? `${address}, ${cityLine}` : address;

  return (
    <div
      className={`
        group bg-card border border-border rounded-xl p-4 flex flex-col gap-2.5 cursor-grab
        transition-all duration-150
        hover:border-border/80 hover:shadow-md hover:-translate-y-px
        active:cursor-grabbing
        ${isDragging ? 'opacity-40' : ''}
      `}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', project.id);
        onDragStart?.(project);
      }}
      onDragEnd={() => onDragEnd?.()}>
      {/* Header row */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          disabled={!hasCustomer}
          onClick={(e) => {
            if (!hasCustomer) return;
            e.stopPropagation();
            navigate(`/customers/${customer!.id}`);
          }}
          className={`flex items-center gap-2 min-w-0 flex-1 text-left ${hasCustomer ? 'hover:opacity-75 transition-opacity' : ''}`}>
          {hasCustomer ? (
            (() => {
              const { bg, text } = getAvatarColor(displayName!);
              return (
                <Avatar className="h-7 w-7 flex-shrink-0 text-[11px]">
                  <AvatarFallback className={`text-[10px] font-semibold ${bg} ${text}`}>
                    {abbreviateName(displayName!)}
                  </AvatarFallback>
                </Avatar>
              );
            })()
          ) : (
            <div className="h-7 w-7 flex-shrink-0 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground bg-muted">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          )}
          <span
            className={`flex-1 min-w-0 text-sm font-semibold truncate ${!hasCustomer ? 'text-muted-foreground italic' : ''}`}
            title={displayName ?? 'No customer assigned'}>
            {displayName ?? 'No customer assigned'}
          </span>
        </button>
        {typeName && (
          <Badge
            variant={typeName === 'Commercial' ? 'secondary' : 'default'}
            className="text-[10px] px-1.5 py-0 flex-shrink-0">
            {typeName}
          </Badge>
        )}
        <button
          className="flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-opacity"
          title="Expand"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(project);
          }}>
          <ExpandIcon className="h-3 w-3" />
        </button>
      </div>

      {/* Address row */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0 px-2">
        <MapPinIcon className="h-3 w-3 flex-shrink-0 text-muted-foreground/70" />
        <span className="truncate">
          {fullAddress || <span className="italic">No address</span>}
        </span>
      </div>

      {/* Date row */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0 px-2">
        <CalendarIcon className="h-3 w-3 flex-shrink-0 text-muted-foreground/70" />
        <span className="truncate">{formatDateRange(project.start_date, project.end_date)}</span>
      </div>

      {/* Service row */}
      <div className="flex items-center gap-2 text-xs min-w-0 px-2">
        <PackageIcon className="h-3 w-3 flex-shrink-0 text-muted-foreground/70" />
        <span
          className={`truncate ${project.service_details?.name ? '' : 'text-muted-foreground italic'}`}>
          {project.service_details?.name ?? 'No service set'}
        </span>
      </div>

      {/* Drive row — only when linked */}
      {project.drive_folder_url && (
        <a
          href={project.drive_folder_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 text-xs text-primary min-w-0 px-2 hover:underline">
          <svg viewBox="0 0 87.3 78" className="h-3 w-3 flex-shrink-0">
            <path
              d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
              fill="#0066da"
            />
            <path
              d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
              fill="#00ac47"
            />
            <path
              d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
              fill="#ea4335"
            />
            <path
              d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
              fill="#00832d"
            />
            <path
              d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
              fill="#2684fc"
            />
            <path
              d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
              fill="#ffba00"
            />
          </svg>
          <span className="truncate">{project.drive_folder_name ?? 'Drive folder'}</span>
        </a>
      )}

      {/* Footer: value */}
      <div className="pt-2 mt-0.5 border-t border-border flex items-center justify-end">
        {project.estimated_value != null ? (
          <span className="text-xs font-semibold tabular-nums">
            ${formatMoneyValue(project.estimated_value)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground italic">No value set</span>
        )}
      </div>
    </div>
  );
}
