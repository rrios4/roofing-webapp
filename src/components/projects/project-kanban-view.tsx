import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { ProjectStatus, ProjectWithRelations } from '../../types/db_types';
import ProjectKanbanCard from './project-kanban-card';

type Props = {
  projects: ProjectWithRelations[];
  statuses: ProjectStatus[];
  onExpand: (project: ProjectWithRelations) => void;
  onAdd: (statusId: number) => void;
  onMoveStatus: (projectId: string, newStatusId: number) => void;
};

export default function ProjectKanbanView({ projects, statuses, onExpand, onAdd, onMoveStatus }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoverStatusId, setHoverStatusId] = useState<number | null>(null);

  const byStatus: Record<number, ProjectWithRelations[]> = {};
  for (const s of statuses) byStatus[s.id] = [];
  for (const p of projects) {
    if (p.project_status_id != null && byStatus[p.project_status_id]) {
      byStatus[p.project_status_id].push(p);
    }
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
    <div className="flex gap-3 overflow-x-auto pb-4 items-start">
      {statuses.map((status) => {
        const items = byStatus[status.id] ?? [];
        const isDropTarget = !!draggedId && hoverStatusId === status.id;
        return (
          <section
            key={status.id}
            className={`
              flex-shrink-0 w-[300px] xl:w-[320px] rounded-xl p-3 flex flex-col gap-2.5
              bg-muted/50 border
              transition-all duration-150
              ${isDropTarget
                ? 'border-primary/60 bg-primary/5 ring-2 ring-primary/20 ring-inset'
                : 'border-border'}
            `}
            onDragOver={(e) => handleColumnDragOver(e, status.id)}
            onDragLeave={(e) => handleColumnDragLeave(e, status.id)}
            onDrop={(e) => handleColumnDrop(e, status.id)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-1 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{status.name}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <button
                className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                title={`Add to ${status.name}`}
                onClick={() => onAdd(status.id)}
              >
                <PlusIcon className="h-3 w-3" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 min-h-[60px]">
              {items.map((p) => (
                <ProjectKanbanCard
                  key={p.id}
                  project={p}
                  onExpand={onExpand}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedId === p.id}
                />
              ))}
              {items.length === 0 && (
                <div className={`
                  rounded-lg border border-dashed text-center text-xs text-muted-foreground py-6
                  ${isDropTarget ? 'border-primary text-primary' : 'border-border'}
                `}>
                  {isDropTarget ? 'Drop here' : 'No projects yet'}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
