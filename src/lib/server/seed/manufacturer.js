import { prisma } from '../prisma.js';

export default async () => {
	await prisma.manufacturer.upsert({
		where: { name: 'ABB' },
		create: {
			name: 'ABB',
			web: 'www.abb.de'
		},
		update: {}
	});

	await prisma.manufacturer.upsert({
		where: { name: 'Hager' },
		create: {
			name: 'Hager',
			web: 'www.hager.de'
		},
		update: {}
	});

	await prisma.manufacturer.upsert({
		where: { name: 'Wago' },
		create: {
			name: 'Wago',
			web: 'www.wago.de'
		},
		update: {}
	});
}

