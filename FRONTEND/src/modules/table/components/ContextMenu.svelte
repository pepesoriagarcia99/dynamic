<script lang="ts">
  import { onMount } from 'svelte';

  import type { RowEvent } from '../models/event/RowEvent';

  interface ContextMenuProps {
    visible?: boolean;
    event?: RowEvent;
  }

  let { visible = $bindable(false), event = $bindable() }: ContextMenuProps = $props();

  let menuElement: HTMLDivElement | undefined = $state();
  let x: number = $state(0);
  let y: number = $state(0);

  $effect(() => {
    if (visible && event?.mouse) {
      const mouseEvent = event.mouse;
      x = mouseEvent.x!;
      y = mouseEvent.y!;

      // Ajustar posición si se sale de la pantalla
      requestAnimationFrame(() => {
        if (menuElement) {
          const rect = menuElement.getBoundingClientRect();
          if (rect.right > window.innerWidth) {
            x = window.innerWidth - rect.width - 10;
          }
          if (rect.bottom > window.innerHeight) {
            y = window.innerHeight - rect.height - 10;
          }
        }
      });
    }
  });

  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuElement && !menuElement.contains(e.target as Node)) {
        visible = false;
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        visible = false;
      }
    };

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  });
</script>

{#if visible}
  <div class="context-menu" part="context-menu" bind:this={menuElement} style="left: {x}px; top: {y}px;">
    <slot {event} />
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    z-index: 9999;
    background: var(--context-menu-background);
    border: 1px solid var(--context-menu-border-color);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: auto;
    padding: 4px 0;
  }
</style>
