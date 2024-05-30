<script>
	import { Heading } from '$lib';

	export let data;
	const { customer } = data;
</script>

<div class="mb-4 flex justify-between">
	<Heading size="h3" text="Kundenprojekte" />
</div>

<pre class="text-white">
  {JSON.stringify(customer, undefined, 4)}
</pre>
