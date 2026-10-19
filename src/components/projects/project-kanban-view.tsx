import React, { useEffect, useRef, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { ProjectStatus, ProjectWithRelations } from '../../types/db_types';
import ProjectKanbanCard from './project-kanban-card';
import { cn } from '../../lib/utils';
import { useIsTouchDevice } from '../../hooks/useMediaQuery';

type Props = {
  projects: ProjectWithRelations[];
  statuses: ProjectStatus[];
  onExpand: (project: ProjectWithRelations) => void;
  onAdd: (statusId: number) => void;
  onMoveStatus: (projectId: string, newStatusId: number) => void;
};

export default function ProjectKanbanView({
  projects,
  statuses,
  onExpand,
  onAdd,
  onMoveStatus
}: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoverStatusId, setHoverStatusId] = useState<number | null>(null);
  const [visibleStatusId, setVisibleStatusId] = useState<number | null>(null);
  const isTouch = useIsTouchDevice();

  const scrollerRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<Record<number, HTMLElement | null>>({});

  const byStatus: Record<number, ProjectWithRelations[]> = {};
  for (const s of statuses) byStatus[s.id] = [];
  for (const p of projects) {
    if (p.project_status_id != null && byStatus[p.project_status_id]) {
      byStatus[p.project_status_id].push(p);
    }
  }

  // Track which column is in view so the mobile status chips can highlight it
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || statuses.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setVisibleStatusId(Number((best.target as HTMLElement).dataset.statusId));
      },
      { root, threshold: [0.5, 0.75] }
    );
    for (const s of statuses) {
      const el = columnRefs.current[s.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [statuses]);

  function scrollToColumn(statusId: number) {
    columnRefs.current[statusId]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest'
    });
  }

  function handleDragStart(project: ProjectWithRelations) {
    setDraggedId(project.id);
  }
  function handleDragEnd() {
    setDraggedId(null);
    setHoverStatusId(null);
  }
  function handleColumnDragOver(e: React.DragEvent, statusId: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (hoverStatusId !== statusId) setHoverStatusId(statusId);
  }
  function handleColumnDragLeave(e: React.DragEvent, statusId: number) {
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
    if (hoverStatusId === statusId) setHoverStatusId(null);
  }
  function handleColumnDrop(e: React.DragEvent, statusId: number) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) onMoveStatus(id, statusId);
    setDraggedId(null);
    setHoverStatusId(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Status chips — phones only, jump between columns */}
      <div className="sm:hidden -mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar">
        {statuses.map((status) => {
          const active = visibleStatusId === status.id;
          return (
            <button
              key={status.id}
              type="button"
              onClick={() => scrollToColumn(status.id)}
              className={cn(
                'flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border'
              )}>
              {status.name}
              <span
                className={cn(
                  'tabular-nums',
                  active ? 'text-primary-foreground/80' : 'text-muted-foreground/70'
                )}>
                {byStatus[status.id]?.length ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto pb-4 items-start -mx-4 px-4 scroll-px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:scroll-px-0 sm:snap-none">
        {statuses.map((status) => {
          const items = byStatus[status.id] ?? [];
          const isDropTarget = !!draggedId && hoverStatusId === status.id;
          return (
            <section
              key={status.id}
              ref={(el) => (columnRefs.current[status.id] = el)}
              data-status-id={status.id}
              className={cn(
                'flex-shrink-0 w-[85vw] sm:w-[300px] xl:w-[320px] snap-start rounded-xl p-3 flex flex-col gap-2.5',
                'bg-muted/50 border transition-all duration-150',
                'lg:max-h-[calc(100dvh-220px)]',
                isDropTarget
                  ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/20 ring-inset'
                  : 'border-border'
              )}
              onDragOver={(e) => handleColumnDragOver(e, status.id)}
              onDragLeave={(e) => handleColumnDragLeave(e, status.id)}
              onDrop={(e) => handleColumnDrop(e, status.id)}>
              {/* Column header */}
              <div className="flex items-center justify-between px-1 pb-1 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold truncate">{status.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <button
                  className="h-8 w-8 sm:h-6 sm:w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
                  title={`Add to ${status.name}`}
                  onClick={() => onAdd(status.id)}>
                  <PlusIcon className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                </button>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2.5 min-h-[60px] lg:overflow-y-auto lg:-mr-1 lg:pr-1">
                {items.map((p) => (
                  <ProjectKanbanCard
                    key={p.id}
                    project={p}
                    statuses={statuses}
                    onExpand={onExpand}
                    onMoveStatus={onMoveStatus}
                    draggable={!isTouch}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedId === p.id}
                  />
                ))}
                {items.length === 0 && (
                  <div
                    className={cn(
                      'rounded-lg border border-dashed text-center text-xs text-muted-foreground py-6',
                      isDropTarget ? 'border-primary text-primary' : 'border-border'
                    )}>
                    {isDropTarget ? 'Drop here' : 'No projects yet'}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
