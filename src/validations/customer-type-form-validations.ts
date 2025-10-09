import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Create Customer Type Form Schema
export const createCustomerTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Customer type name is required')
    .min(2, 'Customer type name must be at least 2 characters')
    .max(50, 'Customer type name must not exceed 50 characters')
    .trim()
    .refine(
      (value) => /^[a-zA-Z0-9\s\-_&()]+$/.test(value),
      'Customer type name can only contain letters, numbers, spaces, and basic punctuation'
    ),
  description: z
    .string()
    .max(255, 'Description must not exceed 255 characters')
    .optional()
    .or(z.literal(''))
});

// Update Customer Type Form Schema
export const updateCustomerTypeSchema = z.object({
  id: z.number().positive('Invalid customer type ID'),
  name: z
    .string()
    .min(1, 'Customer type name is required')
    .min(2, 'Customer type name must be at least 2 characters')
    .max(50, 'Customer type name must not exceed 50 characters')
    .trim()
    .refine(
      (value) => /^[a-zA-Z0-9\s\-_&()]+$/.test(value),
      'Customer type name can only contain letters, numbers, spaces, and basic punctuation'
    ),
  description: z
    .string()
    .max(255, 'Description must not exceed 255 characters')
    .optional()
    .or(z.literal(''))
});

// Form resolvers for React Hook Form
export const createCustomerTypeResolver = zodResolver(createCustomerTypeSchema);
export const updateCustomerTypeResolver = zodResolver(updateCustomerTypeSchema);

// Type definitions for forms
export type CreateCustomerTypeFormData = z.infer<typeof createCustomerTypeSchema>;
export type UpdateCustomerTypeFormData = z.infer<typeof updateCustomerTypeSchema>;

// Default form values
export const defaultCreateCustomerTypeValues: CreateCustomerTypeFormData = {
  name: '',
  description: ''
};

export const getDefaultUpdateCustomerTypeValues = (customerType: {
  id: number;
  name: string;
  description: string | null;
}): UpdateCustomerTypeFormData => ({
  id: customerType.id,
  name: customerType.name,
  description: customerType.description || ''
});
