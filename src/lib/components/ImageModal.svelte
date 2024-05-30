<script>
  import { Button, Modal } from "flowbite-svelte"
	export let name;
  export let image;
	export let openModal = false;
</script>

<Modal title={name} bind:open={openModal} size="lg" autoclose>
  <img src={image} alt="" />
  <svelte:fragment slot="footer">
    <Button>I accept</Button>
    <Button color="alternative">Decline</Button>
  </svelte:fragment>
</Modal>
