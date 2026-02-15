<script lang="ts">
  import './app.css';

  import Header from './shared/Header.svelte';
  import Table from './pages/Table.svelte';
  import Controls from './pages/Controls.svelte';

  const menuItems = [
    { key: 'table', component: Table, label: 'Table' },
    { key: 'controls', component: Controls, label: 'Controls' }
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
