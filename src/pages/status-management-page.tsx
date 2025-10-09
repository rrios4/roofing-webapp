import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  TagIcon,
  FileTextIcon,
  HammerIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DownloadIcon,
  UploadIcon,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
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

import { useStatusManagement, useFetchStatusUsage } from '../hooks/useAPI/use-status-management';
import { StatusType, UnifiedStatus } from '../services/api/status-service';
import {
  statusFormSchema,
  StatusFormData,
  statusTypeSchema,
  COMMON_STATUS_NAMES,
  getStatusSuggestions,
  STATUS_VALIDATION_MESSAGES
} from '../validations/status-management-validations';

// Helper functions for status types
const formatTypeName = (type: StatusType): string => {
  switch (type) {
    case 'invoice':
      return 'Invoice';
    case 'quote':
      return 'Quote';
    case 'quote_request':
      return 'Quote Request';
    default:
      return type;
  }
};

const getStatusTypeIcon = (type: StatusType) => {
  switch (type) {
    case 'invoice':
      return <FileTextIcon className="h-4 w-4 text-blue-600" />;
    case 'quote':
      return <TagIcon className="h-4 w-4 text-green-600" />;
    case 'quote_request':
      return <HammerIcon className="h-4 w-4 text-purple-600" />;
    default:
      return <FileTextIcon className="h-4 w-4" />;
  }
};

