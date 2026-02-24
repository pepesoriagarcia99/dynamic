<script lang="ts">
  import type { Element } from '../models/Elements';
  import trashIcon from '../../../../../../../assets/svg/trash.svg';
  import BasicControl from '../../../../../../controls/components/BasicControl.svelte';
  import SelectorControl from '../../../../../../controls/components/SelectorControl.svelte';

  interface ConditionProps {
    element: Element;
    child: Element;
  }

  /** Inputs */
  let { element = $bindable(), child = $bindable() }: ConditionProps = $props();

  const OPERATOR_OPTIONS = ['equals', 'not equals', 'greater than', 'less than', 'contains', 'does not contain'];

  function onRemoveCondition(conditions: Element[], conditionToRemove: Element) {
    const index = conditions.indexOf(conditionToRemove);
    if (index > -1) {
      conditions.splice(index, 1);
    }
  }
</script>

<div class="condition">
  <div class="header">
    <button
      class="remove-condition-btn"
      part="remove-condition-btn"
      onclick={() => onRemoveCondition(element.value, child)}
    >
      <img src={trashIcon} alt="Remove condition" class="remove-condition-icon" part="remove-condition-icon" />
    </button>
  </div>

  <div class="content">
    <SelectorControl bind:value={child.operator} options={OPERATOR_OPTIONS} />
    <BasicControl value={child.value} />
  </div>
</div>

<style>
  .condition {
    margin: 8px;
    background-color: aquamarine;
    padding: 4px;
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
