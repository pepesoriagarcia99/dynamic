<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  interface DateControlProps extends CommonControlProp {
    min?: string;
    max?: string;
  }

  /** States */
  let {
    id = crypto.randomUUID(),
    label,
    placeholder = 'Select a date',
    value = $bindable(undefined),
    disabled = false,
    min,
    max,
    style = '',
    onChange = () => {}
  }: DateControlProps = $props();

  const inputId: string = $derived(`date-control-${id}`);
  const partNamesContainer: string = $derived(
    `control-container date-control-container date-control-container-${id}`
  );
  const partNamesInput: string = $derived(`control-item date-control-input date-control-input-${id}`);
  const partNamesLabel: string = $derived(`control-label date-control-label date-control-label-${id}`);

  /** Methods */

  function keydownHandler(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onEnter();
    }
  }

  function onEnter() {
    onChange(value);
  }

  function handleChange() {
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
    type="date"
    {placeholder}
    {min}
    {max}
    bind:value
    onkeydown={keydownHandler}
    onchange={handleChange}
    {disabled}
  />
</div>

<style>
  @import '../styles/control.css';

  .date-control-container {
    width: 100%;
    box-sizing: border-box;
  }

  .date-control-input {
    width: 100%;
    box-sizing: border-box;
  }

  input[type='date'] {
    cursor: pointer;
  }

  input[type='date']::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  input[type='date']::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }

  input[type='date']:disabled::-webkit-calendar-picker-indicator {
    cursor: default;
    opacity: 0.3;
  }
</style>
