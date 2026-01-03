<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  interface AutoCompleteControlProps extends CommonControlProp {
    options?: string[];
    maxVisibleOptions?: number;
    filterFunction?: (option: string, searchValue: string) => boolean;
  }

  /** States */
  let {
    id = crypto.randomUUID(),
    label,
    placeholder = 'Type to search...',
    value = $bindable(undefined),
    disabled = false,
    options = [],
    maxVisibleOptions = 5,
    style = '',
    filterFunction = defaultFilter,
    onChange = () => {}
  }: AutoCompleteControlProps = $props();

  let searchValue = $state('');
  let isOpen = $state(false);
  let highlightedIndex = $state(-1);
  let inputElement: HTMLInputElement;
  let dropdownElement: HTMLDivElement | null = $state(null);

  const inputId: string = $derived(`autocomplete-control-${id}`);
  const dropdownId: string = $derived(`autocomplete-dropdown-${id}`);
  const partNamesContainer: string = $derived(
    `control-container autocomplete-control-container autocomplete-control-container-${id}`
  );
  const partNamesInput: string = $derived(
    `control-item autocomplete-control-input autocomplete-control-input-${id}`
  );
  const partNamesLabel: string = $derived(
    `control-label autocomplete-control-label autocomplete-control-label-${id}`
  );
  const partNamesDropdown: string = $derived(
    `autocomplete-dropdown autocomplete-dropdown-${id}`
  );
  const partNamesOption: string = $derived(`autocomplete-option autocomplete-option-${id}`);

  const filteredOptions = $derived(
    searchValue.trim() === ''
      ? options
      : options.filter((option) => filterFunction(option, searchValue))
  );

  /** Methods */

  function defaultFilter(option: string, searchValue: string): boolean {
    return option.toLowerCase().includes(searchValue.toLowerCase());
  }

  function handleInput() {
    isOpen = true;
    highlightedIndex = -1;
  }

  function handleFocus() {
    isOpen = true;
  }

  function handleBlur(event: FocusEvent) {
    // Delay to allow click on option
    setTimeout(() => {
      if (!dropdownElement?.contains(event.relatedTarget as Node)) {
        isOpen = false;
        highlightedIndex = -1;
      }
    }, 150);
  }

  function selectOption(option: string) {
    value = option;
    searchValue = option;
    isOpen = false;
    highlightedIndex = -1;
    onChange(value);
  }

  function keydownHandler(event: KeyboardEvent) {
    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      isOpen = true;
      event.preventDefault();
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
        scrollToHighlighted();
        break;

      case 'ArrowUp':
        event.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, -1);
        scrollToHighlighted();
        break;

      case 'Enter':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          onChange(value);
        }
        break;

      case 'Escape':
        event.preventDefault();
        isOpen = false;
        highlightedIndex = -1;
        inputElement?.blur();
        break;

      case 'Tab':
        isOpen = false;
        highlightedIndex = -1;
        break;
    }
  }

  function scrollToHighlighted() {
    if (dropdownElement && highlightedIndex >= 0) {
      const optionElements = dropdownElement.querySelectorAll('.autocomplete-option');
      const highlightedElement = optionElements[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  function handleOptionMouseEnter(index: number) {
    highlightedIndex = index;
  }
</script>

<div class={partNamesContainer} part={partNamesContainer}>
  {#if label}
    <label for={inputId} class={partNamesLabel} part={partNamesLabel}>{label}</label>
  {/if}
  <div class="autocomplete-wrapper">
    <input
      bind:this={inputElement}
      id={inputId}
      aria-label={inputId}
      aria-controls={dropdownId}
      aria-expanded={isOpen}
      aria-autocomplete="list"
      class={partNamesInput}
      part={partNamesInput}
      {style}
      type="text"
      {placeholder}
      bind:value={searchValue}
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      onkeydown={keydownHandler}
      {disabled}
    />
    {#if isOpen && filteredOptions.length > 0 && !disabled}
      <div
        bind:this={dropdownElement}
        id={dropdownId}
        class={partNamesDropdown}
        part={partNamesDropdown}
        role="listbox"
        style="max-height: {maxVisibleOptions * 2.5}rem;"
      >
        {#each filteredOptions as option, index}
          <div
            class="{partNamesOption} {highlightedIndex === index ? 'highlighted' : ''}"
            part={partNamesOption}
            role="option"
            aria-selected={highlightedIndex === index}
            tabindex="-1"
            onclick={() => selectOption(option)}
            onmouseenter={() => handleOptionMouseEnter(index)}
          >
            {option}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  @import '../styles/control.css';

  .autocomplete-control-container {
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .autocomplete-wrapper {
    position: relative;
    width: 100%;
  }

  .autocomplete-control-input {
    width: 100%;
    box-sizing: border-box;
  }

  .autocomplete-dropdown {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--control-background-color);
    border: 1px solid var(--control-border-color);
    border-radius: var(--control-border-radius);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .autocomplete-option {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-size: 1rem;
    color: var(--control-text-color);
    transition: background-color 0.15s ease;
  }

  .autocomplete-option:hover,
  .autocomplete-option.highlighted {
    background-color: var(--control-border-focus-color, rgba(59, 130, 246, 0.1));
  }

  .autocomplete-option:active {
    background-color: var(--control-border-focus-color, rgba(59, 130, 246, 0.2));
  }

  /* Scrollbar styling */
  .autocomplete-dropdown::-webkit-scrollbar {
    width: 0.5rem;
  }

  .autocomplete-dropdown::-webkit-scrollbar-track {
    background: transparent;
  }

  .autocomplete-dropdown::-webkit-scrollbar-thumb {
    background: var(--control-border-color);
    border-radius: 0.25rem;
  }

  .autocomplete-dropdown::-webkit-scrollbar-thumb:hover {
    background: var(--control-border-hover-color);
  }
</style>
