import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { KanbanColumn } from './kanban-column';
import { ProjectCard } from './project-card';
import { useKanbanBoard, useWorkflows } from '../../hooks/useProjects';
import { Project } from '../../types/project-types';
import { Settings, Plus } from 'lucide-react';

interface KanbanBoardProps {
  onCreateProject?: () => void;
  onManageWorkflows?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onCreateProject, onManageWorkflows }) => {
  const { workflows, defaultWorkflowId, setDefaultWorkflow } = useWorkflows();
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(defaultWorkflowId || '');
  const { activeWorkflow, projectsByStatus, moveProject } = useKanbanBoard(selectedWorkflowId);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Find the project that's being dragged
    const allProjects = Object.values(projectsByStatus).flat();
    const project = allProjects.find((p) => p.id === active.id);
    setActiveProject(project || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveProject(null);

    if (!over) return;

    const projectId = active.id as string;
    const newStatusId = over.id as string;

    // Find current project to check if status actually changed
    const allProjects = Object.values(projectsByStatus).flat();
    const project = allProjects.find((p) => p.id === projectId);

    if (project && project.statusId !== newStatusId) {
      moveProject(projectId, newStatusId);
    }
  };

  const handleWorkflowChange = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    if (workflowId !== defaultWorkflowId) {
      // Optionally make this the new default
      // setDefaultWorkflow(workflowId);
    }
  };

  const handleSetAsDefault = () => {
    if (selectedWorkflowId && selectedWorkflowId !== defaultWorkflowId) {
      setDefaultWorkflow(selectedWorkflowId);
    }
  };

  if (!activeWorkflow) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No workflow selected or available</p>
          <Button onClick={onManageWorkflows}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Workflows
          </Button>
        </div>
      </div>
    );
  }

  const totalProjects = Object.values(projectsByStatus).reduce(
    (sum, projects) => sum + projects.length,
    0
  );

  const totalValue = Object.values(projectsByStatus)
    .flat()
    .reduce((sum, project) => sum + (project.jobValue || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header with workflow selector and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedWorkflowId} onValueChange={handleWorkflowChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select workflow" />
            </SelectTrigger>
            <SelectContent>
              {workflows.map((workflow) => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  <div className="flex items-center gap-2">
                    {workflow.name}
                    {workflow.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedWorkflowId !== defaultWorkflowId && (
            <Button variant="outline" size="sm" onClick={handleSetAsDefault}>
              Set as Default
            </Button>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              <strong>{totalProjects}</strong> projects
            </span>
            <span>
              <strong>${totalValue.toLocaleString()}</strong> total value
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onManageWorkflows}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Workflows
          </Button>

          <Button onClick={onCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            <SortableContext
              items={activeWorkflow.statuses.map((s) => s.id)}
              strategy={horizontalListSortingStrategy}>
              {activeWorkflow.statuses
                .sort((a, b) => a.order - b.order)
                .map((status) => (
                  <KanbanColumn
                    key={status.id}
                    status={status}
                    projects={projectsByStatus[status.id] || []}
                  />
                ))}
            </SortableContext>
          </div>
        </ScrollArea>

        <DragOverlay>
          {activeProject ? <ProjectCard project={activeProject} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
