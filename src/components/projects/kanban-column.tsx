import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Project, ProjectStatus } from '../../types/project-types';
import { ProjectCard } from './project-card';

interface KanbanColumnProps {
  status: ProjectStatus;
  projects: Project[];
  onEditStatus?: (status: ProjectStatus) => void;
  onDeleteStatus?: (statusId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  projects,
  onEditStatus,
  onDeleteStatus
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status.id
  });

  const totalValue = projects.reduce((sum, project) => sum + (project.jobValue || 0), 0);

  return (
    <Card
      className={`flex-shrink-0 min-w-[350px] max-w-[450px] ${isOver ? 'ring-2 ring-primary/50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
            <span className="text-sm font-medium">{status.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {projects.length}
            </Badge>
            {totalValue > 0 && (
              <Badge variant="outline" className="text-xs">
                ${totalValue.toLocaleString()}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div
          ref={setNodeRef}
          className={`min-h-[200px] space-y-2 transition-colors ${
            isOver ? 'bg-muted/50 rounded-md p-2' : ''
          }`}>
          <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </SortableContext>
          {projects.length === 0 && (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground border-2 border-dashed border-muted rounded-md">
              Drop projects here
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
