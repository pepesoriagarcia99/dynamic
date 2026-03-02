<script lang="ts">
  import type { Column } from '../../models/column/Column';
  import Skeleton from '../Skeleton.svelte';

  interface LoadingBodyProps {
    columns?: Column[];
    pageSize?: number;
  }

  /** Inputs */
  const { columns, pageSize = 100 }: LoadingBodyProps = $props();

  /** States */
  const colClasses = $derived(columns?.map((_, iCol) => `loading-column loading-column-${iCol}`) ?? []);
</script>

{#each { length: pageSize } as _, iRow (iRow)}
  {@const rowClass = iRow % 2 === 0 ? 'loading-row row-even' : 'loading-row row-odd'}

  <tr class={rowClass} part={rowClass}>
    {#each columns as column, iCol (iCol)}
      <td class={colClasses[iCol]} part={colClasses[iCol]}>
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
