import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const addRequestFormSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone_number: z.string(),
    customer_type: z.string(),
    status: z.string(),
    desired_date: z.date(),
    service: z.string(),
    street_address: z.string(),
    city: z.string(),
    state: z.string(),
    zipcode: z.string()
})