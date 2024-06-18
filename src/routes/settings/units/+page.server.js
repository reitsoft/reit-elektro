import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async () => {
	const units = await prisma.unit.findMany();

	return {
		units
	};
};

export const actions = {
	create: async ({ request }) => {
		const { name, short } = Object.fromEntries(await request.formData());

		try {
			await prisma.unit.create({
				data: {
					name,
					short
				}
			});
		} catch (error) {
			console.error(error);
			return fail(500, {
				message: 'Neues Objekt konnte nicht in der Datenbank gespeichert werden.'
			});
		}
		return { status: 200 };
	},
	delete: async ({ url }) => {
    const id = url.searchParams.get('id');
		if (!id) {
      return fail(400, { message: 'Invalid request' });
      }
    console.log({id});

		try {
			await prisma.unit.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (error) {
			console.error(error);
			return fail(400, { message: 'Could not delete.' });
		}
		return { status: 200 };
	}
};
