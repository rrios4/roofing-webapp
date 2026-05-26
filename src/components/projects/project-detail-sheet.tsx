import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  ExpandIcon,
  PencilIcon,
  ClockIcon,
  FolderOpenIcon,
  ExternalLinkIcon,
} from 'lucide-react';
import { abbreviateName, formatDateWithAbbreviatedMonth, formatMoneyValue, formatNumber } from '../../lib/utils';
import { ProjectWithRelations } from '../../types/db_types';
import UpdateProjectSheet from '../forms/update-project-sheet';

type Props = {
  project: ProjectWithRelations | null;
  open: boolean;
  onClose: () => void;
  onOpenFull: (project: ProjectWithRelations) => void;
};

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return 'Not scheduled';
  const fmt = (iso: string) => formatDateWithAbbreviatedMonth(iso);
  if (start && !end) return `From ${fmt(start)}`;
  if (!start && end) return `Through ${fmt(end)}`;
  return `${fmt(start!)} – ${fmt(end!)}`;
}

export default function ProjectDetailSheet({ project, open, onClose, onOpenFull }: Props) {
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open && !editOpen) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, editOpen]);

  if (!project) return null;

  const customer = project.customer_details;
  const hasCustomer = !!customer;
  const displayName = hasCustomer
    ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim()
    : null;
  const typeName = project.project_type?.name;
  const statusName = project.project_status?.name;
  const address = project.street_address || project.address || '';
  const cityLine = [project.city, project.state, project.zipcode].filter(Boolean).join(', ');

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
        <SheetContent side="right" className="w-full sm:max-w-[520px] p-0 flex flex-col">
          {/* Header */}
          <SheetHeader className="pl-5 pr-12 py-4 border-b bg-card flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {hasCustomer ? (
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="text-xs font-semibold">
                    {abbreviateName(displayName!)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-10 w-10 flex-shrink-0 rounded-full border border-dashed border-border flex items-center justify-center bg-muted text-muted-foreground">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className={`text-base leading-tight ${!hasCustomer ? 'text-muted-foreground italic font-normal' : ''}`}>
                    {displayName ?? 'No customer assigned'}
                  </SheetTitle>
                  {typeName && (
                    <Badge variant={typeName === 'Commercial' ? 'secondary' : 'default'} className="text-[10px] px-1.5 py-0">
                      {typeName}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  #{formatNumber(project.project_number ?? 0)}
                  {project.service_details?.name ? ` · ${project.service_details.name}` : ''}
                </p>
              </div>
            </div>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
            {/* Stat grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Value',
                  value: project.estimated_value != null
                    ? <span className="text-lg font-bold">${formatMoneyValue(project.estimated_value)}</span>
                    : <span className="text-muted-foreground italic text-sm">—</span>
                },
                {
                  label: 'Status',
                  value: statusName
                    ? <span className="text-sm font-semibold">{statusName}</span>
                    : <span className="text-muted-foreground italic text-sm">—</span>
                },
                {
                  label: 'Type',
                  value: typeName
                    ? <span className="text-sm font-semibold">{typeName}</span>
                    : <span className="text-muted-foreground italic text-sm">—</span>
                },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground mb-1">{s.label}</p>
                  {s.value}
                </div>
              ))}
            </div>

            <Separator />

            {/* Details grid */}
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Details</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-card border border-border rounded-xl p-4">
                <KVRow
                  label="Address"
                  value={
                    <span className="text-sm font-medium leading-tight">
                      {address || <em className="text-muted-foreground not-italic">—</em>}
                      {cityLine && <span className="block text-xs text-muted-foreground">{cityLine}</span>}
                    </span>
                  }
                />
                <KVRow
                  label="Schedule"
                  value={<span className="text-sm">{formatDateRange(project.start_date, project.end_date)}</span>}
                />
                <KVRow
                  label="Phone"
                  value={customer?.phone_number
                    ? <a href={`tel:${customer.phone_number}`} className="text-sm hover:underline">{customer.phone_number}</a>
                    : <em className="text-muted-foreground not-italic text-sm">Not set</em>}
                />
                <KVRow
                  label="Email"
                  value={customer?.email
                    ? <a href={`mailto:${customer.email}`} className="text-sm hover:underline truncate block">{customer.email}</a>
                    : <em className="text-muted-foreground not-italic text-sm">Not set</em>}
                />
                <KVRow
                  label="Service"
                  value={project.service_details?.name
                    ? <span className="text-sm">{project.service_details.name}</span>
                    : <em className="text-muted-foreground not-italic text-sm">Not set</em>}
                />
                <KVRow
                  label="Source"
                  value={project.project_source?.name
                    ? <span className="text-sm">{project.project_source.name}</span>
                    : <em className="text-muted-foreground not-italic text-sm">—</em>}
                />
              </div>
            </div>

            {/* Google Drive */}
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Google Drive</p>
              <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${project.drive_folder_url ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <FolderOpenIcon className="h-4 w-4" />
                </div>
                {project.drive_folder_url ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.drive_folder_name ?? 'Project folder'}</p>
                      <p className="text-xs text-muted-foreground">Google Drive folder</p>
                    </div>
                    <a
                      href={project.drive_folder_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline flex-shrink-0">
                      Open <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                  </>
                ) : (
                  <p className="text-sm italic text-muted-foreground">No folder linked yet</p>
                )}
              </div>
            </div>

            {/* Created timeline item */}
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Activity</p>
              <div className="flex gap-3 items-start bg-card border border-border rounded-xl p-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Project created</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 px-5 py-3 border-t bg-card flex-shrink-0">
            <UpdateProjectSheet
              project={project}
              trigger={
                <Button variant="outline" size="sm">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit project
                </Button>
              }
            />
            <Button size="sm" onClick={() => onOpenFull(project)}>
              <ExpandIcon className="h-4 w-4 mr-2" />
              Open full view
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
