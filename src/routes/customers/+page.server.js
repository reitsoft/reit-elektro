import { prisma } from '$lib/server/prisma';

export const load = async () => {
	const customers = await prisma.customer.findMany({
		include: {
			Project: {
        include: {
          Status: true
        }
      }
		}
	});
	// console.log(customers);

	return {
		customers
	};
};
