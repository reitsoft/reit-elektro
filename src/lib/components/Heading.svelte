<script>
  import { Heading } from 'flowbite-svelte';

  export let text ="Default Heading";
  export let size ="h3";
</script>

<Heading tag={size} class="font-semibold ">{text}</Heading>