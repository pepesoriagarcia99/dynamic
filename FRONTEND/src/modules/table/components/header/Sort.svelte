<script lang="ts">
  import { getContext } from 'svelte';

  import { LOADING_STATE } from '../../constant';

  import type { Column } from '../../models/column/Column';
  import type { SortEvent } from '../../models/event/TableEvent';

  import sortIcon from '../../../../assets/svg/sort.svg';
  import sortTopIcon from '../../../../assets/svg/sort-top.svg';
  import sortBottomIcon from '../../../../assets/svg/sort-bottom.svg';

  import Skeleton from '../Skeleton.svelte';

  interface SortProps {
    index: number;
    column: Column;
    sort: SortEvent | null;
    handleSort: (key: string) => void;
  }

  /** Inputs */
  let { index, column, sort, handleSort }: SortProps = $props();

  /** Values */
  const loading: () => boolean = getContext(LOADING_STATE);

  const partNamesIcon: string = $derived(
    `sort-icon sort-icon-${index} ${sort?.direction !== null ? 'sort-icon-active' : ''}`
  );
  const partNamesContainer: string = `sort-container sort-container-${index}`;
  const partNamesButton: string = `sort-btn sort-btn-${index}`;

  /** Methods */
  function toggleSort(event?: MouseEvent) {
    event?.stopPropagation();

    handleSort(column.key);
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  {#if loading() === true}
    <Skeleton width="26px" height="26px" />
  {:else}
    <button onclick={(e) => toggleSort(e)} aria-label="Sort" class={partNamesButton} part={partNamesButton}>
      {#if sort?.direction === 'asc'}
        <img src={sortTopIcon} alt="sort ascending" class={partNamesIcon} part={partNamesIcon} />
      {:else if sort?.direction === 'desc'}
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
    transform: scale(1.2);
  }
</style>
