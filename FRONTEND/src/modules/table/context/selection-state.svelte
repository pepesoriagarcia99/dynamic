<script module lang="ts">
  import { setContext, getContext } from 'svelte';
  import type { RowData } from '../models/RowData';
  import type { SelectableType } from '../models/configuration/TableConfiguration';

  const SELECTION_KEY = Symbol('selection');

  interface RowSignal {
    value: boolean;
  }

  export interface SelectionContext {
    readonly size: number;
    register(key: string): RowSignal;
    unregister(key: string): void;
    isSelected(key: string): boolean;
    toggle(key: string, row: RowData, modifiers?: { ctrl?: boolean; shift?: boolean }): void;
    select(key: string, row: RowData): void;
    deselect(key: string): void;
    clear(): void;
    refresh(data: RowData[], primaryKey: string): void;
    toArray(): RowData[];
  }

  export function initSelectionContext(
    selectableType: SelectableType,
    onChange?: (selected: RowData[]) => void
  ): SelectionContext {
    // Datos seleccionados (NO reactivo, solo almacén)
    const selectedData = new Map<string, RowData>();

    // Señal individual por fila (reactiva, grano fino)
    const signals = new Map<string, RowSignal>();

    // Señal para el tamaño (solo re-renderiza lo que lee .size)
    let _size = $state(0);

    function getOrCreateSignal(key: string): RowSignal {
      let signal = signals.get(key);
      
      if (!signal) {
        let _value = $state(selectedData.has(key));
        signal = {
          get value() {
            return _value;
          },
          set value(v: boolean) {
            _value = v;
          }
        };
        signals.set(key, signal);
      }
      return signal;
    }

    function setSelected(key: string, row: RowData) {
      selectedData.set(key, row);
      const s = signals.get(key);
      if (s) s.value = true;
    }

    function setDeselected(key: string) {
      selectedData.delete(key);
      const s = signals.get(key);
      if (s) s.value = false;
    }

    function clearAll() {
      for (const key of selectedData.keys()) {
        const s = signals.get(key);
        if (s) s.value = false;
      }
      selectedData.clear();
    }

    function notify() {
      _size = selectedData.size;
      onChange?.([...selectedData.values()]);
    }

    const ctx: SelectionContext = {
      get size() {
        return _size;
      },

      register(key: string): RowSignal {
        return getOrCreateSignal(key);
      },

      unregister(key: string) {
        signals.delete(key);
      },

      isSelected(key: string): boolean {
        return selectedData.has(key);
      },

      toggle(key: string, row: RowData, modifiers?: { ctrl?: boolean; shift?: boolean }) {
        if (selectableType === 'none') return;

        if (selectableType === 'single') {
          const wasSelected = selectedData.has(key);
          clearAll();
          if (!wasSelected) {
            setSelected(key, row);
          }
          notify();
          return;
        }

        // multiple
        if (!modifiers?.ctrl && !modifiers?.shift) {
          const wasSelected = selectedData.has(key);
          clearAll();
          if (!wasSelected) {
            setSelected(key, row);
          }
        } else {
          if (selectedData.has(key)) {
            setDeselected(key);
          } else {
            setSelected(key, row);
          }
        }
        notify();
      },

      select(key: string, row: RowData) {
        if (selectableType === 'none') return;

        if (selectableType === 'single') {
          clearAll();
        }
        setSelected(key, row);
        notify();
      },

      deselect(key: string) {
        if (!selectedData.has(key)) return;
        setDeselected(key);
        notify();
      },

      clear() {
        if (selectedData.size === 0) return;
        clearAll();
        notify();
      },

      refresh(data: RowData[], primaryKey: string) {
        if (selectedData.size === 0) return;

        const dataKeys = new Set(data.map((r) => String(r[primaryKey])));
        const toRemove: string[] = [];

        for (const key of selectedData.keys()) {
          if (!dataKeys.has(key)) {
            toRemove.push(key);
          } else {
            const freshRow = data.find((r) => String(r[primaryKey]) === key);
            if (freshRow) selectedData.set(key, freshRow);
          }
        }

        for (const key of toRemove) {
          setDeselected(key);
        }

        if (toRemove.length > 0) {
          notify();
        }
      },

      toArray(): RowData[] {
        return [...selectedData.values()];
      }
    };

    setContext(SELECTION_KEY, ctx);
    return ctx;
  }

  export function getSelectionContext(): SelectionContext {
    return getContext<SelectionContext>(SELECTION_KEY);
  }
</script>