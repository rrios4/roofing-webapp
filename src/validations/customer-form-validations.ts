import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export const addCustomerFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  customer_type: z.string(),
  email: z.string({ required_error: 'Please type an email to save.' }).email(),
  phone_number: z.string().min(10).max(14).optional(),
  street_address: z.string().optional(),
  city: z.string().min(3).max(50),
  state: z.string().min(2).max(2),
  zipcode: z.string()
});

export const updateCustomerFormSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  customer_type: z.string(),
  email: z.string({ required_error: 'Please type an email to save.' }).email(),
  phone_number: z.string().min(10).max(14),
  street_address: z.string(),
  city: z.string().min(3).max(50),
  state: z.string().min(2).max(2),
  zipcode: z.string()
});
