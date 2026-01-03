<script lang="ts">
  import type { CommonControlProp } from '../models/CommonControlProp';

  interface MultipleSelectorOption {
    label: string;
    value: any;
  }

  interface MultipleSelectorProps extends CommonControlProp {
    options?: MultipleSelectorOption[];
    maxVisibleOptions?: number;
    showFilter?: boolean;
    showSelectAll?: boolean;
  }

  /** States */
  let {
    id = crypto.randomUUID(),
    label,
    placeholder = 'Select items',
    value = $bindable([]),
    disabled = false,
    options = [],
    maxVisibleOptions = 6,
    showFilter = true,
    showSelectAll = true,
    style = '',
    onChange = () => {}
  }: MultipleSelectorProps = $props();

  let isOpen = $state(false);
  let filterValue = $state('');
  let containerElement: HTMLDivElement;
  let dropdownElement: HTMLDivElement;

  const inputId: string = $derived(`multiple-selector-control-${id}`);
  const dropdownId: string = $derived(`multiple-selector-dropdown-${id}`);
  const partNamesContainer: string = $derived(
    `control-container multiple-selector-control-container multiple-selector-control-container-${id}`
  );
  const partNamesDisplay: string = $derived(
    `control-item multiple-selector-display multiple-selector-display-${id}`
  );
  const partNamesLabel: string = $derived(
    `control-label multiple-selector-label multiple-selector-label-${id}`
  );
  const partNamesDropdown: string = $derived(`multiple-selector-dropdown multiple-selector-dropdown-${id}`);

  const filteredOptions = $derived(
    filterValue.trim() === ''
      ? options
      : options.filter((opt) => opt.label.toLowerCase().includes(filterValue.toLowerCase()))
  );

  const selectedOptions = $derived(
    options.filter((opt) => value.includes(opt.value))
  );

  const allFilteredSelected = $derived(
    filteredOptions.length > 0 && filteredOptions.every((opt) => value.includes(opt.value))
  );

  /** Methods */

  function toggleDropdown() {
    if (disabled) return;
    isOpen = !isOpen;
    if (!isOpen) {
      filterValue = '';
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (containerElement && !containerElement.contains(event.target as Node)) {
      isOpen = false;
      filterValue = '';
    }
  }

  function toggleOption(optionValue: any) {
    if (value.includes(optionValue)) {
      value = value.filter((v: any) => v !== optionValue);
    } else {
      value = [...value, optionValue];
    }
    onChange(value);
  }

  function removeChip(optionValue: any, event: Event) {
    event.stopPropagation();
    value = value.filter((v: any) => v !== optionValue);
    onChange(value);
  }

  function selectAll() {
    if (allFilteredSelected) {
      // Deselect all filtered options
      const filteredValues = filteredOptions.map((opt) => opt.value);
      value = value.filter((v: any) => !filteredValues.includes(v));
    } else {
      // Select all filtered options
      const filteredValues = filteredOptions.map((opt) => opt.value);
      const newValues = [...new Set([...value, ...filteredValues])];
      value = newValues;
    }
    onChange(value);
  }

  function clearAll(event: Event) {
    event.stopPropagation();
    value = [];
    onChange(value);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleDropdown();
    } else if (event.key === 'Escape') {
      isOpen = false;
      filterValue = '';
    }
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });
</script>

