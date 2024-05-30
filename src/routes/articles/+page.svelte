<script>
	import {
		A,
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Modal,
		Label,
		Input,
		Helper,
		Select
	} from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Heading, EUR } from '$lib';

	export let data;
	const { articles, categories, manufacturers, units } = data;
	const articlesJson = JSON.parse(articles);
	const { form, errors, constraints, enhance } = superForm(data.form);
	// console.log(articles)
	let formModal = false;
	let imageModal = false;
	let selectedArticle = '';

	function openImageModal(article) {
		// console.log(e)
		selectedArticle = article;
		imageModal = true;
	}

	async function scrapeArticles() {
		console.log("Scraping articles ...")
		try {
			const response = await fetch('/api/articles/scrapeAll');
			if (response.ok) {
				console.log("Scrapink OK!")
			} else {
				console.error('Failed to fetch data:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function uint8ArrayToBase64(uint8Array) {
		let binary = '';
		const len = uint8Array.length;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(uint8Array[i]);
		}
		return btoa(binary);
	}

	function getImage(image) {
		const base64String = uint8ArrayToBase64(image);
		return `data:image/jpeg;base64,${base64String}`;
	}
</script>

<div class="mb-4 flex justify-between">
	<Heading size="h3" text="Artikel" />
	<div class="flex">
		<Button class="mx-2 min-w-48" color="green" size="sm" href="/articles/addorupdate"
			>Artikel hinzufügen</Button
		>
		<Button class="mx-2 min-w-48" color="blue" size="sm" on:click={() => (formModal = true)}
			>Artikel hinzufügen</Button
		>
		<Button
			class="mx-2 min-w-48"
			color="green"
			size="sm"
			on:click={() => scrapeArticles()}>Alle Artikel aktualisieren</Button
		>
	</div>
</div>

{#if articlesJson && articlesJson.length > 0}
	<Table shadow>
		<TableHead>
			<TableHeadCell>Bild</TableHeadCell>
			<TableHeadCell>Name / Beschreibung</TableHeadCell>
			<TableHeadCell>Hersteller / Kategorie</TableHeadCell>
			<TableHeadCell>VPE</TableHeadCell>
			<TableHeadCell>Preis</TableHeadCell>
			<TableHeadCell>Link</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each articlesJson as article}
				<TableBodyRow>
					<TableBodyCell on:click={() => openImageModal(article)}>
						<img
							class="-my-3 mx-auto h-[5rem] max-w-24 rounded-lg object-contain object-center py-0.5 shadow-lg"
							src={getImage(article.image.data)}
							alt={article.name}
						/>
					</TableBodyCell>
					<TableBodyCell>
						<p class="block font-sans text-base font-semibold leading-normal antialiased">
							{article.name}
						</p>
						<p class="block font-sans text-base font-semibold leading-normal antialiased">
							{article.description ? `${article.description}` : ''}
						</p>
					</TableBodyCell>
					<TableBodyCell>{article.Manufacturer.name} <br /> {article.Category.name}</TableBodyCell>
					<TableBodyCell>{`${article.vpe} ${article.Unit.name}`}</TableBodyCell>
					<TableBodyCell>{EUR.format(article.price)}</TableBodyCell>
					<TableBodyCell>
						<A
							href={article.url}
							target="_blank"
							textColor="text-primary-600 dark:text-primary-500"
							aClass="inline-flex items-center font-medium  hover:underline"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24px"
								height="24px"
								viewBox="0 0 32 32"
								{...$$props}
							>
								<path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M22 3h7v7m-1.5-5.5L20 12m-3-7H8a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3v-9"
								/>
							</svg>
						</A>
					</TableBodyCell>
					<TableBodyCell class="flex justify-end items-center">
						<Button color="light" size="xs" href={`/articles/addorupdate/${article.id}`}
							>Bearbeiten</Button
						>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{:else}
	<Heading size="h6" text="Keine Artikel vorhanden." />
{/if}

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" novalidate method="POST" action="?/safeUrl" use:enhance>
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Neuer Artikel</h3>
		<div class="mb-4">
			<Label for="url" class="mb-2 block">Webseite</Label>
			<Input
				id="url"
				name="url"
				type="text"
				placeholder="https://www.temo-elektro.de/.."
				bind:value={$form.url}
				{...$constraints.url}
			/>
			{#if $errors.url}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.url}</span>
				</Helper>
			{/if}
		</div>

		<div class="mb-4">
			<Label>
				Kategorie
				<Select
					name="categoryId"
					class="mt-2"
					bind:value={$form.categoryId}
					{...$constraints.categoryId}
				>
					{#each categories as { id, name }}
						<option value={id}>{name}</option>
					{/each}
				</Select>
				{#if $errors.categoryId}
					<Helper class="mt-2" color="red">
						<span class="font-medium">{$errors.categoryId}</span>
					</Helper>
				{/if}
			</Label>
		</div>
		<div class="flex justify-between">
			<div class="mb-4">
				<Label for="vpe" class="mb-2 block">VPE</Label>
				<Input id="vpe" name="vpe" bind:value={$form.vpe} {...$constraints.vpe} />
				{#if $errors.vpe}
					<Helper class="mt-2" color="red">
						<span class="font-medium">{$errors.vpe}</span>
					</Helper>
				{/if}
			</div>

			<div class="mb-4">
				<Label for="unitId" class="mb-2 block">
					Einheit
					<Select name="unitId" class="mt-2" bind:value={$form.unitId} {...$constraints.unitId}>
						{#each units as { id, name }}
							<option value={id}>{name}</option>
						{/each}
					</Select>
					{#if $errors.unitId}
						<Helper class="mt-2" color="red">
							<span class="font-medium">{$errors.unitId}</span>
						</Helper>
					{/if}
				</Label>
			</div>
		</div>

		<div class="mb-4">
			<Label>
				Hersteller
				<Select
					name="manufacturerId"
					class="mt-2"
					bind:value={$form.manufacturerId}
					{...$constraints.manufacturerId}
				>
					{#each manufacturers as { id, name }}
						<option value={id}>{name}</option>
					{/each}
				</Select>
				{#if $errors.manufacturerId}
					<Helper class="mt-2" color="red">
						<span class="font-medium">{$errors.manufacturerId}</span>
					</Helper>
				{/if}
			</Label>
		</div>

		<div class="mb-4">
			<Label for="description" class="mb-2 block">Beschreibung</Label>
			<Input
				id="description"
				name="description"
				placeholder=""
				bind:value={$form.description}
				{...$constraints.description}
			/>
			{#if $errors.description}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.description}</span>
				</Helper>
			{/if}
		</div>
		<Button type="submit" class="w-full1 my-2">Artikel speichern</Button>
	</form>
</Modal>

<Modal title="Bild" bind:open={imageModal} autoclose outsideclose>
	<img
		class="max-h-auto max-w-auto mx-auto rounded-lg object-contain object-center shadow-lg"
		src={getImage(selectedArticle.image.data)}
		alt={selectedArticle.name}
	/>
	<svelte:fragment slot="footer">
		<div class="mx-auto flex">
			<p>{selectedArticle.name}</p>
		</div>
	</svelte:fragment>
</Modal>
