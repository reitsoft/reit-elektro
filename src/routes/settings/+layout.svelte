<script>
	import { page } from '$app/stores';
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
	import {
		ChartPieSolid,
		GridSolid,
		MailBoxSolid,
		UserSolid,
		ArrowRightToBracketOutline,
		EditOutline
	} from 'flowbite-svelte-icons';
	import { Heading } from '$lib';
	$: activeUrl = $page.url.pathname;
</script>

<!-- <div class="mb-4 flex justify-between">
	<Heading text="Einstellungen" />
</div> -->

<div class="grid grid-cols-12 gap-2">
	<div class="col-span-2">
		<Heading text="Einstellungen" />
		<Sidebar {activeUrl}>
			<SidebarWrapper class="mt-8">
				<SidebarGroup>
          <SidebarItem label="Allgemein" href="/settings">
						<svelte:fragment slot="icon">
							<ChartPieSolid
								class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Kategorien" href="/settings/categories">
						<svelte:fragment slot="icon">
							<ChartPieSolid
								class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Hersteller" href="/settings/manufacturers">
						<svelte:fragment slot="icon">
							<GridSolid
								class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
					<SidebarItem label="Einheiten" href="/settings/units">
						<svelte:fragment slot="icon">
							<MailBoxSolid
								class="h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
							/>
						</svelte:fragment>
					</SidebarItem>
				</SidebarGroup>
			</SidebarWrapper>
		</Sidebar>
	</div>
	<div class="col-span-10 ml-8"><slot /></div>
</div>
