<script lang="ts">

  import firstPageIcon from '../../../assets/svg/arrow-to-left.svg';
  import lastPageIcon from '../../../assets/svg/arrow-to-right.svg';
  import previousPageIcon from '../../../assets/svg/left-arrow.svg';
  import nextPageIcon from '../../../assets/svg/right-arrow.svg';

  import SelectorControl from '../../controls/components/SelectorControl.svelte';
  import { PAGE_CHANGE_EVENT_NAME } from '../constant';
  import { getLoadingContext } from '../context/loading-state.svelte';
  import type { PageEvent } from '../models/event/TableEvent';

  type PageActions = 'first' | 'last' | 'next' | 'previous';

  interface PaginationProps {
    count: number;
    pageSizeOptions: number[];
    pageSize: number;
  }

  let { count, pageSizeOptions, pageSize }: PaginationProps = $props();

  const loadingState = getLoadingContext();
  let el: HTMLElement;
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
    el.dispatchEvent(
      new CustomEvent(PAGE_CHANGE_EVENT_NAME, {
        detail: {
          page: currentPage,
          pageSize: pageSize
        } as PageEvent,
        bubbles: true,
        composed: true
      })
    );
  }

  function getPartPageNumber(n: number) {
    return [
      'pagination-page-num',
      `pagination-page-num-${n}`,
      currentPage === n ? 'pagination-page-num-selected' : null
    ]
      .filter(Boolean)
      .join(' ');
  }

  function getPartPageNumberBtn(n: number) {
    return [
      'pagination-page-num-btn',
      `pagination-page-num-btn-${n}`,
      currentPage === n ? 'pagination-page-num-btn-selected' : null
    ]
      .filter(Boolean)
      .join(' ');
  }

  export function setPage(pageNumber: number) {
    currentPage = pageNumber;
    emitChange();
  }

  /**
   * Resetea la página actual a 1
   * @param emitEvent Indica si se debe emitir el evento de cambio de página
   */
  export function resetPage(emitEvent?: boolean) {
    currentPage = 1;
    if (emitEvent) {
      emitChange();
    }
  }

  export function getState() {
    return {
      page: currentPage,
      pageSize
    };
  }
</script>

<div bind:this={el} class="pagination-content" part="pagination-content">
  <button
    onclick={() => handlerAction('first')}
    disabled={currentPage === 1 || loadingState()}
    aria-label="first-page"
    class="pagination-action-btn first-page-btn"
    part="pagination-action-btn first-page-btn"
  >
    <img src={firstPageIcon} alt="first page" class="first-page-icon" part="first-page-icon" />
  </button>

  <button
    onclick={() => handlerAction('previous')}
    disabled={currentPage === 1 || loadingState()}
    aria-label="previous-page"
    class="pagination-action-btn previous-page-btn"
    part="pagination-action-btn previous-page-btn"
  >
    <img src={previousPageIcon} alt="previous page" class="previous-page-icon" part="previous-page-icon" />
  </button>
  {#if loadingState() === true && showPageNumbers.length === 0}
    <span class="pagination-page-num-loading" part="pagination-page-num-loading">...</span>
  {:else}
    {#each showPageNumbers as n}
      <button
        onclick={() => setPage(n)}
        disabled={loadingState()}
        aria-label="page-number"
        class={getPartPageNumberBtn(n)}
        part={getPartPageNumberBtn(n)}
      >
        <span class={getPartPageNumber(n)} part={getPartPageNumber(n)}>{n}</span>
      </button>
    {/each}
  {/if}
  <button
    onclick={() => handlerAction('next')}
    disabled={currentPage === totalPages || loadingState()}
    aria-label="next-page"
    class="pagination-action-btn next-page-btn"
    part="pagination-action-btn next-page-btn"
  >
    <img src={nextPageIcon} alt="next page" class="next-page-icon" part="next-page-icon" />
  </button>
  <button
    onclick={() => handlerAction('last')}
    disabled={currentPage === totalPages || loadingState()}
    aria-label="last-page"
    class="pagination-action-btn last-page-btn"
    part="pagination-action-btn last-page-btn"
  >
    <img src={lastPageIcon} alt="last page" class="last-page-icon" part="last-page-icon" />
  </button>
  <SelectorControl
    style="width: auto;"
    options={pageSizeOptions}
    bind:value={pageSize}
    onChange={onChangePageSize}
    disabled={loadingState()}
  />
</div>

<style>
  .pagination-content {
    background-color: var(--pagination-background);
    width: 100%;
    height: var(--pagination-height);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .pagination-page-num-loading {
    cursor: default;
    opacity: 0.5;
  }

  /** Estilos botones */
  .pagination-action-btn,
  .pagination-page-num-btn {
    background: none;
    border: none;
    cursor: pointer;
  }

  /** Estilos numeros de pagina */

  .pagination-page-num-btn {
    width: 35px;
    height: 35px;
  }

  .pagination-page-num-btn:not(.pagination-page-num-btn-selected):hover {
    background: var(--pagination-page-num-btn-hover) !important;
    border-radius: 35px;
    margin-top: 1px;
  }

  .pagination-page-num-btn-selected {
    background: var(--pagination-page-num-btn-selected) !important;
    border-radius: 35px;
    margin-top: 1px;
  }

  .pagination-page-num-selected {
    color: var(--pagination-page-num-text-selected);
  }

  .pagination-page-num {
    font-size: large;
  }

  .pagination-page-num:hover {
    cursor: pointer;
  }

  /** Estilos botones acciones */

  .pagination-action-btn {
    width: 35px;
    height: 35px;
  }

  .pagination-action-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .pagination-action-btn:not(:disabled):hover {
    background: var(--pagination-action-btn-hover) !important;
    border-radius: 30px;
  }

  .first-page-icon,
  .last-page-icon {
    width: 24px;
    height: 24px;
  }

  .next-page-icon,
  .previous-page-icon {
    width: 14px;
    height: 14px;
    margin: 4px 4px 4px 4px;
  }

  :global(.pagination-selector .selector-control-select) {
    width: auto !important;
  }
</style>
