<script lang="ts">
  import { onMount } from 'svelte';
  import type { Column } from '../../models/column/Column';
  import type { StoreComponent } from '../../../core/models/StoreComponent';
  import type { SortOrder } from '../../models/event/SortEvent';

  import sortIcon from '../../../../assets/svg/sort.svg';
  import sortTopIcon from '../../../../assets/svg/sort-top.svg';
  import sortBottomIcon from '../../../../assets/svg/sort-bottom.svg';
  import { sortStore } from '../../store/sort-store';

  import Skeleton from '../Skeleton.svelte';
  import { loadingState } from '../../store/loading-state.svelte';

  interface SortProps {
    column: Column;
  }

  /** Inputs */
  let { column }: SortProps = $props();

  /** Values */
  let sortDirection = $state<SortOrder | null>(null);
  const sortStoreComponent: StoreComponent<SortOrder> = sortStore.add(column.key, null);

  const partNamesContainer: string = $derived(`sort-container sort-container-${column.index}`);
  const partNamesButton: string = $derived(`sort-btn sort-btn-${column.index}`);
  const partNamesIcon: string = $derived(
    ['sort-icon', sortDirection !== null ? 'sort-icon-active' : null, `sort-icon-${column.index}`]
      .filter(Boolean)
      .join(' ')
  );

  /** Methods */
  onMount(() => {
    /**
     * TODO: se tendra que monitorizar el valor de filtro en advance filter para saber si mostrar icono activo
    */
    sortStoreComponent.subscribe((event) => {
      sortDirection = event.value ?? null;
    });
  });

  export function toggleSort(event?: MouseEvent) {
    event?.stopPropagation();
    sortStore.onSortToggle(column.key);
  }

  export function getSortDirection(): SortOrder | null {
    return sortDirection;
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  {#if loadingState() === true}
    <Skeleton width="26px" height="26px" />
  {:else}
    <button onclick={(e) => toggleSort(e)} aria-label="Sort" class={partNamesButton} part={partNamesButton}>
      {#if sortDirection === 'asc'}
        <img src={sortTopIcon} alt="sort ascending" class={partNamesIcon} part={partNamesIcon} />
      {:else if sortDirection === 'desc'}
        <img src={sortBottomIcon} alt="sort descending" class={partNamesIcon} part={partNamesIcon} />
      {:else}
        <img src={sortIcon} alt="sort" class={partNamesIcon} part={partNamesIcon} />
      {/if}
    </button>
  {/if}
</div>

<style>
  .sort-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
  }

  .sort-icon {
    width: 22px;
    height: 22px;
    transform: scale(1.2);
    transition: transform 180ms ease-in-out;
    transform-origin: center;
  }

  .sort-icon:hover {
    transform: scale(1.3);
  }

  .sort-icon-active {
    width: 22px;
    height: 22px;
    filter: invert(1) drop-shadow(0 0 0 var(--table-header-sorted-icon-color)) drop-shadow(0 0 0 var(--table-header-sorted-icon-color));
    transform: scale(1.2);
  }
</style>
