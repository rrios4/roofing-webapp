import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleDriveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
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
  );
}

import { PageHeader } from '../components/ui/page-header';
import CountStatCard from '../components/count-stat-card';
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleDotIcon,
  DollarSignIcon,
  ExpandIcon,
  FolderKanbanIcon,
  HardHatIcon,
  HashIcon,
  KanbanSquareIcon,
  ListIcon,
  MapPinIcon,
  PlusCircleIcon,
  RefreshCwIcon,
  SearchIcon,
  Settings2Icon,
  TagIcon,
  TrendingUpIcon,
  UserIcon,
  WrenchIcon
} from 'lucide-react';
import DataTable from '../components/data-table';
import DataTableFilterCard from '../components/data-table-filter-card';
import { createColumnHelper } from '@tanstack/react-table';
import { formatDateWithAbbreviatedMonth, formatMoneyValue, formatNumber } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DefaultStatusBadge from '../components/status-badges';
import CustomerPreviewPopover from '../components/customer-preview-popover';
import { ConnectedDeleteProjectAlertDialog } from '../components/connected-delete-dialogs';
import UpdateProjectSheet from '../components/forms/update-project-sheet';
import AddProjectForm from '../components/forms/add-project-form';
import {
  useFetchNextProjectNumber,
  useFetchProjects,
  useFetchProjectStatuses,
  useFetchProjectTypes,
  useUpdateProjectStatus
} from '../hooks/useAPI/use-projects';
import { ProjectWithRelations } from '../types/db_types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../lib/utils';
import ProjectKanbanView from '../components/projects/project-kanban-view';
import ProjectDetailSheet from '../components/projects/project-detail-sheet';
import ProjectFullDialog from '../components/projects/project-full-dialog';
import ProjectFilterPopover, {
  ProjectFilters
} from '../components/projects/project-filter-popover';

const columnHelper = createColumnHelper<any>();

function getStatusVariant(
  statusName: string | undefined
): 'gray' | 'blue' | 'orange' | 'yellow' | 'green' | 'red' | 'default' {
  switch (statusName) {
    case 'Lead':
      return 'gray';
    case 'Estimate Sent':
      return 'blue';
    case 'Approved / Booked':
      return 'orange';
    case 'In Progress':
      return 'yellow';
    case 'Inspection / Punch List':
      return 'orange';
    case 'Invoice Sent':
      return 'blue';
    case 'Completed':
      return 'green';
    default:
      return 'gray';
  }
}

