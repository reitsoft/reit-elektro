<script>
	import { page } from '$app/stores';
	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger
	} from 'flowbite-svelte';
	$: activeUrl = $page.url.pathname;
	let activeClass =
		'text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent';
	let nonActiveClass =
		'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
</script>

<div class="relative">
	<Navbar class="sticky start-0 top-0 z-20 w-full border-b px-10 py-2.5 sm:px-4">
		<NavBrand href="/">
			<!-- <img
				src="/images/flowbite-svelte-icon-logo.svg"
				class="me-3 h-6 sm:h-9"
				alt="Flowbite Logo"
			/> -->
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>REIT-Elektro</span
			>
		</NavBrand>
		<NavHamburger />
		<NavUl {activeUrl} {activeClass} {nonActiveClass}>
			<NavLi href="/" active={true}>Dashboard</NavLi>
			<NavLi href="/customers">Kunden</NavLi>
			<NavLi href="/projects">Projekte</NavLi>
			<NavLi href="/articles">Artikel</NavLi>
			<NavLi href="/settings">Einstellungen</NavLi>
		</NavUl>
	</Navbar>
</div>

