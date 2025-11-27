<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  interface BasicControlProps extends CommonControlProp {}

  /** States */
  let { id = crypto.randomUUID() , value = $bindable(undefined), disabled = false, onChange = () => {} }: BasicControlProps = $props();

  const partNamesContainer: string = $derived(`basic-control-container basic-control-container-${id}`);
  const partNamesInput: string = $derived(`basic-control-input basic-control-input-${id}`);

  /** Methods */
  // const filterStoreComponent: StoreComponent<string> = filterStore.add(column.key, filterValue);
  // filterStoreComponent.subscribe((change: StoreComponentData<string>) => {
  //   filterValue = change.value ?? '';
  // });

  function keydownHandler(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onEnter();
    }
  }

  function onEnter() {
    // filterStoreComponent?.setValue(filterValue);
    onChange(value);
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  <input
    id="basic-control-{id}"
    class={partNamesInput}
    part={partNamesInput}
    type="text"
    placeholder="Enter key to search"
    bind:value={value}
    onkeydown={keydownHandler}
    {disabled}
  />
</div>

<style>

  .basic-control-container .basic-control-input {
    height: var(--control-height);
  }
</style>
