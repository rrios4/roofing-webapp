import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CircleDotIcon,
  EditIcon,
  GripVerticalIcon,
  PlusIcon,
  RefreshCwIcon,
  TagIcon,
  TrashIcon,
  TrendingUpIcon
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '../components/ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../lib/utils';
import {
  useFetchProjectSources,
  useFetchProjectStatuses,
  useFetchProjectTypes,
  useFetchProjects,
  useCreateProjectStatus,
  useUpdateProjectStatusItem,
  useDeleteProjectStatus,
  useReorderProjectStatuses,
  useCreateProjectType,
  useUpdateProjectTypeItem,
  useDeleteProjectType,
  useCreateProjectSource,
  useUpdateProjectSourceItem,
  useDeleteProjectSource
} from '../hooks/useAPI/use-projects';

const itemFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  description: z.string().max(200, 'Description must be at most 200 characters').optional()
});
type ItemFormData = z.infer<typeof itemFormSchema>;

type LookupItem = { id: number; name: string; description?: string | null };
type TabKey = 'statuses' | 'types' | 'sources';

// ── Shared item form ─────────────────────────────────────────────────────────

interface ItemFormProps {
  item?: LookupItem;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
  label: string;
}

function ItemForm({ item, onSubmit, onCancel, isLoading, mode, label }: ItemFormProps) {
  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: { name: item?.name ?? '', description: item?.description ?? '' }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder={`e.g., My ${label}…`} {...field} />
              </FormControl>
              <FormDescription className="text-xs">2–50 characters, must be unique.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional: explain when this should be used…"
                  className="resize-none min-h-[80px]"
                  rows={3}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormDescription className="text-xs">Max 200 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 pt-2 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading && <RefreshCwIcon className="mr-2 h-3.5 w-3.5 animate-spin" />}
            {mode === 'create' ? (
              <>
                <PlusIcon className="mr-1.5 h-3.5 w-3.5" />
                Create
              </>
            ) : (
              <>
                <CheckCircleIcon className="mr-1.5 h-3.5 w-3.5" />
                Save
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ── Delete confirmation dialog ───────────────────────────────────────────────

interface DeleteDialogProps {
  item: LookupItem | null;
  usageCount: number;
  label: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ item, usageCount, label, isOpen, isLoading, onConfirm, onCancel }: DeleteDialogProps) {
  if (!item) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-destructive" />
            Delete {label}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>"{item.name}"</strong>? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {usageCount > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>{usageCount} project{usageCount !== 1 ? 's' : ''}</strong> currently use this{' '}
                {label.toLowerCase()}. Deleting it will leave those projects without a{' '}
                {label.toLowerCase()}.
              </p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <RefreshCwIcon className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Lookup item list ─────────────────────────────────────────────────────────

interface LookupListProps {
  items: LookupItem[];
  isLoading: boolean;
  label: string;
  singularLabel: string;
  getUsageCount: (id: number) => number;
  onEdit: (item: LookupItem) => void;
  onDelete: (item: LookupItem) => void;
  onAdd: () => void;
  icon: React.ReactNode;
  isDraggable?: boolean;
  draggedId?: number | null;
  dragOverId?: number | null;
  onDragStart?: (id: number) => void;
  onDragOver?: (id: number) => void;
  onDragEnd?: () => void;
}

function LookupList({
  items,
  isLoading,
  label,
  singularLabel,
  getUsageCount,
  onEdit,
  onDelete,
  onAdd,
  icon,
  isDraggable = false,
  draggedId,
  dragOverId,
  onDragStart,
  onDragOver,
  onDragEnd
}: LookupListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto mb-3 flex items-center justify-center h-12 w-12 rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
        <p className="text-sm font-medium">No {label.toLowerCase()} yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Add your first {singularLabel.toLowerCase()} to get started.
        </p>
        <Button className="mt-4" size="sm" onClick={onAdd}>
          <PlusIcon className="mr-1.5 h-3.5 w-3.5" />
          Add {singularLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isDraggable && items.length > 1 && (
        <p className="text-xs text-muted-foreground mb-1">
          Drag the grip handle to reorder — order is reflected in the Kanban board.
        </p>
      )}
      {items.map((item) => {
        const count = getUsageCount(item.id);
        const isBeingDragged = draggedId === item.id;
        const isDropTarget = dragOverId === item.id && draggedId !== item.id;

        return (
          <div
            key={item.id}
            data-drag-id={item.id}
            draggable={isDraggable}
            onDragStart={isDraggable ? () => onDragStart?.(item.id) : undefined}
            onDragOver={
              isDraggable
                ? (e) => {
                    e.preventDefault();
                    onDragOver?.(item.id);
                  }
                : undefined
            }
            onDragEnd={isDraggable ? onDragEnd : undefined}
            className={cn(
              'flex items-center justify-between p-3 border rounded-lg transition-colors',
              isBeingDragged ? 'opacity-40 bg-muted' : 'hover:bg-muted/40',
              isDropTarget ? 'border-primary border-2 bg-primary/5' : ''
            )}>
            {isDraggable && (
              <div
                className="touch-none flex-shrink-0 mr-2 cursor-grab active:cursor-grabbing p-1 -ml-1 rounded"
                onTouchStart={() => onDragStart?.(item.id)}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  // Temporarily disable pointer events on the dragged row so
                  // elementFromPoint can see through it to the row beneath.
                  const draggedEl = document.querySelector(
                    `[data-drag-id="${item.id}"]`
                  ) as HTMLElement | null;
                  if (draggedEl) draggedEl.style.pointerEvents = 'none';
                  const target = document.elementFromPoint(touch.clientX, touch.clientY);
                  if (draggedEl) draggedEl.style.pointerEvents = '';
                  const row = target?.closest('[data-drag-id]') as HTMLElement | null;
                  if (row) {
                    const id = Number(row.dataset.dragId);
                    if (id) onDragOver?.(id);
                  }
                }}
                onTouchEnd={onDragEnd}>
                <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.name}</span>
                {count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {count} project{count !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                <EditIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(item)}>
                <TrashIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab section wrapper ──────────────────────────────────────────────────────

interface TabSectionProps {
  title: string;
  description: string;
  count: number;
  onAdd: () => void;
  addLabel: string;
  children: React.ReactNode;
}

function TabSection({ title, description, count, onAdd, addLabel, children }: TabSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{count}</Badge>
            <Button size="sm" onClick={onAdd}>
              <PlusIcon className="mr-1.5 h-3.5 w-3.5" />
              {addLabel}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function ProjectSettingsPage() {
  const navigate = useNavigate();
  const { data: projects = [] } = useFetchProjects();
  const { data: statuses, isLoading: loadingStatuses } = useFetchProjectStatuses();
  const { data: types = [], isLoading: loadingTypes } = useFetchProjectTypes();
  const { data: sources = [], isLoading: loadingSources } = useFetchProjectSources();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LookupItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('statuses');
  const [mode, setMode] = useState<'create' | 'edit'>('create');

  // Drag-and-drop state for statuses
  const [orderedStatuses, setOrderedStatuses] = useState<LookupItem[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // Sync from server only when statuses data changes (initial load, add, delete).
  // Do NOT depend on draggedId — adding it causes a race where setDraggedId(null)
  // fires the effect before the optimistic update has propagated, reverting the order.
  useEffect(() => {
    if (statuses) setOrderedStatuses(statuses as LookupItem[]);
  }, [statuses]); // eslint-disable-line react-hooks/exhaustive-deps

  const createStatus = useCreateProjectStatus(() => setSheetOpen(false));
  const updateStatus = useUpdateProjectStatusItem(() => setSheetOpen(false));
  const deleteStatus = useDeleteProjectStatus(() => setDeleteOpen(false));
  const reorder = useReorderProjectStatuses();

  const createType = useCreateProjectType(() => setSheetOpen(false));
  const updateType = useUpdateProjectTypeItem(() => setSheetOpen(false));
  const deleteType = useDeleteProjectType(() => setDeleteOpen(false));

  const createSource = useCreateProjectSource(() => setSheetOpen(false));
  const updateSource = useUpdateProjectSourceItem(() => setSheetOpen(false));
  const deleteSource = useDeleteProjectSource(() => setDeleteOpen(false));

  const isSubmitting =
    createStatus.isLoading ||
    updateStatus.isLoading ||
    createType.isLoading ||
    updateType.isLoading ||
    createSource.isLoading ||
    updateSource.isLoading;

  const isDeleting = deleteStatus.isLoading || deleteType.isLoading || deleteSource.isLoading;

  // Usage counts derived from cached projects list
  const statusUsage = useMemo(() => {
    const map: Record<number, number> = {};
    projects.forEach((p) => {
      if (p.project_status_id != null)
        map[p.project_status_id] = (map[p.project_status_id] ?? 0) + 1;
    });
    return map;
  }, [projects]);

  const typeUsage = useMemo(() => {
    const map: Record<number, number> = {};
    projects.forEach((p) => {
      if (p.project_type_id != null) map[p.project_type_id] = (map[p.project_type_id] ?? 0) + 1;
    });
    return map;
  }, [projects]);

  const sourceUsage = useMemo(() => {
    const map: Record<number, number> = {};
    projects.forEach((p) => {
      if ((p as any).source_id != null)
        map[(p as any).source_id] = (map[(p as any).source_id] ?? 0) + 1;
    });
    return map;
  }, [projects]);

  // ── DnD handlers ────────────────────────────────────────────────────────────

  function handleDragStart(id: number) {
    setDraggedId(id);
  }

  function handleDragOver(id: number) {
    setDragOverId(id);
  }

  function handleDragEnd() {
    if (draggedId == null || dragOverId == null || draggedId === dragOverId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    const next = [...orderedStatuses];
    const fromIdx = next.findIndex((s) => s.id === draggedId);
    const toIdx = next.findIndex((s) => s.id === dragOverId);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setOrderedStatuses(next);
    reorder.mutate(next.map((s, i) => ({ id: s.id, sort_order: i + 1 })));
    setDraggedId(null);
    setDragOverId(null);
  }

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  function openAdd(tab: TabKey) {
    setActiveTab(tab);
    setMode('create');
    setSelectedItem(null);
    setSheetOpen(true);
  }

  function openEdit(item: LookupItem) {
    setMode('edit');
    setSelectedItem(item);
    setSheetOpen(true);
  }

  function openDelete(item: LookupItem) {
    setSelectedItem(item);
    setDeleteOpen(true);
  }

  function handleSubmit(data: ItemFormData) {
    const payload = { name: data.name, description: data.description ?? '' };
    if (mode === 'create') {
      if (activeTab === 'statuses') createStatus.mutate(payload);
      else if (activeTab === 'types') createType.mutate(payload);
      else createSource.mutate(payload);
    } else {
      if (!selectedItem) return;
      if (activeTab === 'statuses') updateStatus.mutate({ id: selectedItem.id, data: payload });
      else if (activeTab === 'types') updateType.mutate({ id: selectedItem.id, data: payload });
      else updateSource.mutate({ id: selectedItem.id, data: payload });
    }
  }

  function handleDelete() {
    if (!selectedItem) return;
    if (activeTab === 'statuses') deleteStatus.mutate(selectedItem.id);
    else if (activeTab === 'types') deleteType.mutate(selectedItem.id);
    else deleteSource.mutate(selectedItem.id);
  }

  function getDeleteUsageCount() {
    if (!selectedItem) return 0;
    if (activeTab === 'statuses') return statusUsage[selectedItem.id] ?? 0;
    if (activeTab === 'types') return typeUsage[selectedItem.id] ?? 0;
    return sourceUsage[selectedItem.id] ?? 0;
  }

  function getSheetLabel() {
    if (activeTab === 'statuses') return 'Status';
    if (activeTab === 'types') return 'Type';
    return 'Source';
  }

  return (
    <div className="flex flex-col w-full gap-6 mb-6">
      <PageHeader
        title="Project Settings"
        subheading="Manage statuses, types, and sources used across all projects."
        customActions={
          <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
            <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
            Back to Projects
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
        <TabsList className="mb-2">
          <TabsTrigger value="statuses" className="gap-1.5">
            <CircleDotIcon className="h-3.5 w-3.5" />
            Statuses
            <Badge variant="secondary" className="ml-1 text-xs">
              {statuses?.length ?? 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="types" className="gap-1.5">
            <TagIcon className="h-3.5 w-3.5" />
            Types
            <Badge variant="secondary" className="ml-1 text-xs">
              {types.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sources" className="gap-1.5">
            <TrendingUpIcon className="h-3.5 w-3.5" />
            Sources
            <Badge variant="secondary" className="ml-1 text-xs">
              {sources.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="statuses">
          <TabSection
            title="Project Statuses"
            description="Pipeline stages that track a project from lead to completion. Drag to reorder — order is reflected in the Kanban board."
            count={orderedStatuses.length}
            onAdd={() => openAdd('statuses')}
            addLabel="Add Status">
            <LookupList
              items={orderedStatuses}
              isLoading={loadingStatuses}
              label="Statuses"
              singularLabel="Status"
              getUsageCount={(id) => statusUsage[id] ?? 0}
              onEdit={openEdit}
              onDelete={openDelete}
              onAdd={() => openAdd('statuses')}
              icon={<CircleDotIcon className="h-6 w-6" />}
              isDraggable
              draggedId={draggedId}
              dragOverId={dragOverId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            />
          </TabSection>
        </TabsContent>

        <TabsContent value="types">
          <TabSection
            title="Project Types"
            description="Categories of work such as Residential, Commercial, or Repair."
            count={types.length}
            onAdd={() => openAdd('types')}
            addLabel="Add Type">
            <LookupList
              items={types as LookupItem[]}
              isLoading={loadingTypes}
              label="Types"
              singularLabel="Type"
              getUsageCount={(id) => typeUsage[id] ?? 0}
              onEdit={openEdit}
              onDelete={openDelete}
              onAdd={() => openAdd('types')}
              icon={<TagIcon className="h-6 w-6" />}
            />
          </TabSection>
        </TabsContent>

        <TabsContent value="sources">
          <TabSection
            title="Project Sources"
            description="Where the lead came from — referral, website, walk-in, etc."
            count={sources.length}
            onAdd={() => openAdd('sources')}
            addLabel="Add Source">
            <LookupList
              items={sources as LookupItem[]}
              isLoading={loadingSources}
              label="Sources"
              singularLabel="Source"
              getUsageCount={(id) => sourceUsage[id] ?? 0}
              onEdit={openEdit}
              onDelete={openDelete}
              onAdd={() => openAdd('sources')}
              icon={<TrendingUpIcon className="h-6 w-6" />}
            />
          </TabSection>
        </TabsContent>
      </Tabs>

      {/* Add / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md p-0" side="right">
          <ScrollArea className="h-full">
            <div className="px-6 py-6 space-y-5">
              <SheetHeader>
                <SheetTitle>
                  {mode === 'create' ? 'Add' : 'Edit'} {getSheetLabel()}
                </SheetTitle>
                <SheetDescription>
                  {mode === 'create'
                    ? `Create a new project ${getSheetLabel().toLowerCase()}.`
                    : `Update "${selectedItem?.name}".`}
                </SheetDescription>
              </SheetHeader>
              <ItemForm
                key={selectedItem?.id ?? 'new'}
                item={selectedItem ?? undefined}
                onSubmit={handleSubmit}
                onCancel={() => setSheetOpen(false)}
                isLoading={isSubmitting}
                mode={mode}
                label={getSheetLabel()}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <DeleteDialog
        item={selectedItem}
        usageCount={getDeleteUsageCount()}
        label={getSheetLabel()}
        isOpen={deleteOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
