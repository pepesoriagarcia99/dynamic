<script lang="ts">
  import addIcon from '../../../assets/svg/plus.svg';
  import trashIcon from '../../../assets/svg/trash.svg';

  import type { Element } from '../models/Elements';

  import Block from './Block.svelte';
  import Condition from './Condition.svelte';
  import Button from '../../core/components/Button.svelte';
  import DotsMenu from '../../core/components/DotsMenu.svelte';
  import ExpandPanel from '../../core/components/ExpandPanel.svelte';

  interface BlockProps {
    element: Element;
  }

  /** Inputs */
  let { element = $bindable() }: BlockProps = $props();

  let operatorMenuRef: HTMLDivElement | null = $state(null);
  let showEditorOperatorMenu = $state(false);

  function onAddCondition(conditions: Element[]) {
    conditions.push({
      type: 'condition',
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

  // function switchOperator(currentElement: Element) {
  //   currentElement = {
  //     ...currentElement,
  //     operator: currentElement.operator === 'AND' ? 'OR' : 'AND'
  //   };
  //   showEditorOperatorMenu = false;
  // }

  function handleClickOutsideMenu(event: MouseEvent) {
    if (showEditorOperatorMenu && operatorMenuRef && !operatorMenuRef.contains(event.target as Node)) {
      showEditorOperatorMenu = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutsideMenu} />

<div>
  {#each element.value as child, index}
    {#if child.type === 'condition'}
      {#if index !== 0}
        <div>{element.operator}</div>
      {/if}
      <Condition {element} {child} />
    {:else if child.type === 'block'}
      {#if index !== 0}
        <div>{element.operator}</div>
      {/if}

      <ExpandPanel bind:open={child.expanded} label="Block">
        <div slot="header" class="header">
          <Button type="icon" onClick={() => onRemoveCondition(element.value, child)}>
            <img src={trashIcon} alt="Remove block" />
          </Button>
          <DotsMenu>
            <!-- <Button type="text" onClick={() => switchOperator(element)}>
              <span>"{element.operator}" Cambiar a {element.operator === 'AND' ? 'OR' : 'AND'}</span>
            </Button> -->
          </DotsMenu>
        </div>
        <div class="block">
          <Block element={child} />
        </div>
      </ExpandPanel>
    {/if}
  {/each}

  <div class="actions_content">
    <div>
      <Button onClick={() => onAddCondition(element.value)}>
        <img src={addIcon} alt="Add condition" />
        <span>Condition</span>
      </Button>
    </div>
    <div class="block_content">
      <Button onClick={() => onAddBlock(element.value, 'AND')}>
        <img src={addIcon} alt="Add block" />
        <span>AND</span>
      </Button>

      <Button onClick={() => onAddBlock(element.value, 'OR')}>
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
