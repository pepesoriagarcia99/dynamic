import type { RowEvent } from "./RowEvent";

export interface ContextMenuEvent {
    row: RowEvent;
    selection: any[];
}