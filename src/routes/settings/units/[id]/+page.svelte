<script>
  import { enhance } from '$app/forms'
	import { Label, Input, Button, Heading } from 'flowbite-svelte';

	export let data;

	const { unit } = data;
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-6">
		<Heading class="mb-4" customSize="text-2xl font-semibold">Hersteller bearbeiten</Heading>
		<div class="py-4">
			<form method="POST" action="?/update" use:enhance>
				<Label for="name">Name</Label>
				<Input id="name" name="name" class="w-full" value={unit.name}/>
				<Label for="web" class="mt-4">Abkürzung</Label>
				<Input id="web" name="web" value={unit.short}/>
				<Button class="mt-4 w-full" type="submit">Aktualisieren</Button>
			</form>
		</div>
	</div>
</div>
