import { z } from 'zod';

// Base status validation schema
export const statusFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Status name is required')
    .min(2, 'Status name must be at least 2 characters')
    .max(50, 'Status name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9\s\-_\.]+$/,
      'Status name can only contain letters, numbers, spaces, hyphens, underscores, and dots'
    )
    .transform((val) => val.trim()),

  description: z
    .string()
    .max(200, 'Description must not exceed 200 characters')
    .optional()
    .transform((val) => (val ? val.trim() : undefined))
});

// Type inference for the form schema
export type StatusFormData = z.infer<typeof statusFormSchema>;

// Validation schema for status type selection
export const statusTypeSchema = z.enum(['invoice', 'quote', 'quote_request'], {
  required_error: 'Status type is required',
  invalid_type_error: 'Invalid status type selected'
});

// Combined schema for creating/updating status with type
export const statusWithTypeSchema = z.object({
  type: statusTypeSchema,
  name: statusFormSchema.shape.name,
  description: statusFormSchema.shape.description
});

export type StatusWithTypeData = z.infer<typeof statusWithTypeSchema>;

// Validation for bulk operations
export const bulkStatusActionSchema = z.object({
  action: z.enum(['delete'], {
    required_error: 'Action is required'
  }),
  statusIds: z
    .array(z.number().positive('Invalid status ID'))
    .min(1, 'At least one status must be selected')
    .max(20, 'Cannot perform bulk action on more than 20 statuses at once'),
  type: statusTypeSchema
});

export type BulkStatusActionData = z.infer<typeof bulkStatusActionSchema>;

// Validation for status filtering and searching
export const statusFilterSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['all', 'invoice', 'quote', 'quote_request']).optional().default('all'),
  sortBy: z.enum(['name', 'created_at', 'updated_at', 'type']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});

export type StatusFilterData = z.infer<typeof statusFilterSchema>;

// Validation for status usage check
export const statusUsageSchema = z.object({
  type: statusTypeSchema,
  id: z.number().positive('Invalid status ID')
});

export type StatusUsageData = z.infer<typeof statusUsageSchema>;

// Error messages for better UX
export const STATUS_VALIDATION_MESSAGES = {
  name: {
    required: 'Status name is required',
    minLength: 'Status name must be at least 2 characters',
    maxLength: 'Status name must not exceed 50 characters',
    pattern:
      'Status name can only contain letters, numbers, spaces, hyphens, underscores, and dots',
    duplicate: 'A status with this name already exists'
  },
  description: {
    maxLength: 'Description must not exceed 200 characters'
  },
  type: {
    required: 'Status type is required',
    invalid: 'Please select a valid status type'
  },
  general: {
    networkError: 'Network error. Please check your connection and try again.',
    serverError: 'Server error. Please try again later.',
    unknownError: 'An unexpected error occurred. Please try again.'
  }
} as const;

// Helper function to get user-friendly error messages
export const getValidationErrorMessage = (error: z.ZodError): string => {
  const firstError = error.errors[0];
  if (!firstError) return STATUS_VALIDATION_MESSAGES.general.unknownError;

  return firstError.message;
};

// Helper function to validate status name uniqueness
export const validateStatusNameUniqueness = (
  name: string,
  existingNames: string[],
  currentName?: string
): string | null => {
  const trimmedName = name.trim().toLowerCase();
  const currentNameLower = currentName?.trim().toLowerCase();

  // Skip validation if name hasn't changed
  if (currentNameLower && trimmedName === currentNameLower) {
    return null;
  }

  const existingNamesLower = existingNames.map((n) => n.trim().toLowerCase());

  if (existingNamesLower.includes(trimmedName)) {
    return STATUS_VALIDATION_MESSAGES.name.duplicate;
  }

  return null;
};

// Pre-defined common status names for suggestions
export const COMMON_STATUS_NAMES = {
  invoice: [
    'Draft',
    'Sent',
    'Pending',
    'Paid',
    'Overdue',
    'Cancelled',
    'Refunded',
    'Partial Payment'
  ],
  quote: [
    'Draft',
    'Sent',
    'Pending Review',
    'Accepted',
    'Rejected',
    'Expired',
    'Converted',
    'Under Review'
  ],
  quote_request: [
    'New Request',
    'In Review',
    'Scheduled',
    'Completed',
    'Cancelled',
    'Follow Up Required',
    'Quote Sent',
    'Converted to Quote'
  ]
} as const;

// Type-safe function to get status suggestions
export const getStatusSuggestions = (
  type: 'invoice' | 'quote' | 'quote_request'
): readonly string[] => {
  return COMMON_STATUS_NAMES[type];
};

// Validation for importing statuses from CSV/Excel
export const importStatusSchema = z.object({
  statuses: z
    .array(
      z.object({
        type: statusTypeSchema,
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional()
      })
    )
    .min(1, 'At least one status must be provided')
    .max(100, 'Cannot import more than 100 statuses at once')
});

export type ImportStatusData = z.infer<typeof importStatusSchema>;
