import type { SortOrder } from "../store/sort-store.svelte";


export interface SortEvent {
    key: string;
    value: SortOrder | null;
}
