import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET = async () => {
	const result = await prisma.article.findMany({
		where: {
			AND: [{ deleted: false }, { name: { not: null } }]
		},
		include: {
			Unit: true,
			Category: true,
			Manufacturer: true
		}
	});
	return json(result);
};

export const POST = async ({ request }) => {
	const body = await request.json();
	return json({ message: 'OK', body }, { status: 201 });
};
