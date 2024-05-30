import { prisma } from '../prisma.js';

export default async () => {
	await prisma.customer.upsert({
		where: { name: 'Alex Reit' },
		create: {
			name: 'Alex Reit',
			company: 'ZF Friedrichshafen AG',
			city: '88082 Friedrichshafen',
			address: 'Ehlerstr. 50',
			phone: '+49 123123123',
			email: 'alex@zf.com',
			comment: 'test comment'
		},
		update: {}
	});

	await prisma.customer.upsert({
		where: { name: 'Luljeta Reit' },
		create: {
			name: 'Luljeta Reit',
			company: 'Haare AG',
			city: '88074 Meckenbeuren',
			address: 'Ernst-Lehmann-Str. 18',
			phone: '+49 111222333',
			email: 'luljeta@haare.com',
			comment: 'comment 123'
		},
		update: {}
	});
};
