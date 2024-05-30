<script>
	import { Card } from 'flowbite-svelte';

	export let data;
	const { title, info, text } = data;
</script>

<Card padding="none">
	<div class="rounded-lg bg-slate-900 p-8">
		<div class="flex justify-between">
			<h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
				{title}
			</h5>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{info}</h5>
		</div>
		<p class="font-normal leading-tight text-gray-700 dark:text-gray-400">
			{text}
		</p>
	</div>
</Card>
