import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const unit = await prisma.unit.findUnique({
		where: {
			id: Number(params.id)
		}
	});

	if (!unit) {
		throw error(404, 'Unit not found.');
	}
	return { unit };
};

export const actions = {
	update: async ({ request, params }) => {
		const { name, short } = Object.fromEntries(await request.formData());
		try {
			await prisma.unit.update({
				where: {
					id: Number(params.id)
				},
				data: {
					name,
					short
				}
      });
		} catch (error) {
      console.log(error);
			return fail(500, 'Couuld not update Unit.');
		}
    throw redirect(303, '/settings/units');
		// return { status: 200 };
	}
};
