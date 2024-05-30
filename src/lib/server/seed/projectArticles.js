import { prisma } from '../prisma.js';

export default async () => {
	await prisma.projectArticles.upsert({
		where: { id: 1 },
		create: {
			projektId: 1,
			articleId: 1,
      amount: 12,
      comment: "Test Projekt1 Artikel 1",
      price: 1.98
		},
		update: {}
	});

  await prisma.projectArticles.upsert({
		where: { id: 2 },
		create: {
			projektId: 1,
			articleId: 2,
      amount: 2,
      comment: "Test Rojekt1 Artikel 2",
      price: 6.98
		},
		update: {}
	});

	await prisma.projectArticles.upsert({
		where: { id: 3 },
		create: {
			projektId: 1,
			articleId: 2,
      amount: 2,
      comment: "Test Rojekt2 Artikel 1",
      price: 6.98
		},
		update: {}
	});
}

