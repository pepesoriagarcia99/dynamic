<script lang="ts">
  import { getContext } from 'svelte';

  import { LOADING_STATE } from '../../../../constant';

  import advanceFilterIcon from '../../../../../../assets/svg/advance-filter.svg';
  import advanceFilterFillIcon from '../../../../../../assets/svg/advance-filter-fill.svg';

  import type { Column } from '../../../../models/column/Column';

  import Skeleton from '../../../Skeleton.svelte';
  import Block from './components/Block.svelte';
  import type { Element } from './models/Elements';

  import dotEditIcon from '../../../../../../assets/svg/dots-options.svg';

  interface AdvanceFilterIconProps {
    index: number;
    column: Column;
    onOpen: (index: number) => void;
  }

  /** Inputs */
  let { index, column, onOpen = () => {} }: AdvanceFilterIconProps = $props();
  console.log('🚀 ~ column:', column);

  /** States */
  const loading: () => boolean = getContext(LOADING_STATE);
  let showModal = $state<boolean>(false);
  let buttonRef: HTMLButtonElement | null = $state(null);
  let value = $state<any>(null);
  let showEditorOperatorMenu = $state(false);

  const partNamesIcon: string = $derived(
    `advance-filter-icon ${value || showModal ? 'advance-filter-icon-active' : ''} advance-filter-icon-${index}`
  );
  const partNamesContainer: string = `advance-filter-container advance-filter-container-${index}`;
  const partNamesButton: string = `advance-filter-btn advance-filter-btn-${index}`;

  const INIT_FILTER: Element = {
    type: 'block',
    operator: 'AND',
    value: [
      {
        type: 'block',
        operator: 'OR',
        value: [
          {
            type: 'condition',
            operator: 'contains',
            value: 'Manolo'
          },
          {
            type: 'condition',
            operator: 'contains',
            value: 'Pepe'
          }
        ]
      },
      {
        type: 'condition',
        operator: 'contains',
        value: 'Paco'
      }
    ]
  };
  let filterTree = $state<Element>(INIT_FILTER);

  /** Methods */
  function toggleShowModal(event?: MouseEvent) {
    event?.stopPropagation();
    showModal = !showModal;

    if (showModal) {
      onOpen(index);
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (showModal && buttonRef && !buttonRef.contains(event.target as Node)) {
      showModal = false;
    }
  }

  export function closeModal() {
    showModal = false;
  }

  function toggleOperatorMenu(event: MouseEvent) {
    event.stopPropagation();
    showEditorOperatorMenu = !showEditorOperatorMenu;
  }

  function switchOperator() {
    filterTree = {
      ...filterTree,
      operator: filterTree.operator === 'AND' ? 'OR' : 'AND'
    };
    showEditorOperatorMenu = false;
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

  // function onAddCondition(conditionType: 'AND' | 'OR') {
  // (filterTree.conditions as BlockType[]).push({
  //   type: 'block',
  //   operator: conditionType,
  //   conditions: []
  // });
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
          <div class="advance-filter-modal-header">
            <button class="edit-block-btn" part="edit-block-btn" onclick={toggleOperatorMenu}>
              <img src={dotEditIcon} alt="Edit block" class="edit-block-icon" part="edit-block-icon" />
            </button>
            {#if showEditorOperatorMenu}
              <!-- onclick|stopPropagation -->
              <div class="operator-menu">
                <button class="operator-switch-btn" onclick={switchOperator}>
                  Cambiar a {filterTree.operator === 'AND' ? 'OR' : 'AND'}
                </button>
              </div>
            {/if}
          </div>

          <Block element={filterTree} />

          <div class="advance-filter-modal-actions">
            <button class="clear-action" onclick={() => (filterTree = INIT_FILTER)}>clear</button>
            <button class="apply-action">apply</button>
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
    width: 20px;
    height: 20px;
    transform: scale(1.2);
    transition: transform 180ms ease-in-out;
    transform-origin: center;
  }

  .advance-filter-icon:hover {
    transform: scale(1.3);
  }

  .advance-filter-icon-active {
    width: 20px;
    height: 20px;
    transform: scale(1.2);
  }

  .operator-menu {
    position: absolute;
    top: 36px;
    right: 12px;
    background: #fff;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
    z-index: 1100;
    padding: 4px 0;
    min-width: 120px;
  }
  .operator-switch-btn {
    background: none;
    border: none;
    padding: 8px 16px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
  }
  .operator-switch-btn:hover {
    background: #f1f3f5;
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

  .advance-filter-modal-header {
    display: flex;
    justify-content: flex-end;
  }

  .edit-block-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
  }

  .edit-block-icon {
    width: 22px;
    height: 22px;
  }

  .advance-filter-modal-content {
    padding: 12px;
  }

  .advance-filter-modal-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
  }

  .clear-action {
    background-color: transparent;
    border: 1px solid #dee2e6;
    color: #212529;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }

  .apply-action {
    background-color: #007bff;
    border: 1px solid #007bff;
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }
</style>
