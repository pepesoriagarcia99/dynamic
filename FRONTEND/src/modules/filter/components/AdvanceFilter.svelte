<script lang="ts">
  import { getContext } from 'svelte';

  import { LOADING_STATE } from '../../table/constant';

  import type { Element } from '../models/Elements';

  import advanceFilterIcon from '../../../assets/svg/advance-filter.svg';
  import advanceFilterFillIcon from '../../../assets/svg/advance-filter-fill.svg';

  import Skeleton from '../../table/components/Skeleton.svelte';
  import Block from './Block.svelte';
  import DotsMenu from '../../core/components/DotsMenu.svelte';
  import Button from '../../core/components/Button.svelte';

  interface AdvanceFilterIconProps {
    index: number;
    columnField?: string;
    onOpen: (index: number) => void;
  }

  /** Inputs */
  let { index, columnField, onOpen = () => {} }: AdvanceFilterIconProps = $props();
  console.log('🚀 ~ columnField:', columnField);

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
    expanded: true,
    value: [
      {
        type: 'block',
        operator: 'OR',
        expanded: true,
        value: [
          {
            type: 'condition',
            operator: 'contains',
            value: 'Manolo',
            expanded: false
          },
          {
            type: 'condition',
            operator: 'contains',
            value: 'Pepe',
            expanded: false
          }
        ]
      },
      {
        type: 'condition',
        operator: 'contains',
        value: 'Paco',
        expanded: false
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

  function switchOperator() {
    filterTree = {
      ...filterTree,
      operator: filterTree.operator === 'AND' ? 'OR' : 'AND'
    };
    showEditorOperatorMenu = false;
  }

  export function closeModal() {
    showModal = false;
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
            <DotsMenu>
              <Button type="text" onClick={switchOperator}>
                Cambiar a {filterTree.operator === 'AND' ? 'OR' : 'AND'}
              </Button>
            </DotsMenu>
          </div>

          <Block element={filterTree} />

          <div class="advance-filter-modal-actions">
            <Button type="basic" onClick={() => (filterTree = INIT_FILTER)}>clear</Button>
            <Button type="primary">apply</Button>
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

  .advance-filter-modal-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  .advance-filter-modal-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
  }
</style>