export function makeProjectTableColumns(onExpand: (p: ProjectWithRelations) => void) {
  return [
    columnHelper.accessor('project_number', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        return (
          <p className="text-center text-xs sm:text-sm text-nowrap font-medium text-muted-foreground">
            PRJ-{formatNumber(project.project_number || 0)}
          </p>
        );
      },
      header: ({ column }: any) => (
        <div className="flex justify-center w-full">
          <Button
            className="px-1 text-xs sm:text-sm gap-1"
            size="sm"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <HashIcon className="h-3 w-3" />
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      )
    }),
    columnHelper.accessor(
      (row: any) =>
        `${row.street_address || row.address || ''} ${row.city || ''} ${row.state || ''} ${row.zipcode || ''} ${row.property_owner_name || ''} ${row.customer_details?.first_name || ''} ${row.customer_details?.last_name || ''} ${row.project_status?.name || ''} ${row.project_type?.name || ''}`,
      {
        id: 'address',
        cell: ({ row }: any) => {
          const project: ProjectWithRelations = row.original;
          const address = project.street_address || project.address || '';
          const secondLine = [project.city, project.state, project.zipcode]
            .filter(Boolean)
            .join(', ');
          return (
            <div className="flex flex-col min-w-[160px]">
              <p className="text-xs sm:text-sm font-medium leading-tight">
                {address || 'No address'}
              </p>
              {secondLine && (
                <p className="text-xs text-muted-foreground leading-tight">{secondLine}</p>
              )}
            </div>
          );
        },
        header: ({ column }: any) => (
          <div className="flex">
            <Button
              className="px-1 text-xs sm:text-sm gap-1"
              size="sm"
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
              <MapPinIcon className="h-3 w-3" />
              Address
              {column.getIsSorted() === 'asc' ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDownIcon className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        )
      }
    ),
    columnHelper.accessor(
      (row: any) =>
        `${row.customer_details?.first_name || ''} ${row.customer_details?.last_name || ''} ${row.property_owner_name || ''}`,
      {
        id: 'owner',
        cell: ({ row }: any) => {
          const project: ProjectWithRelations = row.original;
          if (project.customer_details) {
            return (
              <CustomerPreviewPopover
                firstName={project.customer_details.first_name || ''}
                lastName={project.customer_details.last_name || ''}
                email={project.customer_details.email || ''}
                phoneNumber={(project.customer_details as any).phone_number || ''}
                streetAddress={project.customer_details.street_address || ''}
                city={project.customer_details.city || ''}
                state={project.customer_details.state || ''}
                zipcode={project.customer_details.zipcode || ''}
                customerId={(project.customer_details as any).id || 0}
              />
            );
          }
          return (
            <p className="text-xs sm:text-sm text-muted-foreground">
              {project.property_owner_name || <span className="italic">Unassigned</span>}
            </p>
          );
        },
        header: () => (
          <div className="flex items-center gap-1 px-1 text-xs sm:text-sm font-medium">
            <UserIcon className="h-3 w-3" />
            Owner
          </div>
        )
      }
    ),
    columnHelper.accessor('project_status_id', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        return (
          <DefaultStatusBadge
            title={project.project_status?.name || 'Unknown'}
            variant={getStatusVariant(project.project_status?.name)}
          />
        );
      },
      header: ({ column }: any) => (
        <div className="flex">
          <Button
            className="px-1 gap-1"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <CircleDotIcon className="h-3 w-3" />
            Status
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3" />
            ) : null}
          </Button>
        </div>
      )
    }),
    columnHelper.accessor('project_type_id', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        return (
          <p className="text-xs sm:text-sm text-nowrap">
            {project.project_type?.name || <span className="text-muted-foreground italic">—</span>}
          </p>
        );
      },
      header: () => (
        <div className="flex items-center gap-1 px-1 text-xs sm:text-sm font-medium">
          <TagIcon className="h-3 w-3" />
          Type
        </div>
      )
    }),
    columnHelper.accessor('service', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        return (
          <p className="text-xs sm:text-sm text-nowrap">
            {project.service_details?.name || (
              <span className="text-muted-foreground italic">—</span>
            )}
          </p>
        );
      },
      header: () => (
        <div className="flex items-center gap-1 px-1 text-xs sm:text-sm font-medium">
          <WrenchIcon className="h-3 w-3" />
          Service
        </div>
      )
    }),
    columnHelper.accessor('start_date', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        return (
          <p className="text-xs sm:text-sm">
            {project.start_date ? formatDateWithAbbreviatedMonth(project.start_date) : '—'}
          </p>
        );
      },
      header: ({ column }: any) => (
        <div className="flex">
          <Button
            className="px-1 gap-1"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <CalendarIcon className="h-3 w-3" />
            Start
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3" />
            ) : null}
          </Button>
        </div>
      )
    }),
    columnHelper.accessor('estimated_value', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        return project.estimated_value != null ? (
          <p className="text-xs sm:text-sm">${formatMoneyValue(project.estimated_value)}</p>
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground italic">—</p>
        );
      },
      header: ({ column }: any) => (
        <div className="flex">
          <Button
            className="px-1 gap-1"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            <DollarSignIcon className="h-3 w-3" />
            Est. Value
            {column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="h-3 w-3" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="h-3 w-3" />
            ) : null}
          </Button>
        </div>
      )
    }),
    columnHelper.accessor('drive_folder_id', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        const url =
          project.drive_folder_url ||
          (project.drive_folder_id
            ? `https://drive.google.com/drive/folders/${project.drive_folder_id}`
            : null);
        if (!url) return <p className="text-xs text-muted-foreground italic px-1">—</p>;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline max-w-[160px]">
            <GoogleDriveIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{project.drive_folder_name || 'Open folder'}</span>
          </a>
        );
      },
      header: () => (
        <div className="flex items-center gap-1.5 px-1 text-xs sm:text-sm font-medium">
          <GoogleDriveIcon className="h-3.5 w-3.5" />
          Drive
        </div>
      )
    }),
    columnHelper.accessor('actions', {
      cell: ({ row }: any) => {
        const project: ProjectWithRelations = row.original;
        return (
          <div className="flex gap-2">
            <UpdateProjectSheet project={project} />
            <ConnectedDeleteProjectAlertDialog
              title="Delete project?"
              description="This will permanently delete the project and all associated data."
              itemId={project.id}
            />
            <Button
              variant="primary"
              size="icon"
              className="px-3"
              title="View full details"
              onClick={() => onExpand(project)}>
              <ExpandIcon size="15px" />
            </Button>
          </div>
        );
      },
      header: () => <p>Actions</p>
    })
  ];
}

