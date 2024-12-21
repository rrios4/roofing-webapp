import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const addQuoteFormSchema = z.object({
  quote_number: z.number(),
  customer_id: z.number(),
  service_id: z.number(),
  quote_status_id: z.number(),
  quote_date: z.date(),
  expiration_date: z.date(),
  note: z.string(),
  customer_note: z.string(),
  measurement_note: z.string()
});
