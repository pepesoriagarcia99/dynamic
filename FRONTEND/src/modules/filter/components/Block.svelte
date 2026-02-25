<script lang="ts">
  import addIcon from '../../../assets/svg/plus.svg';
  import trashIcon from '../../../assets/svg/trash.svg';

  import type { Element } from '../models/Elements';

  import Block from './Block.svelte';
  import Condition from './Condition.svelte';
  import Button from '../../core/components/Button.svelte';
  import ExpandPanel from '../../core/components/ExpandPanel.svelte';

  interface BlockProps {
    element: Element;
    columns?: string[];
    columnField?: string;
  }

  /** Inputs */
  let { element, columns, columnField }: BlockProps = $props();

  function onAddCondition(conditions: Element[]) {
    conditions.push({
      type: 'condition',
      field: columnField ?? '',
      operator: '',
      value: '',
      expanded: true
    });
  }

  function onAddBlock(conditions: Element[], conditionType: 'AND' | 'OR') {
    conditions.push({
      type: 'block',
      operator: conditionType,
      value: [],
      expanded: true
    });
  }

  function onRemoveCondition(conditions: Element[], conditionToRemove: Element) {
    const index = conditions.indexOf(conditionToRemove);
    if (index > -1) {
      conditions.splice(index, 1);
    }
  }
</script>

<div>
  {#each element.value as child, index}
    {#if child.type === 'condition'}
      {#if index !== 0}
        <div>{element.operator}</div>
      {/if}
      <Condition {element} {child} {columns} />
    {:else if child.type === 'block'}
      {#if index !== 0}
        <div>{element.operator}</div>
      {/if}

      <ExpandPanel bind:open={child.expanded} label="Block">
        <div slot="header" class="header">
          <Button type="icon" action={() => onRemoveCondition(element.value, child)}>
            <img src={trashIcon} alt="Remove block" />
          </Button>
        </div>
        <div class="block">
          <Block element={child} {columns} {columnField} />
        </div>
      </ExpandPanel>
    {/if}
  {/each}

  <div class="actions_content">
    <div>
      <Button action={() => onAddCondition(element.value)}>
        <img src={addIcon} alt="Add condition" />
        <span>Condition</span>
      </Button>
    </div>
    <div class="block_content">
      <Button action={() => onAddBlock(element.value, 'AND')}>
        <img src={addIcon} alt="Add block" />
        <span>AND</span>
      </Button>

      <Button action={() => onAddBlock(element.value, 'OR')}>
        <img src={addIcon} alt="Add block" />
        <span>OR</span>
      </Button>
    </div>
  </div>
</div>

<style>
  .block {
    padding: 8px;
    margin-bottom: 8px;
  }

  .header {
    display: flex;
    justify-content: flex-end;
  }

  .actions_content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .block_content {
    display: flex;
    align-items: center;
    gap: 6px;
  }
</style>