<div bind:this={containerElement} class={partNamesContainer} part={partNamesContainer}>
  {#if label}
    <label for={inputId} class={partNamesLabel} part={partNamesLabel}>{label}</label>
  {/if}

  <div
    id={inputId}
    aria-label={inputId}
    aria-controls={dropdownId}
    aria-expanded={isOpen}
    class="{partNamesDisplay} {disabled ? 'disabled' : ''}"
    part={partNamesDisplay}
    {style}
    role="button"
    tabindex={disabled ? -1 : 0}
    onclick={toggleDropdown}
    onkeydown={handleKeydown}
  >
    <div class="multiple-selector-chips">
      {#if selectedOptions.length === 0}
        <span class="multiple-selector-placeholder">{placeholder}</span>
      {:else}
        {#each selectedOptions as option}
          <span class="multiple-selector-chip">
            {option.label}
            {#if !disabled}
              <button
                class="multiple-selector-chip-remove"
                onclick={(e) => removeChip(option.value, e)}
                aria-label="Remove {option.label}"
                tabindex="-1"
              >
                ×
              </button>
            {/if}
          </span>
        {/each}
      {/if}
    </div>

    <div class="multiple-selector-actions">
      {#if selectedOptions.length > 0 && !disabled}
        <button
          class="multiple-selector-clear"
          onclick={clearAll}
          aria-label="Clear all"
          tabindex="-1"
        >
          ×
        </button>
      {/if}
      <span class="multiple-selector-arrow {isOpen ? 'open' : ''}">▼</span>
    </div>
  </div>

  {#if isOpen && !disabled}
    <div
      bind:this={dropdownElement}
      id={dropdownId}
      class={partNamesDropdown}
      part={partNamesDropdown}
      role="listbox"
      aria-multiselectable="true"
      style="max-height: {maxVisibleOptions * 2.5 + (showFilter ? 3 : 0)}rem;"
    >
      {#if showFilter}
        <div class="multiple-selector-filter">
          <input
            type="text"
            class="multiple-selector-filter-input"
            placeholder="Search..."
            bind:value={filterValue}
            onclick={(e) => e.stopPropagation()}
          />
        </div>
      {/if}

      {#if showSelectAll && filteredOptions.length > 0}
        <div
          class="multiple-selector-option select-all"
          role="option"
          aria-selected={allFilteredSelected}
          onclick={selectAll}
        >
          <input
            type="checkbox"
            class="multiple-selector-checkbox"
            checked={allFilteredSelected}
            tabindex="-1"
          />
          <span class="multiple-selector-option-label">Select All</span>
        </div>
      {/if}

      {#if filteredOptions.length === 0}
        <div class="multiple-selector-empty">No options found</div>
      {:else}
        {#each filteredOptions as option}
          <div
            class="multiple-selector-option"
            role="option"
            aria-selected={value.includes(option.value)}
            onclick={() => toggleOption(option.value)}
          >
            <input
              type="checkbox"
              class="multiple-selector-checkbox"
              checked={value.includes(option.value)}
              tabindex="-1"
            />
            <span class="multiple-selector-option-label">{option.label}</span>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  @import '../styles/control.css';

  .multiple-selector-control-container {
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .multiple-selector-display {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    cursor: pointer;
    min-height: var(--control-height);
    height: auto;
    padding: 0.375rem 0.75rem;
  }

  .multiple-selector-display.disabled {
    cursor: default;
  }

  .multiple-selector-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
  }

  .multiple-selector-placeholder {
    color: #6c757d;
    opacity: 0.7;
  }

  .multiple-selector-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: var(--control-border-focus-color, #3b82f6);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    max-width: 100%;
  }

  .multiple-selector-chip-remove {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.15s;
  }

  .multiple-selector-chip-remove:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .multiple-selector-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .multiple-selector-clear {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    font-size: 1.5rem;
    line-height: 1;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.15s;
  }

  .multiple-selector-clear:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #dc3545;
  }

  .multiple-selector-arrow {
    color: #6c757d;
    font-size: 0.75rem;
    transition: transform 0.2s;
  }

  .multiple-selector-arrow.open {
    transform: rotate(180deg);
  }

  .multiple-selector-dropdown {
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

  .multiple-selector-filter {
    padding: 0.5rem;
    border-bottom: 1px solid var(--control-border-color);
    position: sticky;
    top: 0;
    background: var(--control-background-color);
    z-index: 1;
  }

  .multiple-selector-filter-input {
    width: 100%;
    padding: 0.375rem 0.5rem;
    border: 1px solid var(--control-border-color);
    border-radius: var(--control-border-radius);
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.15s;
  }

  .multiple-selector-filter-input:focus {
    border-color: var(--control-border-focus-color);
  }

  .multiple-selector-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .multiple-selector-option:hover {
    background-color: var(--control-border-focus-color, rgba(59, 130, 246, 0.1));
  }

  .multiple-selector-option.select-all {
    font-weight: 500;
    border-bottom: 1px solid var(--control-border-color);
  }

  .multiple-selector-checkbox {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .multiple-selector-option-label {
    flex: 1;
    font-size: 1rem;
    color: var(--control-text-color);
  }

  .multiple-selector-empty {
    padding: 1rem 0.75rem;
    text-align: center;
    color: #6c757d;
    font-size: 0.875rem;
  }

  /* Scrollbar styling */
  .multiple-selector-dropdown::-webkit-scrollbar {
    width: 0.5rem;
  }

  .multiple-selector-dropdown::-webkit-scrollbar-track {
    background: transparent;
  }

  .multiple-selector-dropdown::-webkit-scrollbar-thumb {
    background: var(--control-border-color);
    border-radius: 0.25rem;
  }

  .multiple-selector-dropdown::-webkit-scrollbar-thumb:hover {
    background: var(--control-border-hover-color);
  }
</style>
