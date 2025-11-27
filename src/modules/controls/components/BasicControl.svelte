<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  interface BasicControlProps extends CommonControlProp {}

  /** States */
  let {
    id = crypto.randomUUID(),
    label,
    value = $bindable(undefined),
    disabled = false,
    onChange = () => {}
  }: BasicControlProps = $props();

  const inputId: string = $derived(`basic-control-${id}`);
  const partNamesContainer: string = $derived(
    `control-container basic-control-container basic-control-container-${id}`
  );
  const partNamesInput: string = $derived(`control-item basic-control-input basic-control-input-${id}`);
  const partNamesLabel: string = $derived(`control-label basic-control-label basic-control-label-${id}`);

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
  {#if label}
    <label for={inputId} class={partNamesLabel} part={partNamesLabel}>{label}</label>
  {/if}
  <input
    id={inputId}
    class={partNamesInput}
    part={partNamesInput}
    type="text"
    placeholder="Enter key to search"
    bind:value
    onkeydown={keydownHandler}
    {disabled}
  />
</div>

<style>
  @import '../styles/control.css';

  .basic-control-input {
    margin: 0px 12px 0px 12px;
  }
</style>
