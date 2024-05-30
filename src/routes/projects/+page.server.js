import { prisma } from '$lib/server/prisma';

export const load = async () => {
	const projects = await prisma.project.findMany({
		include: {
			Status: true,
			Customer: true
		}
	});

	return {
		projects
	};
};
