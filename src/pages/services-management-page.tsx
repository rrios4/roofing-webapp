import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  HammerIcon,
  FilterIcon,
  MoreVerticalIcon,
  LoaderIcon
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import { Skeleton } from '../components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import { toast } from '../components/ui/use-toast';

// Services and Types
import { fetchAllServices } from '../services/api/service';
import { Service } from '../types/db_types';
import DefaultPageHeader, { PageHeader } from '../components/ui/page-header';
import { PageBreadcrumb } from '../components/ui/breadcrumb';
import AddServiceForm from '../components/forms/add-service-form';
import EditServiceForm from '../components/forms/edit-service-form';
import { useServiceManagement } from '../hooks/useServiceManagement';

type Props = {};

export default function ServicesManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { deleteService, isDeleting } = useServiceManagement();

  // Fetch services
  const {
    data: services = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['services'],
    queryFn: fetchAllServices
  });

  // Filter services based on search
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format currency helper
  const formatPrice = (price?: string) => {
    if (!price) return 'Not set';
    // If it's already formatted text like "$300 per sq", return as is
    if (price.includes('$') || price.toLowerCase().includes('per')) {
      return price;
    }
    // If it's a number string, format as currency
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(numPrice);
    }
    return price;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-8 w-[80px]" />
        </div>
      ))}
    </div>
  );

  // Service row component for mobile
  const ServiceCard = ({ service }: { service: Service }) => (
    <Card className="mb-4 lg:hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{service.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {service.description || 'No description provided'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedService(service);
                  setIsEditSheetOpen(true);
                }}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelectedService(service);
                  setIsDeleteDialogOpen(true);
                }}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Default Price</span>
            <span className="font-semibold">{formatPrice(service.default_price)}</span>
          </div>
          <Badge variant="secondary">ID: {service.id}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Services</h2>
          <p className="text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Breadcrumb Navigation */}
      <div className="pt-4">
        <PageBreadcrumb
          currentPage="Services Management"
          parentPages={[{ label: 'Data Management', href: '/data-management' }]}
          homeHref="/"
        />
      </div>

      <PageHeader
        title="Services Management"
        subheading="Manage your service types and pricing"
        actionButtonText="Add Service"
        actionButtonIcon={<PlusIcon className="h-4 w-4 mr-2" />}
        sheetTitle="Add New Service"
        sheetDescription="Fill out the form to create a new service type."
        SheetContentBody={AddServiceForm}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <HammerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">Available service types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Pricing</CardTitle>
            <HammerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter((s) => s.default_price && s.default_price.trim() !== '').length}
            </div>
            <p className="text-xs text-muted-foreground">Services have pricing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Pricing</CardTitle>
            <HammerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter((s) => !s.default_price || s.default_price.trim() === '').length}
            </div>
            <p className="text-xs text-muted-foreground">Need pricing setup</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Created</CardTitle>
            <HammerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length > 0 ? 'Recent' : 'None'}</div>
            <p className="text-xs text-muted-foreground">Latest service added</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>All Services ({filteredServices.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-[300px]">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <HammerIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? 'No services match your search criteria.'
                  : 'Get started by creating your first service.'}
              </p>
              <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
                <SheetTrigger asChild>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </SheetTrigger>
              </Sheet>
            </div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="lg:hidden">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Default Price</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <HammerIcon className="h-4 w-4 text-primary" />
                            </div>
                            {service.name}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {service.description || 'No description provided'}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {formatPrice(service.default_price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {service.created_at
                            ? new Date(service.created_at).toLocaleDateString()
                            : 'Unknown'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedService(service);
                                  setIsEditSheetOpen(true);
                                }}>
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedService(service);
                                  setIsDeleteDialogOpen(true);
                                }}>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Service
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl px-6">
          <SheetHeader>
            <SheetTitle>Edit Service</SheetTitle>
            <div className="text-sm text-muted-foreground">
              Update details for "{selectedService?.name}"
            </div>
          </SheetHeader>
          {selectedService && (
            <EditServiceForm setOpen={setIsEditSheetOpen} service={selectedService} />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the service "
              {selectedService?.name}" and remove it from all quotes and invoices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                if (selectedService) {
                  try {
                    await deleteService.mutateAsync(selectedService.id);
                    setIsDeleteDialogOpen(false);
                    setSelectedService(null);
                  } catch (error) {
                    // Error handling is done in the hook
                    console.error('Delete error:', error);
                  }
                }
              }}>
              {isDeleting ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Service'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
