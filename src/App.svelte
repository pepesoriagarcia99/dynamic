<script lang="ts">
  import './app.css';
  import Table from './modules/table/components/Table.svelte';
  import type { Column } from './modules/table/models/Column';

  let columns: Column[] = [
    { key: 'id', name: 'ID', type: String },
    { key: 'name', name: 'Name', type: String },
    { key: 'age', name: 'Age', type: Number },
    { key: 'email', name: 'Email', type: String }
  ];

  let data = [
    { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 25, email: 'bob@example.com' },
    { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' }
  ];

</script>

<main>
  <div class="content">
    <h1>🎨 Dynamic Table - Desarrollo</h1>
    <Table {columns} {data} />
  </div>
</main>

<style>
  .content {
    margin: 2rem;
  }
</style>
