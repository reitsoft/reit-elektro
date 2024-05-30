import { z } from 'zod';

export const urlSchema = z.object({
	url: z.string().url(),
  description: z.string(),
	manufacturerId: z.coerce.number(),
	categoryId: z.coerce.number(),
	vpe: z.coerce.number().default(1),
	unitId: z.coerce.number(),
});