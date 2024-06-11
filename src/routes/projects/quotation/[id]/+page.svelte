<script>
	import {
		Button,
		ButtonGroup,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { Heading, EUR } from '$lib';

	import { invalidateAll } from '$app/navigation';

	export let data;
	$: ({ project, projectArticles, articles } = data);
	// const articlesJson = JSON.parse(articles);
	// console.log(projectArticles);
	// $: console.log(projectArticles);

	$: totalPrice = projectArticles.reduce((a, b) => a + b.projectPrice * b.amount, 0);
	// $: console.log(totalPrice)

	async function createProjectArticle(article) {
		const found = projectArticles.find((obj) => obj.articleId === article.id);
		// console.log({found})

		if (found) {
			await updateAmount(found, 'plus');
		} else {
			const data = {
				projectId: project.id,
				articleId: article.id,
				amount: 1,
				// comment "",
				projectPrice: article.price
			};

			try {
				const response = await fetch('/api/projectArticles', {
					method: 'POST',
					headers: {
						'Content-type': 'application/json; charset=UTF-8'
					},
					body: JSON.stringify(data)
				});
				invalidateAll();

				if (response.ok) {
					console.log('New ProjectArticle created!');
				} else {
					console.error('Failed to create projectArticle', response.statusText);
				}
			} catch (error) {
				console.error('Error when creating projectArticle:', error);
			}
		}
	}

	async function updateAmount(article, action) {
		const newAmount = action === 'minus' ? Math.max(article.amount - 1, 0) : article.amount + 1;

		const data = {
			articleId: article.id,
			amount: newAmount
		};

		try {
			const response = await fetch('/api/projectArticles', {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify(data)
			});
			// invalidateAll()

			if (response.ok) {
				const articleIndex = projectArticles.findIndex((item) => item.id === article.id);
				if (articleIndex !== -1) {
					projectArticles[articleIndex].amount = newAmount;
				}
				console.log('Update Amount OK!');
			} else {
				console.error('Failed to update amount:', response.statusText);
			}
		} catch (error) {
			console.error('Error when updating amount:', error);
		}
	}

	async function deleteProjectArticle(id) {
		try {
			const response = await fetch('/api/projectArticles', {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				},
				body: JSON.stringify({ id })
			});
			invalidateAll();

			if (response.ok) {
				console.log('ProjectArticle deleted!');
			} else {
				console.error('Failed to delete ProjectArticle:', response.statusText);
			}
		} catch (error) {
			console.error('Error when deleting ProjectArticle:', error);
		}
	}
</script>

<div class="mb-4 flex justify-between">
	<Heading size="h3" text="Angebot" />
	<div class="flex">
		<Heading size="h5" text="Katalog" />
	</div>
</div>

<div class="grid h-[calc(100vh-150px)] grid-cols-12 gap-2 overflow-y-auto">
	<div class="col-span-7">
		{#if projectArticles && projectArticles.length > 0}
			<Table shadow>
				<TableHead>
					<TableHeadCell>Anzahl</TableHeadCell>
					<TableHeadCell>Name / Beschreibung</TableHeadCell>
					<TableHeadCell>EInzelpreis / VPE</TableHeadCell>
					<TableHeadCell>Gesamtpreis</TableHeadCell>
					<TableHeadCell></TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each projectArticles as article}
						<TableBodyRow>
							<TableBodyCell>
								<ButtonGroup>
									<Button
										outline
										color="dark"
										on:click={() => {
											updateAmount(article, 'minus');
										}}>-</Button
									>
									<Button outline color="dark">
										{article.amount}
									</Button>
									<Button
										outline
										color="dark"
										on:click={() => {
											updateAmount(article, 'plus');
										}}>+</Button
									>
								</ButtonGroup>
								<p class="block font-sans text-base font-semibold leading-normal antialiased"></p>
							</TableBodyCell>
							<TableBodyCell>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{article.name}
								</p>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{article.description ? article.description : ''}
								</p>
							</TableBodyCell>
							<TableBodyCell>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{EUR.format(article.projectPrice)}
								</p>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{`${article.vpe} ${article.Unit.name}`}
								</p>
							</TableBodyCell>
							<TableBodyCell>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{EUR.format(article.amount * article.projectPrice)}
								</p>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{`${article.vpe * article.amount} ${article.Unit.name}`}
								</p>
							</TableBodyCell>
							<TableBodyCell>
								<Button
									color="red"
									outline
									size="xs"
									on:click={() => {
										deleteProjectArticle(article.id);
									}}>Löschen</Button
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
				<tfoot>
					<tr class="border-t bg-white last:border-b-0 dark:border-gray-700 dark:bg-gray-800">
						<td class="px-6 py-3"><a href={`/api/pdf/${project.id}`} target="_blank" class="button">PDF erstellen</a></td>
						<td class="px-6 py-3"></td>
						<th class="px-6 py-3 text-lg font-medium">Total</th>
						<td
							class="whitespace-nowrap px-6 py-4 text-lg font-medium text-gray-900 dark:text-white"
							>{EUR.format(totalPrice)}</td
						>
					</tr>
				</tfoot>
			</Table>
		{:else}
			<Heading size="h6" text="Keine Artikel vorhanden." />
		{/if}
	</div>
	<div class="col-span-5">
		{#if articles && articles.length > 0}
			<Table shadow>
				<TableHead>
					<TableHeadCell>Name / Beschreibung</TableHeadCell>
					<TableHeadCell>Preis / VPE</TableHeadCell>
					<TableHeadCell></TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each articles as article}
						<TableBodyRow>
							<TableBodyCell>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{article.name}
								</p>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{article.description ? `${article.description}` : ''}
								</p>
							</TableBodyCell>
							<TableBodyCell>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{EUR.format(article.price)}
								</p>
								<p class="block font-sans text-base font-semibold leading-normal antialiased">
									{`${article.vpe} ${article.Unit.name}`}
								</p>
							</TableBodyCell>
							<TableBodyCell>
								<Button
									color="green"
									outline
									size="xs"
									on:click={() => {
										createProjectArticle(article);
									}}>Hinzufügen</Button
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{:else}
			<Heading size="h6" text="Keine Artikel vorhanden." />
		{/if}
	</div>
</div>
