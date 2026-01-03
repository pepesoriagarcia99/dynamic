<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  type CheckState = boolean | null;

  interface CheckControlProps extends CommonControlProp {
    checked?: CheckState;
    triState?: boolean;
  }

  /** States */
  let {
    id = crypto.randomUUID(),
    label,
    value = $bindable(undefined),
    checked = $bindable<CheckState>(false),
    disabled = false,
    triState = false,
    style = '',
    onChange = () => {}
  }: CheckControlProps = $props();

  const inputId: string = $derived(`check-control-${id}`);
  const partNamesContainer: string = $derived(
    `control-container check-control-container check-control-container-${id}`
  );
  const partNamesInput: string = $derived(`control-item check-control-input check-control-input-${id}`);
  const partNamesLabel: string = $derived(`control-label check-control-label check-control-label-${id}`);

  const isChecked: boolean = $derived(checked === true);
  const isIndeterminate: boolean = $derived(checked === null);

  /** Methods */
  function onCheckClick() {
    if (disabled) return;

    if (triState) {
      // Ciclo: false -> null -> true -> false
      if (checked === false) {
        checked = null;
      } else if (checked === null) {
        checked = true;
      } else {
        checked = false;
      }
    } else {
      // Ciclo binario: false -> true -> false
      checked = !checked;
    }

    onChange(checked === true ? value || 'checked' : checked === null ? 'indeterminate' : undefined);
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  <label for={inputId} class="check-control-wrapper">
    <div
      class="check-control-checkbox"
      class:checked={isChecked}
      class:indeterminate={isIndeterminate}
      class:disabled
      onclick={onCheckClick}
      role="checkbox"
      aria-checked={isIndeterminate ? 'mixed' : isChecked}
      tabindex={disabled ? -1 : 0}
      onkeydown={(e) => (e.key === ' ' || e.key === 'Enter') && onCheckClick()}
    >
      <input
        id={inputId}
        aria-label={inputId}
        class={partNamesInput}
        part={partNamesInput}
        type="checkbox"
        checked={isChecked}
        {style}
        {disabled}
        tabindex="-1"
      />
      {#if isIndeterminate}
        <svg
          class="check-control-icon indeterminate-icon"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 7H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      {:else}
        <svg class="check-control-icon check-icon" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.5 7.5L6.5 9.5L9.5 4.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {/if}
    </div>
    {#if label}
      <span class={partNamesLabel} part={partNamesLabel}>{label}</span>
    {/if}
  </label>
</div>

<style>
  @import '../styles/control.css';

  .control-container {
    align-items: flex-start !important;
    height: auto !important;
  }

  .check-control-container {
    width: 100%;
    box-sizing: border-box;
  }

  .check-control-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .check-control-wrapper:has(input:disabled) {
    cursor: default;
    opacity: 0.6;
  }

  .check-control-checkbox {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--control-border-color);
    border-radius: 4px;
    background-color: var(--control-background-color);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .check-control-checkbox:hover:not(.disabled) {
    border-color: var(--control-border-hover-color);
  }

  .check-control-checkbox:focus-visible {
    outline: 2px solid var(--control-border-focus-color);
    outline-offset: 2px;
  }

  .check-control-checkbox.checked,
  .check-control-checkbox.indeterminate {
    background-color: var(--control-border-focus-color);
    border-color: var(--control-border-focus-color);
  }
  .check-control-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .check-control-icon {
    width: 0.875rem;
    height: 0.875rem;
    color: white;
    opacity: 0;
    transform: scale(0.3);
    transition: all 0.15s ease;
    pointer-events: none;
  }

  .check-control-checkbox.checked .check-icon,
  .check-control-checkbox.indeterminate .indeterminate-icon {
    opacity: 1;
    transform: scale(1);
    transform: scale(0.3);
    transition: all 0.15s ease;
  }

  .check-control-checkbox.checked .check-control-icon {
    opacity: 1;
    transform: scale(1);
  }

  .check-control-label {
    user-select: none;
    font-size: 0.875rem;
    color: var(--control-text-color);
  }
</style>
