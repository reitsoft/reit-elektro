import { PrismaClient } from '@prisma/client';

global.prisma;

const prisma =
	global.prisma ||
	new PrismaClient({
		// log: [
		// 	{
		// 		emit: 'event',
		// 		level: 'query'
		// 	},
		// 	{
		// 		emit: 'stdout',
		// 		level: 'error'
		// 	},
		// 	{
		// 		emit: 'stdout',
		// 		level: 'info'
		// 	},
		// 	{
		// 		emit: 'stdout',
		// 		level: 'warn'
		// 	}
		// ]
	});

// prisma.$on('query', (e) => {
// 	console.log('Query: ' + e.query);
// 	console.log('Params: ' + e.params);
// 	console.log('Duration: ' + e.duration + 'ms');
// });

if (process.env.NODE_ENV === 'development') {
	global.prisma = prisma;
}

export { prisma };
