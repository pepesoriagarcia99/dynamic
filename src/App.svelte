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
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    margin-bottom: 20px;
  }

  /* table {
    tb
  }

  dyn-table::part(row) {
    transition: background 0.15s;
    cursor: pointer;
  }

  dyn-table::part(row):hover {
    background: #f5faff;
  }

  dyn-table::part(row-even) {
    background: #ffffff;
  }

  dyn-table::part(row-odd) {
    background: #fcfcfc;
  }

  dyn-table::part(row-selected) {
    background: #cfe6ff;
  } */
</style>
