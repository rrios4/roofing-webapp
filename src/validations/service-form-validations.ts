import { z } from 'zod';

// Schema for creating a new service
export const createServiceFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Service name is required')
    .max(100, 'Service name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  default_price: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      // Allow either numeric values or text descriptions like "$300 per sq ft"
      const numericValue = parseFloat(val);
      return !isNaN(numericValue) || val.includes('$') || val.toLowerCase().includes('per');
    }, 'Price must be a valid number or descriptive text (e.g., "$300 per sq ft")')
});

// Schema for updating a service (includes id)
export const updateServiceFormSchema = createServiceFormSchema.extend({
  id: z.number().positive('Service ID must be a positive number')
});

// Type exports for form data
export type CreateServiceFormData = z.infer<typeof createServiceFormSchema>;
export type UpdateServiceFormData = z.infer<typeof updateServiceFormSchema>;
