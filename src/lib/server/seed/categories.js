import { prisma } from '../prisma.js';

export default async () => {
	await prisma.category.upsert({
		where: { name: 'Hutschienengeräte' },
		create: {
			name: 'Hutschienengeräte',
			description: 'Alles für die Hutschiene.'
		},
		update: {}
	});

	await prisma.category.upsert({
		where: { name: 'Leitungen' },
		create: {
			name: 'Leitungen',
			description: 'NYM-Y und sonstige MAntelleitungen.'
		},
		update: {}
	});
}
