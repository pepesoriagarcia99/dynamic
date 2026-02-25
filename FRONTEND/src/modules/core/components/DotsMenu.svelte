<script lang="ts">
  import dotEditIcon from '../../../assets/svg/dots-options.svg';
  import Button from './Button.svelte';

  let buttonRef: HTMLButtonElement | null = $state(null);
  let showMenu = $state(false);
  let menuPosition = $state({ top: 0, left: 0 });
  let menuWidth = 160;

function toggleMenu(event: MouseEvent) {
  event.stopPropagation();
  showMenu = !showMenu;
  if (showMenu && buttonRef) {
    const rect = buttonRef.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    let left = rect.left;
    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth + 10;
      if (left < 0) left = 0;
    }
    menuPosition = {
      top: rect.bottom + 4,
      left
    };
  }
}

  function handleClickOutside() {
    if (showMenu) {
      showMenu = false;
    }
  }
</script>

<svelte:window on:click|capture={handleClickOutside} />

<div>
  <Button bind:buttonRef type="icon" onClick={toggleMenu}>
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      <img src={dotEditIcon} alt="Edit block" />
    {/if}
  </Button>

  {#if showMenu}
    <div class="menu-content" style="top: {menuPosition.top}px; left: {menuPosition.left}px; position: fixed;">
      <slot></slot>
      <slot name="body" />
    </div>
  {/if}
</div>

<style>
  .menu-content {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
    z-index: 1100;
    padding: 4px 0;
    min-width: 120px;
  }
</style>
