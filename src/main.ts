import Table from './components/Table.svelte';

// El Custom Element se registra automáticamente cuando se importa el componente
// pero podemos forzar su registro explícitamente
console.log('Dynamic library loaded - Custom Element dyn-table should be available');

export { Table };
