<script lang="ts">
  import type { ConditionELement, FilterElement } from '../models/Elements';

  import trashIcon from '../../../assets/svg/trash.svg';

  import BasicControl from '../../controls/components/BasicControl.svelte';
  import SelectorControl from '../../controls/components/SelectorControl.svelte';
  import ExpandPanel from '../../core/components/ExpandPanel.svelte';

  interface ConditionProps {
    element: FilterElement;
    child: FilterElement;
    columns?: string[];
  }

  /** Inputs */
  let { element, child, columns }: ConditionProps = $props();

  const OPERATOR_OPTIONS = ['equals', 'not equals', 'greater than', 'less than', 'contains', 'does not contain'];

  function onRemoveCondition(conditions: FilterElement[], conditionToRemove: FilterElement) {
    const index = conditions.indexOf(conditionToRemove);
    if (index > -1) {
      conditions.splice(index, 1);
    }
  }
</script>

<ExpandPanel bind:open={child.expanded} label="Condition">
  <div slot="header" class="header">
    <button
      class="remove-condition-btn"
      part="remove-condition-btn"
      onclick={() => onRemoveCondition(element.value, child)}
    >
      <img src={trashIcon} alt="Remove condition" class="remove-condition-icon" part="remove-condition-icon" />
    </button>
  </div>

  <div class="condition">
    <div class="content">
      {#if columns}
        <SelectorControl bind:value={(child as ConditionELement).field} options={columns} />
      {/if}
      <SelectorControl bind:value={child.operator} options={OPERATOR_OPTIONS} />
      <BasicControl bind:value={child.value} />
    </div>
  </div>
</ExpandPanel>

<style>
  .condition {
    padding: 12px 4px 12px 4px;
    border-radius: 4px;
  }

  .header {
    display: flex;
    align-items: end;
    gap: 4px;
    justify-content: flex-end;
  }

  .remove-condition-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
  }

  .remove-condition-icon {
    width: 22px;
    height: 22px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
</style>
