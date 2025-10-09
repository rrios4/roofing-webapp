import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const addInvoiceFormSchema = z.object({
  invoice_number: z.number().min(1, 'Invoice number is required'),
  customer_id: z.number(),
  service_type_id: z.number(), // Note: using service_type_id for invoices
  invoice_status_id: z.number(),
  invoice_date: z.date(),
  issue_date: z.date(),
  due_date: z.date(),
  private_note: z.string().optional(),
  public_note: z.string().optional(),
  cust_note: z.string().optional(), // Customer note field
  sqft_measurement: z.string().optional(),
  // Bill From fields (company info)
  bill_from_street_address: z.string().default('150 Tallant St'),
  bill_from_city: z.string().default('Houston'),
  bill_from_state: z.string().default('TX'),
  bill_from_zipcode: z.string().default('77076'),
  bill_from_email: z.string().optional(),
  // Bill To fields (customer billing info)
  bill_to_street_address: z.string().optional(),
  bill_to_city: z.string().optional(),
  bill_to_state: z.string().optional(),
  bill_to_zipcode: z.string().optional(),
  bill_to: z.boolean().default(false), // Flag for custom billing address
  // Line items array
  line_items: z
    .array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        qty: z.number().min(1, 'Quantity must be at least 1'),
        rate: z.number().nonnegative('Rate must be non-negative'),
        amount: z.number().positive('Amount must be positive'),
        sq_ft: z.number().optional(),
        fixed_item: z.boolean().default(false)
      })
    )
    .min(1, 'At least one line item is required.')
    .optional() // Allow for optional line items
});

// Schema for updating an existing invoice
export const updateInvoiceFormSchema = z.object({
  id: z.number(), // Required for updates
  invoice_number: z.number().min(1, 'Invoice number is required'),
  customer_id: z.number(),
  service_type_id: z.number(), // Note: using service_type_id for invoices
  invoice_status_id: z.number(),
  invoice_date: z.date(),
  issue_date: z.date(),
  due_date: z.date(),
  private_note: z.string().optional(),
  public_note: z.string().optional(),
  cust_note: z.string().optional(), // Customer note field
  sqft_measurement: z.string().optional(),
  // Bill From fields (company info)
  bill_from_street_address: z.string().default('150 Tallant St'),
  bill_from_city: z.string().default('Houston'),
  bill_from_state: z.string().default('TX'),
  bill_from_zipcode: z.string().default('77076'),
  bill_from_email: z.string().optional(),
  // Bill To fields (customer billing info)
  bill_to_street_address: z.string().optional(),
  bill_to_city: z.string().optional(),
  bill_to_state: z.string().optional(),
  bill_to_zipcode: z.string().optional(),
  bill_to: z.boolean().default(false), // Flag for custom billing address
  // Line items array
  line_items: z
    .array(
      z.object({
        id: z.number().optional(), // Optional for new line items
        description: z.string().min(1, 'Description is required'),
        qty: z.number().min(1, 'Quantity must be at least 1'),
        rate: z.number().nonnegative('Rate must be non-negative'),
        amount: z.number().positive('Amount must be positive'),
        sq_ft: z.number().optional(),
        fixed_item: z.boolean().default(false)
      })
    )
    .min(1, 'At least one line item is required.')
    .optional()
});
