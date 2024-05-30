import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { customerSchema } from '../../customerSchema.js';
import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const id = Number(params.id);
	let customer;
	if (id) {
		customer = await prisma.customer.findUnique({
			where: {
				id
			}
		});

		if (id && !customer) throw error(404, 'Customer not found.');
	}

	const form = await superValidate(customer, zod(customerSchema));
	return { form };
};

export const actions = {
	createOrUpdate: async ({ request }) => {
		const form = await superValidate(request, zod(customerSchema));
		if (!form.valid) return fail(400, { form });

		if (!form.data.id) {
			await prisma.customer.create({ data: form.data });
		} else {
			await prisma.customer.update({
				where: { id: form.data.id },
				data: form.data
			});
		}
		return { form };
	}
	// deleteArticle: async ({ request }) => {
	// 	const form = await superValidate(request, zod(articleSchema));
	// 	await prisma.article.update({
	// 		where: { id: form.data.id },
	// 		data: { deleted: true }
	// 	});
	// }
};
