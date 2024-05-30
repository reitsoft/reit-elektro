<script>
	import { Label, Input, Select, Helper, Button } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { Heading } from '$lib';

	export let data;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		resetForm: false,
		applyAction: false,
		onResult({ result }) {
			if (result.type === 'success') {
				window.location.href = '/customers';
			}
		}
	});
</script>

<Heading size="h3" text={!$form.id ? 'Kunde erstellen' : 'Kunde bearbeiten'} />
<div class="w-[360px]">
	<form novalidate method="POST" action="?/createOrUpdate" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />

		<div class="mb-4">
			<Label for="name" class="mb-2 block">Name</Label>
			<Input
				id="name"
				name="name"
				type="text"
				placeholder="Kundenname..."
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
			<Label for="company" class="mb-2 block">Firma</Label>
			<Input
				id="company"
				name="company"
				placeholder=""
				bind:value={$form.company}
				{...$constraints.company}
			/>
			{#if $errors.company}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.company}</span>
				</Helper>
			{/if}
		</div>

		<div class="mb-4">
			<Label for="address" class="mb-2 block">Straße Nr.</Label>
			<Input id="address" name="address" placeholder="" bind:value={$form.address} {...$constraints.address} />
			{#if $errors.address}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.address}</span>
				</Helper>
			{/if}
		</div>

    <div class="mb-4">
			<Label for="city" class="mb-2 block">PLZ Ort</Label>
			<Input id="city" name="city" placeholder="" bind:value={$form.city} {...$constraints.city} />
			{#if $errors.city}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.city}</span>
				</Helper>
			{/if}
		</div>

    <div class="mb-4">
			<Label for="phone" class="mb-2 block">Telefon</Label>
			<Input id="phone" name="phone" placeholder="" bind:value={$form.phone} {...$constraints.phone} />
			{#if $errors.phone}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.phone}</span>
				</Helper>
			{/if}
		</div>

    <div class="mb-4">
			<Label for="email" class="mb-2 block">E-Mail</Label>
			<Input id="email" name="email" placeholder="" bind:value={$form.email} {...$constraints.email} />
			{#if $errors.email}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.email}</span>
				</Helper>
			{/if}
		</div>

    <div class="mb-4">
			<Label for="comment" class="mb-2 block">Kommentar</Label>
			<Input id="comment" name="comment" placeholder="" bind:value={$form.comment} {...$constraints.comment} />
			{#if $errors.comment}
				<Helper class="mt-2" color="red">
					<span class="font-medium">{$errors.comment}</span>
				</Helper>
			{/if}
		</div>
		
		<Button type="submit">Speichern</Button>
	</form>
</div>
