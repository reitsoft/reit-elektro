import { prisma } from '$lib/server/prisma';

export const load = async () => {
	const customersCount = await prisma.customer.count();
	const projectsCount = await prisma.project.count();
	const projectsDoneCount = await prisma.project.count();
	const articlesCount = await prisma.article.count();

	return {
		customersCount: await customersCount,
		projectsCount: await projectsCount,
		projectsDoneCount: await projectsDoneCount,
		articlesCount: await articlesCount
	};
};
