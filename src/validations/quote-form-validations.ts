import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const addQuoteFormSchema = z.object({
  quote_number: z.number().min(1, 'Invoice number is required'),
  customer_id: z.number(),
  service_id: z.number(),
  quote_status_id: z.number(),
  quote_date: z.date(),
  expiration_date: z.date(),
  public_note: z.string().optional(),
  private_note: z.string().optional(),
  measurement_note: z.string().optional(),
  // Add the line items array
  line_items: z
    .array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        qty: z.number().min(1, 'Quantity must be at least 1'), // Ensure quantity is positive
        amount: z.number().positive(), // Ensure amount is positive
        subtotal: z.number().positive(), // Added subtotal to the schema
      })
    )
    .min(1, "At least one line item is required.") // Enforce at least one item
    .optional(), // Allow for optional line items
});
