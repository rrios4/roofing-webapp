import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useWorkflows } from '../../hooks/useProjects';
import { ProjectWorkflow, ProjectStatus } from '../../types/project-types';
import { Trash2, Edit, Plus, Star, Settings } from 'lucide-react';

const workflowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isDefault: z.boolean()
});

const statusSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required')
});

type WorkflowFormData = z.infer<typeof workflowSchema>;
type StatusFormData = z.infer<typeof statusSchema>;

interface WorkflowManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultColors = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#ef4444', // red
  '#0ea5e9', // sky
  '#f97316', // orange
  '#22c55e', // green
  '#ec4899', // pink
  '#6366f1' // indigo
];

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({ isOpen, onClose }) => {
  const {
    workflows,
    defaultWorkflowId,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    setDefaultWorkflow,
    isCreating,
    isUpdating,
    isDeleting
  } = useWorkflows();

  const [editingWorkflow, setEditingWorkflow] = useState<ProjectWorkflow | null>(null);
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProjectStatus | null>(null);
  const [showCreateStatus, setShowCreateStatus] = useState<string | null>(null);

  const workflowForm = useForm<WorkflowFormData>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: '',
      description: '',
      isDefault: false
    }
  });

  const statusForm = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      name: '',
      color: defaultColors[0]
    }
  });

  const handleCreateWorkflow = (data: WorkflowFormData) => {
    const newWorkflow: Omit<ProjectWorkflow, 'id' | 'createdAt' | 'updatedAt'> = {
      ...data,
      statuses: [
        {
          id: 'new',
          name: 'New',
          color: '#3b82f6',
          order: 0,
          workflowId: ''
        }
      ]
    };

    createWorkflow(newWorkflow);
    setShowCreateWorkflow(false);
    workflowForm.reset();
  };

  const handleUpdateWorkflow = (data: WorkflowFormData) => {
    if (editingWorkflow) {
      updateWorkflow({
        id: editingWorkflow.id,
        updates: data
      });
      setEditingWorkflow(null);
      workflowForm.reset();
    }
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (workflows.length <= 1) {
      alert('Cannot delete the last workflow');
      return;
    }

    if (workflowId === defaultWorkflowId) {
      alert('Cannot delete the default workflow. Set another workflow as default first.');
      return;
    }

    if (confirm('Are you sure you want to delete this workflow?')) {
      deleteWorkflow(workflowId);
    }
  };

  const handleCreateStatus = (data: StatusFormData) => {
    if (showCreateStatus) {
      const workflow = workflows.find((w) => w.id === showCreateStatus);
      if (workflow) {
        const newStatus: ProjectStatus = {
          id: Date.now().toString(),
          name: data.name,
          color: data.color,
          order: workflow.statuses.length,
          workflowId: workflow.id
        };

        updateWorkflow({
          id: workflow.id,
          updates: {
            statuses: [...workflow.statuses, newStatus]
          }
        });
      }
      setShowCreateStatus(null);
      statusForm.reset();
    }
  };

  const handleUpdateStatus = (data: StatusFormData) => {
    if (editingStatus) {
      const workflow = workflows.find((w) => w.id === editingStatus.workflowId);
      if (workflow) {
        const updatedStatuses = workflow.statuses.map((status) =>
          status.id === editingStatus.id
            ? { ...status, name: data.name, color: data.color }
            : status
        );

        updateWorkflow({
          id: workflow.id,
          updates: { statuses: updatedStatuses }
        });
      }
      setEditingStatus(null);
      statusForm.reset();
    }
  };

  const handleDeleteStatus = (workflowId: string, statusId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow && workflow.statuses.length <= 1) {
      alert('Cannot delete the last status in a workflow');
      return;
    }

    if (confirm('Are you sure you want to delete this status?')) {
      if (workflow) {
        const updatedStatuses = workflow.statuses.filter((status) => status.id !== statusId);
        updateWorkflow({
          id: workflowId,
          updates: { statuses: updatedStatuses }
        });
      }
    }
  };

  const startEditWorkflow = (workflow: ProjectWorkflow) => {
    setEditingWorkflow(workflow);
    workflowForm.reset({
      name: workflow.name,
      description: workflow.description || '',
      isDefault: workflow.isDefault
    });
  };

  const startEditStatus = (status: ProjectStatus) => {
    setEditingStatus(status);
    statusForm.reset({
      name: status.name,
      color: status.color
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Workflow Manager
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Workflow Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Workflows</h3>
              <p className="text-sm text-muted-foreground">
                Manage your project workflows and statuses
              </p>
            </div>
            <Button onClick={() => setShowCreateWorkflow(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </div>

          {/* Workflows List */}
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      {workflow.id === defaultWorkflowId && (
                        <Badge variant="default">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {workflow.id !== defaultWorkflowId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultWorkflow(workflow.id)}>
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditWorkflow(workflow)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {workflows.length > 1 && workflow.id !== defaultWorkflowId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {workflow.description && (
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Statuses</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateStatus(workflow.id)}>
                        <Plus className="w-3 h-3 mr-1" />
                        Add Status
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workflow.statuses
                        .sort((a, b) => a.order - b.order)
                        .map((status) => (
                          <div
                            key={status.id}
                            className="flex items-center gap-2 p-2 border rounded-md group hover:bg-muted/50">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            <span className="text-sm">{status.name}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditStatus(status)}
                                className="h-6 w-6 p-0">
                                <Edit className="w-3 h-3" />
                              </Button>
                              {workflow.statuses.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteStatus(workflow.id, status.id)}
                                  className="h-6 w-6 p-0">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Create/Edit Workflow Modal */}
        <Dialog
          open={showCreateWorkflow || editingWorkflow !== null}
          onOpenChange={() => {
            setShowCreateWorkflow(false);
            setEditingWorkflow(null);
            workflowForm.reset();
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}</DialogTitle>
            </DialogHeader>

            <Form {...workflowForm}>
              <form
                onSubmit={workflowForm.handleSubmit(
                  editingWorkflow ? handleUpdateWorkflow : handleCreateWorkflow
                )}
                className="space-y-4">
                <FormField
                  control={workflowForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Workflow name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={workflowForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateWorkflow(false);
                      setEditingWorkflow(null);
                      workflowForm.reset();
                    }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {editingWorkflow ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Status Modal */}
        <Dialog
          open={showCreateStatus !== null || editingStatus !== null}
          onOpenChange={() => {
            setShowCreateStatus(null);
            setEditingStatus(null);
            statusForm.reset();
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStatus ? 'Edit Status' : 'Create New Status'}</DialogTitle>
            </DialogHeader>

            <Form {...statusForm}>
              <form
                onSubmit={statusForm.handleSubmit(
                  editingStatus ? handleUpdateStatus : handleCreateStatus
                )}
                className="space-y-4">
                <FormField
                  control={statusForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Status name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={statusForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input type="color" {...field} />
                          <div className="flex gap-2 flex-wrap">
                            {defaultColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500"
                                style={{ backgroundColor: color }}
                                onClick={() => field.onChange(color)}
                              />
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateStatus(null);
                      setEditingStatus(null);
                      statusForm.reset();
                    }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {editingStatus ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
