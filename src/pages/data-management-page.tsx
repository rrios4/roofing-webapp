import React from 'react';
import { Link } from 'react-router-dom';
import { SettingsIcon, HammerIcon, ChevronRightIcon, TagIcon, ListIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import DefaultPageHeader from '../components/ui/page-header';

interface ManagementSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const managementSections: ManagementSection[] = [
  {
    id: 'statuses',
    title: 'Statuses',
    description: 'Manage status options for invoices, quotes, and quote requests',
    icon: <TagIcon className="h-6 w-6" />,
    path: '/data-management/statuses'
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Manage service types and pricing used in quotes and invoices',
    icon: <HammerIcon className="h-6 w-6" />,
    path: '/data-management/services'
  }
];

export default function DataManagementPage() {
  return (
    <div className="flex-1 space-y-4">
      <DefaultPageHeader
        title="Data Management"
        subheading="Manage system data and configuration settings"
        addItemTextButton='Test'
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {managementSections.map((section) => (
          <Link key={section.id} to={section.path}>
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border hover:border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/100 text-white rounded-lg">{section.icon}</div>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {section.description}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Statuses</CardTitle>
              <ListIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Across all entities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <HammerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Available service types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              <SettingsIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Most recent change</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configuration</CardTitle>
              <TagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">System status</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