const getStatusTypeColor = (type: StatusType): string => {
  switch (type) {
    case 'invoice':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'quote':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'quote_request':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

// Types for the component
interface StatusFormProps {
  status?: UnifiedStatus;
  onSubmit: (data: StatusFormData & { type: StatusType }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

interface StatusUsageDialogProps {
  status: UnifiedStatus;
  isOpen: boolean;
  onClose: () => void;
}

interface DeleteConfirmDialogProps {
  status: UnifiedStatus;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Status form component for sheets
const StatusFormSheet: React.FC<StatusFormProps> = ({
  status,
  onSubmit,
  onCancel,
  isLoading,
  mode
}) => {
  const [selectedType, setSelectedType] = useState<StatusType>(status?.type || 'invoice');

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      name: status?.name || '',
      description: status?.description || ''
    }
  });

  const handleSubmit = async (data: StatusFormData) => {
    await onSubmit({ ...data, type: selectedType });
  };

  const suggestions = useMemo(() => {
    return getStatusSuggestions(selectedType);
  }, [selectedType]);

  const handleSuggestionClick = (suggestionName: string) => {
    form.setValue('name', suggestionName);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Status Type Selection */}
        {mode === 'create' && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Status Type</label>
              <p className="text-xs text-muted-foreground font-thin">
                Choose which type of records this status will be used for
              </p>
            </div>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as StatusType)}>
              <SelectTrigger className="w-full text-left py-8">
                <SelectValue placeholder="Select status type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="hover:cursor-pointer" value="invoice">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-blue-100 rounded">
                      <FileTextIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Invoice Status</div>
                      <div className="text-xs text-muted-foreground">
                        For billing and payment tracking
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem className="hover:cursor-pointer" value="quote">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-1 bg-green-100 rounded">
                      <TagIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Quote Status</div>
                      <div className="text-xs text-muted-foreground">
                        For estimate and proposal tracking
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem className="hover:cursor-pointer" value="quote_request">
                  <div className="flex items-center gap-3 py-2">
                    <div className="p-1 bg-purple-100 rounded">
                      <HammerIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">Quote Request Status</div>
                      <div className="text-xs text-muted-foreground">
                        For lead and inquiry management
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Status Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status Name <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Pending Review, In Progress, Completed..."
                  {...field}
                  className="text-base"
                />
              </FormControl>
              <FormDescription className="text-xs font-thin">
                Choose a clear, descriptive name (2-50 characters). This will be visible throughout
                the system.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Suggestions */}
        {mode === 'create' && suggestions.length > 0 && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Popular {formatTypeName(selectedType)} Statuses
              </label>
              <p className="text-xs text-muted-foreground mt-1 font-thin">
                Click any suggestion to use it as your status name
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.slice(0, 8).map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="justify-start text-left text-xs h-auto py-2 px-3">
                  <div className="truncate">{suggestion}</div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional: Describe when this status should be used, what it represents, or any special conditions..."
                  className="resize-none text-base min-h-[80px]"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs font-thin">
                Help your team understand when to use this status (max 200 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preview Section */}
        {mode === 'create' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Preview</label>
            <div className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                {getStatusTypeIcon(selectedType)}
                <span className="font-medium">{form.watch('name') || 'Status Name'}</span>
                <Badge variant="secondary" className={getStatusTypeColor(selectedType)}>
                  {formatTypeName(selectedType)}
                </Badge>
              </div>
              {form.watch('description') && (
                <p className="text-sm text-muted-foreground mt-2">{form.watch('description')}</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'create' ? (
              <>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Status
              </>
            ) : (
              <>
                <CheckCircleIcon className="mr-2 h-4 w-4" />
                Update Status
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Status form component for dialogs (kept for edit functionality)
const StatusForm: React.FC<StatusFormProps> = ({ status, onSubmit, onCancel, isLoading, mode }) => {
  const [selectedType, setSelectedType] = useState<StatusType>(status?.type || 'invoice');

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      name: status?.name || '',
      description: status?.description || ''
    }
  });

  const handleSubmit = async (data: StatusFormData) => {
    await onSubmit({ ...data, type: selectedType });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter status name..." {...field} />
              </FormControl>
              <FormDescription>A unique name for this status (2-50 characters)</FormDescription>
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
                  placeholder="Enter a brief description..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional description to clarify when this status should be used
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

// Status usage dialog component
const StatusUsageDialog: React.FC<StatusUsageDialogProps> = ({ status, isOpen, onClose }) => {
  const { data: usage, isLoading } = useFetchStatusUsage(status.type, status.id, isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            Status Usage: {status.name}
          </DialogTitle>
          <DialogDescription>
            View how this status is currently being used in the system
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Current Usage</p>
              <p className="text-sm text-muted-foreground">Records using this status</p>
            </div>
            <div className="text-right">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{usage?.count ?? 0}</div>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Status Information</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type:</dt>
                <dd className="capitalize">{status.type.replace('_', ' ')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Created:</dt>
                <dd>{new Date(status.created_at).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last Updated:</dt>
                <dd>{new Date(status.updated_at).toLocaleDateString()}</dd>
              </div>
              {status.description && (
                <div className="pt-2">
                  <dt className="text-muted-foreground mb-1">Description:</dt>
                  <dd className="text-sm">{status.description}</dd>
                </div>
              )}
            </dl>
          </div>

          {usage && usage.count > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  This status is currently in use and cannot be deleted. You can still edit its name
                  and description.
                </p>
              </div>
            </div>
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

// Delete confirmation dialog
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  status,
  isOpen,
  onConfirm,
  onCancel,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-destructive" />
            Delete Status
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{status.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">
              Please ensure this status is not being used by any {status.type.replace('_', ' ')}s
              before deleting it.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}
            Delete Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main status management page component
export default function StatusManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | StatusType>('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [usageDialogOpen, setUsageDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<UnifiedStatus | null>(null);

  // Hooks
  const {
    allStatuses,
    groupedStatuses,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    createStatus,
    updateStatus,
    deleteStatus,
    refetchAll,
    resetCreateState,
    resetUpdateState,
    resetDeleteState
  } = useStatusManagement();

  // Filter statuses based on search and tab
  const filteredStatuses = useMemo(() => {
    let statuses = allStatuses;

    // Filter by tab
    if (selectedTab !== 'all') {
      statuses = statuses.filter((status) => status.type === selectedTab);
    }

    // Filter by search term
    if (searchTerm) {
      statuses = statuses.filter(
        (status) =>
          status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return statuses;
  }, [allStatuses, selectedTab, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: allStatuses.length,
      invoice: (groupedStatuses as any).invoice?.length || 0,
      quote: (groupedStatuses as any).quote?.length || 0,
      quote_request: (groupedStatuses as any).quote_request?.length || 0
    };
  }, [allStatuses, groupedStatuses]);

  // Event handlers
  const handleCreateStatus = async (data: StatusFormData & { type: StatusType }) => {
    try {
      const response = await createStatus(data.type, {
        name: data.name,
        description: data.description
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setCreateDialogOpen(false);
      resetCreateState();
    } catch (error) {
      console.error('Error creating status:', error);
      // Don't rethrow - let the error be handled by the mutation error state
    }
  };

  const handleUpdateStatus = async (data: StatusFormData & { type: StatusType }) => {
    if (!selectedStatus) return;

    try {
      const response = await updateStatus(selectedStatus.type, selectedStatus.id, {
        name: data.name,
        description: data.description
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setEditDialogOpen(false);
      setSelectedStatus(null);
      resetUpdateState();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteStatus = async () => {
    if (!selectedStatus) return;

    try {
      const response = await deleteStatus(selectedStatus.type, selectedStatus.id);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete status');
      }

      setDeleteDialogOpen(false);
      setSelectedStatus(null);
      resetDeleteState();
    } catch (error) {
      console.error('Error deleting status:', error);
    }
  };

  const openEditDialog = (status: UnifiedStatus) => {
    setSelectedStatus(status);
    setEditDialogOpen(true);
  };

  const openUsageDialog = (status: UnifiedStatus) => {
    setSelectedStatus(status);
    setUsageDialogOpen(true);
  };

  const openDeleteDialog = (status: UnifiedStatus) => {
    setSelectedStatus(status);
    setDeleteDialogOpen(true);
  };

  // Status type icon helper
  const getStatusTypeIcon = (type: StatusType) => {
    switch (type) {
      case 'invoice':
        return <FileTextIcon className="h-4 w-4" />;
      case 'quote':
        return <TagIcon className="h-4 w-4" />;
      case 'quote_request':
        return <HammerIcon className="h-4 w-4" />;
      default:
        return <TagIcon className="h-4 w-4" />;
    }
  };

  // Status type color helper
  const getStatusTypeColor = (type: StatusType) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'quote':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'quote_request':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Format type name for display
  const formatTypeName = (type: StatusType) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="flex-1 space-y-4 mb-8">
      <PageHeader
        title="Status Management"
        subheading="Manage statuses for invoices, quotes, and quote requests"
        showActionButton={true}
        actionButtonText="Create Status"
        actionButtonIcon={<PlusIcon className="h-4 w-4 mr-1" />}
        useSheet={false}
        onActionClick={() => setCreateDialogOpen(true)}
      />

      {/* Error Display */}
      {error || createError || updateError || deleteError ? (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircleIcon className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">
              {String(
                error || createError || updateError || deleteError || 'An unexpected error occurred'
              )}
            </p>
          </div>
        </div>
      ) : null}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Statuses</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoice Statuses</CardTitle>
            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.invoice}</div>
            <p className="text-xs text-muted-foreground">For invoice management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quote Statuses</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quote}</div>
            <p className="text-xs text-muted-foreground">For quote tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Request Statuses</CardTitle>
            <HammerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.quote_request}</div>
            <p className="text-xs text-muted-foreground">For request workflow</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Status Management</CardTitle>
              <CardDescription>
                Create, edit, and organize statuses for your business workflow
              </CardDescription>
            </div>
            <Button variant="outline" onClick={refetchAll} disabled={isLoading}>
              <RefreshCwIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search statuses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Types</TabsTrigger>
              <TabsTrigger value="invoice">Invoices</TabsTrigger>
              <TabsTrigger value="quote">Quotes</TabsTrigger>
              <TabsTrigger value="quote_request">Requests</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4">
              {/* Status List */}
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : filteredStatuses.length === 0 ? (
                <div className="text-center py-8">
                  <TagIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No statuses found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm
                      ? 'Try adjusting your search terms.'
                      : 'Get started by creating your first status.'}
                  </p>
                  {!searchTerm && (
                    <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Status
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredStatuses.map((status) => (
                    <div
                      key={`${status.type}-${status.id}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusTypeIcon(status.type)}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{status.name}</h4>
                              <Badge
                                variant="secondary"
                                className={getStatusTypeColor(status.type)}>
                                {formatTypeName(status.type)}
                              </Badge>
                            </div>
                            {status.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {status.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openUsageDialog(status)}>
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(status)}>
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(status)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Status Sheet */}
      <Sheet open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <SheetContent className="w-full sm:max-w-xl p-0" side="right">
          <ScrollArea className="h-full">
            <div className="px-6 py-6 space-y-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {/* <PlusIcon className="h-5 w-5" /> */}
                  Create New Status
                </SheetTitle>
                <SheetDescription>
                  Add a new status to organize your business workflow. Choose the appropriate type
                  and provide a descriptive name.
                </SheetDescription>
              </SheetHeader>

              <StatusFormSheet
                mode="create"
                onSubmit={handleCreateStatus}
                onCancel={() => setCreateDialogOpen(false)}
                isLoading={isCreating}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Edit Status Dialog */}
      {selectedStatus && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Status</DialogTitle>
              <DialogDescription>Make changes to "{selectedStatus.name}" status</DialogDescription>
            </DialogHeader>
            <StatusForm
              mode="edit"
              status={selectedStatus}
              onSubmit={handleUpdateStatus}
              onCancel={() => setEditDialogOpen(false)}
              isLoading={isUpdating}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Usage Dialog */}
      {selectedStatus && (
        <StatusUsageDialog
          status={selectedStatus}
          isOpen={usageDialogOpen}
          onClose={() => setUsageDialogOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedStatus && (
        <DeleteConfirmDialog
          status={selectedStatus}
          isOpen={deleteDialogOpen}
          onConfirm={handleDeleteStatus}
          onCancel={() => setDeleteDialogOpen(false)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
