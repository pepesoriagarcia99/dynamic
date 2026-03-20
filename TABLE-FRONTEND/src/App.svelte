<script lang="ts">
  import { onMount } from 'svelte';
  import './app.css';

  import Header from './shared/Header.svelte';
  import TableComplex from './pages/TableComplex.svelte';
  import Controls from './pages/Controls.svelte';
  import AdvanceFilter from './pages/AdvanceFilter.svelte';
  import TableSimple from './pages/TableSimple.svelte';
  import TableExpansive from './pages/TableExpansive.svelte';

  const menuItems = [
    { key: 'table_complex', component: TableComplex, label: 'Complex table' },
    { key: 'table_expansible', component: TableExpansive, label: 'Expansible table' },
    { key: 'table_simple', component: TableSimple, label: 'Simple table' },
    { key: 'controls', component: Controls, label: 'Controls' },
    { key: 'advanceFilter', component: AdvanceFilter, label: 'Advance Filter' }
  ];

  let header: Header | null = $state<Header | null>(null);
  let Component = $state<any>();

  onMount(() => {
    header?.handleClick(menuItems[0]);
  });

  function handleMenuSelect(e: any) {
    Component = e.component;
  }
</script>

<main>
  <Header bind:this={header} items={menuItems} onSelect={handleMenuSelect} />

  <div class="content">
    <Component />
  </div>
</main>

<style>
  .content {
    margin-left: 7rem; /* Espacio para el menú lateral */
  }
</style>
