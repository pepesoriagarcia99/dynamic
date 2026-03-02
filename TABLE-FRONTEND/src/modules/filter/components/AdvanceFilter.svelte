<svelte:options customElement="dyn-advance-filter" />

<script lang="ts">
  import '../../controls/styles/control.css';
  import type { FilterElement } from '../models/Elements';

  import Block from './Block.svelte';
  import SimpleMenu from '../../core/components/SimpleMenu.svelte';
  import Button from '../../core/components/Button.svelte';

  const INIT_FILTER: FilterElement = {
    type: 'block',
    operator: 'AND',
    expanded: true,
    value: []
  };

  interface AdvanceFilterIconProps {
    value?: FilterElement;
    columnField?: string;
    columns?: string[];
    onApply?: (filter: FilterElement) => void;
  }

  /** Inputs */
  let { value = $bindable<FilterElement>(INIT_FILTER), columnField, columns, onApply = () => {} }: AdvanceFilterIconProps = $props();

  /** Check */
  $effect(() => {
    if (!columnField && (!columns || columns.length === 0)) {
      throw new Error('AdvanceFilterIcon requires either columnField or columns prop');
    }
  });

  /** States */
  let showModal = $state<boolean>(false);
  let buttonRef: HTMLButtonElement | null = $state(null);
  // let filterTree = $state<FilterElement>(value);

  /** Values */
  const partNamesContainer: string = `advance-filter-container`;
  const partNamesContent: string = `advance-filter-content`;
  const partNamesHeader: string = `advance-filter-header`;
  const partNamesActions: string = `advance-filter-actions`;

  /** Methods */
  function handleClickOutside(event: MouseEvent) {
    if (showModal && buttonRef && !buttonRef.contains(event.target as Node)) {
      showModal = false;
    }
  }

  function switchOperator() {
    value.operator = value.operator === 'AND' ? 'OR' : 'AND';
  }

  export function closeModal() {
    showModal = false;
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div
  class={partNamesContainer}
  part={partNamesContainer}
  role="dialog"
  tabindex="-1"
  onclick={(e) => e.stopPropagation()}
  onkeydown={(e) => e.stopPropagation()}
>
  <div class={partNamesContent} part={partNamesContent}>
    <div class={partNamesHeader} part={partNamesHeader}>
      <SimpleMenu>
        <Button type="text" action={switchOperator}>
          Change to {value.operator === 'AND' ? 'OR' : 'AND'}
        </Button>
      </SimpleMenu>
    </div>

    <Block element={value} {columns} {columnField} />

    <div class={partNamesActions} part={partNamesActions}>
      <Button type="secondary" action={() => (value = INIT_FILTER)}>Clear</Button>
      <Button type="primary" action={() => onApply(value)}>Apply</Button>
    </div>
  </div>
</div>

<style>
  .advance-filter-container {
    overflow: auto;
  }

  .advance-filter-content {
    padding: 12px;
  }

  .advance-filter-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  .advance-filter-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 18px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
  }
</style>
