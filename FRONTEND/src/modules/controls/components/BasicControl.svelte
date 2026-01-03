<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  interface BasicControlProps extends CommonControlProp {
    type?: string;
  }

  /** States */
  let {
    id = crypto.randomUUID(),
    label,
    placeholder = 'Enter key to search',
    value = $bindable(undefined),
    disabled = false,
    type = 'text',
    style = '',
    onChange = () => {}
  }: BasicControlProps = $props();

  const inputId: string = $derived(`basic-control-${id}`);
  const partNamesContainer: string = $derived(
    `control-container basic-control-container basic-control-container-${id}`
  );
  const partNamesInput: string = $derived(`control-item basic-control-input basic-control-input-${id}`);
  const partNamesLabel: string = $derived(`control-label basic-control-label basic-control-label-${id}`);

  /** Methods */

  function keydownHandler(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onEnter();
    }
  }

  function onEnter() {
    onChange(value);
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  {#if label}
    <label for={inputId} class={partNamesLabel} part={partNamesLabel}>{label}</label>
  {/if}
  <input
    id={inputId}
    aria-label={inputId}
    class={partNamesInput}
    part={partNamesInput}
    {style}
    {type}
    {placeholder}
    bind:value
    onkeydown={keydownHandler}
    {disabled}
  />
</div>

<style>
  @import '../styles/control.css';

  .basic-control-container {
    width: 100%;
    box-sizing: border-box;
  }

  .basic-control-input {
    width: 100%;
    box-sizing: border-box;
  }

  input[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
</style>
