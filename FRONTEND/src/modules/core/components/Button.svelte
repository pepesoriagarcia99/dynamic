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
  }

  .basic {
    border-radius: 4px;
    border: 1px solid #dee2e6;
    background-color: white;
  }

  .basic:hover {
    border: 1px solid #212529;
  }

  .text {
    background: none;
    border: none;
  }

  .text:hover {
    background-color: #dee2e6;
  }

  .icon {
    background: none;
    border: none;
    padding: 0;
  }

  .icon:hover {
    border-radius: 24px;
    background-color: #dee2e6;
  }
</style>
