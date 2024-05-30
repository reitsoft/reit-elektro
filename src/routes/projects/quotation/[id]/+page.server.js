import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const projectId = Number(params.id);

	const getProject = async (id) => {
		const result = await prisma.project.findUnique({
			where: {
				id
			},
			include: {
				Status: true,
				Customer: true
			}
		});
		return result;
	};

	const getArticles = async () => {
		const result = await prisma.article.findMany({
			where: { deleted: false },
			include: {
				Unit: true,
				Category: true,
				Manufacturer: true
			}
		});

		const articlesNoImage = result.map((article) => {
			let { image: _, ...rest } = article;
			return rest;
		});
		return articlesNoImage;
	};
	
	const getProjectArticles = async (id) => {
		const result = await prisma.projectArticles.findMany({
			where: {
				projectId: id
			}
		});
		return result;
	};

	const articles = await getArticles();
	const projectArticles = await getProjectArticles(projectId)

const pArticles = projectArticles.map(p => {
	const foundedArticle = articles.find(a => a.id === p.articleId)
	return {...p, ...foundedArticle, id: p.id}
});

// console.log(pArticles)

	return {
		project: await getProject(projectId),
		projectArticles: pArticles,
		articles
	};
};
