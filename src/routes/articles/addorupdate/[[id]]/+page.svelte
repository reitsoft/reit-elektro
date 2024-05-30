<script>
	import { Label, Input, Select, Helper, Button } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Heading } from '$lib';

	export let data;
	const { categories, manufacturers, units } = data;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		resetForm: false,
		applyAction: false,
		onResult({ result }) {
			if (result.type === 'success') {
				window.location.href = '/articles';
			}
		}
	});
</script>

<Heading size="h3" text={!$form.id ? 'Artikel erstellen' : 'Artikel bearbeiten'} />
<div class="w-[360px]">
	<form novalidate method="POST" action="?/createOrUpdate" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />

		<div class="mb-4">
			<Label for="name" class="mb-2 block">Artikelbezeichnung</Label>
			<Input
				id="name"
				name="name"
				type="text"
				placeholder="Name des Artikels..."
				bind:value={$form.name}
				{...$constraints.name}
			/>
			{#if $errors.name}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.name}</span>
				</Helper>
			{/if}
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

		<div class="mb-4">
			<Label for="url" class="mb-2 block">Webseite</Label>
			<Input id="url" name="url" placeholder="" bind:value={$form.url} {...$constraints.url} />
			{#if $errors.url}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.url}</span>
				</Helper>
			{/if}
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
			<Label>
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

		<div class="mb-4">
			<Label for="price" class="mb-2 block">Preis</Label>
			<Input id="price" name="price" bind:value={$form.price} {...$constraints.price} />
			{#if $errors.price}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.price}</span>
				</Helper>
			{/if}
		</div>

		<Button type="submit">Speichern</Button>
		{#if $form.id}
			<Button type="submit" formaction="?/deleteArticle" color="red">Löschen</Button>
		{/if}
	</form>
</div>
