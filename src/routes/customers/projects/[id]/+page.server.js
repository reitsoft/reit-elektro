import { prisma } from '$lib/server/prisma';

export const load = async ({ params }) => {
	const id = Number(params.id);
	const customer = await prisma.customer.findUnique({
		where: {
			id
		},
		include: {
			Project: {
				include: {
					Status: true
				}
			}
		}
	});

	return {
		customer
	};
};
