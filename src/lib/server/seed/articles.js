import { prisma } from '../prisma.js';

export default async () => {
	await prisma.article.upsert({
		where: { name: 'LS B16' },
		create: {
			name: 'LS B16',
			description: 'Leitungsschutzschalter B16A',
			manufacturerId: 2,
			categoryId: 2,
			price: 1.98,
			vpe: 1,
			unitId: 2,
			url: "",
			createdAt: new Date()
		},
		update: {}
	});

	await prisma.article.upsert({
		where: { name: 'PS3/12FI' },
		create: {
			name: 'PS3/12FI',
			description: 'Phasenschiene für FI und 8 LS',
			manufacturerId: 2,
			categoryId: 2,
			price: 6.98,
			vpe: 1,
			unitId: 2,
			url: "",
			createdAt: new Date()
		},
		update: {}
	});
}
