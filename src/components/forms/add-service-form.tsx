import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HammerIcon, DollarSignIcon, FileTextIcon, CheckIcon, LoaderIcon } from 'lucide-react';

// UI Components
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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

// Validations and Hooks
import {
  createServiceFormSchema,
  CreateServiceFormData
} from '../../validations/service-form-validations';
import { useServiceManagement } from '../../hooks/useServiceManagement';

interface AddServiceFormProps {
  setOpen: (open: boolean) => void;
}

export default function AddServiceForm({ setOpen }: AddServiceFormProps) {
  const { createService, isCreating } = useServiceManagement();

  const form = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      default_price: ''
    }
  });

  const onSubmit = async (values: CreateServiceFormData) => {
    try {
      // Clean up empty strings to undefined for optional fields
      const cleanData = {
        ...values,
        description: values.description?.trim() || undefined,
        default_price: values.default_price?.trim() || undefined
      };

      await createService.mutateAsync(cleanData);

      // Reset form and close sheet on success
      form.reset();
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

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Service Setup Tips</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1 ml-6">
                <li>• Use clear, professional service names</li>
                <li>• Add detailed descriptions to help with quotes</li>
                <li>• Set default prices for common services</li>
                <li>• You can always edit these details later</li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <SheetFooter className="px-4 pt-4 gap-2 border-t">
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isCreating}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isCreating} className="min-w-[120px]">
              {isCreating ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Create Service
                </>
              )}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </div>
  );
}
