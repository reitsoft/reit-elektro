import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const POST = async ({request}) => {
	const body = await request.json();
	// console.log(body)
	await prisma.projectArticles.create({ data: body })
	return json({ message: 'OK', body }, { status: 201 });
}

export const PUT = async ({ request }) => {
	const body = await request.json();
	// console.log(body)
	await prisma.projectArticles.update({
		where: {
			id: body.articleId
		},
		data: {
			amount: body.amount
		}
	});
	return json({ message: 'OK', body }, { status: 201 });
};

export const DELETE = async ({ request }) => {
	const body = await request.json();
	// console.log({delete: body})
	await prisma.projectArticles.delete({
		where: {
			id: body.id
		}
	});
	return json({ message: 'OK', body }, { status: 201 });
};
