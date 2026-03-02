<script lang="ts">
  import { slide } from 'svelte/transition';

  interface ExpandPanelProps {
    label?: string;
    open?: boolean;
  }

  const { label, open = $bindable(false) }: ExpandPanelProps = $props();

  let localOpen = $state(open);

  $effect(() => {
    localOpen = open;
  });
</script>

<div class="panel">
  <div class="header">
    <button type="button" class="header-open-button" aria-expanded={localOpen} onclick={() => (localOpen = !localOpen)}>
      <span class="arrow {localOpen ? 'open' : ''}">▶</span>
    </button>

    {#if label}
      <span>{label}</span>
    {/if}

    <slot name="header" />
  </div>

  {#if localOpen}
    <div class="body" transition:slide>
      <slot />
      <slot name="actions" />
    </div>
  {/if}
</div>

<style>
  .panel {
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px;
    background: #f7f7f7;
    user-select: none;
    border-bottom: 1px solid var(--border);
  }

  .header-open-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
  }

  .arrow {
    margin-right: 0.5rem;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
  }
  .arrow.open {
    transform: rotate(90deg);
  }
  .body {
    overflow: hidden;
  }
</style>
