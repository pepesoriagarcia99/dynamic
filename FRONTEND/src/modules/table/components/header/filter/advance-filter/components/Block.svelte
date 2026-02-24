<script lang="ts">
  import type { Element } from '../models/Elements';
  import Block from './Block.svelte';
  import Condition from './Condition.svelte';

  import addIcon from '../../../../../../../assets/svg/plus.svg';
  import trashIcon from '../../../../../../../assets/svg/trash.svg';
  import Button from '../../../../../../core/components/Button.svelte';
  import DotsMenu from '../../../../../../core/components/DotsMenu.svelte';

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
      value: ''
    });
  }

  function onAddBlock(conditions: Element[], conditionType: 'AND' | 'OR') {
    conditions.push({
      type: 'block',
      operator: conditionType,
      value: []
    });
  }

  function onRemoveCondition(conditions: Element[], conditionToRemove: Element) {
    const index = conditions.indexOf(conditionToRemove);
    if (index > -1) {
      conditions.splice(index, 1);
    }
  }

  function switchOperator(currentElement: Element) {
    currentElement = {
      ...currentElement,
      operator: currentElement.operator === 'AND' ? 'OR' : 'AND'
    };
    showEditorOperatorMenu = false;
  }

  function handleClickOutsideMenu(event: MouseEvent) {
    console.log('🚀 ~ handleClickOutsideMenu ~ showEditorOperatorMenu:', showEditorOperatorMenu);
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

      <div class="block">
        <div class="header">
          <button
            class="remove-block-btn"
            part="remove-block-btn"
            onclick={() => onRemoveCondition(element.value, child)}
            ><img src={trashIcon} alt="Remove block" class="remove-block-icon" part="remove-block-icon" /></button
          >
          <DotsMenu>
            <Button type="text" onClick={() => switchOperator(element)}>
              <span>"{element.operator}" Cambiar a {element.operator === 'AND' ? 'OR' : 'AND'}</span>
            </Button>
          </DotsMenu>
        </div>

        <Block element={child} />
      </div>
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
    background-color: darkred;
    border: 1px solid white;
    padding: 8px;
    margin-bottom: 8px;
  }

  .header {
    display: flex;
    justify-content: flex-end;
  }

  .remove-block-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
  }

  .remove-block-icon {
    width: 22px;
    height: 22px;
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
