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
	import { Heading } from '$lib';

	export let data;
	const { customers } = data;
</script>

<div class="mb-4 flex justify-between">
	<Heading size="h3" text="Kunden" />
	<div class="flex">
		<Button class="mx-2 min-w-48" color="green" size="sm" href="/customers/addorupdate"
			>Kunde hinzufügen</Button
		>
	</div>
</div>

{#if customers && customers.length > 0}
	<Table shadow>
		<TableHead>
			<TableHeadCell>Name /Firma</TableHeadCell>
			<TableHeadCell>Adresse</TableHeadCell>
			<TableHeadCell>Kontakt</TableHeadCell>
			<TableHeadCell>Kommentar</TableHeadCell>
			<TableHeadCell>Projekte</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each customers as customer}
				<TableBodyRow>
					<TableBodyCell>{customer.name} <br /> {customer.company}</TableBodyCell>
					<TableBodyCell>{customer.address} <br /> {customer.city}</TableBodyCell>
					<TableBodyCell>{customer.phone} <br /> {customer.email}</TableBodyCell>
					<TableBodyCell>{customer.comment}</TableBodyCell>
					<TableBodyCell>{customer.Project.length}</TableBodyCell>
					<TableBodyCell class="flex justify-end">
						<ButtonGroup>
							<Button size="xs" href={`/customers/addorupdate/${customer.id}`}>Bearbeiten</Button>
							<Button size="xs" href={`/customers/projects/${customer.id}`}>Projekte</Button>
						</ButtonGroup>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{:else}
	<Heading size="h6" text="Keine Artikel vorhanden." />
{/if}
