<script>
	import '../app.pcss';
	import { Svrollbar } from 'svrollbar';
	import { Navbar } from '$lib';
</script>

<Svrollbar />
<div class="sticky top-0">
	<Navbar />
</div>

<div class="contaimer mx-48 pt-[28px]">
	<slot />
</div>
