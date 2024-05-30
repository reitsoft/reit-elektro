import { prisma } from '../prisma.js';

export default async () => {
	await prisma.unit.upsert({
		where: { name: 'Stück' },
		create: {
			name: 'Stück',
			short: 'Stk'
		},
		update: {}
	});

	await prisma.unit.upsert({
		where: { name: 'Meter' },
		create: {
			name: 'Meter',
			short: 'm'
		},
		update: {}
	});
}
