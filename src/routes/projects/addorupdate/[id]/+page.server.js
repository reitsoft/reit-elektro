import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const id = Number(params.id);
	const project = await prisma.project.findUnique({
		where: {
			id
		},
		include: {
			Status: true,
			Customer: true
		}
	});

	return {
		project
	};
};
