<script lang="ts">
  interface SelectorProps {
    label?: string;
    options: any[];
    value: any;
    disabled?: boolean;
    onChange?: (change: string) => void;
  }

  let { label, options, value = $bindable(undefined), disabled = false, onChange = () => {} }: SelectorProps = $props();

  function onSelectChange() {
    onChange(value);
  }
</script>

<div class="selector-control-container" part="selector-control-container">
  {#if label}
    <label for="selector-control" class="selector-control-label" part="selector-control-label">{label}</label>
  {/if}
  <select
    id="selector-control"
    bind:value
    onchange={onSelectChange}
    class="selector-control-select"
    part="selector-control-select"
    aria-label="selector"
    {disabled}
  >
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
</div>

<style>
  .selector-control-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
    height: var(--control-height);
  }

  .selector-control-select {
    height: var(--control-height);
  }

  .selector-control-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--control-text-color);
  }

  .selector-control-select {
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    font-size: 1rem;
    color: var(--control-text-color);
    background: var(--control-background-color);
    border: 1px solid var(--control-border-color);
    border-radius: 6px;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23495057' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
  }

  .selector-control-select:hover:not(:disabled):not(:focus) {
    border-color: var(--control-border-hover-color);
  }

  .selector-control-select:focus {
    outline: none;
    border-color: var(--control-border-focus-color);
    box-shadow: 0 0 0 0.05rem var(--control-border-focus-color);
  }

  .selector-control-select:disabled {
    background-color: var(--control-background-disabled-color);
    opacity: 0.6;
    cursor: default;
  }
</style>
