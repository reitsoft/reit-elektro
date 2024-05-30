import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { articleSchema } from '../../articleSchema.js';
import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const id = Number(params.id);
	let article;
	if (id) {
		article = await prisma.article.findUnique({
			where: {
				id
			},
			include: {
				Unit: true,
				Category: true,
				Manufacturer: true
			}
		});

		if (id && !article) throw error(404, 'Article not found.');

		delete article.image
	}

	const form = await superValidate(article, zod(articleSchema));
	const categories = await prisma.category.findMany();
	const manufacturers = await prisma.manufacturer.findMany();
	const units = await prisma.unit.findMany();

	return { form, categories, manufacturers, units };
};

export const actions = {
	createOrUpdate: async ({ request }) => {
		const form = await superValidate(request, zod(articleSchema));
		if (!form.valid) return fail(400, { form });

		if (!form.data.id) {
			await prisma.article.create({ data: form.data });
		} else {
			await prisma.article.update({
				where: { id: form.data.id },
				data: form.data
			});
		}
		return { form };
	},
	deleteArticle: async ({ request }) => {
		const form = await superValidate(request, zod(articleSchema));
		await prisma.article.update({
			where: { id: form.data.id },
			data: { deleted: true }
		});
	}
};
