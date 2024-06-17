<script>
	import {
		A,
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

	export let data;

	$: ({ manufacturers } = data);
	// console.log(data);
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-8">
		<Heading class="mb-4" customSize="text-2xl font-semibold">Hersteller</Heading>
		<div class="flex py-4">
			<Table shadow>
				<TableHead>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Webseite</TableHeadCell>
					<TableHeadCell>Artikel</TableHeadCell>
					<TableHeadCell></TableHeadCell>
				</TableHead>
				<TableBody tableBodyClass="divide-y">
					{#each manufacturers as { id, name, web, anzahl }}
						<TableBodyRow>
							<TableBodyCell>{name}</TableBodyCell>
							<TableBodyCell><A href={web} target="_black">{web}</A></TableBodyCell>
							<TableBodyCell>{anzahl}</TableBodyCell>
							<TableBodyCell
								><ButtonGroup>
									<Button>Bearbeiten</Button>
									<form method="POST" action={`?/delete&id=${id}`}>
										<Button type="submit" color="red">löschen</Button>
									</form>
								</ButtonGroup></TableBodyCell
							>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
			<!-- <P class="mb-3 font-semibold" size="lg" color="text-gray-500 dark:text-gray-400"
				>Name
				<A href="www.web.de">www.web.de</A>
			</P> -->
		</div>
	</div>
	<div class="col-span-4">
		<form method="POST" action="?/create">
			<Heading class="mb-4" customSize="text-2xl font-semibold">Neuer Hersteller</Heading>
			<Label for="name">Name</Label>
			<Input id="name" name="name" class="w-full" />
			<Label for="web" class="mt-4">Webseite</Label>
			<Input id="web" name="web" />
			<Button class="mt-4 w-full" type="submit">Spiechern</Button>
		</form>
	</div>
</div>
