<script lang="ts">
  interface SelectorProps {
    label?: string;
    options: any[];
    value: any;
    onChange?: (change: string) => void;
  }

  let { label, options, value = $bindable(undefined), onChange = () => {} }: SelectorProps = $props();

  function onSelectChange() {
    onChange(value);
  }
</script>

<div class="selector-root" part="selector-root">
  {#if label}
    <label for="selector-control" class="selector-label" part="selector-label">{label}</label>
  {/if}
  <select
    id="selector-control"
    bind:value={value}
    onchange={onSelectChange}
    class="selector"
    part="selector"
    aria-label="selector"
  >
    {#each options as opt}
      <option value={opt}>{opt}</option>
    {/each}
  </select>
</div>

<style>
  .selector-root {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 14px;
  }
</style>
