import { prisma } from './prisma.js';
import manufacturer from './seed/manufacturer.js';
import categories from './seed/categories.js';
import units from './seed/units.js';
import articles from './seed/articles.js';
import customers from './seed/customers.js';
import statuses from './seed/statuses.js';
import projects from './seed/projects.js';
import projektArticles from './seed/projectArticles.js';

async function main() {
	manufacturer();
	categories();
	units();
	statuses();
	customers();
	projects();
	articles();
	projektArticles();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
