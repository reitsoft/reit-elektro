import { z } from 'zod';

export const articleSchema = z.object({
	id: z.coerce.number().optional(),
	name: z.string().min(3),
	description: z.string().min(3),
	manufacturerId: z.coerce.number(),
	categoryId: z.coerce.number(),
	vpe: z.coerce.number(),
	unitId: z.coerce.number(),
	price: z.coerce.number(),
	url: z.string().default(""),
	image: z.instanceof(File).optional()
});