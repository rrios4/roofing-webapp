import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HammerIcon, DollarSignIcon, FileTextIcon, CheckIcon, LoaderIcon } from 'lucide-react';

// UI Components
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { SheetFooter, SheetClose } from '../ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '../ui/form';

// Validations, Hooks, and Types
import {
  updateServiceFormSchema,
  UpdateServiceFormData
} from '../../validations/service-form-validations';
import { useServiceManagement } from '../../hooks/useServiceManagement';
import { Service } from '../../types/db_types';

interface EditServiceFormProps {
  setOpen: (open: boolean) => void;
  service: Service;
}

export default function EditServiceForm({ setOpen, service }: EditServiceFormProps) {
  const { updateService, isUpdating } = useServiceManagement();

  const form = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceFormSchema),
    defaultValues: {
      id: service.id,
      name: service.name || '',
      description: service.description || '',
      default_price: service.default_price || ''
    }
  });

  // Update form when service changes
  useEffect(() => {
    form.reset({
      id: service.id,
      name: service.name || '',
      description: service.description || '',
      default_price: service.default_price || ''
    });
  }, [service, form]);

  const onSubmit = async (values: UpdateServiceFormData) => {
    try {
      // Clean up empty strings to undefined for optional fields
      const cleanData = {
        ...values,
        description: values.description?.trim() || undefined,
        default_price: values.default_price?.trim() || undefined
      };

      await updateService.mutateAsync(cleanData);

      // Close sheet on success
      setOpen(false);
    } catch (error) {
      // Error handling is done in the hook
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 h-full px-1 pb-6">
            {/* Service Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <HammerIcon className="h-4 w-4" />
                    Service Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Roof Repair, Gutter Installation"
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>Enter a clear, descriptive name for the service</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe what this service includes, materials used, typical duration, etc."
                      className="w-full min-h-[100px] resize-none"
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide details about what this service includes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Default Price */}
            <FormField
              control={form.control}
              name="default_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSignIcon className="h-4 w-4" />
                    Default Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., 150, $300 per sq ft, Contact for quote"
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Enter a price, rate, or pricing description. Can be a number (150) or
                    text ($300 per sq ft)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info about editing */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-900">Edit Service</span>
              </div>
              <p className="text-sm text-amber-700">
                Changes will be applied immediately and will affect future quotes and invoices using
                this service.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <SheetFooter className="px-4 pt-4 gap-2 border-t">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isUpdating}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
              {isUpdating ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Update Service
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </div>
  );
}
