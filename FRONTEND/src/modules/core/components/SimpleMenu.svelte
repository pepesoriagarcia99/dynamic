<script lang="ts">
  import dotEditIcon from '../../../assets/svg/dots-options.svg';
  import Button from './Button.svelte';

  interface SimpleMenuProps {
    width?: number | 'auto';
    height?: number | 'auto';
    onOpen?: () => void;
  }

  const { width = 160, height = 32, onOpen = () => {} } = $props() as SimpleMenuProps;

  let buttonRef: HTMLButtonElement | null = $state(null);
  let showMenu = $state(false);
  let menuPosition = $state({ top: 0, left: 0 });

  function toggleMenu(event?: MouseEvent) {
    event?.stopPropagation();
    showMenu = !showMenu;
    if (showMenu && buttonRef) {
      onOpen();

      const rect = buttonRef.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      let left = rect.left;
      if (width !== 'auto' && left + width > viewportWidth) {
        left = viewportWidth - width + 10;
        if (left < 0) left = 0;
      }
      menuPosition = {
        top: rect.bottom + 4,
        left
      };
    }
  }

  function handleClickOutside() {
    if (showMenu) closeMenu();
  }

  export function openMenu() {
    showMenu = true;
    onOpen();
  }

  export function closeMenu() {
    showMenu = false;
  }

  export function menuState() {
    return showMenu;
  }
</script>

<!-- capture -->
<svelte:window on:click={handleClickOutside} />

<div>
  <Button bind:buttonRef type="icon" action={toggleMenu}>
    {#if $$slots.icon}
      <slot name="icon" />
    {:else}
      <img src={dotEditIcon} alt="Edit block" />
    {/if}
  </Button>

  {#if showMenu}
    <div
      class="menu-content"
      style="top: {menuPosition.top}px; left: {menuPosition.left}px; width: {width === 'auto' ? 'auto' : `${width}px`}; height: {height === 'auto' ? 'auto' : `${height}px`}; position: fixed;"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
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
