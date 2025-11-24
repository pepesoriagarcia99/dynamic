<script lang="ts">
  import { onMount } from 'svelte';
  import type { Column } from '../../models/Column';
  import { sortStore, type SortOrder } from '../../store/sort-store';
  import type { StoreComponent } from '../../../core/models/StoreComponent';

  import sortIcon from '../../../../assets/svg/sort.svg';
  import sortTopIcon from '../../../../assets/svg/sort-top.svg';
  import sortBottomIcon from '../../../../assets/svg/sort-bottom.svg';
  import { loadingState } from '../../store/loading-state';
  import Skeleton from '../Skeleton.svelte';

  interface FilterProps {
    column: Column;
  }

  /** Inputs */
  let { column }: FilterProps = $props();

  /** Values */
  let sortDirection = $state<SortOrder | null>(null);
  let sortStoreComponent: StoreComponent<SortOrder> = sortStore.add(column.key, null);
  let loading = $state(false);

  const partNamesContainer: string = $derived(`sort-container sort-container-${column.key}`);
  const partNamesButton: string = $derived(`sort-btn sort-btn-${column.key}`);
  const partNamesIcon: string = $derived(`sort-icon sort-icon-${column.key}`);

  loadingState.subscribe((state) => {
    loading = state;
  });

  /** Methods */
  onMount(() => {
    sortStoreComponent.subscribe((event) => {
      sortDirection = event.value ?? null;
    });
  });

  function toggleSort() {
    sortStore.onSortToggle(column.key);
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  {#if loading === true}
    <Skeleton width="20px" height="20px" />
  {:else}
    <button onclick={toggleSort} aria-label="Sort" class={partNamesButton} part={partNamesButton}>
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
    width: 20px;
    height: 20px;
  }
</style>
