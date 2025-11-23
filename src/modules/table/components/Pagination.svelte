<script lang="ts">
  import type { PageEvent } from '../models/event/PageEvent';

  import firstPageIcon from '../../../assets/svg/arrow-to-left.svg';
  import lastPageIcon from '../../../assets/svg/arrow-to-right.svg';
  import previousPageIcon from '../../../assets/svg/left-arrow.svg';
  import nextPageIcon from '../../../assets/svg/right-arrow.svg';

  import SelectorControl from './header/inputs/SelectorControl.svelte';

  type PageActions = 'first' | 'last' | 'next' | 'previous';

  interface PaginationProps {
    count: number;
    pageSizeOptions: number[];
    pageSize: number;
    onChange?: (event: PageEvent) => void;
  }

  let { count, pageSizeOptions, pageSize, onChange = () => {} }: PaginationProps = $props();

  let currentPage: number = $state(1);
  let totalPages: number = $derived(Math.ceil(count / pageSize));

  let showPageNumbers: number[] = $state([]);
  $effect(() => {
    if (totalPages <= 5) {
      showPageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
      return;
    }

    if (currentPage <= 3) {
      showPageNumbers = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      showPageNumbers = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      showPageNumbers = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  });

  function handlerAction(action: PageActions) {
    if (action === 'next' && currentPage < totalPages) currentPage++;
    else if (action === 'previous' && currentPage > 1) currentPage--;
    else if (action === 'first') currentPage = 1;
    else if (action === 'last') currentPage = totalPages;

    emitChange();
  }

  function onChangePageSize() {
    currentPage = 1;
    emitChange();
  }

  function emitChange() {
    onChange({
      page: currentPage,
      pageSize: pageSize
    });
  }

  function getPartPageNumber(n: number) {
    return ['pagination-page', `pagination-page-${n}`, currentPage === n ? 'pagination-page-selected' : null]
      .filter(Boolean)
      .join(' ');
  }

  function getPartPageNumberBtn(n: number) {
    return ['pagination-btn', `pagination-btn-${n}`, currentPage === n ? 'pagination-btn-selected' : null]
      .filter(Boolean)
      .join(' ');
  }

  export function setPage(pageNumber: number) {
    currentPage = pageNumber;
    emitChange();
  }

  export function resetPage() {
    currentPage = 1
  }

  export function getState() {
    return {
      page: currentPage,
      pageSize
    };
  }
</script>

<div class="pagination-content" part="pagination-content">
  <button
    onclick={() => handlerAction('first')}
    disabled={currentPage === 0}
    aria-label="first-page"
    class="pagination-btn first-page-btn"
    part="pagination-btn first-page-btn"
  >
    <img src={firstPageIcon} alt="first page" class="first-page-icon" part="first-page-icon" />
  </button>

  <button
    onclick={() => handlerAction('previous')}
    aria-label="previous-page"
    class="pagination-btn previous-page-btn"
    part="pagination-btn previous-page-btn"
  >
    <img src={previousPageIcon} alt="previous page" class="previous-page-icon" part="previous-page-icon" />
  </button>
  {#each showPageNumbers as n}
    <button
      onclick={() => setPage(n)}
      aria-label="page-number"
      class={getPartPageNumberBtn(n)}
      part={getPartPageNumberBtn(n)}
    >
      <span class={getPartPageNumber(n)} part={getPartPageNumber(n)}>{n}</span>
    </button>
  {/each}
  <button
    onclick={() => handlerAction('next')}
    aria-label="next-page"
    class="pagination-btn next-page-btn"
    part="pagination-btn next-page-btn"
  >
    <img src={nextPageIcon} alt="next page" class="next-page-icon" part="next-page-icon" />
  </button>
  <button
    onclick={() => handlerAction('last')}
    aria-label="last-page"
    class="pagination-btn last-page-btn"
    part="pagination-btn last-page-btn"
  >
    <img src={lastPageIcon} alt="last page" class="last-page-icon" part="last-page-icon" />
  </button>
  <SelectorControl options={pageSizeOptions} bind:value={pageSize} onChange={onChangePageSize} />
</div>

<style>
  .pagination-content {
    background-color: rgb(202, 202, 202);
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .pagination-page-selected {
    font-weight: 800;
  }

  .pagination-page:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
  }

  .first-page-icon,
  .last-page-icon {
    width: 26px;
    height: 26px;
  }

  .next-page-icon,
  .previous-page-icon {
    width: 16px;
    height: 16px;
  }
</style>
