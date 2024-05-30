import { z } from 'zod';

export const customerSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(3),
	address: z.string().min(3),
	city: z.string().min(3),
	phone: z.string().min(3),
	email: z.string().email(),
	company: z.string().min(3).optional(),
	comment: z.string().optional()
});
