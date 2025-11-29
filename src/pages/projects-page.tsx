import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { KanbanBoard } from '../components/projects/kanban-board';
import { CreateProjectForm } from '../components/projects/create-project-form';
import { WorkflowManager } from '../components/projects/workflow-manager';
import { useProjectStats, useFilteredProjects } from '../hooks/useProjects';
import { Search, Filter, Settings, BarChart3, Calendar, DollarSign } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showWorkflowManager, setShowWorkflowManager] = useState(false);
  const { filters, updateFilters } = useFilteredProjects();

  const stats = useProjectStats();

  const handleSearch = (value: string) => {
    updateFilters({ search: value });
  };

  return (
    <div className="w-full py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your roofing projects and workflows</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowWorkflowManager(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Workflows
          </Button>

          <Button onClick={() => setShowCreateForm(true)}>New Project</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.projectsWithInsurance} with insurance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${Math.round(stats.averageValue).toLocaleString()} avg per project
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.insurancePercentage)}%</div>
            <p className="text-xs text-muted-foreground">Projects with insurance claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Source</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.entries(stats.sourceCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Most common project source</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>

        <div className="flex items-center gap-2">
          {filters.search && <Badge variant="secondary">Search: {filters.search}</Badge>}
          {filters.assignedTo.length > 0 && (
            <Badge variant="secondary">Assigned: {filters.assignedTo.length}</Badge>
          )}
          {filters.hasInsurance !== undefined && (
            <Badge variant="secondary">
              {filters.hasInsurance ? 'With Insurance' : 'No Insurance'}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <KanbanBoard
            onCreateProject={() => setShowCreateForm(true)}
            onManageWorkflows={() => setShowWorkflowManager(true)}
          />
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">List view coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Project Modal */}
      <CreateProjectForm isOpen={showCreateForm} onClose={() => setShowCreateForm(false)} />

      {/* Workflow Manager Modal */}
      <WorkflowManager isOpen={showWorkflowManager} onClose={() => setShowWorkflowManager(false)} />
    </div>
  );
};

export default ProjectsPage;
