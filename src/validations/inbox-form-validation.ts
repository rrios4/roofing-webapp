import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const addRequestFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone_number: z.string(),
    customer_typeID: z.string(),
    est_request_status_id: z.string(),
    requested_date: z.date(),
    service_type_id: z.string(),
    streetAddress: z.string(),
    city: z.string(),
    state: z.string(),
    zipcode: z.string()
})