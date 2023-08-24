import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const addCustomerFormSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    customerType: z.string(),
    email: z.string({required_error: "Please select an email to display.",}).email().optional(),
    phone_number: z.string().optional(),
    street_address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipcode: z.string().optional()
})