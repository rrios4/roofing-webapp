import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Project, InsuranceInfo } from '../../types/project-types';
import { useProjects, useWorkflows } from '../../hooks/useProjects';

const createProjectSchema = z.object({
  jobAddress: z.string().min(1, 'Job address is required'),
  customerId: z.number().optional(),
  quoteId: z.number().optional(),
  invoiceId: z.number().optional(),
  statusId: z.string().min(1, 'Status is required'),
  assignedTo: z.string().optional(),
  jobValue: z.number().optional(),
  closeDate: z.string().optional(),
  source: z.string().optional(),
  details: z.string().optional(),
  workflowId: z.string().min(1, 'Workflow is required'),
  hasInsurance: z.boolean(),
  // Insurance fields (conditional)
  insuranceCompany: z.string().optional(),
  policyNumber: z.string().optional(),
  claimNumber: z.string().optional(),
  dateOfLoss: z.string().optional(),
  damageType: z.string().optional(),
  claimAmount: z.number().optional(),
  deductible: z.number().optional(),
  claimDetails: z.string().optional()
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Project>;
}

const sourceOptions = [
  'Website',
  'Referral',
  'Advertisement',
  'Cold Call',
  'Social Media',
  'Other'
];

const damageTypes = [
  'Hail Damage',
  'Wind Damage',
  'Storm Damage',
  'Fire Damage',
  'Water Damage',
  'Other'
];

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  isOpen,
  onClose,
  initialData
}) => {
  const { createProject, isCreating } = useProjects();
  const { workflows, defaultWorkflow } = useWorkflows();
  const [showInsurance, setShowInsurance] = useState(false);

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      jobAddress: initialData?.jobAddress || '',
      customerId: initialData?.customerId,
      quoteId: initialData?.quoteId,
      invoiceId: initialData?.invoiceId,
      statusId: initialData?.statusId || defaultWorkflow?.statuses[0]?.id || '',
      assignedTo: initialData?.assignedTo || '',
      jobValue: initialData?.jobValue,
      closeDate: initialData?.closeDate || '',
      source: initialData?.source || '',
      details: initialData?.details || '',
      workflowId: initialData?.workflowId || defaultWorkflow?.id || '',
      hasInsurance: initialData?.hasInsurance || false,
      // Insurance defaults
      insuranceCompany: initialData?.insuranceInfo?.company || '',
      policyNumber: initialData?.insuranceInfo?.policyNumber || '',
      claimNumber: initialData?.insuranceInfo?.claimNumber || '',
      dateOfLoss: initialData?.insuranceInfo?.dateOfLoss || '',
      damageType: initialData?.insuranceInfo?.damageType || '',
      claimAmount: initialData?.insuranceInfo?.claimAmount,
      deductible: initialData?.insuranceInfo?.deductible,
      claimDetails: initialData?.insuranceInfo?.claimDetails || ''
    }
  });

  const selectedWorkflow = workflows.find((w) => w.id === form.watch('workflowId'));

  const handleSubmit = (data: CreateProjectFormData) => {
    const insuranceInfo: InsuranceInfo | undefined = data.hasInsurance
      ? {
          company: data.insuranceCompany || '',
          policyNumber: data.policyNumber || '',
          claimNumber: data.claimNumber || '',
          dateOfLoss: data.dateOfLoss || '',
          damageType: data.damageType || '',
          claimAmount: data.claimAmount || 0,
          deductible: data.deductible || 0,
          claimDetails: data.claimDetails
        }
      : undefined;

    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      jobAddress: data.jobAddress,
      customerId: data.customerId,
      quoteId: data.quoteId,
      invoiceId: data.invoiceId,
      statusId: data.statusId,
      assignedTo: data.assignedTo,
      jobValue: data.jobValue,
      closeDate: data.closeDate,
      source: data.source,
      details: data.details,
      hasInsurance: data.hasInsurance,
      insuranceInfo,
      workflowId: data.workflowId
    };

    createProject(projectData);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="jobAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State ZIP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workflowId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workflow *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select workflow" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workflows.map((workflow) => (
                              <SelectItem key={workflow.id} value={workflow.id}>
                                {workflow.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="statusId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedWorkflow?.statuses
                              .sort((a, b) => a.order - b.order)
                              .map((status) => (
                                <SelectItem key={status.id} value={status.id}>
                                  {status.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <FormControl>
                          <Input placeholder="Team member name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sourceOptions.map((source) => (
                              <SelectItem key={source} value={source}>
                                {source}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Value ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="closeDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Close Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional project details..." rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Optional Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optional Links</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Customer ID"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quoteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quote ID"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Invoice ID"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card>
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Insurance Information</CardTitle>
                  <FormField
                    control={form.control}
                    name="hasInsurance"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setShowInsurance(checked);
                            }}
                          />
                        </FormControl>
                        <FormLabel>Has Insurance</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>

              {(form.watch('hasInsurance') || showInsurance) && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="insuranceCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Company</FormLabel>
                          <FormControl>
                            <Input placeholder="State Farm, Allstate, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="policyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy/Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Policy number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="claimNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Claim Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Claim number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfLoss"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Loss</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="damageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Damage</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select damage type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {damageTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="claimAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Claim Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deductible"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deductible ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="claimDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Details</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional claim details..." rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              )}
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
