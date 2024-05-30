import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import { urlSchema } from './urlSchema.js';
import { prisma } from '$lib/server/prisma';

export const load = async () => {
	const form = await superValidate(zod(urlSchema));
	const getArticles = async () => {
		const articles = await prisma.article.findMany({
			where: {
				AND: [{ deleted: false }, { name: { not: null } }]
			},
			include: {
				Unit: true,
				Category: true,
				Manufacturer: true
			}
		});

		return JSON.stringify(articles);
	};
	
	const categories = await prisma.category.findMany();
	const manufacturers = await prisma.manufacturer.findMany();
	const units = await prisma.unit.findMany();

	return { form, categories, manufacturers, units, articles: await getArticles() };
};

export const actions = {
	safeUrl: async ({ request }) => {
		const form = await superValidate(request, zod(urlSchema));
		if (!form.valid) return fail(400, { form });
		await prisma.article.create({ data: form.data });
		return { form };
	}
};
