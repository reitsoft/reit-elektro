import { prisma } from '../prisma.js';

export default async () => {
	await prisma.status.upsert({
		where: { name: 'Anfrage erhalten' },
		create: {
			name: 'Anfrage erhalten',
			description: "Neue Anfrage ist eingegangen.",
		},
		update: {}
	});

	await prisma.status.upsert({
		where: { name: 'Angebot erstellt' },
		create: {
			name: 'Angebot erstellt',
			description: "Planung und Angebot erstellt und versendet.",
		},
		update: {}
	});
}

