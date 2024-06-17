import { prisma } from '../prisma.js';

export default async () => {
	await prisma.project.upsert({
		where: { ident: "20231501" },
		create: {
			name: 'Wohnung Sanierung',
			statusId: 1,
      customerId: 1,
      ident: "20231501",
      priority: ""
		},
		update: {}
	});

	await prisma.project.upsert({
		where: { ident: "20231502" },
		create: {
			name: 'Haus Neubau',
			statusId: 2,
      customerId: 2,
      ident: "20231502",
      priority: ""
		},
		update: {}
	});
}

