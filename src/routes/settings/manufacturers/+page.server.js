import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async () => {
	const manufacturers = await prisma.manufacturer.findMany();
	const articles = await prisma.article.findMany();

	manufacturers.forEach((m) => {
		const anzahl = articles.filter((article) => article.manufacturerId === m.id).length;
		m.anzahl = anzahl;
	});

	return {
		manufacturers
	};
};

export const actions = {
	create: async ({ request }) => {
		const { name, web } = Object.fromEntries(await request.formData());

		try {
			await prisma.manufacturer.create({
				data: {
					name,
					web
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
			await prisma.manufacturer.delete({
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
