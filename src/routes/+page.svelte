<script>
	import { DashboardCard } from '$lib';

	export let data;
	const { customersCount, projectsCount, projectsDoneCount, articlesCount } = data;

	const daten = [
		{ title: 'Kunden', info: customersCount, text: 'Anzahl Kunden' },
		{ title: 'Projekte Gesamt', info: projectsCount, text: 'Alle Projekte.' },
		{ title: 'Laufende Projekte', info: projectsDoneCount, text: 'Projekte in bearbeitung.' },
		{ title: 'Artikel', info: articlesCount, text: 'Alle Artikel.' }
	];
</script>

<div class="grid grid-cols-4 gap-4">
	{#each daten as data}
		<DashboardCard {data} />
	{/each}
</div>
