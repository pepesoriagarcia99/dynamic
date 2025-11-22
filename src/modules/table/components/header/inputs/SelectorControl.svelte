<script lang="ts">
  import { onMount } from 'svelte';

  interface SelectorProps {
    label: string;
    options: any[];
    value: any;
    configuration: {
      firstSelected: boolean;
      firstBlank: boolean;
    };
    onChange?: (change: string) => void;
  }

  let { label, options, value, configuration, onChange = () => {} }: SelectorProps = $props();

  let showOptions = $derived(configuration.firstBlank ? ['', ...options] : options);
  let selected = $state(value);

  onMount(() => {
    if (configuration.firstSelected === true && !value) {
      selected = showOptions[0];
    }
  });

  function onSelectChange() {
    onChange(selected);
  }
</script>

<div class="selector-root" part="selector-root">
  {#if label}
    <label for="selector-control" class="selector-label" part="selector-label">{label}</label>
  {/if}
  <select
    id="selector-control"
    bind:value={selected}
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