function AddProjectDialog({
  defaultStatusId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: {
  defaultStatusId?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = controlledOnOpenChange ?? setInternalOpen;
  const { data: nextNumber } = useFetchNextProjectNumber();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="primary" size="sm">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add project
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border bg-muted">
              <FolderKanbanIcon size={18} className="text-muted-foreground" />
            </div>
            <div>
              <DialogTitle className="text-base">Add project</DialogTitle>
              <DialogDescription className="text-xs">
                Create a new project — start with the job site address.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto px-6 pb-6">
          <AddProjectForm
            setOpen={setOpen}
            defaultProjectNumber={nextNumber}
            defaultProjectStatusId={defaultStatusId}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading, refetch } = useFetchProjects();
  const { data: statuses = [] } = useFetchProjectStatuses();
  const { data: types = [] } = useFetchProjectTypes();
  const updateStatus = useUpdateProjectStatus();

  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({ statusIds: [], typeIds: [] });
  const [detailOpen, setDetailOpen] = useState(false);
  const [fullProject, setFullProject] = useState<ProjectWithRelations | null>(null);
  const [fullOpen, setFullOpen] = useState(false);
  const [kanbanAddOpen, setKanbanAddOpen] = useState(false);
  const [kanbanAddStatusId, setKanbanAddStatusId] = useState<number | undefined>(undefined);

  const stats = useMemo(() => {
    if (!projects) return { total: 0, leads: 0, inProgress: 0, completed: 0 };
    return {
      total: projects.length,
      leads: projects.filter((p) => p.project_status?.name === 'Lead').length,
      inProgress: projects.filter((p) => p.project_status?.name === 'In Progress').length,
      completed: projects.filter((p) => p.project_status?.name === 'Completed').length
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (
        filters.statusIds.length &&
        p.project_status_id != null &&
        !filters.statusIds.includes(p.project_status_id)
      )
        return false;
      if (
        filters.typeIds.length &&
        p.project_type_id != null &&
        !filters.typeIds.includes(p.project_type_id)
      )
        return false;
      if (q) {
        const customerName = p.customer_details
          ? `${p.customer_details.first_name ?? ''} ${p.customer_details.last_name ?? ''}`.toLowerCase()
          : '';
        const hay = [
          p.street_address,
          p.address,
          p.city,
          p.state,
          p.zipcode,
          customerName,
          p.project_number?.toString(),
          p.service_details?.name,
          p.project_type?.name,
          p.project_status?.name,
          p.property_owner_name
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [projects, filters, search]);

  function handleKanbanAdd(statusId: number) {
    setKanbanAddStatusId(statusId);
    setKanbanAddOpen(true);
  }

  function handleExpand(project: ProjectWithRelations) {
    setFullProject(project);
    setFullOpen(true);
  }

  function handleOpenFull(project: ProjectWithRelations) {
    setDetailOpen(false);
    setFullProject(project);
    setTimeout(() => setFullOpen(true), 220);
  }

  function handleMoveStatus(projectId: string, newStatusId: number) {
    updateStatus.mutate({ id: projectId, statusId: newStatusId });
  }

  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <PageHeader
        title="Projects"
        subheading="Track roofing jobs by address from lead to completion."
        customActions={<AddProjectDialog />}
      />

      {/* Stat cards */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <CountStatCard
          title="Total"
          totalCount={stats.total}
          icon={<FolderKanbanIcon size="18px" />}
          isLoading={isLoading}
        />
        <CountStatCard
          title="Leads"
          totalCount={stats.leads}
          icon={<TrendingUpIcon size="18px" />}
          isLoading={isLoading}
        />
        <CountStatCard
          title="In Progress"
          totalCount={stats.inProgress}
          icon={<HardHatIcon size="18px" />}
          isLoading={isLoading}
        />
        <CountStatCard
          title="Completed"
          totalCount={stats.completed}
          icon={<CheckCircleIcon size="18px" />}
          isLoading={isLoading}
        />
      </div> */}

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* View toggle */}
        <div className="flex items-center p-0.5 bg-muted rounded-lg border border-border">
          <button
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              view === 'kanban'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setView('kanban')}>
            <KanbanSquareIcon className="h-3.5 w-3.5" />
            Kanban
          </button>
          <button
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              view === 'table'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => setView('table')}>
            <ListIcon className="h-3.5 w-3.5" />
            Table
          </button>
        </div>

        {/* Refresh */}
        <Button variant="outline" size="sm" onClick={() => refetch()} title="Refresh">
          <RefreshCwIcon className="h-3.5 w-3.5" />
        </Button>

        {/* Search — pushed right */}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 border border-border bg-background rounded-lg px-3 h-9 min-w-[240px]">
            <SearchIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <Input
              className="border-0 bg-transparent p-0 h-full text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              placeholder="Search projects, customers, address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ProjectFilterPopover
            statuses={statuses}
            types={types}
            filters={filters}
            setFilters={setFilters}
          />
          <Button
            variant="outline"
            size="sm"
            title="Project settings"
            onClick={() => navigate('/projects/settings')}>
            <Settings2Icon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* View */}
      {view === 'kanban' ? (
        <ProjectKanbanView
          projects={filteredProjects}
          statuses={statuses}
          onExpand={handleExpand}
          onAdd={handleKanbanAdd}
          onMoveStatus={handleMoveStatus}
        />
      ) : (
        <DataTable
          entity="project"
          data={filteredProjects}
          isLoading={isLoading}
          // EntityFilterBar={DataTableFilterCard}
          // firstSelectName="Status"
          // secondSelectName="Type"
          // thirdSelectName="Source"
          // filterBarEntity="project"
          activateModal={false}
          columns={makeProjectTableColumns(handleExpand)}
          EmptyStateAction={<AddProjectDialog />}
        />
      )}

      {/* Detail slide-over */}
      <ProjectDetailSheet
        project={null}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onOpenFull={handleOpenFull}
      />

      {/* Full-screen dialog */}
      <ProjectFullDialog
        project={fullProject}
        open={fullOpen}
        onClose={() => {
          setFullOpen(false);
          setFullProject(null);
        }}
      />

      {/* Kanban column add — controlled dialog with pre-filled status */}
      <AddProjectDialog
        defaultStatusId={kanbanAddStatusId}
        open={kanbanAddOpen}
        onOpenChange={(v) => {
          setKanbanAddOpen(v);
          if (!v) setKanbanAddStatusId(undefined);
        }}
      />
    </div>
  );
}
