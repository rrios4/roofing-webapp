import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DownloadIcon,
  EyeIcon
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PageHeader } from '../components/ui/page-header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';

import {
  useCustomerTypeManagement,
  useFetchCustomerTypeUsage
} from '../hooks/useAPI/use-customer-type-management';
import { CustomerType } from '../types/db_types';
import {
  createCustomerTypeSchema,
  updateCustomerTypeSchema,
  CreateCustomerTypeFormData,
  UpdateCustomerTypeFormData,
  createCustomerTypeResolver,
  updateCustomerTypeResolver,
  defaultCreateCustomerTypeValues,
  getDefaultUpdateCustomerTypeValues
} from '../validations/customer-type-form-validations';

// Helper functions
const formatCustomerTypeName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const getCustomerTypeColor = (name: string): string => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800'
  ];

  // Use name hash to consistently assign colors
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Component interfaces
interface CustomerTypeFormProps {
  customerType?: CustomerType;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

interface CustomerTypeUsageDialogProps {
  customerType: CustomerType;
  isOpen: boolean;
  onClose: () => void;
}

interface DeleteConfirmDialogProps {
  customerType: CustomerType;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Customer Type Form Component
const CustomerTypeForm: React.FC<CustomerTypeFormProps> = ({
  customerType,
  onSubmit,
  onCancel,
  isLoading,
  mode
}) => {
  const form = useForm<any>({
    resolver: mode === 'create' ? createCustomerTypeResolver : updateCustomerTypeResolver,
    defaultValues:
      mode === 'create'
        ? defaultCreateCustomerTypeValues
        : customerType
          ? getDefaultUpdateCustomerTypeValues({
              id: customerType.id,
              name: customerType.name,
              description: customerType.description || null
            })
          : defaultCreateCustomerTypeValues
  });

  const handleSubmit = async (data: any) => {
    try {
      const submitData = mode === 'edit' && customerType ? { ...data, id: customerType.id } : data;
      await onSubmit(submitData);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Type Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Residential, Commercial, Industrial"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Enter a unique name for this customer type (2-50 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[200px]"
                  placeholder="Describe this customer type and its characteristics..."
                  rows={3}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Provide additional context about this customer type (max 255 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
            {isLoading ? (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : mode === 'create' ? (
              'Create Customer Type'
            ) : (
              'Update Customer Type'
            )}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

// Customer Type Usage Dialog
const CustomerTypeUsageDialog: React.FC<CustomerTypeUsageDialogProps> = ({
  customerType,
  isOpen,
  onClose
}) => {
  const { data: usage, isLoading } = useFetchCustomerTypeUsage(customerType.id, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <EyeIcon className="h-5 w-5 text-blue-600" />
            <span>Customer Type Usage</span>
          </DialogTitle>
          <DialogDescription>Usage details for "{customerType.name}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : usage ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Customers using this type:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {usage.customerCount}
                </Badge>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {usage.canDelete ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {usage.canDelete ? 'Can be deleted' : 'Cannot be deleted'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {usage.canDelete
                    ? 'This customer type is not in use and can be safely deleted.'
                    : 'This customer type is currently assigned to customers and cannot be deleted.'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Unable to load usage information.</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  customerType,
  isOpen,
  onConfirm,
  onCancel,
  isLoading
}) => {
  const { data: usage } = useFetchCustomerTypeUsage(customerType.id, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangleIcon className="h-5 w-5 text-red-600" />
            <span>Delete Customer Type</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{customerType.name}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {usage && !usage.canDelete && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <XCircleIcon className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Cannot delete</span>
              </div>
              <p className="text-sm text-red-700">
                This customer type is assigned to {usage.customerCount} customer
                {usage.customerCount !== 1 ? 's' : ''}. Please reassign or remove these customers
                before deleting.
              </p>
            </div>
          )}

          {usage && usage.canDelete && (
            <p className="text-sm text-gray-600">
              This action cannot be undone. The customer type will be permanently removed from the
              system.
            </p>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading || (usage ? !usage.canDelete : false)}>
            {isLoading ? (
              <>
                <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Customer Type'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Customer Types Management Page
const CustomerTypesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isUsageDialogOpen, setIsUsageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    customerTypes,
    isLoading,
    error,
    createCustomerType,
    updateCustomerType,
    deleteCustomerType,
    refetchCustomerTypes,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError
  } = useCustomerTypeManagement();

  // Filter customer types based on search
  const filteredCustomerTypes = useMemo(() => {
    if (!searchTerm.trim()) return customerTypes;

    const search = searchTerm.toLowerCase();
    return customerTypes.filter(
      (type) =>
        type.name.toLowerCase().includes(search) ||
        (type.description && type.description.toLowerCase().includes(search))
    );
  }, [customerTypes, searchTerm]);

  // Event handlers
  const handleCreateCustomerType = async (data: CreateCustomerTypeFormData) => {
    try {
      await createCustomerType(data);
    } catch (error) {
      console.error('Create customer type error:', error);
    }
  };

  const handleUpdateCustomerType = async (data: UpdateCustomerTypeFormData) => {
    try {
      await updateCustomerType(data);
      setIsEditSheetOpen(false);
      setSelectedCustomerType(null);
    } catch (error) {
      console.error('Update customer type error:', error);
    }
  };

  const handleDeleteCustomerType = async () => {
    if (!selectedCustomerType) return;

    try {
      await deleteCustomerType(selectedCustomerType.id);
      setIsDeleteDialogOpen(false);
      setSelectedCustomerType(null);
    } catch (error) {
      console.error('Delete customer type error:', error);
    }
  };

  const handleEditClick = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setIsEditSheetOpen(true);
  };

  const handleUsageClick = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setIsUsageDialogOpen(true);
  };

  const handleDeleteClick = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="w-full mx-auto pb-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Customer Types"
        subheading="Manage customer types to categorize and organize your clients"
        actionButtonText="Add Customer Type"
        actionButtonIcon={<PlusIcon className="mr-2 h-4 w-4" />}
        useSheet={true}
        sheetTitle="Create Customer Type"
        sheetDescription="Add a new customer type to categorize your clients"
        SheetContentBody={({ setOpen }: { setOpen: (open: boolean) => void }) => (
          <CustomerTypeForm
            mode="create"
            onSubmit={async (data) => {
              await handleCreateCustomerType(data);
              setOpen(false);
            }}
            onCancel={() => setOpen(false)}
            isLoading={isCreating}
          />
        )}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Types</p>
                <p className="text-2xl font-bold">{customerTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <SearchIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredCustomerTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{customerTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Types List</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchCustomerTypes()}
                disabled={isLoading}>
                <RefreshCwIcon className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customer types by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Error Display */}
          {(error || createError || updateError || deleteError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangleIcon className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                {error || createError || updateError || deleteError}
              </p>
            </div>
          )}

          {/* Customer Types Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCustomerTypes.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No customer types found' : 'No customer types yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first customer type'}
              </p>
              {!searchTerm && (
                <p className="mt-2 text-sm text-gray-500">
                  Use the "Add Customer Type" button above to get started.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomerTypes.map((customerType) => (
                <Card key={customerType.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getCustomerTypeColor(customerType.name)}>
                            {formatCustomerTypeName(customerType.name)}
                          </Badge>
                        </div>
                        {customerType.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {customerType.description}
                          </p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUsageClick(customerType)}>
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View Usage
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(customerType)}>
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(customerType)}
                            className="text-red-600 hover:text-red-700">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {customerType.id}</span>
                      <span>{new Date(customerType.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Customer Type Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Customer Type</SheetTitle>
            <SheetDescription>Update the selected customer type details</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            {selectedCustomerType && (
              <CustomerTypeForm
                mode="edit"
                customerType={selectedCustomerType}
                onSubmit={handleUpdateCustomerType}
                onCancel={() => {
                  setIsEditSheetOpen(false);
                  setSelectedCustomerType(null);
                }}
                isLoading={isUpdating}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Usage Dialog */}
      {selectedCustomerType && (
        <CustomerTypeUsageDialog
          customerType={selectedCustomerType}
          isOpen={isUsageDialogOpen}
          onClose={() => {
            setIsUsageDialogOpen(false);
            setSelectedCustomerType(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedCustomerType && (
        <DeleteConfirmDialog
          customerType={selectedCustomerType}
          isOpen={isDeleteDialogOpen}
          onConfirm={handleDeleteCustomerType}
          onCancel={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCustomerType(null);
          }}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CustomerTypesPage;
