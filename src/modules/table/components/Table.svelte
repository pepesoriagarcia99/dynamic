<svelte:options customElement="dyn-table" />

<script lang="ts">
  import type { Column } from '../models/Column';
  import Header from './Header.svelte';
  import Row from './Row.svelte';

  // Inputs
  export let columns: Column[] = [];
  export let data: any[] = [];
</script>

<table class="s-table">
  <Header {columns} />

  <tbody>
    {#each data as row}
      <Row  {columns} {row} />
    {/each}
  </tbody>
</table>

<style>
</style>
