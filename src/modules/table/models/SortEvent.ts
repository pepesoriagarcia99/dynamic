import type { SortableType } from "./configuration/TableConfiguration";

export interface SortEvent {
    key: string;
    value: SortableType;
}
