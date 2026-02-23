<script lang="ts">
  import type { Element } from './models/elements';
  import Block from './Block.svelte';
  // import Condition from './Condition.svelte';

  interface BlockProps {
    element: Element;
  }

  /** Inputs */
  let { element = $bindable() }: BlockProps = $props();

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

  $effect(() => {
    console.log('🚀 ~ element:', $state.snapshot(element));
  });
</script>

<div>
  {#each element.value as child, index}
    {#if child.type === 'condition'}
      {#if index !== 0}
        <div>{element.operator}</div>
      {/if}

      <div class="condition">
        <div>Condition: {child.operator} {child.value}</div>
        <button onclick={() => onRemoveCondition(element.value, child)}>remove</button>
      </div>
    {:else if child.type === 'block'}
      {#if index !== 0}
        <div>{element.operator} </div>
      {/if}

      <div class="block">
        <button onclick={() => onRemoveCondition(element.value, child)}>remove</button>

        <Block element={child} />
      </div>
    {/if}
  {/each}

  <div>
    <button onclick={() => onAddCondition(element.value)}>add condition</button>
    <button onclick={() => onAddBlock(element.value, 'AND')}>add AND</button>
    <button onclick={() => onAddBlock(element.value, 'OR')}>add OR</button>
  </div>
</div>

<style>
  .block {
    background-color: darkred;
    border: 1px solid white;
    padding: 8px;
    margin-bottom: 8px;
  }

  .condition {
    margin: 8px;
    background-color: aquamarine;
    padding: 4px;
    border-radius: 4px;

    display: flex;
    align-items: center;
    gap: 4px;
  }
</style>
