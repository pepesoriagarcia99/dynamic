<script lang="ts">
  import type { ColumnCompiled } from '../../models/column/Column';
  import type { RowEvent } from '../../models/event/RowEvent';
  import Row from './Row.svelte';

  interface BodyProps {
    primaryKey: string;
    columns: ColumnCompiled[];
    data: any[];
  }

  const { primaryKey, columns, data }: BodyProps = $props();

  let selectedIds: any[] = $state([]);
  function onRowClick(event: RowEvent) {
    // if (contextMenuConfiguration().has) {
    //   event.preventDefault();
    // }


    console.log('🚀 ~ onRowClick ~ event:', event);

    const key = event.row[primaryKey];
    selectedIds.push(key);
    console.log('🚀 ~ onRowClick ~ selectedIds:', selectedIds);
  }

//   $effect(() => {
//     console.log('🚀 ~ selectedIds:', selectedIds);
//   });
</script>

{#each data as row, index (row[primaryKey])}
  <Row {index} {columns} {row} selected={selectedIds.includes(row[primaryKey] as any)} ontoggle={onRowClick} />
{/each}

<style>
</style>
