import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const category = await prisma.category.findUnique({
		where: {
			id: Number(params.id)
		}
	});

	if (!category) {
		throw error(404, 'Category not found.');
	}
	return { category };
};

export const actions = {
	update: async ({ request, params }) => {
		const { name, description } = Object.fromEntries(await request.formData());
		try {
			await prisma.category.update({
				where: {
					id: Number(params.id)
				},
				data: {
					name,
					description
				}
      });
		} catch (error) {
      console.log(error);
			return fail(500, 'Couuld not update Category.');
		}
    throw redirect(303, '/settings/categories');
		// return { status: 200 };
	}
};
