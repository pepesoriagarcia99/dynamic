<!-- <script lang="ts">
  import type { Element } from './models/elements';

  interface ConditionProps {
    conditions: Element[];
  }

  /** Inputs */
  let { conditions = $bindable() }: ConditionProps = $props();

  $effect(() => {
    console.log('🚀 ~ conditions:', $state.snapshot(conditions));
  });

  function onAddCondition() {
    conditions.push({
      field: '',
      operator: '',
      value: ''
    });
  }

</script>

<div>
  {#each conditions as condition}
    <div class="condition">Condition: {condition.field} {condition.operator} {condition.value}</div>
  {/each}

  <button onclick={onAddCondition}>add condition</button>
</div>

<style>
  .condition {
    margin: 8px;
    background-color: aquamarine;
    padding: 4px;
    border-radius: 4px;
  }
</style> -->
