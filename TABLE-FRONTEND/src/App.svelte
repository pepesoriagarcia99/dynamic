<script lang="ts">
  import './app.css';

  import Header from './shared/Header.svelte';
  import TableComplex from './pages/TableComplex.svelte';
  import Controls from './pages/Controls.svelte';
  import AdvanceFilter from './pages/AdvanceFilter.svelte';
  import TableSimple from './pages/TableSimple.svelte';

  const menuItems = [
    { key: 'controls', component: Controls, label: 'Controls' },
    { key: 'table_complex', component: TableComplex, label: 'Complex table' },
    { key: 'table_simple', component: TableSimple, label: 'Simple table' },
    { key: 'advanceFilter', component: AdvanceFilter, label: 'Advance Filter' },
    
  ];

  let Component = $state<any>(menuItems[0].component);

  function handleMenuSelect(e: any) {
    Component = e.component;
  }
</script>

<main>
  <Header items={menuItems} onSelect={handleMenuSelect} />

  <div class="content">
    <Component />
  </div>
</main>

<style>
  .content {
    margin-left: 7rem; /* Espacio para el menú lateral */
  }
</style>
