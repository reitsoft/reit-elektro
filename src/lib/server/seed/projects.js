import { prisma } from '../prisma.js';

export default async () => {
	await prisma.project.upsert({
		where: { ident: "20231501" },
		create: {
			name: 'Wohnung Sanierung',
			statusId: 2,
      customerId: 3,
      ident: "20231501",
      priority: ""
		},
		update: {}
	});

	await prisma.project.upsert({
		where: { ident: "20231502" },
		create: {
			name: 'Haus Neubau',
			statusId: 3,
      customerId: 4,
      ident: "20231502",
      priority: ""
		},
		update: {}
	});
}

