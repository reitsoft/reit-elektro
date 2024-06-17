import { error, fail, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const manufacturer = await prisma.manufacturer.findUnique({
		where: {
			id: Number(params.id)
		}
	});

	if (!manufacturer) {
		throw error(404, 'Manufacturer not found.');
	}
	return { manufacturer };
};

export const actions = {
	update: async ({ request, params }) => {
		const { name, web } = Object.fromEntries(await request.formData());
		try {
			await prisma.manufacturer.update({
				where: {
					id: Number(params.id)
				},
				data: {
					name,
					web
				}
      });
		} catch (error) {
      console.log(error);
			return fail(500, 'Couuld not update Manufacturer.');
		}
    throw redirect(303, '/settings/manufacturers');
		// return { status: 200 };
	}
};
