<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import Skeleton from '../Skeleton.svelte';

  interface LoadingBodyProps {
    columns?: Column[];
  }

  /** Inputs */
  const { columns = [] }: LoadingBodyProps = $props();

  let skeletonData = Array.from({ length: 200 }, (_, i) => i);

  const getRowPartNames = (index: number) => {
    return `loading-row loading-row-${index % 2 === 0 ? 'even' : 'odd'}`;
  };

  const getColumnPartNames = (index: number) => {
    return `loading-column loading-column-${index}`;
  };
</script>

{#each skeletonData as { }, iRow}
  <tr class={getRowPartNames(iRow)} part={getRowPartNames(iRow)}>
    {#each columns as column, iCol}
      <td class={getColumnPartNames(iCol)} part={getColumnPartNames(iCol)}>
        <div class="loading-column-value" part="loading-column-value">
          {#if column.type === 'avatar'}
            <div class="loading-column-avatar" part="loading-column-avatar">
              <Skeleton width="40px" borderRadius="50%" height="40px" />
              <Skeleton width="50%" height="calc(var(--table-row-height) * 0.5)" />
            </div>
          {:else}
            <Skeleton width="50%" height="calc(var(--table-row-height) * 0.5)" />
          {/if}
        </div>
      </td>
    {/each}
  </tr>
{/each}

<style>
  .loading-row {
    height: var(--table-row-height);
  }

  .loading-column {
    border-bottom: 1px solid var(--row-border-bottom-color);
    border-top: 1px solid var(--row-border-top-color);
    border-left: 1px solid var(--row-border-left-color);
    border-right: 1px solid var(--row-border-right-color);
    height: 100%;
  }

  .loading-column-value {
    margin-left: 6px;
    height: 100%;
  }

  .loading-column-value {
    padding-left: var(--table-column-margin-left);
  }

  .loading-column-avatar {
    display: flex;
    gap: 6px;
    align-items: center;
  }
</style>
