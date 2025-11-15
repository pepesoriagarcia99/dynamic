<svelte:options customElement="dyn-table" />

<script lang="ts">
  console.log('---------------> Table component loaded!');
</script>

<h1>Esto es una tabla 2</h1>

<style>
  :host {
    display: block;
    width: 100%;
  }
  
  h1 {
    color: #333;
    font-family: Arial, sans-serif;
    padding: 20px;
    background-color: #f0f0f0;
    border: 2px solid #007bff;
    margin: 0;
  }
</style>