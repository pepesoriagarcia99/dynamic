<script lang="ts">
  import { getContext } from 'svelte';

  import { LOADING_STATE } from '../../../constant';

  import advanceFilterIcon from '../../../../../assets/svg/advance-filter.svg';
  import advanceFilterFillIcon from '../../../../../assets/svg/advance-filter-fill.svg';

  import type { Column } from '../../../models/column/Column';

  import Skeleton from '../../Skeleton.svelte';
  import SelectorControl from '../../../../controls/components/SelectorControl.svelte';

  interface AdvanceFilterIconProps {
    index: number;
    column: Column;
  }

  /** Inputs */
  let { index, column }: AdvanceFilterIconProps = $props();

  /** States */
  const loading: () => boolean = getContext(LOADING_STATE);
  let showModal = $state<boolean>(false);
  let buttonRef: HTMLButtonElement | null = $state(null);
  let value = $state<any>(null);

  const partNamesIcon: string = $derived(`advance-filter-icon ${value || showModal ? 'advance-filter-icon-active' : ''} advance-filter-icon-${index}`);
  const partNamesContainer: string = `advance-filter-container advance-filter-container-${index}`;
  const partNamesButton: string = `advance-filter-btn advance-filter-btn-${index}`;

  /** Methods */
  function toggleShowModal(event?: MouseEvent) {
    event?.stopPropagation();
    showModal = !showModal;
  }

  function handleClickOutside(event: MouseEvent) {
    if (showModal && buttonRef && !buttonRef.contains(event.target as Node)) {
      showModal = false;
    }
  }

  // function controlEvent() {
  /**
   * Aqui se pueden mapear los diferentes eventos
   *
   * Por ejemplo:
   * Selectores: Evento de paginacion para traer mas valores
   * AutoComplete: Evento de busqueda para filtrar valores, Evento de paginacion
   */
  // el.dispatchEvent(
  //   new CustomEvent('ControlEvent', {
  //     detail: eventDetail as SortEvent[],
  //     bubbles: true,
  //     composed: true
  //   })
  // );
  // }
</script>

<svelte:window on:click={handleClickOutside} />

<div class={partNamesContainer} part={partNamesContainer}>
  {#if loading() === true}
    <Skeleton width="26px" height="26px" />
  {:else}
    <button
      bind:this={buttonRef}
      onclick={(e) => toggleShowModal(e)}
      aria-label="Advance Filter"
      class={partNamesButton}
      part={partNamesButton}
    >
      {#if showModal || value}
        <img src={advanceFilterFillIcon} alt="Advance filter" class={partNamesIcon} part={partNamesIcon} />
      {:else}
        <img src={advanceFilterIcon} alt="Advance filter" class={partNamesIcon} part={partNamesIcon} />
      {/if}
    </button>

    {#if showModal}
      <div
        class="advance-filter-modal"
        part="advance-filter-modal"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
      >
        <div class="advance-filter-modal-content">
          <div class="selector-condition">
            <SelectorControl options={[1, 2, 3, 4]} bind:value />
          </div>

          <div>
            {#if column.type === 'string'}
              <input type="text" placeholder="Value" />
            {:else if column.type === 'number'}
              <input type="number" placeholder="Value" />
            {:else if column.type === 'date'}
              <input type="date" placeholder="Value" />
            {/if}
          </div>
          <div>
            <button onclick={() => (value = null)}>Clear</button>
            <button onclick={() => toggleShowModal()}>Apply</button>
        </div>


        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .advance-filter-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
  }

  .advance-filter-icon {
    width: 22px;
    height: 22px;
    transform: scale(1.2);
    transition: transform 180ms ease-in-out;
    transform-origin: center;
  }

  .advance-filter-icon:hover {
    transform: scale(1.3);
  }

  .advance-filter-icon-active {
    width: 22px;
    height: 22px;
    /* filter: invert(1) drop-shadow(0 0 0 var(--table-header-sorted-icon-color))
      drop-shadow(0 0 0 var(--table-header-sorted-icon-color));
    transform: scale(1.2); */
  }

  .advance-filter-modal {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    z-index: 1000;
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-width: 250px;
    min-height: 200px;
    animation: fadeIn 150ms ease-in;
  }

  .advance-filter-modal-content {
    padding: 12px;
  }

  .selector-condition {
    width: 100%;
  }
</style>
