<script lang="ts">
  interface ButtonProps {
    buttonRef?: HTMLButtonElement | null;
    type?: 'primary' | 'secondary' | 'basic' | 'text' | 'icon';
    disabled?: boolean;
    onClick?: (event: MouseEvent) => void;
  }

  let { buttonRef = $bindable(), type = 'basic', disabled = false, onClick = () => {} }: ButtonProps = $props();
  let localButtonRef = $state<HTMLButtonElement | null>(null);

  $effect(() => {
    buttonRef = localButtonRef;
  });
</script>

<button bind:this={localButtonRef} class={type} {disabled} onclick={(event: MouseEvent) => onClick(event)}>
  <slot />
</button>

<style>
  button :global(img) {
    width: 18px;
    height: 18px;
    object-fit: contain;
    vertical-align: middle;
  }

  button :global(span) {
    vertical-align: middle;
  }

  button {
    cursor: pointer;
    width: 100%;
    padding: 6px;
    margin: 2px;
  }

  /** primary */
  .primary {
    background-color: black;
    color: white;
    border-radius: 4px;
    border: none;
  }

  /** basic */

  .basic {
    border-radius: 4px;
    border: 1px solid var(--border);
    background-color: white;
  }

  .basic:hover {
    border: 1.5px solid var(--border);
    background-color: var(--hover);
  }

  /** text */

  .text {
    background: none;
    border: none;
  }

  .text:hover {
    background-color: var(--hover);
  }

  /** icon */

  .icon {
    background: none;
    border: none;
    padding: 0;
    vertical-align: middle;
  }

  .icon:hover {
    border-radius: 24px;
    background-color: var(--hover);
  }

  button.icon :global(img) {
    width: 22px;
    height: 22px;
  }
</style>
