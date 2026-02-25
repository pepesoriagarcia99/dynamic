<svelte:options customElement="dyn-selector-control" />

<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  interface SelectorProps extends CommonControlProp {
    options: any[];
  }

  /** States */
  let {
    id = crypto.randomUUID(),
    label,
    options,
    value = $bindable(undefined),
    disabled = false,
    style = '',
    onChange = () => {}
  }: SelectorProps = $props();

  const inputId: string = $derived(`selector-control-${id}`);
  const partNamesContainer: string = $derived(
    `control-container selector-control-container selector-control-container-${id}`
  );
  const partNamesInput: string = $derived(`control-item selector-control-select selector-control-select-${id}`);
  const partNamesLabel: string = $derived(`control-label selector-control-label selector-control-label-${id}`);

  /** Methods */
  function onSelectChange() {
    onChange(value);
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  {#if label}
    <label for={inputId} class={partNamesLabel} part={partNamesLabel}>{label}</label>
  {/if}
  <select
    id={inputId}
    aria-label={inputId}
    class={partNamesInput}
    part={partNamesInput}
    {style}
    {disabled}
    bind:value
    onchange={onSelectChange}
  >
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
</div>

<style>
  @import '../styles/control.css';

  .selector-control-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23495057' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
  }
</style>
