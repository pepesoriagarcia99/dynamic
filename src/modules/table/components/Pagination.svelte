<script lang="ts">
  import firstPageIcon from '../../../assets/svg/arrow-to-left.svg';
  import lastPageIcon from '../../../assets/svg/arrow-to-right.svg';
  import nextPageIcon from '../../../assets/svg/left-arrow.svg';
  import previousPageIcon from '../../../assets/svg/right-arrow.svg';
  import SelectorControl from './header/inputs/SelectorControl.svelte';

  type PageActions = 'first' | 'last' | 'next' | 'previous';

  interface PaginationProps {
    count: number;
    pageSizeOptions: number[];
  }

  let { count, pageSizeOptions }: PaginationProps = $props();
  //   let pageSize = pageSizeOptions[0];
  //   let currentPage = 0;

  let currentPage = 1;
  let pageSize;

  let totalPages = $state(Math.ceil(count / pageSize));
  let showPages: number[] = $state(Array.from({ length: totalPages }, (_, i) => i + 1));

  console.log('🚀 ~ pageSizeOptions:', pageSizeOptions);
  console.log('🚀 ~ count:', count);

  function handlerAction(action: PageActions) {
    if (action === 'next') {
    } else if (action === 'previous') {
    } else if (action === 'first') {
    } else if (action === 'last') {
    }
  }

  function gotoPage(pageNumber: number) {}

  function calculatePages() {
    //   const totalPages = Math.ceil(count / pageSize);
    //   showPages = [];
    //   for (let i = 1; i <= totalPages; i++) {
    //     showPages.push(i);
  }
</script>

<div class="pagination-content" part="pagination-content">
  <button
    onclick={() => handlerAction('first')}
    aria-label="first-page"
    class="pagination-btn first-page-btn"
    part="pagination-btn first-page-btn"
  >
    <img src={firstPageIcon} alt="first page" class="first-page-icon" part="first-page-icon" />
  </button>

  <button
    onclick={() => handlerAction('next')}
    aria-label="next-page"
    class="pagination-btn next-page-btn"
    part="pagination-btn next-page-btn"
  >
    <img src={nextPageIcon} alt="next page" class="next-page-icon" part="next-page-icon" />
  </button>
  {#each showPages as n}
    <button
      onclick={() => gotoPage(n)}
      aria-label="page-number"
      class={`pagination-btn page-${n}-btn`}
      part={`pagination-btn page-${n}-btn`}
    >
      <span class={`page-number-${n}`} part={`page-number-${n}`}>{n}</span>
    </button>
  {/each}
  <button
    onclick={() => handlerAction('previous')}
    aria-label="previous-page"
    class="pagination-btn previous-page-btn"
    part="pagination-btn previous-page-btn"
  >
    <img src={previousPageIcon} alt="previous page" class="previous-page-icon" part="previous-page-icon" />
  </button>
  <button
    onclick={() => handlerAction('last')}
    aria-label="last-page"
    class="pagination-btn last-page-btn"
    part="pagination-btn last-page-btn"
  >
    <img src={lastPageIcon} alt="last page" class="last-page-icon" part="last-page-icon" />
  </button>
  <SelectorControl options={}  />
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

  .pagination-page-number:hover {
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
