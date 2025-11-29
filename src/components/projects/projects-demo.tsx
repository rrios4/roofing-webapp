import React from 'react';
import { Button } from '../ui/button';
import ProjectsPage from '../../pages/projects-page';

// Example component showing how to integrate the Projects page
const ProjectsDemo: React.FC = () => {
  const [showProjects, setShowProjects] = React.useState(false);

  if (showProjects) {
    return <ProjectsPage />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Projects Management System</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive project management solution for your roofing business with kanban boards,
          customizable workflows, and detailed project tracking.
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📋 Kanban Boards</h3>
              <p className="text-sm text-muted-foreground">
                Visualize project progress with drag-and-drop kanban boards
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🔄 Custom Workflows</h3>
              <p className="text-sm text-muted-foreground">
                Create multiple workflows for different teams (Sales, Materials, etc.)
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">💰 Insurance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track insurance information, claims, and policy details
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">📊 Project Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Monitor project statistics, values, and performance metrics
              </p>
            </div>
          </div>
        </div>

        <Button size="lg" onClick={() => setShowProjects(true)}>
          Open Projects Management
        </Button>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            This system includes sample data and uses localStorage for persistence. Ready for
            Supabase integration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectsDemo;
