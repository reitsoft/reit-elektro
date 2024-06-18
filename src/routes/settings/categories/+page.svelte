<script>
	import {
		A,
		P,
		ButtonGroup,
		Label,
		Input,
		Button,
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import TrashBinOutline from 'flowbite-svelte-icons/TrashBinOutline.svelte'
	import EditOutline from 'flowbite-svelte-icons/EditOutline.svelte'

	export let data;

	$: ({ categories } = data);
	// console.log(categories);
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-8">
		<Heading class="mb-4" customSize="text-2xl font-semibold">Kategorien</Heading>
		<div class="py-4 pr-10 w-full">
			<Table shadow>
				<TableHead>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Beschreibung</TableHeadCell>
					<TableHeadCell class="flex justify-center">Artikel</TableHeadCell>
					<TableHeadCell></TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each categories as { id, name, description, anzahl }}
						<TableBodyRow>
							<TableBodyCell><P class="font-semibold" size="lg" color="text-gray-500 dark:text-gray-400">{name}</P></TableBodyCell>
							<TableBodyCell>{description}</TableBodyCell>
							<TableBodyCell><div class="flex justify-center">{anzahl}</div></TableBodyCell>
							<TableBodyCell
								>
								<div class="flex justify-end">
									<ButtonGroup>

										<form method="POST" action="?/delete&id={id}">
										<Button outline color="yellow" href={`categories/${id}`}><EditOutline /></Button>
											<Button outline type="submit" color="red"><TrashBinOutline /></Button>
										</form>
									</ButtonGroup>
								</div>
									</TableBodyCell
							>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	</div>
	<div class="col-span-4">
		<form method="POST" action="?/create">
			<Heading class="mb-4" customSize="text-2xl font-semibold">Neue Kategorie</Heading>
			<Label for="name">Name</Label>
			<Input id="name" name="name" class="w-full" />
			<Label for="description" class="mt-4">Beschreibung</Label>
			<Input id="description" name="description" />
			<Button class="mt-4 w-full" type="submit">Spiechern</Button>
		</form>
	</div>
</div>
