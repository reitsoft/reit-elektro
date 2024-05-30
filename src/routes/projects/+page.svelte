<script>
	import {
		A,
		Badge,
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
	const { projects } = data;
</script>

<div class="mb-4 flex justify-between">
	<Heading size="h3" text="Projekte" />
	<Button class="mx-2 min-w-48" color="green" size="sm" href="/projects/addorupdate"
		>Neues Projekt</Button
	>
</div>

{#if projects && projects.length > 0}
	<Table shadow>
		<TableHead>
			<TableHeadCell>Ident Nr.</TableHeadCell>
			<TableHeadCell>Projekt</TableHeadCell>
			<TableHeadCell>Kunde</TableHeadCell>
			<TableHeadCell>Erstellungsdatum</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Angebotspreis</TableHeadCell>
			<TableHeadCell>Umsatz</TableHeadCell>
			<TableHeadCell><p class="sr-only">Actions</p></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each projects as project}
				<TableBodyRow>
					<TableBodyCell><Badge large border color="dark">{project.ident}</Badge></TableBodyCell>
					<TableBodyCell>{project.name}<br /> {project.description}</TableBodyCell>
					<TableBodyCell
						><A
							href={`/customers/addorupdate/${project.Customer.id}`}
							class="font-medium hover:underline"
							>{project.Customer.name} {project.Customer.company ? ` - ${project.Customer.company}` : ""}</A
						> <br />
						{project.Customer.address}, {project.Customer.city}</TableBodyCell
					>
					<TableBodyCell>{project.createdAt.toLocaleString()}</TableBodyCell>
					<TableBodyCell>{project.Status.name}</TableBodyCell>
					<TableBodyCell>{project.quotedPrice} €</TableBodyCell>
					<TableBodyCell>{project.revenue} €</TableBodyCell>
					<TableBodyCell class="flex justify-end">
						<ButtonGroup>
							<Button size="xs" href={`/projects/addorupdate/${project.id}`}
								>Daten</Button
							>
							<Button size="xs" href={`/projects/quotation/${project.id}`}
								>Kosten</Button
							>
						</ButtonGroup>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{:else}
	<Heading size="h6" text="Keine Projekte vorhanden." />
{/if}
